# AWS Free Tier Optimized Configuration
# This configuration uses only free tier eligible services

# AWS Configuration
aws_region = "ap-south-1"

# Project Configuration
project_name = "ecommerce"
environment  = "development"  # Changed to development for free tier

# DynamoDB Configuration (Free Tier)
# DynamoDB free tier: 25GB storage, 25 RCU, 25 WCU per month
# No additional configuration needed - using PAY_PER_REQUEST

# Domain Configuration (optional)
domain_name = "your-domain.com"

# Free Tier Limits:
# - RDS: 750 hours of db.t3.micro per month
# - EKS: No free tier, but we'll use minimal resources
# - ElastiCache: 750 hours of cache.t3.micro per month
# - S3: 5GB storage, 20,000 GET requests, 2,000 PUT requests
# - CloudFront: 1TB data transfer out, 10,000,000 HTTP requests
# - ECR: 500MB storage per month
