# DevOps E-commerce Project

A full-stack Amazon-like e-commerce website built with modern DevOps practices and cloud technologies.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Redis
- **Infrastructure**: AWS (EKS, RDS, S3, CloudFront)
- **DevOps Tools**: Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions, Prometheus, Grafana

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- AWS CLI configured
- kubectl
- Terraform
- Ansible

### Local Development

1. Clone the repository
2. Start the development environment:
   ```bash
   docker-compose up -d
   ```
3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Grafana: http://localhost:3001

## 📁 Project Structure

```
DevOps_Project/
├── frontend/                 # React + Tailwind + TypeScript
├── backend/                  # Node.js/Express + TypeScript
├── terraform/                # AWS Infrastructure as Code
├── kubernetes/               # K8s manifests and Helm charts
├── ansible/                  # Configuration management playbooks
├── docker/                   # Dockerfiles for services
├── monitoring/               # Prometheus + Grafana configs
├── .github/workflows/        # GitHub Actions CI/CD
├── jenkins/                  # Jenkinsfile for deployment
└── docker-compose.yml        # Local development setup
```

## 🛠️ DevOps Tools Integration

- **Docker**: Containerization of all services
- **Kubernetes**: Container orchestration on AWS EKS
- **Terraform**: Infrastructure as Code for AWS resources
- **Ansible**: Configuration management and automation
- **Jenkins**: CI/CD pipeline automation
- **GitHub Actions**: Modern CI/CD workflows
- **Prometheus**: Metrics collection and monitoring
- **Grafana**: Visualization and alerting dashboards

## 📚 Documentation

- [Setup Guide](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)

## 🔧 Environment Variables

See `.env.example` files in frontend and backend directories for required environment variables.

## 📄 License

MIT License
