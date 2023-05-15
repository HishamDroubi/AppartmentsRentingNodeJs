//packages
const express = require('express');
const body_parser = require('body-parser');
const date_format = require('dateformat');
const session=require('express-session');

//creat Router
const usersRouter = express.Router();



//DataBase Connection
const connection = require('../dataBaseConnection.js');




//Body-Parser
usersRouter.use(body_parser.urlencoded({ extended: false }));
usersRouter.use(body_parser.json());
usersRouter.use(session({secret:'secret'}));


//Access-Control-Allow-Origin
usersRouter.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
})

//GET All Users
usersRouter.get('/', (req, res) => {
    try {
        let sql = 'select * from customer';
        connection.query(sql, (err, result) => {
            if (err)
                throw err;
            res.send(JSON.stringify(result));
        })
    }
    catch (err) {

    }
})

//Add Appartment
usersRouter.post("/addAppartment", (req, res) => {
    try {
        let { title, floor_number, number_of_rooms, description, price, type, address, sub_city_id } = req.body;
        let customer_id = session.id;
        
        let sql = 'insert into appartments(title,floor_number,number_of_rooms,description,price,type,address,customer_id,status,sub_city_id)\
  values(?,?,?,?,?,?,?,?,2,?);'
        connection.query(sql, [title, floor_number, number_of_rooms, description, price, type, address, customer_id, sub_city_id],
            (err, result) => {
                if (err)
                    throw err;
                res.send('sucsses');
            });
    } catch (error) {

    }
})

//Remove Appartment
usersRouter.delete('/removeAppartment', (req, res) => {
    try {
        let appartment_id = req.body.appartment_id;

        let sql = 'delete from appartments where appartment_id=?';
        connection.query(sql, [appartment_id], (err, result) => {
            if (err)
                throw err;
            res.send(JSON.stringify('Removed Successfully'));
        })
    } catch (error) {

    }
})

//Reserve Appartment
usersRouter.post('/reserveAppartment', (req, res) => {
    try {
        console.log('hi');
        let { appartment_id, start_date, end_date } = req.body;

        let customer_id = session.id;
        console.log('v');

        let date = date_format(new Date(), "yyyy-mm-dd");

        console.log(date);
        //check if the wanted appartment already reserved or avaliable
        let sql_check = 'select appartment_id from reservation where appartment_id=? and ? >?';
        connection.query(sql_check, [appartment_id, end_date, date], (err, result) => {
            if (err)
                throw err;
            //if it is avaliable allow user to reserve
            if (result.length == 0) {
                let sql = 'insert into reservation(appartment_id,start_date,end_date,customer_id,status) values(?,?,?,?,1);'
                connection.query(sql, [appartment_id, start_date, end_date, customer_id], (err, result) => {
                    if (err)
                        throw err;
                    res.send('this appartment is reserved succsesfully')
                })
            }
            else {
                res.send('this appartment is already reserved');
            }
        })
    } catch (error) {

    }
})

//Wishlist Routes
usersRouter.post('/whishlist/add', (req, res) => {
    try {
        let appartment_id = req.body.appartment_id;
        let customer_id = session.id;
        let sql = 'insert into wishlist (customer_id,appartment_id)values(?,?)';
        connection.query(sql, [customer_id, appartment_id], (err, result) => {
            if (err)
                throw err;
            res.send('added to wishlist successfully');
        })
    } catch (error) {

    }
})
usersRouter.get('/whishlist/show', (req, res) => {
    try {
        let customer_id = session.id;
        let sql = 'select * from wishlist where customer_id=?'
        connection.query(sql, [customer_id], (err, result) => {
            if (err)
                throw err;
            res.send(JSON.stringify(result));
        })
    } catch (error) {
    }
})
usersRouter.delete('/whishlist/remove', (req, res) => {
    try {
        let appartment_id = req.body.appartment_id;
        let customer_id = session.id;
        let sql = 'delete from wishlist where customer_id=? and appartment_id=?';
        connection.query(sql, [customer_id, appartment_id], (err, result) => {
            if (err)
                throw err;
            res.send('remover from wishlist successfully');
        })
    } catch (error) {

    }
});


//Ban User    
usersRouter.put('/ban', (req, res) => {
    try {
        let customer_id = session.id;
        let sql = 'update customer set status=0 where customer_id=?';
        connection.query(sql, [customer_id], (err, result) => {
            if (err)
                throw err;
            res.send('user banned successfully');
        })
    } catch (error) {

    }

})



module.exports = usersRouter;