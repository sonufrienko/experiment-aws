import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ApiSqsAsyncProcessing from '../lib/api-sqs-async-processing-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ApiSqsAsyncProcessing.ApiSqsAsyncProcessingStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
