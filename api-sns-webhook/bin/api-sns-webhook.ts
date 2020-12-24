#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiSnsWebhookStack } from '../lib/api-sns-webhook-stack';

const app = new cdk.App();
new ApiSnsWebhookStack(app, 'ApiSnsWebhookStack');
