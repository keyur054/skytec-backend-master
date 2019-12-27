/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jwt = require('jsonwebtoken');
var allowed = [
];
/**
 *  middleware enabled or not
 * @type Boolean
 */
var enabled = true;

module.exports = function (onoff) {
    enabled = (onoff == 'on') ? true : false;
    return function (req, res, next) {
        if (enabled && allowed.indexOf(req.originalUrl) == -1) {
            
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
           
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
                    if (err) { //failed verification.
                        return res.status(403).json({"success": false, "message": "Please enter valid TOKEN, You are not authorized to access."});
                    }
                    req.decoded = decoded;
                    next(); //no error, proceed
                });
            } else {
                // forbidden without token
                return res.status(403).json({
                    "success": false, "message": "Please enter TOKEN, You are not authorized to access."
                });
            }
        } else {
            next();
        }
    }
}


