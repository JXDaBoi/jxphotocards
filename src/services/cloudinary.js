/**
 * Uploads an image file to Cloudinary and returns the secure URL
 * @param {File} file 
 * @returns {Promise<string>} Uploaded Image URL
 */
export async function uploadImageToCloudinary(file) {
  // These will be loaded from env variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing.');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}
