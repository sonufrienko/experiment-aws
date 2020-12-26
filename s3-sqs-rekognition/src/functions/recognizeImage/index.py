import json
import os
import boto3

rekognition = boto3.client("rekognition")

def get_labels(bucket_name, object_key):
  response = rekognition.detect_moderation_labels(
    Image = {
        'S3Object': {
            'Bucket': bucket_name,
            'Name': object_key
        }
    },
    MinConfidence=50
  )

  labels = []
  for label in response["ModerationLabels"]:
      labels.append(label["Name"])

  return labels

def handler(event, context):
  for message in event["Records"]:
    s3_body = json.loads(message["body"])
    for s3_message in s3_body["Records"]:
      region = s3_message["awsRegion"]
      bucket_name = s3_message["s3"]["bucket"]["name"]
      object_key = s3_message["s3"]["object"]["key"]
      labels = get_labels(bucket_name, object_key)
      print(labels)
      # Write to DynamoDB or SNS
      