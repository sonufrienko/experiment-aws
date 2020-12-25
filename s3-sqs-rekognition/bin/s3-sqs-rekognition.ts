#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3SqsRekognitionStack } from '../lib/s3-sqs-rekognition-stack';

const app = new cdk.App();
new S3SqsRekognitionStack(app, 'S3SqsRekognitionStack');
