// @ts-ignore
import * as AWS from 'aws-sdk';

const sns = new AWS.SNS();

export default class SNS {
  constructor(private topicArn: string) {}

  subscribe(url: string, filterUser: string) {
    const params = {
      Protocol: 'https',
      TopicArn: this.topicArn,
      Attributes: {
        FilterPolicy: JSON.stringify({
          user: [filterUser],
        }),
      },
      Endpoint: url,
    };

    return sns.subscribe(params).promise();
  }

  publish(user: string, message: string) {
    const params = {
      Message: message,
      MessageAttributes: {
        user: {
          DataType: 'String',
          StringValue: user,
        },
      },
      TopicArn: this.topicArn,
    };

    return sns.publish(params).promise();
  }
}
