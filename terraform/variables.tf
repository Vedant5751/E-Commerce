variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "ecommerce"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "your-domain.com"
}

# DynamoDB Configuration (No additional variables needed - using PAY_PER_REQUEST)

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "E-commerce"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}
