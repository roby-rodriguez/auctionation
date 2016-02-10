/**
 * Router
 */
var express         = require('express');
var User            = require('../model/user');
var router          = express.Router();

/*
 * public accessible routes
 */
router.get('/', function(req, res) {
    res.render('index.html');
});
router.post('/login', User.login);

module.exports = router;