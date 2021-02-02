import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codePipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';

export interface EcsPipelineProps {
  ecrRepository: ecr.Repository;
  ecsService: ecs.IBaseService;
  awsAccountId: string;
  serviceName: string;
  containerName: string;
  buildSpecFilePath: string;
}

export class EcsPipeline extends cdk.Construct {
  public readonly pipeline: codePipeline.Pipeline;

  constructor(scope: cdk.Construct, id: string, props: EcsPipelineProps) {
    super(scope, id);

    const { ecrRepository, ecsService, awsAccountId, serviceName, buildSpecFilePath, containerName } = props;

    /**
     * GitHub
     */
    const sourceOutput = new codePipeline.Artifact('SourceArtifact');
    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: 'GitHubSource',
      owner: 'sonufrienko',
      repo: 'experiment-aws',
      branch: 'main',
      output: sourceOutput,
      oauthToken: cdk.SecretValue.secretsManager('experiment-aws', {
        jsonField: 'githubToken',
      }),
    });

    /**
     * CodeBuild
     */
    const buildProject = new codebuild.PipelineProject(this, `CodeBuild-${serviceName}`, {
      buildSpec: codebuild.BuildSpec.fromSourceFilename(buildSpecFilePath),
      projectName: `Build-${serviceName}`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        privileged: true,
      },
      timeout: cdk.Duration.minutes(10),
    });
    buildProject.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')
    );

    const buildOutput = new codePipeline.Artifact('BuildArtifact');
    const buildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'Build',
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
      environmentVariables: {
        AWS_ACCOUNT_ID: {
          value: awsAccountId,
        },
        REPOSITORY_URI: {
          value: ecrRepository.repositoryUri,
        },
        COMMIT_URL: {
          value: sourceAction.variables.commitUrl,
        },
        CONTAINER_NAME: {
          value: containerName,
        },
      },
    });

    const deployAction = new codepipelineActions.EcsDeployAction({
      actionName: 'Deploy',
      input: buildOutput,
      service: ecsService,
      deploymentTimeout: cdk.Duration.minutes(60),
    });

    /**
     * CodePipeline
     */
    this.pipeline = new codePipeline.Pipeline(this, `Pipeline-${serviceName}`, {
      pipelineName: `Pipeline-${serviceName}`,
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'Deploy',
          actions: [deployAction],
        },
      ],
    });
  }
}
