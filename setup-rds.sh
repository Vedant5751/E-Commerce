#!/bin/bash

# AWS RDS Setup Script for E-commerce Project
# This script helps you create a PostgreSQL RDS instance

echo "🚀 Setting up AWS RDS for E-commerce Project"
echo "=============================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   Download from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# Set variables
DB_INSTANCE_ID="ecommerce-postgres"
DB_NAME="ecommerce"
DB_USERNAME="postgres"
DB_PASSWORD="Ecommerce2024!Secure"
DB_INSTANCE_CLASS="db.t3.micro"
DB_ALLOCATED_STORAGE="20"

echo "📋 RDS Configuration:"
echo "   Instance ID: $DB_INSTANCE_ID"
echo "   Database Name: $DB_NAME"
echo "   Username: $DB_USERNAME"
echo "   Instance Class: $DB_INSTANCE_CLASS"
echo "   Storage: ${DB_ALLOCATED_STORAGE}GB"

# Create RDS instance
echo "🔧 Creating RDS instance..."

aws rds create-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --db-instance-class $DB_INSTANCE_CLASS \
    --engine postgres \
    --engine-version 15.4 \
    --master-username $DB_USERNAME \
    --master-user-password $DB_PASSWORD \
    --allocated-storage $DB_ALLOCATED_STORAGE \
    --storage-type gp3 \
    --storage-encrypted \
    --backup-retention-period 7 \
    --multi-az \
    --publicly-accessible \
    --vpc-security-group-ids default \
    --db-name $DB_NAME \
    --no-deletion-protection \
    --skip-final-snapshot

if [ $? -eq 0 ]; then
    echo "✅ RDS instance creation initiated successfully!"
    echo ""
    echo "⏳ Please wait for the instance to be available (this may take 5-10 minutes)"
    echo ""
    echo "🔍 To check the status, run:"
    echo "   aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID"
    echo ""
    echo "📝 Once available, update your backend/.env file with:"
    echo "   POSTGRES_HOST=<RDS_ENDPOINT>"
    echo "   POSTGRES_PASSWORD=$DB_PASSWORD"
    echo ""
    echo "🌐 To get the endpoint, run:"
    echo "   aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --query 'DBInstances[0].Endpoint.Address' --output text"
else
    echo "❌ Failed to create RDS instance"
    exit 1
fi
