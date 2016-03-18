from flask import Flask,redirect,request,jsonify,session,url_for,render_template
import requests
import json
import os

json_data = []


app= Flask(__name__)

@app.route('/')
def home():
	return render_template("d3.html")


@app.route('/data' ,methods=["GET"])
def getdata():
	global json_data

	return jsonify({"data":json_data})


@app.route('/add/',methods=["GET","POST"])
def add():
	global json_data
	json_add={}
	if request.method == 'POST':
		json_add["Period Derivative"] = request.form['y']
		json_add["Period"] = request.form['x']
		json_data.append(json_add)
		print json_add
		print json_data
		return redirect('/')
	else:
		print "error"

print json_data

if __name__ == '__main__':
	global json_data
	r = requests.get('http://msi.mcgill.ca/GSoC_NANOGrav/pulsar_data_test.json')
	json_data = r.json()
	print json_data
	app.run(debug=True)
	

