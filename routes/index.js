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

//reset password
router.get('/resetpass.html', function(req, res, next) {
  res.render('resetpass.html', { title: 'reset password' });
});

router.post('/resetpass',function(req,res,next){
  var name = req.body.lastname;
  var dob =req.body.date;

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
  console.log('inside reset pass....'+'lastname '+name+' dob '+dob)

  var params = {
    ExpressionAttributeValues: {
      ':u': {S: name},
      ':d' : {S: dob},
    },
    ExpressionAttributeNames: {
      "#lastname": "lastname",
      "#date":"date"
    },
    //KeyConditionExpression: 'username = :u',
    ProjectionExpression: 'lastname, pass',
    //FilterExpression: 'contains (:u, :d)',
    FilterExpression: '#lastname = :u AND #date=:d',
    TableName: 'users'
  };

   var dynamodb = new AWS.DynamoDB();
   dynamodb.scan(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else{
      
      if(data.Items.length==0){
        res.render('error.html', { title: 'Invalid username or DOB' });
      }else{
        var result ='';
        data.Items.forEach(function(itemdata) {
          result=itemdata.lastname.S;
          console.log("Item :",itemdata.lastname.S);
       });
       console.log(result+'---------------------'); 
        res.render('resetpage.html',{ title : result});
      }
    }   
   });
});

router.post('/newpass',function(req,res,next){
  console.log('inside new passss')
  var pass = req.body.pass;
  var cpass= req.body.cpass;
  var name =req.body.name;

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
  var params = {
    ExpressionAttributeNames: {
     "#P": "pass", 
    }, 
    ExpressionAttributeValues: {
     ":t": {
       S: pass
      }, 
    }, 
    Key: {
     "lastname": {
       S: name
      }, 
    }, 
    ReturnValues: "ALL_NEW", 
    TableName: "users", 
    UpdateExpression: "SET #P = :t"
   };

   console.log('inside new passss '+name+' '+pass+' '+cpass)

   if(pass==cpass){
    console.log('inside new passss===passss')
    dynamodb.updateItem(params, function(err, data) {
      if (err){
        console.log(err, err.stack);
        res.render('error.html', { title: 'resources din not found ...' });
      }  // an error occurred
      else {
        console.log(data);  
        var result = data.Attributes.pass.S;
        console.log(data.Attributes.pass.S);
        res.render('successupdate.html', { title: result });
      }          // successful response
    })
   }
})

module.exports = router;
