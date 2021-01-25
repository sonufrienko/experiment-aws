#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrStack } from '../lib/ecr-stack';
import { EcsStack } from '../lib/ecs-stack';
import { PipelineStack } from '../lib/pipeline-stack';
import { ServiceAttributes } from '../lib/types';

const app = new cdk.App();
const services: ServiceAttributes[] = [
  {
    name: 'service-js',
    healthCheckPath: '/test',
    port: 4000,
  },
  {
    name: 'service-py',
    healthCheckPath: '/py/test',
    port: 80,
  },
];

new EcrStack(app, 'ecr-stack', { services });
new EcsStack(app, 'ecs-stack', { services });
new PipelineStack(app, 'pipeline-stack');
