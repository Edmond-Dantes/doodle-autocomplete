import { useEffect, useRef } from "react";
import {
  Tldraw,
  useEditor,
  getSvgPathFromPoints,
  type Editor,
  type TLDrawShapeProps,
  type TLDrawShape,
  type TLDrawShapeSegment,
} from "tldraw";
import * as tf from "@tensorflow/tfjs";
import "tldraw/tldraw.css";
import MODEL_URL from "./assets/model.json?url";

// const classes = ["circle", "square", "triangle", "star", "other"];
const classes = [
  "circle",
  "square",
  "triangle",
  "star",
  "vertical_line",
  "other",
];
let model: tf.LayersModel;
// Load model
tf.loadLayersModel(MODEL_URL)
  .then((m) => {
    model = m;
    console.log("Model loaded ✓");
  })
  .catch((err) => {
    console.error("Failed to load model:", err);
  });

export default function App() {
  const ref = useRef<Editor>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
      }}
    >
      <Tldraw
        // hideUi
        onUiEvent={(...args) => {
          console.log(...args);
        }}
      >
        <InsideOfContext ref={ref} />
      </Tldraw>
      <div style={{ position: "absolute", left: 0, top: 100 }}>
        <canvas ref={canvasRef} />
        <button
          onClick={async () => {
            const editor = ref.current;
            const selectedShapeIds = editor?.getSelectedShapeIds();
            selectedShapeIds?.forEach(async (shapeId) => {
              const shape = editor!.getShape(shapeId);
              console.log(shape);
              if (shape!.type !== "draw") {
                return;
              }

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
              canvas.width = 28;
              canvas.height = 28;

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
              console.log(p, path)
              ctx.strokeStyle = "white";
              ctx.lineWidth = Math.ceil(2 / scale); // Adjust line width for scaling
              console.log(ctx.lineWidth);
              ctx.stroke(p);

              ctx.restore();

              const input = tf.tidy(() =>
                tf.browser
                  .fromPixels(canvas, 1)
                  .toFloat()
                  .div(255)
                  .expandDims(0)
              );
              const out = model.predict(input);
              out
                .array()
                .then((arr) => {
                  const probs = arr[0];
                  const idx = probs.indexOf(Math.max(...probs));
                  const conf = probs[idx];
                  const tau = 0.6;
                  const label = conf < tau ? "unknown" : classes[idx];
                  console.log(idx, label);
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
                    const bounds = editor!.getShapePageBounds(shapeId);

                    if (bounds) {
                      // Delete the original shape
                      editor!.deleteShapes([shapeId]);

                      // Create a new shape with the predicted type
                      editor!.createShape({
                        type: "geo",
                        x: bounds.x,
                        y: bounds.y,
                        props: {
                          geo: newShapeType,
                          w: bounds.w,
                          h: bounds.h,
                          color: (shape!.props as TLDrawShapeProps).color,
                          // color: "black",
                        },
                      });
                    }
                  }
                })
                .finally(() => tf.dispose([input, out]));
            });
          }}
        >
          Get Ids
        </button>
      </div>
    </div>
  );
}

interface InsideOfContextProps {
  ref: React.RefObject<Editor | null>;
}

function InsideOfContext({ ref }: InsideOfContextProps) {
  const editor = useEditor();
  useEffect(() => {
    ref.current = editor;
    editor.setCurrentTool("draw");
  }, [ref, editor]);

  return null;
}
