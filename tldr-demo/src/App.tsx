import { useEffect, useRef } from "react";
import { Tldraw, useEditor, type Editor } from "tldraw";
import * as tf from "@tensorflow/tfjs";
import "tldraw/tldraw.css";
import MODEL_URL from "./assets/model.json?url";

const classes = ["circle", "square", "triangle", "star", "other"];
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
      <Tldraw>
        <InsideOfContext ref={ref} />
      </Tldraw>
      <div style={{ position: "absolute", left: 0, top: 100 }}>
        <canvas ref={canvasRef} />
        <button
          onClick={async () => {
            const editor = ref.current;
            const selectedShapeIds = editor?.getSelectedShapeIds();
            const blobs = await Promise.all(
              selectedShapeIds!.map((id) =>
                editor!.toImage([id], {
                  padding: 20,
                  quality: 1,
                  format: "webp",
                  background: false,
                  darkMode: true,
                })
              )
            );
            blobs.forEach(async (blob, index) => {
              const shapeId = selectedShapeIds![index];
              const shape = editor!.getShape(shapeId);
              console.log(shape);
              const imageBitmap = await createImageBitmap(blob.blob);

              // Create a canvas to resize the image to 28x28
              // const canvas = document.createElement("canvas");
              const canvas = canvasRef.current!;
              const ctx = canvas.getContext("2d")!;
              canvas.width = 28;
              canvas.height = 28;

              // Draw the image scaled down to 28x28
              ctx.drawImage(imageBitmap, 0, 0, 28, 28);

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
                  const shapeTypeMap: Record<string, string> = {
                    circle: "ellipse", // tldraw uses 'ellipse' for circles
                    square: "rectangle", // tldraw uses 'rectangle' for squares
                    triangle: "triangle", // direct match
                    star: "star", // direct match
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
                          fill: "solid",
                          color: "black",
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
  }, [ref, editor]);

  return null;
}
