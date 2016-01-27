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
router.get('/products/trendingLow/:pageNr/:resultsPerPage/:category', function(req, res) {
    req.params.type = 'low';
    //Product.findProductsTrending(req, res)
});
router.get('/products/trendingHigh/:pageNr/:resultsPerPage/:category', function(req, res) {
    req.params.type = 'high';
    //Product.findProductsTrending(req, res)
});
router.post('/login', User.login);

module.exports = router;