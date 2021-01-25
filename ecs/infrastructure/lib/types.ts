import { StackProps } from '@aws-cdk/core';

export interface ServiceAttributes {
  name: string;
  healthCheckPath: string;
  port: number;
}

export interface ServiceStackProps extends StackProps {
  services: ServiceAttributes[];
}
