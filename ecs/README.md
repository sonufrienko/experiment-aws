# ECS

Setup ECR, ECS and CodePipeline.

## 1. Build CDK project

```shell
npm run build
cdk synth
```

## 2. Create ECR

```shell
cdk deploy 'ecr-service-*'
```

## 3. Build and push to ECR

```shell
cd service-js
follow push commands

cd service-py
follow push commands
```

## 4. Create ECS

```shell
cdk deploy ecs
```
