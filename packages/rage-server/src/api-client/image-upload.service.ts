
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const url = process.env['API_URL'] || 'http://localhost:3000/api';
  const response = await fetch(`${url}/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const data = await response.json();
  return data.imageUrl; // Assuming the API returns the image URL in this field
}
