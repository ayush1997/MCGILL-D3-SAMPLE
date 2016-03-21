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
	print len(json_data)
	return jsonify({"data":json_data})


@app.route('/add/',methods=["GET","POST"])
def add():
	global json_data
	json_add={}
	if request.method == 'POST':
		if request.form['Period Derivative']=="" and request.form['Period']=="" and request.form['RMS']=="" :
			return redirect('/')
		json_add["Period Derivative"] = float(request.form['Period Derivative'])
		json_add["Period"] = float(request.form['Period'])
		json_add["TOAs"] = request.form['TOAs']
		json_add["Raw Profiles"] = request.form['Raw Profiles']
		json_add["Pulsar"] = request.form['Pulsar']
		json_add["RMS"] = float(request.form['RMS'])
		json_add["Binary"] = request.form['Binary']
		json_add["DM"] = request.form['DM']
		print json_add

		
		json_data.append(json_add)
		print json_add
		print json_data
		return redirect('/')
	else:
		return "error"
@app.route('/delete/',methods=["GET","POST"])
def delete():
	global json_data
	

	print len(json_data)
	if request.method == 'POST':
		name = request.form["Pulsar"]
		print name
		Period = request.form["Period"]
		period_der = request.form["Period Derivative"]

		for i in json_data:
			if i["Pulsar"]==name or(i["Period"]==Period and i["Period Derivative"]==period_der):
				print i["Pulsar"]
				json_data.remove(i)
				break

		
	print len(json_data)
		# for i in json_data:
		# 	if i["Pulsar"]==
	return redirect('/')

@app.route('/reset/')
def referesh():
	global json_data
	r = requests.get('http://msi.mcgill.ca/GSoC_NANOGrav/pulsar_data_test.json')
	json_data = r.json()
	return redirect('/')


if __name__ == '__main__':
	global json_data
	r = requests.get('http://msi.mcgill.ca/GSoC_NANOGrav/pulsar_data_test.json')
	json_data = r.json()
	print json_data
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0',port=port)
	# app.run(debug=True)
	

