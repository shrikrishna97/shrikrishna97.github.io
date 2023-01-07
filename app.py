from flask import Flask

app = Flask(__main__)

@app.route("/")
def index():
  return "Shri Krishan Pandey"

if __main__ == "__name__":
  app.run()
