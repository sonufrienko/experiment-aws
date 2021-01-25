import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import { ServiceStackProps } from './types';

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    for (const service of props.services) {
      const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        `Service-${service.name}`,
        {
          memoryLimitMiB: 1024,
          cpu: 512,
          taskImageOptions: {
            image: ecs.ContainerImage.fromEcrRepository(
              ecr.Repository.fromRepositoryName(this, `Repoid-${service.name}`, service.name)
            ),
            environment: {
              VAR_B: 'Value for var B',
            },
            enableLogging: true,
            containerPort: service.port,
          },
        }
      );

      loadBalancedFargateService.targetGroup.configureHealthCheck({
        path: service.healthCheckPath,
        interval: cdk.Duration.seconds(60),
      });

      loadBalancedFargateService.targetGroup.setAttribute('slow_start.duration_seconds', '0');
    }
  }
}
