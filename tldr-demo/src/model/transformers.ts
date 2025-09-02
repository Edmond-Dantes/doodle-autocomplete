import {
  env,
  pipeline,
  type ImageClassificationSingle,
} from "@huggingface/transformers";

// Configure for local models
env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = "./models/";

type PredictionClass = "circle" | "square" | "line";

// Load your model
export const classifier = await pipeline(
  "image-classification",
  "vit-quickdraw-final"
);

export async function predict(
  canvas: HTMLCanvasElement
): Promise<PredictionClass | "unknown"> {
  // const image = canvas.toDataURL();
  const result = (await classifier(canvas)) as ImageClassificationSingle[];
  const confidence = result[0].score;
  if (confidence < 0.6) {
    return "unknown";
  }
  const label = result[0].label as PredictionClass;
  return label;
}
