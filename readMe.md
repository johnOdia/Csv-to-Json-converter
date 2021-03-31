A script for converting csv files to json format

The api route expects a link to a hosted csv file in req.body.csv 

Users can specify selected fields to be converted in req.body.select_fields which should be an array of fields. By default the api converts all fields.

The api returns a json object as its response.