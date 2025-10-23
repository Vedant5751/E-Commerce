terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
  
  availability_zones = data.aws_availability_zones.available.names
}

# EKS Module
module "eks" {
  source = "./modules/eks"
  
  project_name = var.project_name
  environment  = var.environment
  
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  public_subnets  = module.vpc.public_subnet_ids
  
  node_groups = {
    main = {
      instance_types = ["t3.micro"]  # Free tier eligible
      capacity_type  = "ON_DEMAND"
      min_size       = 1
      max_size       = 2  # Reduced for free tier
      desired_size   = 1  # Start with 1 node
    }
  }
}

# DynamoDB Module
module "dynamodb" {
  source = "./modules/dynamodb"
  
  project_name = var.project_name
  environment  = var.environment
}

# S3 and CloudFront Module
module "s3_cloudfront" {
  source = "./modules/s3-cloudfront"
  
  project_name = var.project_name
  environment  = var.environment
  
  domain_name = var.domain_name
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"
  
  project_name = var.project_name
  environment  = var.environment
  
  repositories = [
    "ecommerce-backend",
    "ecommerce-frontend"
  ]
}

# ElastiCache Module
module "elasticache" {
  source = "./modules/elasticache"
  
  project_name = var.project_name
  environment  = var.environment
  
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
}
