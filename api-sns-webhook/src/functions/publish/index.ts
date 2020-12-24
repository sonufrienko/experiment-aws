import SNS from '../../services/sns';

const sns = new SNS(process.env.SNS_ARN || '');

export const handler = async (event: any) => {
  const { requestContext, body: bodyStr } = event;
  const body = JSON.parse(bodyStr);

  await sns.publish(body.user, body.message);

  return {
    statusCode: 200,
  };
};
