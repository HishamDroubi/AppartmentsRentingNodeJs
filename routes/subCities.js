//packages
const express=require('express');
const body_parser = require('body-parser');


//DataBase Connection
const connection = require('../dataBaseConnection');

//creat Router
const subCitiesRouter=express.Router();



//Access-Control-Allow-Origin
subCitiesRouter.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  console.log("hi");
    next();
})



//GET ALL SubCities for a Specific City
subCitiesRouter.get('/city/:city_id',(req,res)=>{
    try {
        let city_id=req.params.city_id;
        let sql='select * from sub_cities where city_id=?';
        connection.query (sql,[city_id],(err,result)=>{
            if(err)
                throw err;
            res.send(JSON.stringify(result));
        })
    } catch (error) {
        console.log('er');
    }
  
})

module.exports=subCitiesRouter;