# 🚀 **Demo Commands Quick Reference**

## **Application Demo Commands**

### **Start Frontend**

```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

### **Start Backend**

```bash
cd backend
npm run dev
# API: http://localhost:5000
# Swagger: http://localhost:5000/api-docs
```

### **Test API Endpoints**

```bash
# Test cart functionality
curl -X POST http://localhost:5000/api/v1/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1}'

# Get cart items
curl -X GET http://localhost:5000/api/v1/cart

# Test products
curl -X GET http://localhost:5000/api/v1/products
```

---

## **Docker Commands**

### **Build Images**

```bash
# Build frontend
docker build -t ecommerce-frontend ./frontend

# Build backend
docker build -t ecommerce-backend ./backend

# Build all with compose
docker-compose build
```

### **Run Containers**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Docker Management**

```bash
# List images
docker images

# List containers
docker ps -a

# Remove containers
docker-compose down -v
```

---

## **Kubernetes Commands**

### **Deploy to EKS**

```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods
kubectl get services
kubectl get ingress

# View logs
kubectl logs -f deployment/frontend-deployment
kubectl logs -f deployment/backend-deployment
```

### **Service Management**

```bash
# Port forward for local access
kubectl port-forward svc/frontend-service 3000:80
kubectl port-forward svc/backend-service 5000:80

# Scale deployments
kubectl scale deployment frontend-deployment --replicas=3
kubectl scale deployment backend-deployment --replicas=2
```

### **Rolling Updates**

```bash
# Update deployment
kubectl set image deployment/frontend-deployment frontend=ecommerce-frontend:v2

# Check rollout status
kubectl rollout status deployment/frontend-deployment

# Rollback if needed
kubectl rollout undo deployment/frontend-deployment
```

---

## **Terraform Commands**

### **Initialize and Plan**

```bash
cd terraform
terraform init
terraform plan
```

### **Apply Infrastructure**

```bash
# Apply with variables
terraform apply -var-file="terraform.tfvars"

# Apply specific module
terraform apply -target=module.eks

# Show current state
terraform show
```

### **Destroy Infrastructure**

```bash
# Destroy all resources
terraform destroy

# Destroy specific resources
terraform destroy -target=module.dynamodb
```

---

## **Ansible Commands**

### **Run Playbooks**

```bash
# Run deployment playbook
ansible-playbook -i inventory/hosts playbooks/deploy.yml

# Run with specific tags
ansible-playbook -i inventory/hosts playbooks/deploy.yml --tags "kubernetes"

# Check syntax
ansible-playbook --syntax-check playbooks/deploy.yml
```

### **Inventory Management**

```bash
# List inventory
ansible-inventory -i inventory/hosts --list

# Test connectivity
ansible all -i inventory/hosts -m ping
```

---

## **Monitoring Commands**

### **Prometheus**

```bash
# Deploy Prometheus
kubectl apply -f monitoring/prometheus/

# Port forward
kubectl port-forward svc/prometheus 9090:80
# Access: http://localhost:9090
```

### **Grafana**

```bash
# Deploy Grafana
kubectl apply -f monitoring/grafana/

# Port forward
kubectl port-forward svc/grafana 3000:80
# Access: http://localhost:3000
```

### **View Metrics**

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Query metrics
curl "http://localhost:9090/api/v1/query?query=up"
```

---

## **CI/CD Commands**

### **GitHub Actions**

```bash
# Trigger workflow
gh workflow run ci-cd.yml

# View workflow runs
gh run list

# View logs
gh run view <run-id>
```

### **Jenkins**

```bash
# Start Jenkins
docker run -p 8080:8080 jenkins/jenkins:lts

# Access Jenkins
# http://localhost:8080
```

---

## **Security Commands**

### **Trivy Scanning**

```bash
# Scan container images
trivy image ecommerce-frontend:latest
trivy image ecommerce-backend:latest

# Scan filesystem
trivy fs .

# Generate report
trivy image --format json --output report.json ecommerce-frontend:latest
```

### **Code Quality**

```bash
# Run linting
npm run lint
npm run lint:fix

# Run tests
npm run test
npm run test:coverage

# Type checking
npm run type-check
```

---

## **Troubleshooting Commands**

### **Kubernetes Debugging**

```bash
# Describe resources
kubectl describe pod <pod-name>
kubectl describe service <service-name>

# Get events
kubectl get events --sort-by=.metadata.creationTimestamp

# Debug pods
kubectl exec -it <pod-name> -- /bin/bash
```

### **Docker Debugging**

```bash
# Inspect containers
docker inspect <container-id>

# View container logs
docker logs <container-id>

# Debug container
docker exec -it <container-id> /bin/bash
```

### **Application Debugging**

```bash
# Check application health
curl http://localhost:5000/health

# View application logs
kubectl logs -f deployment/backend-deployment

# Check database connectivity
kubectl exec -it <pod-name> -- curl http://localhost:5000/api/v1/products
```

---

## **Performance Testing**

### **Load Testing**

```bash
# Install k6
npm install -g k6

# Run load test
k6 run load-test.js

# Run stress test
k6 run stress-test.js
```

### **Resource Monitoring**

```bash
# Monitor resource usage
kubectl top pods
kubectl top nodes

# Check resource limits
kubectl describe node
```

---

## **Backup and Recovery**

### **Database Backup**

```bash
# Backup DynamoDB tables
aws dynamodb create-backup --table-name users --backup-name users-backup-$(date +%Y%m%d)

# List backups
aws dynamodb list-backups
```

### **Configuration Backup**

```bash
# Backup Kubernetes configs
kubectl get all -o yaml > k8s-backup.yaml

# Backup Terraform state
terraform state pull > terraform-state-backup.json
```

---

## **Quick Demo Scripts**

### **Full Demo Script**

```bash
#!/bin/bash
echo "🚀 Starting DevOps Demo..."

# Start applications
echo "📱 Starting Frontend..."
cd frontend && npm run dev &
cd backend && npm run dev &

# Wait for services
sleep 10

# Test API
echo "🧪 Testing API..."
curl -X GET http://localhost:5000/health

# Build Docker images
echo "🐳 Building Docker images..."
docker build -t ecommerce-frontend ./frontend
docker build -t ecommerce-backend ./backend

# Deploy to Kubernetes
echo "☸️ Deploying to Kubernetes..."
kubectl apply -f kubernetes/

# Check deployment
kubectl get pods

echo "✅ Demo setup complete!"
```

### **Cleanup Script**

```bash
#!/bin/bash
echo "🧹 Cleaning up demo environment..."

# Stop Docker containers
docker-compose down -v

# Remove Kubernetes resources
kubectl delete -f kubernetes/

# Clean Docker images
docker rmi ecommerce-frontend ecommerce-backend

echo "✅ Cleanup complete!"
```

---

## **Demo Timing**

### **Quick Demo (15 minutes)**

1. Start applications (2 min)
2. Show frontend/backend (3 min)
3. Docker build/run (3 min)
4. Kubernetes deploy (3 min)
5. Monitoring dashboards (2 min)
6. Q&A (2 min)

### **Full Demo (45 minutes)**

1. Application demo (8 min)
2. Docker containerization (5 min)
3. Kubernetes orchestration (8 min)
4. Terraform infrastructure (5 min)
5. Ansible configuration (4 min)
6. CI/CD pipelines (5 min)
7. Monitoring & observability (8 min)
8. Q&A (2 min)

### **Extended Demo (60 minutes)**

- Include all above sections
- Add security scanning demo
- Show deployment scenarios
- Demonstrate troubleshooting
- Include performance testing
