import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';
import { ServiceStackProps } from './types';

export class EcrStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    for (const service of props.services) {
      const repository = new ecr.Repository(this, `Repository-${service.name}`, {
        repositoryName: service.name,
        imageScanOnPush: true,
      });
    }
  }
}
