// AWS SDKをimport
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION_NAME // DynamoDBのリージョン
});

exports.handler = async event => {
    getData();
};
    
async function getData() {
    const params = {
        TableName: "geekLaundrySystem",
        Limit: 3,
        KeyConditionExpression: "#type = :type",
        ExpressionAttributeNames:{ "#type": "type" },
        ExpressionAttributeValues: { ":type": "data" },
        ScanIndexForward: false,
    };
    
    try {
        const result = await dynamoDB.query(params).promise();
        return {
        statusCode: 200,
        body: JSON.stringify(result),
        };
    } catch (error) {
        return {
        statusCode: error.statusCode,
        body: error.message,
        };
    }
};