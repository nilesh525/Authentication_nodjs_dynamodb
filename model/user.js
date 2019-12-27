/*var AWS = require('aws-sdk');
require('dotenv').config();

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
    TableName : "Movies",
    KeySchema: [       
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};
var paramstab = {
    TableName : "users",
    KeySchema: [       
        { AttributeName: "lastname", KeyType: "HASH"},  //Partition key
        { AttributeName: "fisrtname", KeyType: "RANGE" },
        
    ],
    AttributeDefinitions: [       
        { AttributeName: "fisrtname", AttributeType: "S" },
        { AttributeName: "lastname", AttributeType: "S" },
        { AttributeName: "gender", AttributeType: "S" },
        { AttributeName: "date", AttributeType: "B" },
        { AttributeName: "address", AttributeType: "S" },
        { AttributeName: "city", AttributeType: "S" },
        { AttributeName: "country", AttributeType: "S" },
        { AttributeName: "dept", AttributeType: "S" },
        { AttributeName: "desc", AttributeType: "S" },
        { AttributeName: "pass", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(paramstab, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});*/