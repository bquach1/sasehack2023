from flask import Flask, request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
uri = "mongodb+srv://sasehack:JdCdqW7uC94ApJQ0@sasehack.dcf0caf.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection

app = Flask(__name__)

@app.route("/test", methods=["GET", "POST"])
def test():
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
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return dic
    except Exception as e:
        print(e)
        return {"connection" : e}

if __name__ == "__main__":
    app.run(debug=True)