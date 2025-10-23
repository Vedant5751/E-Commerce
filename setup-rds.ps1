# AWS RDS Setup Script for E-commerce Project
# This script helps you create a PostgreSQL RDS instance

Write-Host "🚀 Setting up AWS RDS for E-commerce Project" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check if AWS credentials are configured
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS credentials are configured" -ForegroundColor Green
}
catch {
    Write-Host "❌ AWS credentials not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Set variables
$DB_INSTANCE_ID = "ecommerce-postgres"
$DB_NAME = "ecommerce"
$DB_USERNAME = "postgres"
$DB_PASSWORD = "Ecommerce2024!Secure"
$DB_INSTANCE_CLASS = "db.t3.micro"
$DB_ALLOCATED_STORAGE = "20"

Write-Host "📋 RDS Configuration:" -ForegroundColor Cyan
Write-Host "   Instance ID: $DB_INSTANCE_ID" -ForegroundColor White
Write-Host "   Database Name: $DB_NAME" -ForegroundColor White
Write-Host "   Username: $DB_USERNAME" -ForegroundColor White
Write-Host "   Instance Class: $DB_INSTANCE_CLASS" -ForegroundColor White
Write-Host "   Storage: ${DB_ALLOCATED_STORAGE}GB" -ForegroundColor White

# Create RDS instance
Write-Host "🔧 Creating RDS instance..." -ForegroundColor Yellow

$createCommand = @"
aws rds create-db-instance `
    --db-instance-identifier $DB_INSTANCE_ID `
    --db-instance-class $DB_INSTANCE_CLASS `
    --engine postgres `
    --engine-version 15.4 `
    --master-username $DB_USERNAME `
    --master-user-password $DB_PASSWORD `
    --allocated-storage $DB_ALLOCATED_STORAGE `
    --storage-type gp3 `
    --storage-encrypted `
    --backup-retention-period 7 `
    --multi-az `
    --publicly-accessible `
    --vpc-security-group-ids default `
    --db-name $DB_NAME `
    --no-deletion-protection `
    --skip-final-snapshot
"@

try {
    Invoke-Expression $createCommand
    Write-Host "✅ RDS instance creation initiated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Please wait for the instance to be available (this may take 5-10 minutes)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔍 To check the status, run:" -ForegroundColor Cyan
    Write-Host "   aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Once available, update your backend/.env file with:" -ForegroundColor Cyan
    Write-Host "   POSTGRES_HOST=<RDS_ENDPOINT>" -ForegroundColor White
    Write-Host "   POSTGRES_PASSWORD=$DB_PASSWORD" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 To get the endpoint, run:" -ForegroundColor Cyan
    Write-Host "   aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --query 'DBInstances[0].Endpoint.Address' --output text" -ForegroundColor White
}
catch {
    Write-Host "❌ Failed to create RDS instance" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
