from flask import Flask
from flask import render_template

app = Flask(__name__)

list =['data1', 'data2', 'data3','data4', 'data5', 'data6','data7', 'data8', 'data9']
name="test"
@app.route("/")
def index():
  return render_template('index.html',names=name,list=list)

if __name__ == '__main__':
  app.run()