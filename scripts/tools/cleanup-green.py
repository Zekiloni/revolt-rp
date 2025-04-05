from PIL import Image
import os
from io import BytesIO
import numpy as np

def selective_green_cleanup(image_bytes, green_threshold=214, green_dominance=50, green_range=30, white_threshold=240, brightness_threshold=200):
  img = Image.open(BytesIO(image_bytes)).convert("RGBA")
  np_img = np.array(img)

  r, g, b, a = np_img[..., 0], np_img[..., 1], np_img[..., 2], np_img[..., 3]

  # Define the range of green shades (e.g., from #02C702 or similar)
  green_min = green_threshold - green_range
  green_max = green_threshold + green_range

  # Identify greenish pixels (green >= green_threshold, within green_min/green_max range)
  greenish_background = (
    (g >= green_min) &  # Green value within range
    (g <= green_max) &  # Green value within range
    (g > r + green_dominance) &  # Green should be dominant over red
    (g > b + green_dominance)  # Green should be dominant over blue
  )

  # Avoid removing white or near-white pixels (not removing neutral pixels)
  white_pixels = (
    (r >= white_threshold) &
    (g >= white_threshold) &
    (b >= white_threshold)
  )

  # Check for overly bright pixels that are not green, and exclude them (like whites, grays, etc.)
  bright_pixels = (
    (r + g + b) > (brightness_threshold * 3)  # Sum of RGB exceeds brightness threshold
  )

  # Combine the greenish background mask and exclude white/bright pixels
  mask = greenish_background & ~white_pixels & ~bright_pixels

  # Set identified pixels to transparent, excluding white/bright pixels
  np_img[mask] = [0, 0, 0, 0]

  # Re-create the cleaned image
  cleaned = Image.fromarray(np_img, mode="RGBA")
  buffer = BytesIO()
  cleaned.save(buffer, format="PNG")
  return buffer.getvalue()

def process_all_images(input_folder, output_folder, green_threshold=214, green_dominance=50, green_range=30, white_threshold=240, brightness_threshold=200):
  """Process all images in the input folder and save them to the output folder"""
  # Create output folder if it doesn't exist
  if not os.path.exists(output_folder):
    os.makedirs(output_folder)

  # Count for statistics
  processed = 0
  errors = 0

  # Process each image in the input folder
  for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
      input_path = os.path.join(input_folder, filename)

      # Read the image from file
      with open(input_path, 'rb') as img_file:
        image_bytes = img_file.read()

      # Process the image
      cleaned_image_bytes = selective_green_cleanup(image_bytes, green_threshold, green_dominance, green_range, white_threshold, brightness_threshold)

      # Save the cleaned image to the output directory
      base_name = os.path.splitext(filename)[0]
      output_path = os.path.join(output_folder, f"{base_name}.png")

      try:
        with open(output_path, 'wb') as output_file:
          output_file.write(cleaned_image_bytes)
        processed += 1
      except Exception as e:
        print(f"Error processing {input_path}: {e}")
        errors += 1

  print(f"Processing complete: {processed} images processed, {errors} errors")

# Paths to input and output directories
input_folder = "./input"
output_folder = "./output"

# Run the batch processing
if __name__ == "__main__":
  process_all_images(input_folder, output_folder)
