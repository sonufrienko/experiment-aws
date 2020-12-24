import SNS from '../../services/sns';

const sns = new SNS(process.env.SNS_ARN || '');

export const handler = async (event: any) => {
  const { requestContext, body: bodyStr } = event;
  const {
    http: { method, path },
  } = requestContext;

  const body = JSON.parse(bodyStr);
  let statusCode = 200;

  switch (method) {
    case 'POST':
      await sns.subscribe(body.url, body.user);
      break;
    case 'GET':
      // retrieve webhook
      break;
    case 'DELETE':
      // delete webhook
      break;
  }

  return {
    statusCode,
  };
};
