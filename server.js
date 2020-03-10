var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authJwtController = require('./auth_jwt');
var User = require('./Users');
var Movie = require('./Movies');
var jwt = require('jsonwebtoken');
var cors = require('cors');

var app = express();
module.exports = app; // for testing
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();


function getJSONObject(req, _msg, status) {
    var json = {
        headers : "No Headers",
        status: status,
        env: process.env.UNIQUE_KEY,
        body : "No Body",
        msg : "No Message",
        query : "No query"
    };

    if (req.body != null) {
        json.body = req.body;
    }
    if (req.headers != null) {
        json.headers = req.headers;
    }
    if (req.query != null) {
        json.query = req.query;
    }
    json.msg = _msg

    return json;
}



router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
        }
    );

router.route('/users/:userId')
    .get(authJwtController.isAuthenticated, function (req, res) {
        var id = req.params.userId;
        User.findById(id, function(err, user) {
            if (err) res.send(err);

            var userJson = JSON.stringify(user);
            // return that user
            res.json(user);
        });
    });

router.route('/users')
    .get(authJwtController.isAuthenticated, function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(err);
            // return the users
            res.json(users);
        });
    });

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, message: 'Please pass username and password.'});
    }
    else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        // save the user
        user.save(function(err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists. '});
                else
                    return res.send(err);
            }

            res.json({ success: true, message: 'User created!' });
        });
    }
});

router.post('/signin', function(req, res) {
    var userNew = new User();
    //userNew.name = req.body.name;
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) res.send(err);

        user.comparePassword(userNew.password, function(isMatch){
            if (isMatch) {
                var userToken = {id: user._id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, message: 'Authentication failed.'});
            }
        });


    });
});


router.route('/movies')
    .get(function(req, res) {
        res.json(getJSONObject(req,'GET movies')).status(200).end();
    })

    .post(function(req, res) {
        res.json(getJSONObject(req,'movie saved')).status(200).end();
    })

    .put(authJwtController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.json(getJSONObject(req,'movie updated')).status(200).end()
        }
    )

    .delete(function(req, res) {

            var user = db.findOne(req.body.username);

            if (!user) {
                res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
            }
            else {
                // check if password matches
                if (req.body.password == user.password)  {
                    res.json(getJSONObject(req,'movie deleted')).status(200).end();
                }
                else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            };

        }
    )

router.all('*', function(req, res) {
    res.status(405).send({success: false, msg: 'Method Not Allowed'});
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
