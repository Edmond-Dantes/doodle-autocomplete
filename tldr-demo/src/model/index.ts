import * as tf from "@tensorflow/tfjs";
// import MODEL_URL from "../assets/model.json?url";
const MODEL_URL = "./model.json"

export const CLASSES = [
  "circle",
  "square",
  "triangle",
  "star",
  "axis",
  "bat",
  "car",
  "cat",
  "eyeglasses",
  "moon",
  "sailboat",
  "dog",
  "tree",
  "cloud",
  "house",
  "other",
] as const;

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

export async function predict(
  canvas: HTMLCanvasElement
): Promise<(typeof CLASSES)[number] | "unknown"> {
  let out: tf.Tensor | undefined;
  let input: tf.Tensor<tf.Rank.R2> | undefined;

  try {
    input = tf.tidy(() =>
      tf.browser.fromPixels(canvas, 1).toFloat().div(255).expandDims(0)
    ) as tf.Tensor<tf.Rank.R2>;
    out = model.predict(input) as tf.Tensor<tf.Rank.R2>;

    const arr = (await out.array()) as number[][];
    console.log({ arr });
    const probs = arr[0];
    const idx = probs.indexOf(Math.max(...probs));
    const conf = probs[idx];
    const tau = 0.6;
    const label = conf < tau ? "unknown" : CLASSES[idx];
    return label;
  } catch (err) {
    console.error("Failed to predict:", err);
    return "unknown";
  } finally {
    if (input) tf.dispose(input);
    if (out) tf.dispose(out);
  }
}
