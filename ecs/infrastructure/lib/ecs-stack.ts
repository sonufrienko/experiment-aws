import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export interface EcsServiceStackProps extends cdk.StackProps {
  serviceJsRepository: ecr.Repository;
  servicePyRepository: ecr.Repository;
}

export class EcsStack extends cdk.Stack {
  private readonly cluster: ecs.Cluster;
  private readonly alb: elbv2.ApplicationLoadBalancer;

  constructor(scope: cdk.Construct, id: string, props: EcsServiceStackProps) {
    super(scope, id);

    const { serviceJsRepository, servicePyRepository } = props;

    this.cluster = this.createCluster('devops-ecs');
    this.alb = this.createLoadBalancer('devops-ecs-alb', this.cluster.vpc);
    const listener = this.alb.addListener('Listener', { port: 80, open: true });

    const serviceJs = this.createService(this.cluster, serviceJsRepository, listener, 'ServiceJs', 4000, '/test', {
      VAR_B: 'Value for var B',
    });

    const servicePy = this.createService(this.cluster, servicePyRepository, listener, 'ServicePy', 80, '/py/test', {
      VAR_PY: 'Value for var PY',
    });
  }

  createCluster(name: string) {
    const cluster = new ecs.Cluster(this, `ECS-Cluster`, {
      clusterName: name,
      containerInsights: true,
    });

    return cluster;
  }

  createLoadBalancer(name: string, vpc: ec2.IVpc) {
    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'ECS-Alb', {
      loadBalancerName: name,
      internetFacing: true,
      vpc,
    });

    return loadBalancer;
  }

  createService(
    cluster: ecs.Cluster,
    repository: ecr.Repository,
    listener: elbv2.ApplicationListener,
    serviceName: string,
    containerPort: number,
    healthCheckPath: string,
    environment?: {
      [key: string]: string;
    }
  ) {
    const containerName = `Container${serviceName}`;

    /**
     * Task
     */
    const taskDefinition = new ecs.FargateTaskDefinition(this, `Task${serviceName}`, {
      memoryLimitMiB: 1024,
      cpu: 512,
    });

    const container = taskDefinition.addContainer(containerName, {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
      environment,
    });

    container.addPortMappings({ containerPort });

    /**
     * Service
     */
    const service = new ecs.FargateService(this, `Service${serviceName}`, {
      cluster,
      taskDefinition,
      desiredCount: 1,
      serviceName,
    });

    /**
     * Auto-Scaling
     */
    const scaling = service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });

    scaling.scaleOnCpuUtilization(`CpuScaling${serviceName}`, {
      targetUtilizationPercent: 10,
    });

    /**
     * Add to LoadBalancer
     */
    service.registerLoadBalancerTargets({
      containerName,
      containerPort,
      newTargetGroupId: `TargetGroup${serviceName}`,
      listener: ecs.ListenerConfig.applicationListener(listener, {
        protocol: elbv2.ApplicationProtocol.HTTP,
        targetGroupName: `tg-${serviceName}`,
        healthCheck: {
          path: healthCheckPath,
          interval: cdk.Duration.seconds(60),
        },
      }),
    });

    return service;
  }
}
