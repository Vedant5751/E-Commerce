output "users_table_name" {
  description = "Name of the users table"
  value       = aws_dynamodb_table.users.name
}

output "categories_table_name" {
  description = "Name of the categories table"
  value       = aws_dynamodb_table.categories.name
}

output "products_table_name" {
  description = "Name of the products table"
  value       = aws_dynamodb_table.products.name
}

output "cart_items_table_name" {
  description = "Name of the cart items table"
  value       = aws_dynamodb_table.cart_items.name
}

output "orders_table_name" {
  description = "Name of the orders table"
  value       = aws_dynamodb_table.orders.name
}

output "order_items_table_name" {
  description = "Name of the order items table"
  value       = aws_dynamodb_table.order_items.name
}
