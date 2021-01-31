#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrStack } from '../lib/ecr-stack';
import { EcsStack } from '../lib/ecs-stack';

const app = new cdk.App();

const serviceJsEcr = new EcrStack(app, 'ecr-service-js', { repositoryName: 'service-js' });
const servicePyEcr = new EcrStack(app, 'ecr-service-py', { repositoryName: 'service-py' });
const ecs = new EcsStack(app, 'ecs', {
  serviceJsRepository: serviceJsEcr.repository,
  servicePyRepository: servicePyEcr.repository,
});
