import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';

export interface EcrStackProps extends cdk.StackProps {
  repositoryName: string;
}

export class EcrStack extends cdk.Stack {
  public readonly repository: ecr.Repository;

  constructor(scope: cdk.Construct, id: string, props: EcrStackProps) {
    super(scope, id, props);

    const { repositoryName } = props;

    this.repository = new ecr.Repository(this, `ECR-${repositoryName}`, {
      repositoryName,
      imageScanOnPush: true,
    });
  }
}
