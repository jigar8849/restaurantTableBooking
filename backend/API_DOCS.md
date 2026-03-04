# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer" // Optional, default: customer. Enum: ['customer', 'employee', 'admin']
  }
  ```
- **Response**: User object + JWT Token

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object + JWT Token

### Get Profile
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

---

## Tables

### Get All Tables
- **URL**: `/tables`
- **Method**: `GET`

### Create Table (Admin Only)
- **URL**: `/tables`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "tableNumber": 1,
    "capacity": 4,
    "location": "Window"
  }
  ```

---

## Bookings

### Create Booking
- **URL**: `/bookings`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "tableId": "64f...",
    "date": "2024-01-01",
    "timeSlot": "19:00 - 20:00",
    "partySize": 4
  }
  ```

### Get My Bookings
- **URL**: `/bookings/mybookings`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

### Get All Bookings (Employee/Admin)
- **URL**: `/bookings`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

### Update Booking Status (Employee/Admin)
- **URL**: `/bookings/:id/status`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "status": "Confirmed" // Enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled']
  }
  ```

---

## Payments (Razorpay)

### Create Order
- **URL**: `/payments/create-order`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "amount": 500,
    "bookingId": "64f..."
  }
  ```

### Verify Payment
- **URL**: `/payments/verify`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "razorpayOrderId": "order_...",
    "razorpayPaymentId": "pay_...",
    "razorpaySignature": "...",
    "bookingId": "64f...",
    "amount": 500
  }
  ```

---

## Admin

### Get Dashboard Stats
- **URL**: `/admin/stats`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
