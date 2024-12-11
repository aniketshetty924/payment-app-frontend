export const photoUrlService = async (photo) => {
  if (!photo) throw new Error("No photo provided for upload...");

  const formData = new FormData();
  formData.append("file", photo);
  formData.append("upload_preset", "imageUploads");
  formData.append("cloud_name", "dpqrg91p4");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dpqrg91p4/image/upload", // Replace with your cloud name
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (response.ok) {
      return data.secure_url;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw new Error(
      "An error occurred while uploading the photo. Please try again."
    );
  }
};
