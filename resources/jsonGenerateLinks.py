import pandas as pd
import json

# Read the Excel file
excel_file = 'agencyData.xlsx'
df = pd.read_excel(excel_file)

# Convert the DataFrame to a list of dictionaries
data = []
for index, row in df.iterrows():
    agency = {
        "imgSrc": row["ImageSource"],
        "links": [
            {"href": row["Link1URL"], "text": row["Link1Text"]},
            {"href": row["Link2URL"], "text": row["Link2Text"]},
            {"href": row["Link3URL"], "text": row["Link3Text"]},
            {"href": row["Link4URL"], "text": row["Link4Text"]}
        ]
    }
    data.append(agency)

# Write the data to a JSON file
json_file = 'agencyData.json'
with open(json_file, 'w') as f:
    json.dump(data, f, indent=4)

print(f"Data has been successfully written to {json_file}")
