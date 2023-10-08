from flask import Flask, request, session, jsonify
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
import json
import openai
import os
from dotenv import load_dotenv

load_dotenv()

MY_ENV_VAR = os.getenv('OPEN_AI_API_KEY')

uri = "mongodb+srv://sasehack:JdCdqW7uC94ApJQ0@sasehack.dcf0caf.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"))
db = client["sasehack"]
collection = db["ratings"]
# Send a ping to confirm a successful connection

openai.api_key = MY_ENV_VAR

app = Flask(__name__)
app.secret_key = "shhh"

config = {
    "ORIGINS": [
        "http://localhost:3000",  # React
        "http://127.0.0.1:5000",  # React
    ],
}

CORS(app, resources={r"/*": {"origins": config["ORIGINS"]}})


@app.route("/insert", methods=["GET", "POST"])
def insert():
    if request.method == "GET":
        try:
            # Fetch data from the MongoDB collection
            data = list(collection.find({}))

            for entry in data:
                entry["_id"] = str(entry["_id"])

            # Convert the data to a list of dictionaries and jsonify it
            result = [entry for entry in data]

            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    else:
        content = request.get_json()
        try:
            client.admin.command("ping")
            for index, input in enumerate(content.items()):
                dic = {
                    "date": input[1]["date"],
                    "rating": input[1]["rating"],
                    "reflection": input[1]["reflection"],
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
    session["messages"] = [
        {
            "role": "system",
            "content": "Answer the following question as a chatbot realting to mental health mainly the mental health and well being of the user.",
        }
    ]
    try:
        for item in content.values():
            for thing in item:
                if thing['role'] != 'system':
                    dic = {"message": thing["content"]}               
                    session["messages"].append({"role": "user", "content": dic["message"]})
            
        list_messages = session["messages"]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=list_messages
        )
        reply = response["choices"][0]["message"]["content"]
        session["messages"].append({"role": "mental health chatbot", "content": reply})
        return {"reply": reply}

    except Exception as e:
        return {"exception": e}

    # Main loop for chatting with the mental health chatbot


if __name__ == "__main__":
    app.run(debug=True)
