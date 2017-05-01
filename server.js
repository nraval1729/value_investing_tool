// Express
var express = require('express');
var app = express();

// Path
var path = require('path');

// Templating
var engines = require('consolidate');
app.engine('html', engines.hogan);

//sqlite3
var sqlite3 = require('sqlite3').verbose();
//can use :memory: for in memory database but this is easier to debug
var db = new sqlite3.Database('userDatabase.sqlite3');
db.serialize(function() {
    db.run("CREATE TABLE if not exists users (email varchar primary key, number varchar, password varchar)");
    db.run("CREATE TABLE if not exists favorites (email varchar, ticker varchar, PRIMARY KEY (email, ticker))");

})

//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  passReqToCallback : true
},
  function(req, username, password, done) {
      db.get("SELECT password AS password FROM users WHERE email = ?", username, function(err, row) {
          if(row == undefined) {
              return done(null, username, {message: "username"});
          }
          var realpass = row.password;
          if(password == realpass) {
            return done(null, username, {message: "success"});
        } else {
            return done(null, username, {message: "password"});
        }
      });
   }
));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//sessions
var session = require('express-session');
app.use(session({secret: 'secret'}));
var sess;

app.set('views', path.join(path.join(__dirname, 'public'), 'html'));
app.set('view engine', 'html');

// Post request body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));


// Python bridge to run python from node
var spawn = require("child_process").spawn;

// COMMENTING OUT THE PYTHON JOBS FOR DELIVERABLE -Nisarg
// launchCurrentScraper();
// launchValidTickersGenerator();
// launchInfoJsonGenerator();

app.get("/", function(req, res) {
    sess = req.session;
    res.render('index.html');
});

app.post("/", function(req, res) {
        sess = req.session;
        if(sess.email) {
            res.json({loggedIn: true, email: sess.email});
        } else {
            res.json({loggedIn: false, email: sess.email});
        }
});

app.get("/about", function(req, res) {
	res.render('about.html');
});

app.get("/privacy_policy", function(req, res) {
	res.render('privacy_policy.html');
});

app.get("/forgot_pass", function(req, res) {
	res.render('forgot_pass.html');
});

app.get("/create_account", function(req, res) {
	res.render('create_account.html');
});

app.get("/info", function(req, res) {
	var infoFilePath = __dirname + '/public/json_files/info.json';
	console.log("Inside /info, sending current json at path: " +infoFilePath);
	res.sendFile(infoFilePath);
});

app.post("/insert", function(req, res) {
    let email = req.body['email'];
    let number = req.body['number'];
    let password = req.body['password'];
    let message = "";
    db.get("SELECT * FROM users WHERE email = ?", email, function(err, row) {
        if(row != undefined) {
            message = "You already have an account!"
        } else {
            db.run("INSERT INTO users (email, number, password) VALUES (?, ?, ?)", [email, number, password]);
        }
            res.json({message: message});
    });
});

app.post("/validate", passport.authenticate('local', { failureRedirect: "/privacy_policy" }),
  function(req, res) {
      var message = res.req.authInfo["message"];
      var username = res.req.body["username"];
      if(message == "success") {
          sess = req.session;
          sess.email = username;

      }
      res.json({user: username, message: message});
  });

app.post("/logout", function(req, res) {
  req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
});

app.post("/addFav", function(req, res) {
    sess = req.session;
    var email = sess.email;
    var ticker = req.body['ticker'];
    db.run("INSERT or IGNORE INTO favorites (email, ticker) VALUES (?, ?)", [email, ticker]);
    res.json({ticker: ticker});
});
app.post("/removeFav", function(req, res) {
    sess = req.session;
    var email = sess.email;
    var ticker = req.body['ticker'];
    db.run("DELETE FROM favorites WHERE email = ? AND ticker = ?", [email, ticker]);
    res.json({ticker: ticker});
});
app.post("/loadSaved", function(req, res) {

    sess = req.session;
    var email = sess.email;
    var list = [];

    db.each("SELECT ticker FROM favorites WHERE email = ?", [email], function(err, row) {
        list.push(row.ticker);

    }, function() {

        res.json({list: list});
    });
});

// Util functions
function launchInfoJsonGenerator() {
	var filePath = __dirname + "/public/scripts/python/info_json_generator.py";
	spawnPythonProcess(filePath);
}

function launchValidTickersGenerator() {
	var filePath = __dirname + "/public/scripts/python/valid_tickers_generator.py";
	spawnPythonProcess(filePath);
}

function launchCurrentScraper() {
	var filePath = __dirname + "/public/scripts/python/current_scraper.py";
	spawnPythonProcess(filePath);
}

function spawnPythonProcess(scriptPath) {
    var process = spawn('python',[scriptPath]);
    process.stdout.on('data', function(data) {
        console.log("Received: " +data);
    });
}

app.listen(process.env.PORT || 8080, function() {
	console.log("Server started!");
});
