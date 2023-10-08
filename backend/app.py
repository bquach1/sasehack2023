from flask import Flask, request, session, jsonify
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
import json
import openai
from datetime import date, timedelta, datetime
import os
from dotenv import load_dotenv

load_dotenv()

MY_ENV_VAR = os.getenv('OPEN_AI_API_KEY')

uri = "mongodb+srv://sasehack:JdCdqW7uC94ApJQ0@sasehack.dcf0caf.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"))
db = client["sasehack"]
collection = db["ratings"]
summaryCollection = db['summary']
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

@app.route("/summary", methods=["GET", "POST"])
def summary():
    week = [{"role" : "system", "content" : "You will be given user data tracking their mental health throughout the week. Each day of the week will provide you with two things, a rating of their day which can range from 1-5 and a reflection they wrote of that day. You will analyze of their week and provide a summary of what you belive their well being is. Out of the seven days if they have no data marked for a day(s) add a sentence at the end of the summary addressing that. Please be sure to use word common in the mental health space and address the user directly. Do not mention any specific ratings or specific dates just give more of a general overview. Also take note of the differences between this week and the week before if you were provided data for the week before. Make the summary about 2-3 sentences long."}]

    itteration = date.today().isoweekday()

    pastSummary = summaryCollection.find_one({"week": {"$eq": f"{date.today() - timedelta(((itteration - 1) + 7))}-{date.today() + timedelta(((8 - itteration)-7))}"}})
    if pastSummary:
        week.append({"role" : "system", "content" : f"Summary you gave the week before: {pastSummary['reply']}"})
        print(pastSummary)
    else:
        print(f"{date.today() - timedelta(((itteration - 1) + 7))}-{date.today() + timedelta(((8 - itteration)-7))}")
    
    for i in range(itteration):
        day = (date.today() - timedelta(i)).strftime("%m/%d/%Y").replace('/0', '/')
        result = collection.find_one({'date' : day})
        if result:
            rating = result['rating']
            reflection = result['reflection']
            dic = {'role' : 'user', "content" : f"data for {day}, rating: {rating}/5, refection: {reflection}"}
            week.append(dic)
        else:
            week.append({'role' : 'user', 'content' : f'data for {day}: No data'})
    
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages = week
    )
    reply = response['choices'][0]['message']['content']

    dic =   {
                "week" : f"{date.today() - timedelta(itteration - 1)}-{date.today() + timedelta(8 - itteration)}",
                "reply" : str(reply).replace('\\n\\n', '')
            }
    
    if summaryCollection.find_one({"week": {"$eq": dic["week"]}}):
        print(summaryCollection.find_one({"week": {"$eq": dic["week"]}}))
        replace = summaryCollection.replace_one(
            summaryCollection.find_one({"week": {"$eq": dic["week"]}}), dic
        )
        print("Replacing object", replace)
    else:
        insert = summaryCollection.insert_one(dic)
        print("New object", insert)

    return {"reply" : reply}

if __name__ == "__main__":
    app.run(debug=True)
