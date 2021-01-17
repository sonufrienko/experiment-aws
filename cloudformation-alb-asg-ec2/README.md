# Getting Started

Create ALB and ASG infrastructure with CloudFormation.

## Resources

- Application Load Balancer
- Auto Scaling Group
- Target Group
- Launch Template
- Security Group
- EC2

## Run

Create new stack

```bash
aws cloudformation create-stack \
--stack-name asg-stack \
--template-body file://asg-template.yml \
--parameters \
ParameterKey=KeyName,ParameterValue=new_id_rsa \
ParameterKey=VpcId,ParameterValue=vpc-6b87210c \
ParameterKey=Subnets,ParameterValue=subnet-0c49936b\\,subnet-dd56b086\\,subnet-e617b7af \
--capabilities CAPABILITY_IAM
```

Update stack

```bash
aws cloudformation deploy \
--stack-name asg-stack \
--template-file asg-template.yml \
--capabilities CAPABILITY_IAM
```


Get events

```bash
aws cloudformation describe-stack-events \
--stack-name asg-stack \
--max-items 20
```
