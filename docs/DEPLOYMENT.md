# Deployment Guide

This guide covers deploying the E-commerce application to production using AWS, Kubernetes, and DevOps tools.

## Prerequisites

Before deploying, ensure you have:

- **AWS CLI** configured with appropriate permissions
- **kubectl** installed and configured
- **Terraform** (v1.6.0 or higher)
- **Ansible** (v2.9 or higher)
- **Docker** installed
- **Git** for version control

## Infrastructure Setup

### 1. Deploy AWS Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var-file="terraform.tfvars"

# Apply the infrastructure
terraform apply -var-file="terraform.tfvars"
```

This will create:

- VPC with public/private subnets
- EKS cluster
- RDS PostgreSQL instance
- ElastiCache Redis cluster
- S3 bucket for static files
- CloudFront distribution
- ECR repositories

### 2. Configure Kubernetes

```bash
# Get EKS cluster credentials
aws eks update-kubeconfig --region ap-south-1 --name ecommerce-production-cluster

# Verify cluster access
kubectl get nodes
```

## Application Deployment

### 1. Build and Push Docker Images

```bash
# Configure AWS ECR login
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

# Build and push backend image
docker build -t <account-id>.dkr.ecr.ap-south-1.amazonaws.com/ecommerce-backend:latest -f docker/backend.Dockerfile backend/
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/ecommerce-backend:latest

# Build and push frontend image
docker build -t <account-id>.dkr.ecr.ap-south-1.amazonaws.com/ecommerce-frontend:latest -f docker/frontend.Dockerfile frontend/
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/ecommerce-frontend:latest
```

### 2. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Apply configurations
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml

# Deploy database
kubectl apply -f kubernetes/postgres-statefulset.yaml
kubectl apply -f kubernetes/redis-deployment.yaml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n ecommerce --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n ecommerce --timeout=300s

# Deploy applications
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml

# Deploy ingress and HPA
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/hpa.yaml
```

### 3. Verify Deployment

```bash
# Check all pods
kubectl get pods -n ecommerce

# Check services
kubectl get services -n ecommerce

# Check ingress
kubectl get ingress -n ecommerce

# Check logs
kubectl logs -f deployment/backend -n ecommerce
kubectl logs -f deployment/frontend -n ecommerce
```

## Monitoring Setup

### 1. Deploy Monitoring Stack

```bash
# Deploy Prometheus and Grafana
kubectl apply -f kubernetes/monitoring-namespace.yaml
kubectl apply -f kubernetes/prometheus-deployment.yaml
kubectl apply -f kubernetes/grafana-deployment.yaml
```

### 2. Access Monitoring

- **Prometheus**: http://prometheus.monitoring.svc.cluster.local:9090
- **Grafana**: http://grafana.monitoring.svc.cluster.local:3000
  - Default credentials: admin/admin123

## CI/CD Pipeline

### GitHub Actions

The project includes automated CI/CD pipelines:

1. **Backend CI**: Tests, builds, and pushes backend images
2. **Frontend CI**: Tests, builds, and pushes frontend images
3. **Terraform Plan**: Validates infrastructure changes

### Jenkins Pipeline

For more complex deployments, use Jenkins:

1. **Setup Jenkins** on an EC2 instance
2. **Configure credentials** for AWS and Kubernetes
3. **Create pipeline** using the provided Jenkinsfile
4. **Trigger deployments** on code changes

## Production Configuration

### Environment Variables

Update the following for production:

```yaml
# kubernetes/secrets.yaml
POSTGRES_PASSWORD: <base64-encoded-production-password>
JWT_SECRET: <base64-encoded-production-jwt-secret>
JWT_REFRESH_SECRET: <base64-encoded-production-refresh-secret>
AWS_ACCESS_KEY_ID: <base64-encoded-aws-access-key>
AWS_SECRET_ACCESS_KEY: <base64-encoded-aws-secret-key>
```

### Security Considerations

1. **Use strong passwords** for all services
2. **Enable SSL/TLS** for all communications
3. **Configure proper RBAC** for Kubernetes
4. **Use AWS IAM roles** instead of access keys
5. **Enable VPC Flow Logs** for network monitoring
6. **Configure WAF** for application protection

### Scaling Configuration

```bash
# Scale backend replicas
kubectl scale deployment backend --replicas=5 -n ecommerce

# Scale frontend replicas
kubectl scale deployment frontend --replicas=3 -n ecommerce

# Check HPA status
kubectl get hpa -n ecommerce
```

## Database Management

### Backup

```bash
# Create database backup
kubectl exec -it postgres-0 -n ecommerce -- pg_dump -U postgres ecommerce > backup.sql
```

### Restore

```bash
# Restore from backup
kubectl exec -i postgres-0 -n ecommerce -- psql -U postgres ecommerce < backup.sql
```

## Troubleshooting

### Common Issues

1. **Pod not starting**

   ```bash
   kubectl describe pod <pod-name> -n ecommerce
   kubectl logs <pod-name> -n ecommerce
   ```

2. **Service not accessible**

   ```bash
   kubectl get services -n ecommerce
   kubectl describe service <service-name> -n ecommerce
   ```

3. **Ingress not working**
   ```bash
   kubectl get ingress -n ecommerce
   kubectl describe ingress <ingress-name> -n ecommerce
   ```

### Health Checks

```bash
# Check application health
curl http://your-domain.com/health

# Check API health
curl http://api.your-domain.com/health

# Check database connectivity
kubectl exec -it postgres-0 -n ecommerce -- pg_isready -U postgres
```

## Rollback Procedures

### Application Rollback

```bash
# Rollback backend
kubectl rollout undo deployment/backend -n ecommerce

# Rollback frontend
kubectl rollout undo deployment/frontend -n ecommerce

# Check rollout status
kubectl rollout status deployment/backend -n ecommerce
```

### Infrastructure Rollback

```bash
# Rollback Terraform changes
cd terraform
terraform plan -destroy
terraform destroy -var-file="terraform.tfvars"
```

## Maintenance

### Regular Tasks

1. **Update dependencies** monthly
2. **Rotate secrets** quarterly
3. **Update base images** for security patches
4. **Monitor resource usage** and scale as needed
5. **Review and update** monitoring dashboards

### Log Management

```bash
# View application logs
kubectl logs -f deployment/backend -n ecommerce
kubectl logs -f deployment/frontend -n ecommerce

# Archive old logs
kubectl logs --since=24h deployment/backend -n ecommerce > logs/backend-$(date +%Y%m%d).log
```

## Support

For deployment issues:

1. Check the troubleshooting section
2. Review Kubernetes events: `kubectl get events -n ecommerce`
3. Check monitoring dashboards
4. Review application logs
5. Consult the architecture documentation
