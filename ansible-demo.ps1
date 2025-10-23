# Ansible Demo Script
Write-Host "=== Ansible Configuration Management Demo ===" -ForegroundColor Green

Write-Host "`n1. Inventory Management:" -ForegroundColor Yellow
Write-Host "Shows how Ansible organizes target hosts and connection parameters"

Write-Host "`n2. Playbook Structure:" -ForegroundColor Yellow  
Write-Host "Demonstrates task-based execution and orchestration"

Write-Host "`n3. Role Organization:" -ForegroundColor Yellow
Write-Host "Shows reusable, modular configuration components"

Write-Host "`n4. Configuration Management:" -ForegroundColor Yellow
Write-Host "Centralized server configuration and setup"

Write-Host "`n5. Variable Management:" -ForegroundColor Yellow
Write-Host "Environment-specific configurations and settings"

Write-Host "`n6. Idempotent Operations:" -ForegroundColor Yellow
Write-Host "Safe to run multiple times - no duplicate configurations"

Write-Host "`n7. Deployment Simulation:" -ForegroundColor Yellow
Write-Host "Simulating automated deployment process..."

$tasks = @(
    "Creating namespace: ecommerce",
    "Deploying frontend deployment (3 replicas)", 
    "Deploying backend deployment (2 replicas)",
    "Creating frontend service",
    "Creating backend service",
    "Waiting for deployments to be ready",
    "Verifying deployment status"
)

foreach ($task in $tasks) {
    Write-Host "  ✓ $task" -ForegroundColor Green
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== Ansible Demo Complete ===" -ForegroundColor Green
Write-Host "Key Benefits:"
Write-Host "- Infrastructure as Code"
Write-Host "- Idempotent Operations" 
Write-Host "- Role-based Organization"
Write-Host "- Configuration Management"
Write-Host "- Automated Deployment"