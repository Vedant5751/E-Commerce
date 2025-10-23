output "db_instance_id" {
  description = "RDS instance ID"
  value       = aws_db_instance.ecommerce.id
}

output "db_instance_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.ecommerce.endpoint
}

output "db_instance_port" {
  description = "RDS instance port"
  value       = aws_db_instance.ecommerce.port
}

output "db_instance_arn" {
  description = "RDS instance ARN"
  value       = aws_db_instance.ecommerce.arn
}

output "db_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}
