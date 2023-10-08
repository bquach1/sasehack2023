from flask import Flask, request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
import json
uri = "mongodb+srv://sasehack:JdCdqW7uC94ApJQ0@sasehack.dcf0caf.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["sasehack"]
collection = db["ratings"]
# Send a ping to confirm a successful connection

app = Flask(__name__)

CORS(app, resources={r"/chatbot": {"origins": "http://localhost:3000"}})

@app.route("/insert", methods=["GET", "POST"])
def insert():
    content = request.get_json()
    try:
        client.admin.command('ping')
        print(content)
        date = list(content.keys())[0]
        dic =   {
                    "date" : list(content.keys())[0],
                    "rating" : (content[date])["rating"],
                    "reflection" : (content[date])["reflection"],
                }

        if collection.find_one({"date": {"$eq": dic['date']}}):
            replace = collection.replace_one(collection.find_one({"date": {"$eq": dic['date']}}),
                                             dic)
        else:
            insert = collection.insert_one(dic)
            print("else")
        return {"status" : 200}
    except Exception as e:
        print(e)
        return {"connection" : e}

@app.route("/chatbot", methods=["GET", "POST"])
def chatbot():
    content = request.get_json()
    try:
        print(content)
        dic =   {
                    "message" : content["message"]
                }
        print("success")
        
        return dic
    
    except Exception as e:
        print(e)
        return {"connection" : e}

if __name__ == "__main__":
    app.run(debug=True)