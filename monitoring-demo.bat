@echo off
echo === Prometheus and Grafana Monitoring Demo ===
echo.

echo 1. Creating monitoring namespace...
kubectl apply -f monitoring/namespace.yaml
echo.

echo 2. Deploying Prometheus...
kubectl apply -f monitoring/prometheus-deployment.yaml
echo.

echo 3. Deploying Grafana...
kubectl apply -f monitoring/grafana-deployment.yaml
echo.

echo 4. Waiting for deployments to be ready...
kubectl rollout status deployment/prometheus -n monitoring
kubectl rollout status deployment/grafana -n monitoring
echo.

echo 5. Checking deployment status...
kubectl get pods -n monitoring
kubectl get services -n monitoring
echo.

echo 6. Setting up port forwarding...
echo Prometheus will be available at: http://localhost:9090
echo Grafana will be available at: http://localhost:3000 (admin/admin123)
echo.

echo === Monitoring Demo Complete ===
echo Key Features:
echo - Prometheus metrics collection
echo - Grafana visualization dashboards
echo - Kubernetes monitoring
echo - Application metrics
echo - Alerting rules
echo - Real-time monitoring
echo.
echo To access the services:
echo 1. Run: kubectl port-forward service/prometheus-service 9090:9090 -n monitoring
echo 2. Run: kubectl port-forward service/grafana-service 3000:3000 -n monitoring
echo.
pause
