import { env, pipeline } from '@huggingface/transformers';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Specify a custom location for models (defaults to '/models/').
env.localModelPath = path.join(__dirname, '../models');

// Disable the loading of remote models from the Hugging Face Hub:
env.allowRemoteModels = false;

// // Set location of .wasm files. Defaults to use a CDN.
// env.backends.onnx.wasm.wasmPaths = '/path/to/files/';

const classifier = await pipeline("image-classification", "vit-quickdraw-final");

const result = await classifier("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcontent.clipchamp.com%2Fcontent-repo%2Fcontent%2Fpreviews%2Fcc_ea807c5a.png&f=1&nofb=1&ipt=cc8ab3d317a4a685990a4ee9b588014c37391bd11e7c77cb44c718ed16ee4679");

console.log(result);