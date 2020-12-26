import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3n from '@aws-cdk/aws-s3-notifications';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import { PolicyStatement, ServicePrincipal, Effect } from '@aws-cdk/aws-iam';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

export class S3SqsRekognitionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = this.createBucket();
    const queue = this.createQueue();
    const recognizeImageLambda = this.createRecognizeImageLambda();

    /**
     * Allow S3 to make sqs:SendMessage to our SQS Queue
     */
    queue.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sqs:SendMessage'],
        resources: [queue.queueArn],
        principals: [new ServicePrincipal('s3.amazonaws.com')],
        conditions: {
          StringLike: {
            'aws:SourceArn': bucket.bucketArn,
          },
        },
      })
    );

    /**
     * Allow Lambda to get messages from our SQS queue
     */
    queue.grantConsumeMessages(recognizeImageLambda);

    /**
     * Allow Lambda to access S3 bucket
     */
    bucket.grantRead(recognizeImageLambda);

    /**
     * Event: S3 -> SQS
     */
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SqsDestination(queue));

    /**
     * Event: SQS -> Lambda
     */
    recognizeImageLambda.addEventSource(
      new SqsEventSource(queue, {
        batchSize: 1,
      })
    );
  }

  createBucket() {
    return new s3.Bucket(this, 'Bucket');
  }

  createQueue() {
    return new sqs.Queue(this, 'Queue');
  }

  createRecognizeImageLambda() {
    const fn = new PythonFunction(this, 'RecognizeImageFn', {
      functionName: 'recognizeImage',
      entry: './src/functions/recognizeImage/',
      runtime: lambda.Runtime.PYTHON_3_8,
    });

    fn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['rekognition:*'],
        resources: ['*'],
      })
    );

    return fn;
  }
}
