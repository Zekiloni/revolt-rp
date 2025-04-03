from rembg import remove
import os

def process_image(input_path, output_path):
  with open(input_path, "rb") as inp:
    with open(output_path, "wb") as outp:
      background_removed = remove(inp.read())
      outp.write(background_removed)

def batch_process(input_folder, output_folder):
  if not os.path.exists(output_folder):
    os.makedirs(output_folder)

  for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
      input_path = os.path.join(input_folder, filename)
      output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + ".png")
      process_image(input_path, output_path)

batch_process("./input", "./output")
