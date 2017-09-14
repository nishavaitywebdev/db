/**
 * Created by nishavaity on 12/6/16.
 */

module.exports = function(app,model){
    console.log("Reached inside res server service");
    app.get('/api/allRestaurants/',getAllRestaurants);
    app.get('/api/restaurant/:rid',getRestaurantDetailsById);
    app.get('/api/allRestaurants/:cid',getAllRestaurantsByCityId);
    app.post('/api/restaurantNew/',createRestaurant);
    app.post('/api/restaurantTableNew/',createRestaurantTable);
    app.delete('/api/deleteRestaurant/:rid',deleteRestaurant);
    app.post('/api/makeReservation/', makeReservation);
    app.get('/api/allReservations/:uid',getallReservationsByUid);


    var mysql = require('mysql');
    var async = require('async');

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'admin',
        database : 'TableReservation',
        multipleStatements: true
    });

    function createRestaurant(req, res) {
        var cityId = req.body.new_res_city;
        var name = req.body.new_name;
        // var cityId;
        // getCityId();
        // function getCityId(callback) {
        //     connection.query('SELECT * from City where name=?', city, function(err, rows, fields) {
        //         if (!err){
        //             console.log('The solution is: ', rows);
        //             cityId = rows.id;
        //             async.map(rows, addRes, callback);
        //         }
        //         else
        //             console.log('Error while performing Query.');
        //     });
        // }

        // function addRes(resrow, callback) {
        //     cityId = resrow.id;
        //     console.log(cityId);
            connection.query('Insert into Restaurant(name, locatedIn,tokenAmtRequired,amtCollected) values ' +
            '(?,?,?,?)', [name, cityId, 2, 0], function (err, rows, fields) {
            if (!err) {
                res.sendStatus(200);
            }
            else
                console.log('Error while performing Query.', err);
        })
        // }
    }

    function createRestaurantTable(req, res) {
        // console.log("Reached inside create res table");
        // var cityId = req.body.city;
        var resId = req.body.name;
        var seats = req.body.seats;
        // getCityResId();
        // function getCityResId(callback) {
        //     connection.query('SELECT * from City where name=?', city, function(err, rows, fields) {
        //         if (!err){
        //             console.log('got city ', rows);
        //             var cityId = rows.id;
        //             console.log(rows.name);
        //             async.map(rows, getResId, function (err) {
        //                 console.log(err);
        //             });
        //         }
        //         else
        //             console.log('Error while performing Query.');
        //     });
        // }

        // function getResId(cityRows, callback) {
        //     console.log('Inside res id find, city id is '+cityRows.id);
        //     connection.query('SELECT * from Restaurant where name=? and locatedIn = ?', [name, cityRows.id], function(err, rows, fields) {
        //         if (!err){
        //             console.log('got res ', rows);
        //             resId = rows.id;
        //             async.map(rows, addRestaurantTable, function (err) {
        //                 console.log(err);
        //             });
        //         }
        //         else
        //             console.log('Error while performing Query.');
        //     });
        // }

        // function addRestaurantTable(resRows, callback) {
        //     console.log('Inside add table res id is '+resRows.id);
            connection.query('Insert into RestaurantTable(belongsToRestaurant, seatingCapacity) values ' +
                '(?,?)', [resId, seats], function (err, rows, fields) {
                if (!err) {
                    res.sendStatus(200);
                }
                else
                    console.log('Error while performing Query.', err);
            });
        // }
    }

    function getAllRestaurants(req,res) {
        connection.query('SELECT r.id rid, c.id cid, r.name rname, c.name cname ' +
            'from Restaurant r, City c where r.locatedIn = c.id;', function(err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows);
                return res.send(rows);
            }
            else
                console.log('Error while performing Query.');
        });
    }

    function getAllRestaurantsByCityId(req,res) {
        var cityId = req.params.cid;
        connection.query('SELECT r.id rid, r.name rname, c.id cid ' +
            'from Restaurant r, City c where r.locatedIn = c.id and c.id=?;', cityId, function(err, rows, fields) {
            if (!err){
                return res.send(rows);
            }
            else
                console.log('Error while performing Query.');
        });
    }

    function getallReservationsByUid(req,res) {
        var userId = req.params.uid;
        connection.query('SELECT r.dateTime dateTime, r.reservedFor resTable, ' +
            'res.name rname, c.name cname, r.id id  FROM TableReservation.Reservation r, ' +
            'RestaurantTable rt, Restaurant res, City c where r.reservedFor=rt.id ' +
            'and rt.belongsToRestaurant=res.id and res.locatedIn=c.id and reservedBy = ?;',
            userId, function(err, rows, fields) {
            if (!err){
                return res.send(rows);
            }
            else
                console.log('Error while performing Query.');
        });
    }

    function getRestaurantDetailsById(req, res) {
        var resId = req.params.rid;
        connection.query('SELECT r.id rid, c.name cname, rt.id rtid, r.name rname,' +
            ' rt.seatingCapacity seats, r.tokenAmtRequired tokenAmt ' +
            'from Restaurant r, RestaurantTable rt, City c where r.id = rt.belongsToRestaurant ' +
            'and r.locatedIn = c.id and r.id = ?;'
            , resId, function(err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows);
                return res.send(rows);
            }
            else
                console.log('Error while performing Query.');
        });
    }

    function makeReservation(req, res) {
        var reservation = req.body;
        getTokenAmt();
        function getTokenAmt() {
            connection.query('Select moneyBalance from Person where id =?', reservation.userId, function (err, rows, fields) {
                if (!err) {
                    if(JSON.stringify(rows[0].moneyBalance) < reservation.tokenAmt){
                        res.send('0');
                    }else{
                        connection.query('update Person set moneyBalance = (moneyBalance - ?) where id = ?;',
                            [reservation.tokenAmt, reservation.userId], function(err, rows, fields) {
                            if (!err){
                               addReservation();
                            }
                            else
                                console.log('Error while performing update balance Query.');
                        });
                    }
                }
                else
                    console.log('Error while performing select balance Query.');
            })

        }

        function addReservation() {
            console.log("In here");
            var year = reservation.reservationDate.split("-")[0];
            var month = reservation.reservationDate.split("-")[1]-1;
            var day = reservation.reservationDate.split("-")[2].split("T")[0];
            var hours = reservation.reservationDate.split("-")[2].split("T")[1].split(":")[0]-1;
            var minutes = reservation.reservationDate.split("-")[2].split("T")[1].split(":")[1]-1;
            var dateTime = Date.UTC(year, month, day, hours, minutes, 0, 0)
            connection.query('Insert into Reservation(reservedFor, reservedBy, dateTime) values ' +
                '(?,?,?)', [reservation.selectedTable, reservation.userId, dateTime], function (err, rows, fields) {
                if (!err) {
                    res.send(rows);
                }
                else
                    console.log('Error while performing reservation Query.');
            })
        }
    }

    function deleteRestaurant(req, res) {
        var resId = req.params.rid;
        console.log(resId);
        connection.query('Delete from Restaurant where id=?', resId, function(err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows);
                return res.sendStatus(200);
            }
            else
                console.log('Error while performing Query.'+ err);
        });
    }
}