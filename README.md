# Mystore Portal

## Overview
This Mystore portal is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and provides seamless user authentication, product search, cart management, and order handling. Users can securely sign up, log in, browse products, add items to their cart, and place orders. The backend ensures secure authentication using JWT, payment processing via Razorpay with refund management. The system follows an MVC architecture, ensuring scalability and maintainability. Redux is used for state management on the frontend, and Mongoose handles database interactions efficiently. The application is designed to be fully responsive, delivering a smooth shopping experience across devices.

## Design Details
### High-Level Design Considerations

![High-Level Design](add_image_here)

### Schema Diagram

![Schema Diagram](add_image_here)

## Low-Level Design (LLD)

### UI Components

1. **NavBar Component**
   - Contains home logo, search bar, cart logo, ordered products link, refunded products link, and sign-up/login link.

2. **HomePage Component**
   - Displays products categorized into 4 categories: Beauty, Fragrances, Groceries, Furniture.
   - Users can pick any category and search for a product of interest with optimized searching.

3. **SearchedBar Component**
   - Allows users to search for products.
   - Provides automatic suggestions based on input.
   - Suggests alternatives if the product is unavailable.

4. **ProductPage Component**
   - Allows users to buy products.
   - Users can add products to the cart.
   - Quantity can be increased/decreased based on available stock.

5. **Cart Component**
   - Displays wishlisted products.
   - Users can navigate to the product page to buy selected items.
   - Allows users to remove products from the cart.

6. **OrderedProducts Component**
   - Shows order ID, products, and total price.
   - Provides a "View Details" option for each order.

7. **RefundedProducts Component**
   - Displays product details and refund amounts.
   - Provides an option to request a refund.

8. **SignUp Component**
   - Users can sign up by providing a username, phone number, and password.

9. **Login Component**
   - Users can log in using their username and password.

## Backend Components

### Base API URL
`https://mystoreserver-production-d64e.up.railway.app`

### Routes & Functionality

#### Authentication Routes

- **Signup** (`POST /api/v1/signup`)
  ```json
  {
    "userName": "aartik",
    "phoneNumber": "9193917557",
    "password": "password123",
    "confirmPassword": "password123",
    "accountType": "customer"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully"
  }
  ```

- **Login** (`POST /api/v1/login`)
  ```json
  {
    "phoneNumber": "9193917557",
    "password": "password123",
    "accountType": "customer"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "userName": "aartik",
      "phoneNumber": "9193917557",
      "accountType": "customer"
    },
    "message": "User logged in successfully"
  }
  ```

#### Payment Module

- **Get Razorpay Key** (`GET /api/v1/getkeyid`)
  ```json
  {
    "success": true,
    "key": "rzp_test_abc123"
  }
  ```

- **Capture Payment** (`POST /api/v1/capturepayment`)
  ```json
  {
    "amount": 500,
    "currency": "INR",
    "payment_method": "card"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "order_id": "order_abc123",
    "message": "Payment captured successfully"
  }
  ```

- **Verify Payment** (`POST /api/v1/paymentverification`)
  ```json
  {
    "razorpay_payment_id": "pay_123",
    "razorpay_order_id": "order_abc123",
    "razorpay_signature": "signature_here"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "message": "Payment verified successfully"
  }
  ```

- **Refund Payment** (`POST /api/v1/refundpayment`)
  ```json
  {
    "payment_id": "pay_123",
    "amount": 500
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "message": "Payment refunded successfully"
  }
  ```

#### Cart Routes

- **Add to Cart** (`POST /api/v1/addtocart`)
  ```json
  {
    "product": "product_abc123"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "message": "Added product into cart successfully"
  }
  ```

- **Remove from Cart** (`DELETE /api/v1/removefromcart`)
  ```json
  {
    "_id": "cartItem_123"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully removed product from cart"
  }
  ```

- **Show Cart Items** (`POST /api/v1/showcartitems`)
  **Response:**
  ```json
  {
    "success": true,
    "message": "Fetched cart data successfully",
    "data": [
      {
        "product": "product_abc123",
        "userId": "user_123"
      }
    ]
  }
  ```

#### Order Routes

- **Ordered Products** (`POST /api/v1/orderedproducts`)
  ```json
  {
    "userId": "user_123"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "orderedProducts": [
      {
        "productId": "product_abc123",
        "status": "ordered"
      }
    ]
  }
  ```

- **Refunded Products** (`POST /api/v1/refundedproducts`)
  ```json
  {
    "userId": "user_123"
  }
  ```
  **Response:**
  ```json
  {
    "success": true,
    "refundedProducts": [
      {
        "productId": "product_abc123",
        "status": "refunded"
      }
    ]
  }
  ```

## Assumptions
- User-Related Assumptions
- Product & Seller Assumptions
- Payment & Transaction Assumptions
- Order & Delivery Assumptions
- Cart & Wishlist Assumptions
- Discount & Coupon Assumptions
