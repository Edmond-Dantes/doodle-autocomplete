import { env, pipeline, RawImage } from "@huggingface/transformers";

// Configure for local models
// env.allowRemoteModels = false;
// env.allowLocalModels = true;
// env.localModelPath = "/models/";
env.remoteHost = "https://storage.googleapis.com/doodle-autocomplete-model/models/";
env.remotePathTemplate = '{model}/';

// Load your model
const classifier = await pipeline(
  "image-classification",
  "vit-quickdraw-final",
  { device: "webgpu" }
);

async function predict(image) {
  const result = await classifier(image).catch((error) => {
    self.postMessage({
      status: "error",
      task: "image-classification",
      data: error,
    });
    return null;
  });
  const confidence = result[0].score;
  if (confidence < 0.5) {
    return "unknown";
  }
  const label = result[0].label;
  console.log({ label });
  return label;
}

self.addEventListener("message", async (event) => {
  const message = event.data;

  const img = message.image;

  const result = await predict(img);
  if (result === null) return;

  // Send the result back to the main thread
  self.postMessage({
    status: "result",
    task: "image-classification",
    data: result,
    shape: message.shape,
  });
});
