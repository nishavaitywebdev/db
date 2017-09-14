/**
 * Created by nishavaity on 10/24/16.
 */

module.exports = function(app,model){

    var passport      = require('passport');
    var LocalStrategy      = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var bcrypt = require("bcrypt-nodejs");
    var cookieParser  = require('cookie-parser');
    var session       = require('express-session');

    app.use(session({
        secret: 'this is the secret',
        resave: true,
        saveUninitialized: true
    }));
    //
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/project/#/user',
            failureRedirect: '/project/#/login'
        }));

    var facebookConfig = {
        clientID    :   "302238760175775",
        clientSecret : "666d0c6ad902fc6d36c2c1cf2f882fbd",
        callbackURL  : "http://localhost:3000/auth/facebook/callback"
    }

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    //console.log("Inside user service server js");
    app.post('/api/login', login);
    app.post('/api/checkLogin', checkLogin);
    app.post('/api/checkAdmin', checkAdmin);
    app.post('/api/logout', logout);
    app.get('/api/getAllUsers/', getAllUsers);
    app.get('/api/user', findUser);
    app.post ('/api/register', register);
    app.put('/api/follower/', addFollower);
    //app.get('/api/loggedin', loggedin);
    //app.get('/api/user?username=username&password=password',findUserByCredentials);
    app.get('/api/user/:userId',findUserById);
    app.post('/api/user',createUser);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', loggedInAndSelf, deleteUser);
    app.delete('/api/reservation/:rid', deleteReservation);

    var mysql = require('mysql');
    var async = require('async');

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'admin',
        database : 'TableReservation',
        multipleStatements: true
    });

    function getAllUsers(req, res) {
        model.userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }
    function addFollower(req, res) {
        var followerId = req.body.followerId;
        var followeeId = req.body.followeeId;

        model
            .userModel
            .addFollower(followerId, followeeId)
            .then(function (status) {
                    res.send(status);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                })

    }

    function register(req, res) {
        //console.log("In project user service")
        var user = req.body;
        console.log(user);
        var name = user.firstName +" "+user.lastName;

        connection.query('Insert into Person(name, email,phone,username,password, moneyBalance) values ' +
            '(?,?,?,?,?, 0)', [name, user.email, user.phone, user.username, user.password],
            function (err, rows, fields) {
            if (!err) {
                res.send(rows);
            }
            else
                res.send(err);
        })

    }
    
    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }


    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user :  '0');
    }

    function checkAdmin(req, res) {

        var loggedIn = req.isAuthenticated();
        var isAdmin = req.user.role == 'ADMIN';

        if(loggedIn&& isAdmin)
            res.json(req.user);
        else
            res.send('0');
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        //console.log(profile);
        //done(null, profile);
        model.userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        // var email = profile.emails[0].value;
                        // var emailParts = email.split("@");
                        var newFacebookUser = {
                            username:  profile.displayName.replace(/\s+/g, ''),
                            firstName: profile.displayName.split(" ")[0],
                            lastName:  profile.displayName.split(" ")[1],
                            email:     "",
                            facebook: {
                                id:    profile.id,
                                email:     "",
                                token: token
                            }
                        };
                        return model.userModel.createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function localStrategy(username, password, done) {



       // console.log(username);
       //  model
       //      .userModel
       //      .findUserByUsername(username)
       //      .then(
       //          function (user) {
       //              //console.log(user);
       //              if(user && bcrypt.compareSync(password, user.password)) {
       //                  //console.log("In if ")
       //                  return done(null, user);
       //              } else {
       //                  return done(null, false);
       //              }
       //          },
       //          function (error) {
       //              res.sendStatus(400).send(error);
       //          }
       //      );
        //res.send('0');
    }
    
    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    //  console.log(user);
                    done(null, user)
                    // if(user)
                    //     res.send(user);
                    // else
                    //     res.send('0');
                },
                function (error) {
                    done(error, null)
                    //res.sendStatus(400).send(error);
                });
    }
        function login(req, res) {
            var user  = req.body;
            console.log(user);
            connection.query('SELECT * from Person where username=? and password=?',
                [user.username, user.password], function(err, rows, fields) {
                if (!err){
                    console.log('The solution is: ', rows);
                    res.send(rows);
                }
                else
                    res.sendStatus(400).send(error);
            });
        }
        function createUser(req, res) {
            var user = req.body;
            // user._id = (new Date().getTime()).toString();
            // user.push(user);
            //console.log(user);
            model.userModel.createUser(user)
                .then(
                    function (newuser) {
                        res.send(newuser);
                    },
                    function (error) {
                        res.sendStatus(400).send("Error");
                    }
                );


        }

        function findUser(req, res){
            //console.log("Inside find user")
            var params = req.params;
            var query = req.query;
            //console.log(query);
            if(query.password && query.username){
                //console.log("In if of creds");
                findUserByCredentials(req, res);
            } else if (query.username){
                //console.log("In if of username");
                findUserByUsername(req, res);
            } else{
                res.json(req.user);
            }
            // console.log(params);
            // console.log(query);
            //res.send(user);
        }


        function findUserByUsername(req,res) {

            var user,username;
            username = req.query.username;
            for( var u in users){
                if(users[u].username === username){
                    user = users[u];
                    res.send(user);
                    return;
                }
            }
            res.send('0');
        }
        function findUserByCredentials(req,res) {

            var user, username, password;
            username = req.query.username;
            password = req.query.password;

            model
                .userModel
                .findUserByCredentials(username, password)
                .then(
                    function (user) {
                        if(user)
                            res.json(user);
                        else
                            res.send('0');
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
            //res.send('0');
        }

    function findUserById(req,res) {
        //console.log("Inside ind user by id")
        var userId = req.params.userId;
        connection.query('SELECT * from Person where id=?',
            userId, function(err, rows, fields) {
                if (!err){
                    console.log('The solution is: ', rows);
                    res.send(rows);
                }
                else
                    res.sendStatus(400).send(error);
        });
    }


    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.userId;

        var self = userId == req.user._id;

        if(self && loggedIn){
            next();
        }else{
            res.send("You are not the same person.");
        }
    }

    function updateUser(req, res){
        var user = req.body;
        var uid = req.params.userId;
        var name = user.firstName +" "+user.lastName;
        console.log(user.moneyBalance);

        connection.query('Update Person set name=?, email=?,phone=?,' +
            'username=?,password=?, moneyBalance=? where id=?',
            [name, user.email, user.phone, user.username, user.password,user.moneyBalance,uid],
            function (err, rows, fields) {
                if (!err) {
                    console.log('The solution is: ', rows);
                    res.send(user);
                }
                else{
                    console.log("error"+err);
                    res.send('0');
                }
            });
    }

    function deleteReservation(req, res) {
        var resId = req.params.rid;
        console.log(resId);
        connection.query('Delete from Reservation where id=?', resId, function(err, rows, fields) {
            if (!err){
                return res.sendStatus(200);
            }
            else
                console.log('Error while performing Query.'+ err);
        });
    }

    function deleteUser(req, res){
        var uid = req.params.userId;
        model.userModel
            .deleteUser(uid)
            .then(
                function (status) {
                    res.send(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
        // for(var u in user){
        //     if(user[u]._id == uid.toString()){
        //         user.splice(u, 1);
        //         res.send(200);
        //     }
        // }
        //res.send('0');
    }
}