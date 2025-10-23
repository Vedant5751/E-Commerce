# DynamoDB Tables for E-commerce Application

# Users table
resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-${var.environment}-users"
  billing_mode   = "PAY_PER_REQUEST"  # Free tier: 25GB storage, 25 RCU, 25 WCU
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    projection_type = "ALL"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-users"
  })
}

# Categories table
resource "aws_dynamodb_table" "categories" {
  name           = "${var.project_name}-${var.environment}-categories"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-categories"
  })
}

# Products table
resource "aws_dynamodb_table" "products" {
  name           = "${var.project_name}-${var.environment}-products"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "category_id"
    type = "S"
  }

  global_secondary_index {
    name            = "category-index"
    hash_key        = "category_id"
    projection_type = "ALL"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-products"
  })
}

# Cart items table
resource "aws_dynamodb_table" "cart_items" {
  name           = "${var.project_name}-${var.environment}-cart-items"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"
  range_key      = "product_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "product_id"
    type = "S"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-cart-items"
  })
}

# Orders table
resource "aws_dynamodb_table" "orders" {
  name           = "${var.project_name}-${var.environment}-orders"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "user_id"
    type = "S"
  }

  global_secondary_index {
    name            = "user-index"
    hash_key        = "user_id"
    projection_type = "ALL"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-orders"
  })
}

# Order items table
resource "aws_dynamodb_table" "order_items" {
  name           = "${var.project_name}-${var.environment}-order-items"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "order_id"
  range_key      = "product_id"

  attribute {
    name = "order_id"
    type = "S"
  }

  attribute {
    name = "product_id"
    type = "S"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-order-items"
  })
}
