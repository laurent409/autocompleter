var express = require('express');
var router = express.Router();

var elastic = require('.../elasticsearch');

//GET Suggests
router.get('/suggest/:input', function(req, res, next){
  elastic.getSuggestions(req.params.input).then(
    function(result){
      res.json(result)
    }
  );
});

//POST document which being indexed
router.post('/', function(req, res, next){
  elastic.addDocument(req.body).then(
    function(result){
      res.json(result)
    }
  );
});

module.exports = router;
