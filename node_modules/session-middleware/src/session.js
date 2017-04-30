/**
 * @exports session
 */
module.exports = (function () {

   var Crypto = require('crypto');

   /**
    * Session data handling
    *
    * @name Session
    * @constructor
    */
   function Session(encryptionKey) {
      this._key = encryptionKey;
   }

   /**
    * Converts the supplied data object to a JSON string and encrypts it, returns the encrypted string.
    *
    * @param {Object} data
    * @return {String}
    */
   Session.prototype._encryptData = function(data) {
      return Crypto.createCipher('rc4', this._key).update(JSON.stringify(data), 'utf8', 'hex');
   };

   /**
    * Deciphers the supplied data string, when the first character of the string is an opening brace, an attempt will
    * be made to parse the string as JSON. If JSON parsing fails the regular string will be returned, as is the case
    * when the first character isn't an opening brace.
    *
    * @param {String} data
    * @return {Object|String}
    */
   Session.prototype._decryptData = function(data) {
      var deciphered = Crypto.createDecipher('rc4', this._key).update(data, 'hex', 'utf8');
      if(deciphered && deciphered.charAt(0) === '{') {
         try {
            return JSON.parse(deciphered);
         }
         catch (e) {}
      }
      return deciphered;
   };

   /**
    * Creates the hash of the supplied data.
    *
    * @param {String} data
    * @return {String}
    */
   Session.prototype._toHash = function(data) {
      return Crypto.createHash('sha1').update(data).digest('hex');
   };

   /**
    * Given the supplied raw cookie string, returns the expanded cookie object.
    * @param {String} rawCookies
    * @return {Object}
    */
   Session.parseCookies = function(rawCookies) {
      var bakedCookies = {};
      rawCookies.replace(/([^=]+)=([^; ]+)([; |$]*)/g, function(raw,name,value) {
         bakedCookies[name] = value;
      });
      return bakedCookies;
   };

   /**
    * Checks whether the supplied request object contains a session, and whether that session is not empty.
    *
    * @param req
    * @return {Boolean}
    */
   Session.isEmpty = function(req) {
      if(req.session) {
         for(var exists in req.session) {
            if(req.session.hasOwnProperty(exists)) {
               return false;
            }
         }
      }
      return true;
   };

   /**
    *
    * @param {String} encryptionKey
    * @param {String} cookieName
    */
   Session.middleware = function(encryptionKey, cookieName) {
      var session = new Session(encryptionKey);
      if(!cookieName) {
         cookieName = 'SID';
      }

      return function(req, res, next) {
         req.session = {};
         req.cookies = req.cookies || Session.parseCookies(req.headers['cookie'] || '');

         var data = req.cookies[cookieName + '.data'];
         var key = req.cookies[cookieName + '.key'];

         if(data && key && key == session._toHash(data)) {
            req.session = session._decryptData(data);
         }

         var cookiePath = req.originalUrl.substr(0, req.originalUrl.length - req.url.length) + '/';

         res.on('header', function() {
            if(Session.isEmpty(req)) {
               res.clearCookie(cookieName + '.data', {path: cookiePath});
               res.clearCookie(cookieName + '.key', {path: cookiePath});
            }

            else {
               var encrypted = session._encryptData(req.session);
               if(encrypted != data) {
                  res.cookie(cookieName + '.data', encrypted, {path: cookiePath, httpOnly: true});
                  res.cookie(cookieName + '.key', session._toHash(encrypted), {path: cookiePath, httpOnly: true});
               }
            }
         });

         next();
      }
   };

   return Session;

}());
