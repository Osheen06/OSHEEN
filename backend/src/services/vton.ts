import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { Client, handle_file } from "@gradio/client";
import { Jimp } from "jimp";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve an image pointer, resize and crop to 3:4 aspect ratio (768x1024) using Jimp
async function resolveAndCropImage(imgData: string): Promise<string> {
  let sourcePath = "";
  let isSourceTemp = false;

  try {
    // 1. Resolve source image to a local file
    if (imgData.startsWith("data:image/")) {
      const mimeType = imgData.match(/[^:]\w+\/[\w\-+\d.]+(?=;|,)/)?.[0] || "image/png";
      const extension = mimeType.split("/")[1] || "png";
      const base64Image = imgData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Image, "base64");
      
      const filename = `src-${uuidv4()}.${extension}`;
      sourcePath = path.resolve(__dirname, "..", "..", "uploads", filename);
      await fs.promises.writeFile(sourcePath, buffer);
      isSourceTemp = true;
    } else if (imgData.startsWith("/assets/")) {
      sourcePath = path.resolve(__dirname, "..", "..", "..", "frontend", "public", imgData.substring(1));
    } else {
      throw new Error(`Could not resolve image data pointer format.`);
    }

    // 2. Load with Jimp, resize and crop to cover 768x1024 (native VTON 3:4 aspect ratio)
    console.log(`[VTON Engine] Loading and auto-cropping source image to 3:4: ${sourcePath.substring(sourcePath.lastIndexOf(path.sep))}`);
    const image = await Jimp.read(sourcePath);
    
    const targetWidth = 768;
    const targetHeight = 1024;
    
    const croppedFilename = `cropped-${uuidv4()}.png`;
    const croppedPath = path.resolve(__dirname, "..", "..", "uploads", croppedFilename);
    
    // cover() resizes the image to fill 768x1024 while maintaining the aspect ratio, cropping any excess
    await image.cover({ w: targetWidth, h: targetHeight }).write(croppedPath as `${string}.${string}`);
    
    return croppedPath;
  } finally {
    // Clean up temporary source base64 files
    if (isSourceTemp && sourcePath && fs.existsSync(sourcePath)) {
      await fs.promises.unlink(sourcePath).catch(() => {});
    }
  }
}

/**
 * Interface for VTON Try-On inputs.
 */
export interface VtonInput {
  personImage: string; // Base64 string or public asset URL
  garmentImage: string; // Base64 string or public asset URL
  description: string; // Text description of the garment to assist the AI model
}

/**
 * Calls the yisol/IDM-VTON Hugging Face Space using the Gradio client.
 * Auto-crops inputs to 3:4 to prevent stretching/disproportionate outputs.
 */
export async function runVtonTryOn(input: VtonInput): Promise<string> {
  let personCroppedPath = "";
  let garmentCroppedPath = "";

  try {
    // Crop both images to 3:4 to guarantee no stretching/distortion during VTON processing
    personCroppedPath = await resolveAndCropImage(input.personImage);
    garmentCroppedPath = await resolveAndCropImage(input.garmentImage);

    console.log(`[VTON Engine] Connecting to Gradio Space 'yisol/IDM-VTON'...`);
    const connectOptions = process.env.HF_TOKEN ? { token: process.env.HF_TOKEN } : undefined;
    const app = await Client.connect("yisol/IDM-VTON", connectOptions as any);

    console.log(`[VTON Engine] Executing trial room prediction with 3:4 cropped images...`);

    // Call yisol/IDM-VTON's /tryon endpoint with cropped 3:4 files
    const result = (await app.predict("/tryon", [
      {
        background: handle_file(personCroppedPath),
        layers: [],
        composite: null
      }, // human_img (dict)
      handle_file(garmentCroppedPath), // garm_img (file)
      input.description, // garment_des (string)
      true, // is_checked (boolean)
      false, // is_checked_crop (boolean)
      30, // denoise_steps (number)
      42 // seed (number)
    ])) as any;

    if (result && result.data && result.data[0]) {
      const outputImageObj = result.data[0];
      let outputUrl = outputImageObj.url;

      // Fallback to path if url is not populated
      if (!outputUrl && outputImageObj.path) {
        outputUrl = outputImageObj.path;
      }

      // If it's a relative path, prepend the Hugging Face Space URL host
      if (outputUrl && outputUrl.startsWith("/")) {
        outputUrl = `https://yisol-idm-vton.hf.space${outputUrl}`;
      }

      if (outputUrl) {
        console.log(`[VTON Engine] Success! Output URL: ${outputUrl}`);
        return outputUrl;
      }
    }

    throw new Error("Invalid response format received from Hugging Face Space API.");
  } catch (error) {
    console.error(`[VTON Engine] Error running VTON prediction:`, error);
    throw error;
  } finally {
    // Clean up temporary cropped 3:4 files from backend/uploads
    if (personCroppedPath && fs.existsSync(personCroppedPath)) {
      await fs.promises.unlink(personCroppedPath).catch((err) => {
        console.warn(`[VTON Engine] Failed to delete temp person cropped file: ${err.message}`);
      });
    }
    if (garmentCroppedPath && fs.existsSync(garmentCroppedPath)) {
      await fs.promises.unlink(garmentCroppedPath).catch((err) => {
        console.warn(`[VTON Engine] Failed to delete temp garment cropped file: ${err.message}`);
      });
    }
  }
}
