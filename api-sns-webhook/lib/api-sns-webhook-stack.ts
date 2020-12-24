import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import { HttpMethod, HttpApi, AddRoutesOptions } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';

export class ApiSnsWebhookStack extends cdk.Stack {
  public FUNCTION_DEFAULT_PROPS: {
    handler: 'handler';
    bundling: {
      target: 'node12';
      externalModules: ['aws-sdk'];
    };
  };
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * 1. create SNS topic
     * 2. create HTTP API Gateway
     * 3. add routes to API Gateway
     */

    const topic = this.createSNS();
    const api = this.createAPI();

    api.addRoutes({
      path: '/webhook',
      methods: [HttpMethod.ANY],
      integration: new LambdaProxyIntegration({
        handler: this.getRouteWebhook(topic.topicArn),
      }),
    });

    api.addRoutes({
      path: '/publish',
      methods: [HttpMethod.POST],
      integration: new LambdaProxyIntegration({
        handler: this.getRoutePublish(topic.topicArn),
      }),
    });
  }

  createSNS() {
    return new sns.Topic(this, 'WebhookTopic', {
      topicName: 'api-sns-webhook',
      displayName: 'Webhook subscription topic',
    });
  }

  createAPI() {
    return new HttpApi(this, 'HttpApi', {
      apiName: 'api-sns-webhook',
    });
  }

  getRouteWebhook(topicArn: string) {
    const handler = new lambda.NodejsFunction(this, 'WebhookFn', {
      functionName: 'webhook',
      entry: './src/functions/webhook/index.ts',
      environment: { SNS_ARN: topicArn },
      ...this.FUNCTION_DEFAULT_PROPS,
    });

    handler.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sns:*'],
        resources: [topicArn],
      })
    );

    return handler;
  }

  getRoutePublish(topicArn: string) {
    const handler = new lambda.NodejsFunction(this, 'PublishFn', {
      functionName: 'publish',
      entry: './src/functions/publish/index.ts',
      environment: { SNS_ARN: topicArn },
      ...this.FUNCTION_DEFAULT_PROPS,
    });

    handler.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sns:*'],
        resources: [topicArn],
      })
    );

    return handler;
  }
}
