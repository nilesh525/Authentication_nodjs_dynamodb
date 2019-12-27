var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', function(req, res, next) {
  var name=res.body.firstname;
  var lastname = res.body.lastname;
  var gender = res.body.gender;
  var date = res.body.date;
  var address = res.body.address;
  var city = res.body.city;
  var country = res.body.country;
  var dept = res.body.dept;
  var desc = res.body.desc;
  var pass = res.body.pass;
  var cpass = res.body.cpass;

  alert(name);
});


module.exports = router;
