import json
import os

# Input and Output paths
input_file = './input/vehicle_data.json'
output_file = './output/extracted_vehicle_data.json'

# Ensure output directory exists
os.makedirs(os.path.dirname(output_file), exist_ok=True)

# Function to extract _id and model names
def extract_vehicle_ids(input_file):
  vehicle_ids = []

  # Open and read the input file
  with open(input_file, 'r', encoding='utf-8') as f:
    vehicles = json.load(f)

    for item in vehicles:
      vehicle = item.get("vehicle", {})
      vehicle_id = vehicle.get("_id")  # Extract _id
      if vehicle_id:  # Ensure the _id exists
        vehicle_ids.append(vehicle_id)

  return vehicle_ids

# Extract vehicle IDs
extracted_ids = extract_vehicle_ids(input_file)

# Write extracted vehicle IDs to output file
with open(output_file, 'w', encoding='utf-8') as f:
  json.dump(extracted_ids, f, indent=2, ensure_ascii=False)

print(f"✅ Done! Extracted vehicle IDs written to '{output_file}'")
