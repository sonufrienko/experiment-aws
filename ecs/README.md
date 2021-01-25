# ECS

Setup ECR, ECS and CodePipeline.

## 1. Build CDK project

```shell
npm run build
npm run cdk synth
```

## 1. Create ECR

```shell
npm run cdk deploy ecr-stack
```

## 2. Build and push to ECR

```shell
cd service-js
follow push commands

cd service-js
follow push commands
```

## Create a services

```shell
npm run cdk deploy ecs-stack
```

## Create CI/CD (todo)

```shell
npm run cdk deploy pipeline-stack
```
