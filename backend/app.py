from flask import Flask
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://sasehack:JdCdqW7uC94ApJQ0@sasehack.dcf0caf.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection

app = Flask(__name__)

@app.route("/test")
def test():
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return {"connection" : "pinged"}
    except Exception as e:
        print(e)
        return {"connection" : e}

if __name__ == "__main__":
    app.run(debug=True)