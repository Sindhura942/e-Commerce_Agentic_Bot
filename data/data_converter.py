import pandas as pd
import os

# 1. Get the folder where THIS script is saved
folder_path = os.path.dirname(os.path.abspath(__file__))



#2. Join that folder name with your file name
json_file = os.path.join(folder_path, 'farfetch_dataset.json')
csv_file = os.path.join(folder_path, 'farfetch_data.csv')


#3. Now run the conversion
try:
    pd.read_json(json_file).to_csv(csv_file, index=False)
    print(f"Success! CSV saved at: {csv_file}")
except FileNotFoundError :
    print(f"Error: {json_file} not found in {folder_path}")









