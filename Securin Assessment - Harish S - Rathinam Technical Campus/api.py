import requests
from pymongo import MongoClient

# API URL and parameters
api_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
data = 2000
start = 0

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["NVD_database"]
cve_collection = db["cve_data"]

# Function to fetch data from the API
def fetch_cve_data(start_index):
    params = {
        "resultsPerPage": data,
        "startIndex": start_index
    }
    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return None

# Function to store data in the database
def store_cve_data(cve_data):
    if cve_data:
        vulnerabilities = cve_data.get("vulnerabilities", [])
        if vulnerabilities:
            try:
                cve_collection.insert_many(vulnerabilities)
                print(f"Stored {len(vulnerabilities)} records in the database.")
            except Exception as e:
                print(f"Error storing data in the database: {e}")

# Fetch and store data in batches
start_index = start
total_results = 0
while True:
    cve_data = fetch_cve_data(start_index)
    if not cve_data:
        break  # Stop fetching if an error occurs or no more data available
    total_results += cve_data.get("totalResults", 0)
    store_cve_data(cve_data)

    if start_index + data >= total_results:
        break

    start_index += data

# Get the total count of records in the collection
total_records = cve_collection.count_documents({})

# Print the total count of records
print(f"Total records in the database: {total_records}")
