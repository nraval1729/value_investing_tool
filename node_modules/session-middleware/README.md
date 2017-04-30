About
=====

A fully stateless session middleware for Node.js and Connect / Express.

Installation
============

Installing through [npm](http://npmjs.org) is as easy as:

    npm install session-middleware

Usage
=====

To plug the middleware into a Connect or [Express](http://expressjs.com/) server:

    var encryptionKey = 'Some.Encryption.Password';
    var cookieName = 'SessionCookie';

    var app = require('express')();
    app.use(require('session-middleware').middleware( ecryptionKey, cookieName ));

Note that it is not necessary to use the `cookieParser` middleware in order to use this middleware.

When the middleware component runs, a `session` object is attached to the request. Any changes made to data in this
object are serialized and set in a cookie as the headers are sent. Making changes to the `session` object after the
headers are sent will not be persisted for the next request.

Example
=======

    app.use(require('session-middleware').middleware( ecryptionKey, cookieName ));

    app.get('/', function(req, res) {
       var then = req.session.now;
       var now =  req.session.now = Date.now();

       res.send("Then: " + then + " and Now: " + now);

       // headers already sent so this is not saved
       req.session.now = "This will not be persisted";
    });

