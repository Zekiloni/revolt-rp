import cv2
import numpy as np
import skimage.exposure
import os

def process_image(input_path, output_path):
  """Process a single image using a more selective approach for green screen removal"""
  # load image
  img = cv2.imread(input_path)
  if img is None:
    print(f"Error: Could not load {input_path}")
    return False

  # convert to LAB
  lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

  # extract A channel (green-red axis)
  A = lab[:,:,1]

  # Find the most common green value (likely the background)
  # Use histogram to find the dominant green value in the A channel
  hist = cv2.calcHist([A], [0], None, [256], [0, 256])
  dominant_green = np.argmax(hist)

  # Create a range around the dominant green for better isolation
  # Only focus on greens similar to the background, not all greens
  lower_threshold = max(0, dominant_green - 20)
  upper_threshold = min(255, dominant_green + 20)

  # Create a binary mask for the background
  mask = np.zeros_like(A)
  mask[(A >= lower_threshold) & (A <= upper_threshold)] = 255

  # Dilate slightly to ensure complete coverage of the background
  kernel = np.ones((3, 3), np.uint8)
  mask = cv2.dilate(mask, kernel, iterations=1)

  # blur the mask for anti-aliasing
  blur = cv2.GaussianBlur(mask, (0,0), sigmaX=3, sigmaY=3, borderType=cv2.BORDER_DEFAULT)

  # Invert and stretch the mask so foreground is opaque and background is transparent
  alpha_mask = skimage.exposure.rescale_intensity(255 - blur, in_range=(100, 255), out_range=(0, 255)).astype(np.uint8)

  # add mask to image as alpha channel
  result = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
  result[:,:,3] = alpha_mask

  # save output with transparency
  cv2.imwrite(output_path, result)
  print(f"Processed {input_path} -> {output_path}")
  return True

def process_all_images(input_folder, output_folder):
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

      # Always use PNG extension for output to support transparency
      base_name = os.path.splitext(filename)[0]
      output_path = os.path.join(output_folder, f"{base_name}.png")

      success = process_image(input_path, output_path)
      if success:
        processed += 1
      else:
        errors += 1

  print(f"Processing complete: {processed} images processed, {errors} errors")

# Paths to input and output directories
input_folder = "./input"
output_folder = "./output"

# Run the batch processing
if __name__ == "__main__":
  process_all_images(input_folder, output_folder)
