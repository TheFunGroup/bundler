const aws=require('aws-sdk')
const config = {
    aws_local_config: {
        //Provide details for local configuration
    },
    aws_remote_config: {
        accessKeyId: process.env.AWSACCESSKEYID,
        secretAccessKey: process.env.AWSSECRETACCESSKEY,
        // region: process.env.AWSREGION,
        region: "us-west-2"
    }
}
aws.config.update(config.aws_remote_config);
const docClient = new aws.DynamoDB.DocumentClient()

module.exports={
    config,
    docClient,
}
