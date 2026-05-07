type BodyPixModule = typeof import("@tensorflow-models/body-pix");
type TensorFlowModule = typeof import("@tensorflow/tfjs");

let modelPromise: Promise<import("@tensorflow-models/body-pix").BodyPix> | null = null;

export async function loadBodySegmentationModel() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!modelPromise) {
    modelPromise = Promise.all([
      import("@tensorflow-models/body-pix"),
      import("@tensorflow/tfjs"),
      import("@tensorflow/tfjs-backend-webgl")
    ]).then(async ([bodyPix, tf]) => {
      await (tf as TensorFlowModule).setBackend("webgl");
      await (tf as TensorFlowModule).ready();
      return (bodyPix as BodyPixModule).load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.5,
        quantBytes: 2
      });
    });
  }

  return modelPromise;
}

export async function estimatePersonSegmentation(image: HTMLImageElement) {
  try {
    const model = await loadBodySegmentationModel();
    if (!model) return null;

    return await model.segmentPerson(image, {
      internalResolution: "medium",
      segmentationThreshold: 0.7,
      maxDetections: 1
    });
  } catch (error) {
    console.warn("Body segmentation fell back to geometry overlay.", error);
    return null;
  }
}
