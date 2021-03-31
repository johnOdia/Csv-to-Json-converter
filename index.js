const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;
const csv = require("csvtojson");
const request = require('request')
const fs = require('fs')


//middlewares
app.use(express.json());

//make get request to hosted csv file path
const getFileContent = (req,res,next) => {
    const url = req.body.csv.url, fields = req.body.csv.select_fields
    
    const options = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/csv'
        }   
    };

    let allFields = "";

    //return only selected fields if user includes fields else return all fields
    if(fields){
        fields.forEach((field,index) => {
            if(index === 0) allFields += field
            else allFields += `|${field}`
        })
    }
    else allFields = ''

    //Make request Get request to hosted csv path
    req.data = request(options,  function (error, response, body) {
        const reg = new RegExp(allFields);
        if (!error && response.statusCode == 200) {
            
            //Save csv file
            fs.writeFile('requestContent.csv', body, error => {
                if(error) console.log(error);
            })

            //Convert saved csv to json
            const jsonArray = csv({
                includeColumns:  reg
            })
            .fromFile('./requestContent.csv').then((resp) => {
                //Return json object
                res.json({json:resp})
            })               
        }
    })
}
app.use(getFileContent)



//route
app.post('/', async (req, res, next) => {
    try {
    //    const jsonData = await getFileContent(req.body.csv.url, req.body.csv.select_fields)
    //    res.json(jsonData)
    console.log(req.data)
    } catch (err) {
        console.error(err)
    }
})    


app.listen(PORT, () => console.log(`server started on ${PORT}`));


// This app is incomplete. items left:
// 1) generate hashed number with bcrypt module to include in response
// 2) handle errors
// 3) refactor to make it cleaner 