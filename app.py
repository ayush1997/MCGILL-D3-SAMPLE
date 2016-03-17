from flask import Flask,redirect,request,jsonify,session,url_for,render_template
import requests
import json
import os


app= Flask(__name__)

@app.route('/')
def home():
	return render_template("d3.html")




if __name__ == '__main__':
	r = requests.get('http://msi.mcgill.ca/GSoC_NANOGrav/pulsar_data_test.json')
	json_data = r.json()
	print json_data
	app.run(host='0.0.0.0',debug=True,port = 8000)
	

