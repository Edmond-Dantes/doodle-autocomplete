import { useCallback, useEffect, useRef, useState } from "react";
import {
  Tldraw,
  getSvgPathFromPoints,
  type Editor,
  type TLDrawShapeProps,
  type TLDrawShape,
  type TLEventMapHandler,
  type TLShapeId,
  type TLUnknownShape,
  type TLImageShape,
  AssetRecordType,
} from "tldraw";
import "tldraw/tldraw.css";
import { predict } from "./model";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [editor, setEditor] = useState<Editor>();

  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);

  // useEffect(() => {
  //   if (!worker.current) {
  //     // Create the worker if it does not yet exist.
  //     worker.current = new Worker(new URL("./worker.js", import.meta.url), {
  //       type: "module",
  //     });
  //   }

  //   // Create a callback function for messages from the worker thread.
  //   const onMessageReceived = (e: MessageEvent) => {
  //     if (!editor) return;

  //     const result = e.data;

  //     const label = result.data;
  //     const shape = result.shape;

  //     generatePredictedShape(label, shape);
  //   };

  //   // Attach the callback function as an event listener.
  //   worker.current.addEventListener("message", onMessageReceived);

  //   // Define a cleanup function for when the component is unmounted.
  //   return () =>
  //     worker.current?.removeEventListener("message", onMessageReceived);
  // });

  const setAppToState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  const generateOffScreenCanvasForPrediction = useCallback(
    (shapeId: TLShapeId) => {
      if (!editor) return;

      const shape = editor.getShape(shapeId);
      if (!shape || shape.type !== "draw") return;

      const drawShape = shape as TLDrawShape;
      const points = drawShape.props.segments.flatMap(
        (segment) => segment.points
      );

      // Calculate bounding box of the points
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const width = maxX - minX;
      const height = maxY - minY;

      // Calculate scale to fit in 28x28 while maintaining aspect ratio
      const scale = Math.min(24 / width, 24 / height); // Use 24 to leave some padding
      const offsetX = (28 - width * scale) / 2;
      const offsetY = (28 - height * scale) / 2;

      // Create a canvas to resize the image to 28x28
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      // Clear the canvas with black background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 28, 28);

      // Scale and translate the canvas context
      ctx.save();
      ctx.translate(offsetX - minX * scale, offsetY - minY * scale);
      ctx.scale(scale, scale);

      // Draw the path
      const path = getSvgPathFromPoints(points, false);
      const p = new Path2D(path);
      ctx.strokeStyle = "white";
      ctx.lineWidth = Math.ceil(2 / scale); // Adjust line width for scaling
      ctx.stroke(p);
      ctx.restore();

      return { canvas, ctx, shape };
    },
    [editor]
  );

  const generatePredictedShape = useCallback(
    async (label: string, shape: TLUnknownShape | TLDrawShape) => {
      if (!editor) return;

      const shapeTypeMap: Record<string, string> = {
        circle: "ellipse", // tldraw uses 'ellipse' for circles
        square: "rectangle", // tldraw uses 'rectangle' for squares
        line: "arrow-up", // direct match
        other: "rectangle", // fallback to rectangle
        sailboat: "image_sailboat", // fallback to rectangle
      };

      if (label !== "unknown" && label in shapeTypeMap) {
        const newShapeType = shapeTypeMap[label];

        // Get the bounds of the original shape to maintain position and size
        const bounds = editor.getShapePageBounds(shape);

        if (bounds) {
          editor.run(() => {
            editor.markHistoryStoppingPoint();

            // Delete the original shape
            editor.deleteShapes([shape]);

            // Create a new shape with the predicted type
            if (newShapeType.startsWith("image_")) {
              const assetId = AssetRecordType.createId();
              editor.createAssets([
                {
                  id: assetId,
                  type: "image",
                  typeName: "asset",
                  props: {
                    name: `${newShapeType}.png`,
                    src: `/${newShapeType}.png`, // You could also use a base64 encoded string here
                    w: bounds.w,
                    h: bounds.h,
                    mimeType: "image/png",
                    isAnimated: false,
                  },
                  meta: {},
                },
              ]);
              editor.createShape<TLImageShape>({
                type: "image",
                x: bounds.x,
                y: bounds.y,
                props: {
                  assetId,
                  w: bounds.w || 1,
                  h: bounds.h || 1,
                },
              });
            } else {
              editor.createShape({
                type: "geo",
                x: bounds.x,
                y: bounds.y,
                props: {
                  geo: newShapeType,
                  w: bounds.w || 1,
                  h: bounds.h || 1,
                  color: (shape.props as TLDrawShapeProps).color,
                },
              });
            }
          });
        }
      }
    },
    [editor]
  );

  // Extract conversion logic into reusable function
  const convertDrawShapeToGeo = useCallback(
    async (shapeId: TLShapeId) => {
      const offScreenCanvasData = generateOffScreenCanvasForPrediction(shapeId);
      if (!offScreenCanvasData) return;
      const { canvas, ctx, shape } = offScreenCanvasData;

      const label = await predict(canvas);
      console.log("label", label);

      generatePredictedShape(label, shape);
    },
    [generateOffScreenCanvasForPrediction, generatePredictedShape]
  );

  // Extract conversion logic into reusable function
  const transformersConvertDrawShapeToGeo = useCallback(
    async (shapeId: TLShapeId) => {
      const offScreenCanvasData = generateOffScreenCanvasForPrediction(shapeId);
      if (!offScreenCanvasData) return;
      const { canvas, ctx, shape } = offScreenCanvasData;

      worker.current?.postMessage({
        action: "classify",
        image: canvas.toDataURL(),
        shape,
      });
    },
    [generateOffScreenCanvasForPrediction, generatePredictedShape]
  );

  useEffect(() => {
    if (!editor) return;

    editor.setCurrentTool("draw");

    let lastDrawnShapeId: TLShapeId | null = null;
    let isDrawing = false;

    const handleChangeEvent: TLEventMapHandler<"change"> = (change) => {
      // Track the last drawn shape when draw tool is active
      const currentTool = editor.getCurrentToolId();

      if (currentTool === "draw") {
        // Track newly added draw shapes
        for (const record of Object.values(change.changes.added)) {
          if (record.typeName === "shape" && record.type === "draw") {
            lastDrawnShapeId = record.id;
            isDrawing = true;
          }
        }

        // Track updates to draw shapes (drawing in progress)
        for (const [id, [, to]] of Object.entries(change.changes.updated)) {
          if (to.typeName === "shape" && to.type === "draw") {
            lastDrawnShapeId = id as TLShapeId;
            isDrawing = true;
          }
        }
      }
    };

    // Listen for mouse up events directly
    const handleMouseUp = () => {
      const currentTool = editor.getCurrentToolId();

      // Only convert if we were drawing with the draw tool and have a shape to convert
      if (currentTool === "draw" && isDrawing && lastDrawnShapeId) {
        setTimeout(() => {
          if (lastDrawnShapeId) {
            const shape = editor.getShape(lastDrawnShapeId);
            if (shape && shape.type === "draw") {
              convertDrawShapeToGeo(lastDrawnShapeId);
              // transformersConvertDrawShapeToGeo(lastDrawnShapeId);
            }
          }
          // Reset tracking
          lastDrawnShapeId = null;
          isDrawing = false;
        }, 100);
      }
    };

    // Add mouse up listener to the document
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("pointerup", handleMouseUp);

    const cleanupChangeListener = editor.store.listen(handleChangeEvent, {
      source: "user",
      scope: "all",
    });

    return () => {
      cleanupChangeListener();
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("pointerup", handleMouseUp);
    };
  }, [editor, convertDrawShapeToGeo]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
      }}
    >
      <Tldraw onMount={setAppToState} options={{ maxPages: 1 }} />
      <div style={{ position: "absolute", left: 350, top: 0 }}>
        <canvas
          id="classify-canvas"
          ref={canvasRef}
          height={28}
          width={28}
          hidden
        />
      </div>
    </div>
  );
}
