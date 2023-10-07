from Flask import flask

app = flask[__name__]

@app.route("/test")
def test():
    return {"status" : 200}

if __name__ == "__main__":
    app.run(debug=True)