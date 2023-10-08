from flask import Flask, request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
import json
from flask_cors import CORS

uri = "mongodb+srv://sasehack:JdCdqW7uC94ApJQ0@sasehack.dcf0caf.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"))
db = client["sasehack"]
collection = db["ratings"]
# Send a ping to confirm a successful connection

app = Flask(__name__)

config = {
    "ORIGINS": [
        "http://localhost:3000",  # React
        "http://127.0.0.1:5000",  # React
    ],
}

CORS(app, resources={r"/*": {"origins": config["ORIGINS"]}}, supports_credentials=True)


@app.route("/insert", methods=["GET", "POST"])
def insert():
    content = request.get_json()
    try:
        client.admin.command("ping")
        print(content)
        for index, input in enumerate(content):
            date = list(content.keys())[index]
            dic = {
                "date": list(content.keys())[index],
                "rating": (content[date])["rating"],
                "reflection": (content[date])["reflection"],
            }
            
            if collection.find_one({"date": {"$eq": dic["date"]}}):
                replace = collection.replace_one(
                    collection.find_one({"date": {"$eq": dic["date"]}}), dic
                )
                print("Replacing object", replace)
            else:
                insert = collection.insert_one(dic)
                print("New object", insert)
        return {"status": 200}
    except Exception as e:
        print(e)
        return {"connection": e}


@app.route("/chatbot", methods=["GET", "POST"])
def chatbot():
    content = request.get_json()
    try:
        print(content)
        dic = {"message": content["message"]}
        print("success")

        return dic

    except Exception as e:
        print(e)
        return {"connection": e}


if __name__ == "__main__":
    app.run(debug=True)
