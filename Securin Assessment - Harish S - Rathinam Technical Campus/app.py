from flask import Flask, render_template, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["NVD_database"]
cve_collection = db["cve_data"]

@app.route("/")
def get_cve_data():
    cve_data = list(cve_collection.find({}, {"_id": 0}))  # Retrieve all data from MongoDB
    return jsonify({"vulnerabilities": cve_data})  # Return JSON data for API consumption

@app.route("/cves/list")
def display_cves():
    return render_template("index.html")  # Render the HTML template

if __name__ == "__main__":
    app.run(debug=True)
