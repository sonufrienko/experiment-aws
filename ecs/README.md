# ECS

Setup ECR, ECS and CodePipeline.

## 1. Build CDK project

```shell
npm run build
npm run cdk synth
```

## 2. Create ECR

```shell
npm run cdk deploy ecr-stack
```

## 3. Build and push to ECR

```shell
cd service-js
follow push commands

cd service-js
follow push commands
```

## 4. Create a services

```shell
npm run cdk deploy ecs-stack
```

## 5. Create CI/CD (todo)

```shell
npm run cdk deploy pipeline-stack
```
