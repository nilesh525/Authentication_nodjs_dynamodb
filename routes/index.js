var express = require('express');
var router = express.Router();
var http = require('http').Server(express);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/loginproj';
var flash = require('connect-flash')
var bcrypt = require('bcryptjs');
var user = require('../model/user')
var AWS = require('aws-sdk');
require('dotenv').config();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'index' });
});

router.get('/register.html', function(req, res, next) {
  res.render('register.html', { title: 'register' });
});

router.get('/loginpage.html', function(req, res, next) {
  res.render('loginpage.html', { title: 'loginpage' });
});

router.post('/login', function(req, res, next) {
  var lastname = req.body.lastname;
  var pass = req.body.pass;

  var params = {
    Key: {
      lastname:{S:lastname},
    }, 
    TableName: "users"
   };
   var awsConfigInfo = {
    region: 'ap-south-1',
    identityPoolId: 'ap-south-1:c49a9371-0b0b-4359-b111-138b5d17e4af',
  }

  var awsConfig = awsConfigInfo;
  var REGION = awsConfig.region;
  var identityPoolId = awsConfig.identityPoolId;
  AWS.config.update({
    region:REGION
  });
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId:identityPoolId 
  });
  var dynamodb = new AWS.DynamoDB();
  dynamodb.getItem(params,function(er,data){
    if(er){
      console.log(er);
      res.render('error.html', { title: 'index' });
    }else{
      if(data.Item==null){
        res.render('error.html', { title: 'User not registrerd...' });
      }else{
      if(data.Item.pass.S==pass){
        var result =data.Item;
        res.render('successlogin.html', { title: result});
      }else{
        res.render('error.html', { title: 'invalid password' });
      }
      }
    }
  })
});

router.post('/register', function(req, res, next) {
  var name=req.body.firstname;
  var lastname = req.body.lastname;
  var gender = req.body.gender;
  var date = req.body.date;
  var address = req.body.address;
  var city = req.body.city;
  var country = req.body.country;
  var dept = req.body.dept;
  var desc = req.body.desc;
  var pass = req.body.pass;
  var cpass = req.body.cpass;
  console.log(name+'address---------------->'+address);

  if(pass==cpass){
    console.log('inside pass==pass')
 
  var awsConfigInfo = {
    region: 'ap-south-1',
    identityPoolId: 'ap-south-1:c49a9371-0b0b-4359-b111-138b5d17e4af',
  }

  var awsConfig = awsConfigInfo;
  var REGION = awsConfig.region;
  var identityPoolId = awsConfig.identityPoolId;
  AWS.config.update({
    region:REGION
  });
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId:identityPoolId 
  });
  console.log('inside pass==pass 2')

  var params = {
    Item: {
      lastname:{S:lastname},
      firstname:{S:name},
      gender:{S:gender},
      date:{S:date},
      address:{S:address},
      city:{S:city},
      country:{S:country},
      dept:{S:dept},
      desc:{S:desc},
      pass:{S:pass}
    }, 
    ReturnConsumedCapacity: "TOTAL", 
    TableName: "users"
   };

    var dynamodb = new AWS.DynamoDB();
    dynamodb.putItem(params,function(err,data){
      if(err){
        console.log(err);
        res.render('error.html', { title: 'Could not establish connection with dynamodb...' });
      }
      console.log(data);
      res.render('successRegister.html', { title: 'index' });
    });
  }else{
    res.render('error.html', { title: 'Password did not match' });
  }
 
});

module.exports = router;
