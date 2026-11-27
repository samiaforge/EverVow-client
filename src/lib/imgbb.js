export const MAX_SERVICE_IMAGES = 5;

export async function uploadImagesToImgBB(files) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("Image upload is not configured. Please contact support.");
  }

  const urls = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select only image files.");
    }

    const imageData = new FormData();
    imageData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || "Image upload failed.");
    }

    urls.push(result.data.url);
  }

  return urls;
}
