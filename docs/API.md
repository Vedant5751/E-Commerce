# API Documentation

This document provides comprehensive API documentation for the E-commerce backend service.

## Base URL

```
Production: https://api.your-domain.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Error stack trace (development only)"
  }
}
```

## Endpoints

### Authentication

#### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "user",
      "isActive": true,
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User

**POST** `/auth/login`

Authenticate user and return tokens.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User

**GET** `/auth/me`

Get current user profile.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "user",
      "isActive": true,
      "emailVerified": false
    }
  }
}
```

### Products

#### Get Products

**GET** `/products`

Get paginated list of products with optional filtering.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category name
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search in name and description

**Example:**

```
GET /products?page=1&limit=20&category=Electronics&minPrice=100&maxPrice=1000
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "description": "Latest iPhone with advanced camera system",
        "price": 134900.0,
        "categoryId": 1,
        "stock": 50,
        "imageUrl": "https://example.com/iphone.jpg",
        "sku": "IPH15PRO-128",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "category": {
          "id": 1,
          "name": "Electronics"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Get Product by ID

**GET** `/products/:id`

Get detailed information about a specific product.

**Response:**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "Latest iPhone with advanced camera system and A17 Pro chip",
      "price": 134900.0,
      "categoryId": 1,
      "stock": 50,
      "imageUrl": "https://example.com/iphone.jpg",
      "sku": "IPH15PRO-128",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Electronics",
        "description": "Electronic devices and gadgets"
      }
    }
  }
}
```

### Cart

#### Get Cart

**GET** `/cart`

Get user's shopping cart items.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cartItems": [
      {
        "id": 1,
        "userId": 1,
        "productId": 1,
        "quantity": 2,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "product": {
          "id": 1,
          "name": "iPhone 15 Pro",
          "price": 134900.0,
          "imageUrl": "https://example.com/iphone.jpg",
          "stock": 50
        }
      }
    ],
    "total": 269800.0,
    "itemCount": 1
  }
}
```

#### Add to Cart

**POST** `/cart`

Add item to user's cart.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response:**

```json
{
  "success": true,
  "message": "Item added to cart successfully"
}
```

#### Update Cart Item

**PUT** `/cart/:productId`

Update quantity of cart item.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cart item updated successfully"
}
```

#### Remove from Cart

**DELETE** `/cart/:productId`

Remove item from cart.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

#### Clear Cart

**DELETE** `/cart/clear`

Remove all items from cart.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### Orders

#### Get Orders

**GET** `/orders`

Get user's order history.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "userId": 1,
        "totalAmount": 269800.0,
        "status": "delivered",
        "shippingAddress": "123 Main St, City, State 12345",
        "paymentMethod": "card",
        "paymentStatus": "paid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "orderItems": [
          {
            "id": 1,
            "orderId": 1,
            "productId": 1,
            "quantity": 2,
            "price": 134900.0,
            "product": {
              "id": 1,
              "name": "iPhone 15 Pro",
              "imageUrl": "https://example.com/iphone.jpg",
              "sku": "IPH15PRO-128"
            }
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalOrders": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

#### Get Order by ID

**GET** `/orders/:id`

Get detailed information about a specific order.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "userId": 1,
      "totalAmount": 269800.0,
      "status": "delivered",
      "shippingAddress": "123 Main St, City, State 12345",
      "paymentMethod": "card",
      "paymentStatus": "paid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "orderItems": [
        {
          "id": 1,
          "orderId": 1,
          "productId": 1,
          "quantity": 2,
          "price": 134900.0,
          "product": {
            "id": 1,
            "name": "iPhone 15 Pro",
            "imageUrl": "https://example.com/iphone.jpg",
            "sku": "IPH15PRO-128"
          }
        }
      ]
    }
  }
}
```

#### Create Order

**POST** `/orders`

Create a new order from cart items.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "card"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "totalAmount": 269800.0,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Cancel Order

**PUT** `/orders/:id/cancel`

Cancel a pending order.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

### Search

#### Search Products

**GET** `/search`

Search products with advanced filtering.

**Query Parameters:**

- `q` (string, required): Search query
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sortBy` (string): Sort field (name, price, createdAt)
- `sortOrder` (string): Sort order (asc, desc)

**Example:**

```
GET /search?q=iphone&category=Electronics&minPrice=100000&sortBy=price&sortOrder=asc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "description": "Latest iPhone with advanced camera system",
        "price": 134900.0,
        "categoryId": 1,
        "stock": 50,
        "imageUrl": "https://example.com/iphone.jpg",
        "sku": "IPH15PRO-128",
        "isActive": true,
        "category": {
          "id": 1,
          "name": "Electronics"
        }
      }
    ],
    "searchQuery": "iphone",
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalProducts": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "filters": {
      "category": "Electronics",
      "minPrice": 100000,
      "sortBy": "price",
      "sortOrder": "asc"
    }
  }
}
```

#### Get Search Suggestions

**GET** `/search/suggestions`

Get search suggestions based on query.

**Query Parameters:**

- `q` (string, required): Search query
- `limit` (number): Number of suggestions (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "suggestions": ["iPhone 15 Pro", "iPhone 14", "iPhone 13"]
  }
}
```

#### Get Categories

**GET** `/search/categories`

Get all available categories.

**Response:**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "description": "Electronic devices and gadgets",
        "isActive": true
      },
      {
        "id": 2,
        "name": "Clothing",
        "description": "Fashion and apparel",
        "isActive": true
      }
    ]
  }
}
```

### User Management

#### Get User Profile

**GET** `/users/profile`

Get current user profile.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "user",
      "isActive": true,
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update User Profile

**PUT** `/users/profile`

Update user profile information.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "name": "John Smith",
  "phone": "+1234567891"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Smith",
      "phone": "+1234567891",
      "role": "user",
      "isActive": true,
      "emailVerified": false
    }
  }
}
```

#### Change Password

**PUT** `/users/change-password`

Change user password.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Error Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 400  | Bad Request - Invalid input data        |
| 401  | Unauthorized - Invalid or missing token |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Resource already exists      |
| 422  | Unprocessable Entity - Validation error |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Server error    |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 10 requests per 15 minutes
- **Search endpoints**: 200 requests per 15 minutes

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (starts from 1)
- `limit`: Items per page (max 100)

Pagination metadata is included in responses:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

**Filtering:**

- `category`: Filter by category name
- `minPrice`/`maxPrice`: Price range filtering
- `search`: Text search in name and description

**Sorting:**

- `sortBy`: Field to sort by (name, price, createdAt)
- `sortOrder`: Sort direction (asc, desc)

## Webhooks

The API supports webhooks for order events:

**Order Status Changed:**

```json
{
  "event": "order.status.changed",
  "data": {
    "orderId": 1,
    "status": "shipped",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## SDK and Libraries

Official SDKs are available for:

- **JavaScript/Node.js**: `npm install ecommerce-api-sdk`
- **Python**: `pip install ecommerce-api-sdk`
- **PHP**: `composer require ecommerce/api-sdk`

## Support

For API support:

- **Documentation**: https://api.your-domain.com/docs
- **Status Page**: https://status.your-domain.com
- **Support Email**: api-support@your-domain.com
- **GitHub Issues**: https://github.com/your-org/ecommerce-api/issues
