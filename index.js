// AWS SDKをimport
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION_NAME // DynamoDBのリージョン
});

exports.handler = async event => {
    let responseBody =  await getData();
    let itemDatas = await parseResponseData(responseBody);
    let JudgmentResult = JudgedDatas(itemDatas);
    return JudgmentResult;
}

// DynamoDBから値を取得
async function getData() {
    const limit = 3;
    const params = {
        TableName: "geekLaundrySystem",
        Limit: limit,
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
}

// getした値をparse
function parseResponseData(responseBody) {
    let status = responseBody.body;
    let response = JSON.parse(status);
    let itemDatas = response.Items.map(item => item.data);
    return itemDatas;
}

// 値をもとに洗濯機が稼働しているか否かを判定
function JudgedDatas(itemDatas) {
    let JudgedDatas = itemDatas.filter(itemData => itemData !== 0);
    let JudgedDatasCount = JudgedDatas.length;
    return JudgedDatasCount >= 2;
}
    