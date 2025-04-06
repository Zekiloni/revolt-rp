import requests
import json
import time
import os

# API setup
base_url = "https://gtacars.net/api/vehicle-search"
params = {
  "game": "gta5",
  "page": 1,
  "perPage": 60,
  "sort": "alphabet",
  "sortReverse": "false",
  "q": ""
}
output_dir = "./output"
output_file = os.path.join(output_dir, "vehicle_data.json")
all_vehicles = []

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Total number of pages
total_pages = 16

print(f"Fetching {total_pages} pages of vehicle data...")

def remove_image_data(data):
  """Recursive function to remove all 'image' and 'images' keys."""
  if isinstance(data, dict):
    # Remove 'image' and 'images' keys from the dictionary
    data.pop("image", None)
    data.pop("images", None)

    # Recurse into nested dictionaries
    for key, value in data.items():
      remove_image_data(value)
  elif isinstance(data, list):
    # Recurse into each item in the list
    for item in data:
      remove_image_data(item)

# Fetch and process each page
for page in range(1, total_pages + 1):
  params["page"] = page
  print(f"Fetching page {page}...")
  try:
    response = requests.get(base_url, params=params)
    response.raise_for_status()
    data = response.json()

    vehicles = data.get("payload", {}).get("vehicles", [])

    for item in vehicles:
      vehicle = item.get("vehicle", {})

      # Remove all image and images data
      remove_image_data(vehicle)

      all_vehicles.append({"vehicle": vehicle})

  except Exception as e:
    print(f"Error on page {page}: {e}")

  time.sleep(0.3)

# Save cleaned data
with open(output_file, "w", encoding="utf-8") as f:
  json.dump(all_vehicles, f, indent=2, ensure_ascii=False)

print(f"✅ Done! Saved {len(all_vehicles)} vehicles to '{output_file}' without image data.")
