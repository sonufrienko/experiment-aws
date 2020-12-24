#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiSqsAsyncProcessingStack } from '../lib/api-sqs-async-processing-stack';

const app = new cdk.App();
new ApiSqsAsyncProcessingStack(app, 'ApiSqsAsyncProcessingStack');
