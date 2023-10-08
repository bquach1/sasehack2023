from flask import Flask, request, session
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import openai

uri = "mongodb+srv://sasehack:JdCdqW7uC94ApJQ0@sasehack.dcf0caf.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["sasehack"]
collection = db["ratings"]
# Send a ping to confirm a successful connection

openai.api_key = "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"

app = Flask(__name__)
app.secret_key = 'shhh'

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
    session['messages'] = [{"role" : "system", "content" : "Answer the following question as a chatbot realting to mental health mainly the mental health and well being of the user."}]
    try:
        print(content)
        dic =   {
                    "message" : content["message"]
                }
        session['messages'].append({"role" : "user", "content" : dic['message']})
        list_messages = session['messages']
        #print(type(messages))
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages = list_messages
        )
        reply = response['choices'][0]['message']['content']
        session['messages'].append({"role" : "mental health chatbot", "content" : reply})
        return {"reply" : reply}
    
    except Exception as e:
        return {"exception" : e}
    

    # Main loop for chatting with the mental health chatbot

    

if __name__ == "__main__":
    app.run(debug=True)