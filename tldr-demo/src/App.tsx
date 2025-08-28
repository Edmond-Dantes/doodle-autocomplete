import { useCallback, useEffect, useRef, useState } from "react";
import {
  Tldraw,
  getSvgPathFromPoints,
  type Editor,
  type TLDrawShapeProps,
  type TLDrawShape,
  type TLEventMapHandler,
  type TLShapeId,
} from "tldraw";
import "tldraw/tldraw.css";
import * as ModelHelper from "./model";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [editor, setEditor] = useState<Editor>();

  const setAppToState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  // Extract conversion logic into reusable function
  const convertDrawShapeToGeo = useCallback(async (shapeId: TLShapeId) => {
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
    const path = getSvgPathFromPoints(points);
    const p = new Path2D(path);
    ctx.strokeStyle = "white";
    ctx.lineWidth = Math.ceil(2 / scale); // Adjust line width for scaling
    ctx.stroke(p);
    ctx.restore();

    const label = await ModelHelper.predict(canvas);

    const shapeTypeMap: Record<string, string> = {
      circle: "ellipse", // tldraw uses 'ellipse' for circles
      square: "rectangle", // tldraw uses 'rectangle' for squares
      triangle: "triangle", // direct match
      star: "star", // direct match
      vertical_line: "arrow-up", // direct match
      other: "rectangle", // fallback to rectangle
    };

    if (label !== "unknown" && label in shapeTypeMap) {
      const newShapeType = shapeTypeMap[label];

              // Get the bounds of the original shape to maintain position and size
        const bounds = editor.getShapePageBounds(shape);

        if (bounds) {
          // Delete the original shape
          editor.deleteShapes([shape]);

        // Create a new shape with the predicted type
        editor.createShape({
          type: "geo",
          x: bounds.x,
          y: bounds.y,
          props: {
            geo: newShapeType,
            w: bounds.w,
            h: bounds.h,
            color: (shape.props as TLDrawShapeProps).color,
          },
        });
      }
    }
  }, [editor]);

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

    // Use activity-based approach - detect when drawing stops
    let lastActivity = Date.now();
    let checkTimeout: NodeJS.Timeout | null = null;

    const handleDrawingComplete = () => {
      const now = Date.now();
      if (now - lastActivity > 100 && isDrawing && lastDrawnShapeId) {
        const currentTool = editor.getCurrentToolId();
        if (currentTool === "draw") {
          const shape = editor.getShape(lastDrawnShapeId);
          if (shape && shape.type === "draw") {
            convertDrawShapeToGeo(lastDrawnShapeId);
            lastDrawnShapeId = null;
            isDrawing = false;
          }
        }
      }
    };

    const enhancedChangeListener: TLEventMapHandler<"change"> = (change) => {
      handleChangeEvent(change);
      
      // Update activity timestamp when drawing
      if (isDrawing) {
        lastActivity = Date.now();
        
        // Clear existing timeout and set new one
        if (checkTimeout) clearTimeout(checkTimeout);
        checkTimeout = setTimeout(handleDrawingComplete, 150);
      }
    };

    const cleanupEnhancedListener = editor.store.listen(enhancedChangeListener, {
      source: "user",
      scope: "all",
    });

    return () => {
      cleanupEnhancedListener();
      if (checkTimeout) clearTimeout(checkTimeout);
    };
  }, [editor, convertDrawShapeToGeo]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
      }}
    >
      <Tldraw onMount={setAppToState} />
      <div style={{ position: "absolute", left: 350, top: 0 }}>
        <canvas ref={canvasRef} height={28} width={28} />
      </div>
    </div>
  );
}
