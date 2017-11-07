from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.environ.get('MONGODB_URI')
DBS_NAME = os.environ.get('MONGO_DB_NAME','stejmscott-oly-dashboard')
COLLECTION_NAME_S = os.environ.get('MONGO_COLLECTION_NAME','summermedals')
COLLECTION_NAME_W = os.environ.get('MONGO_COLLECTION_NAME','wintermedals')

# Modify the following for your fields
FIELDS = {'Year': True, 'Athlete': True, 'Country': True, 'Gender' : True, 'Medal': True, '_id': False}

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/winter")
def get_winter():
    with MongoClient(MONGODB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME_W]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        results = collection.find(projection=FIELDS)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(results))
        
@app.route("/summer")
def get_summer():
    with MongoClient(MONGODB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME_S]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        results = collection.find(projection=FIELDS)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(results))


if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))