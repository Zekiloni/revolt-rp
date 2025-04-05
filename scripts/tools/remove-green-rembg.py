# from rembg import remove
# import os
#
# def process_image(input_path, output_path):
#   with open(input_path, "rb") as inp:
#     with open(output_path, "wb") as outp:
#       background_removed = remove(inp.read())
#       outp.write(background_removed)
#
# def batch_process(input_folder, output_folder):
#   if not os.path.exists(output_folder):
#     os.makedirs(output_folder)
#
#   for filename in os.listdir(input_folder):
#     if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
#       input_path = os.path.join(input_folder, filename)
#       output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + ".png")
#       process_image(input_path, output_path)
#
# batch_process("./input", "./output")

from rembg import remove, new_session
import os
import multiprocessing

# ✅ Recommended model for clothes & objects
MODEL_NAME = "isnet-general-use"
rembg_session = new_session(MODEL_NAME)

# 🎨 Alpha matting for smoother edges
ALPHA_MATTING = True
ALPHA_MATTING_FOREGROUND_THRESHOLD = 270
ALPHA_MATTING_BACKGROUND_THRESHOLD = 20
ALPHA_MATTING_ERODE_SIZE = 11

def process_image(file_info):
  input_path, output_folder = file_info
  output_path = os.path.join(output_folder, os.path.splitext(os.path.basename(input_path))[0] + ".png")

  try:
    with open(input_path, "rb") as inp:
      background_removed = remove(
        inp.read(),
        session=rembg_session,
        post_process_mask=True,
        alpha_matting=ALPHA_MATTING,
        alpha_matting_foreground_threshold=ALPHA_MATTING_FOREGROUND_THRESHOLD,
        alpha_matting_background_threshold=ALPHA_MATTING_BACKGROUND_THRESHOLD,
        alpha_matting_erode_size=ALPHA_MATTING_ERODE_SIZE
      )
    with open(output_path, "wb") as outp:
      outp.write(background_removed)
    print(f"✅ Processed: {input_path}")
  except Exception as e:
    print(f"❌ Error processing {input_path}: {e}")

def batch_process(input_folder, output_folder, num_workers=4):
  if not os.path.exists(output_folder):
    os.makedirs(output_folder)

  images = [
    (os.path.join(input_folder, filename), output_folder)
    for filename in os.listdir(input_folder)
    if filename.lower().endswith(('.png', '.jpg', '.jpeg'))
  ]

  with multiprocessing.Pool(num_workers) as pool:
    pool.map(process_image, images)

if __name__ == "__main__":
  batch_process("./input", "./output", num_workers=2)
