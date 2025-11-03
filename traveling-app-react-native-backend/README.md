# Travel App Backend - Quick Start Guide

## 📋 Tổng quan

Backend API cho ứng dụng travelling app MVP với đầy đủ tính năng:

### ✨ Features đã implement:
- ✅ **Tours Management** - Quản lý tour du lịch
- ✅ **Hotels Management** - Quản lý khách sạn
- ✅ **Bookings Management** - Quản lý đặt tour
- ✅ **Reviews System** - Hệ thống đánh giá tour/hotel
- ✅ **Services Management** - Quản lý dịch vụ bổ sung
- ✅ **Authentication & Authorization** - JWT authentication
- ✅ **Role-based Access Control** - User & Admin roles
- ✅ **Pagination & Search** - Tìm kiếm và phân trang

## 🚀 Cấu trúc API mới

```
src/
├── models/
│   ├── tour.model.js          ✨ Tour model
│   ├── hotel.model.js         ✨ Hotel model
│   ├── booking.model.js       ✨ Booking model
│   ├── review.model.js        ✨ Review model
│   └── service.model.js       ✨ Service model
├── controllers/
│   ├── tour.controller.js     ✨ Tours endpoints
│   ├── hotel.controller.js    ✨ Hotels endpoints
│   ├── booking.controller.js  ✨ Bookings endpoints
│   ├── review.controller.js   ✨ Reviews endpoints
│   └── service.controller.js  ✨ Services endpoints
├── services/
│   ├── tour.service.js        ✨ Tour business logic
│   ├── hotel.service.js       ✨ Hotel business logic
│   ├── booking.service.js     ✨ Booking business logic
│   ├── review.service.js      ✨ Review business logic
│   └── service.service.js     ✨ Service business logic
├── validations/
│   ├── tour.validation.js     ✨ Tour validation schemas
│   ├── hotel.validation.js    ✨ Hotel validation schemas
│   ├── booking.validation.js  ✨ Booking validation schemas
│   ├── review.validation.js   ✨ Review validation schemas
│   └── service.validation.js  ✨ Service validation schemas
└── routes/v1/
    ├── tour.route.js          ✨ /v1/tours
    ├── hotel.route.js         ✨ /v1/hotels
    ├── booking.route.js       ✨ /v1/bookings
    ├── review.route.js        ✨ /v1/reviews
    └── service.route.js       ✨ /v1/services
```

## 🔧 Setup & Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Đảm bảo file `.env` có MongoDB connection:
```env
MONGODB_URL=mongodb://localhost:27017/travel-app
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
```

3. **Start server:**
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Tours (`/v1/tours`)
- `GET /tours` - Lấy danh sách tours
- `GET /tours/search` - Tìm kiếm tours (filter by destination, price, duration)
- `GET /tours/:tourId` - Chi tiết tour
- `POST /tours` - Tạo tour mới (Admin)
- `PATCH /tours/:tourId` - Cập nhật tour (Admin)
- `DELETE /tours/:tourId` - Xóa tour (Admin)

### Hotels (`/v1/hotels`)
- `GET /hotels` - Lấy danh sách hotels
- `GET /hotels/search` - Tìm kiếm hotels (filter by city, price, rating)
- `GET /hotels/:hotelId` - Chi tiết hotel
- `POST /hotels` - Tạo hotel mới (Admin)
- `PATCH /hotels/:hotelId` - Cập nhật hotel (Admin)
- `DELETE /hotels/:hotelId` - Xóa hotel (Admin)

### Bookings (`/v1/bookings`)
- `GET /bookings` - Lấy tất cả bookings (Admin)
- `GET /bookings/my-bookings` - Bookings của user hiện tại
- `GET /bookings/:bookingId` - Chi tiết booking
- `POST /bookings` - Tạo booking mới
- `PATCH /bookings/:bookingId` - Cập nhật booking (Admin)
- `PATCH /bookings/:bookingId/cancel` - Hủy booking
- `PATCH /bookings/:bookingId/confirm` - Xác nhận booking (Admin)
- `DELETE /bookings/:bookingId` - Xóa booking (Admin)

### Reviews (`/v1/reviews`)
- `GET /reviews` - Lấy tất cả reviews
- `GET /reviews/my-reviews` - Reviews của user hiện tại
- `GET /reviews/:targetType/:targetId` - Reviews của một tour/hotel
- `GET /reviews/:reviewId` - Chi tiết review
- `POST /reviews` - Tạo review mới
- `PATCH /reviews/:reviewId` - Cập nhật review của mình
- `DELETE /reviews/:reviewId` - Xóa review của mình

### Services (`/v1/services`)
- `GET /services` - Lấy danh sách services
- `GET /services/search` - Tìm kiếm services (filter by type, price)
- `GET /services/:serviceId` - Chi tiết service
- `POST /services` - Tạo service mới (Admin)
- `PATCH /services/:serviceId` - Cập nhật service (Admin)
- `DELETE /services/:serviceId` - Xóa service (Admin)

## 🔐 Authentication

### 1. Register User
```bash
POST /v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST /v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": { ... },
  "tokens": {
    "access": {
      "token": "eyJhbGc...",
      "expires": "2025-10-19T10:00:00.000Z"
    },
    "refresh": {
      "token": "eyJhbGc...",
      "expires": "2025-11-18T10:00:00.000Z"
    }
  }
}
```

### 3. Use Token
```bash
GET /v1/bookings/my-bookings
Authorization: Bearer eyJhbGc...
```

## 🧪 Testing API

### Example: Create a Tour (Admin)
```bash
POST /v1/tours
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Tour Hà Nội - Hạ Long",
  "description": "Tour 2 ngày 1 đêm khám phá vịnh Hạ Long",
  "destination": "Quảng Ninh",
  "duration": "2 ngày 1 đêm",
  "pricePerPerson": 2500000,
  "itinerary": [
    {
      "day": 1,
      "activities": ["Khởi hành từ Hà Nội lúc 8h", "Tham quan vịnh Hạ Long", "Check-in khách sạn"]
    },
    {
      "day": 2,
      "activities": ["Tham quan hang Sửng Sốt", "Kayaking", "Về Hà Nội"]
    }
  ],
  "images": ["https://example.com/tour1.jpg"],
  "includedServices": ["Xe du lịch", "Khách sạn 3 sao", "Bữa ăn"]
}
```

### Example: Search Tours
```bash
GET /v1/tours/search?destination=Hạ Long&minPrice=2000000&maxPrice=3000000&limit=10&page=1
```

### Example: Create a Booking (User)
```bash
POST /v1/bookings
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "tourId": "670abc123def456789",
  "numberOfPeople": 4,
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "totalPrice": 10000000
}
```

### Example: Create a Review (User)
```bash
POST /v1/reviews
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "targetType": "tour",
  "targetId": "670abc123def456789",
  "rating": 5,
  "comment": "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình!"
}
```

## 👥 Roles & Permissions

### User Role (Default)
- ✅ View tours, hotels, services, reviews
- ✅ Create & manage own bookings
- ✅ Create, update, delete own reviews
- ✅ Cancel own bookings

### Admin Role
- ✅ All User permissions
- ✅ Manage tours (CRUD)
- ✅ Manage hotels (CRUD)
- ✅ Manage services (CRUD)
- ✅ View & manage all bookings
- ✅ Confirm bookings

## 📊 Models Schema

### Tour
```javascript
{
  name: String (required),
  description: String,
  destination: String (required),
  duration: String,
  pricePerPerson: Number (required),
  itinerary: [{ day: Number, activities: [String] }],
  images: [String],
  includedServices: [String],
  hotels: [ObjectId ref Hotel]
}
```

### Hotel
```javascript
{
  name: String (required),
  address: String (required),
  city: String (required),
  description: String,
  rating: Number (0-5),
  pricePerNight: Number (required),
  amenities: [String],
  images: [String],
  contactInfo: { phone: String, email: String }
}
```

### Booking
```javascript
{
  userId: ObjectId (required),
  tourId: ObjectId (required),
  hotelId: ObjectId,
  services: [ObjectId],
  numberOfPeople: Number (required),
  startDate: Date (required),
  endDate: Date (required),
  totalPrice: Number (required),
  status: enum ['pending', 'confirmed', 'cancelled', 'completed'],
  paymentStatus: enum ['unpaid', 'paid', 'refunded']
}
```

### Review
```javascript
{
  userId: ObjectId (required),
  targetType: enum ['tour', 'hotel'] (required),
  targetId: ObjectId (required),
  rating: Number (1-5, required),
  comment: String
}
```

### Service
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  type: enum ['transport', 'food', 'guide', 'ticket', 'other']
}
```

## 🔍 Advanced Features

### Pagination
Tất cả list endpoints hỗ trợ pagination:
```bash
GET /v1/tours?page=2&limit=20
```

Response:
```json
{
  "results": [...],
  "page": 2,
  "limit": 20,
  "totalPages": 5,
  "totalResults": 100
}
```

### Sorting
```bash
GET /v1/tours?sortBy=pricePerPerson:asc
GET /v1/hotels?sortBy=rating:desc,pricePerNight:asc
```

### Search & Filter
```bash
# Tours
GET /v1/tours/search?destination=Hạ Long&minPrice=2000000&maxPrice=5000000

# Hotels
GET /v1/hotels/search?city=Hà Nội&minRating=4&maxPrice=1000000

# Services
GET /v1/services/search?type=transport&minPrice=100000
```

## 📝 Next Steps

1. **Seed Database:** Tạo sample data cho tours, hotels, services
2. **Testing:** Viết integration tests cho các endpoints mới
3. **Documentation:** Cập nhật Swagger/OpenAPI docs
4. **Features:** Implement payment gateway, notifications, etc.

## 📖 Documentation

Xem chi tiết tại: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🐛 Troubleshooting

### Issue: Cannot create admin user
Solution: Manually update user role trong MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Issue: Permission denied
Solution: Kiểm tra role permissions trong `src/config/roles.js`

## 💡 Tips

1. Sử dụng Postman/Insomnia để test API
2. Tạo admin user đầu tiên để manage tours/hotels
3. Tất cả prices tính bằng VND
4. Dates phải ở format ISO 8601

Happy coding! 🚀


# Travel App API Documentation

## Overview
API endpoints cho ứng dụng travelling app MVP với đầy đủ chức năng quản lý tours, hotels, bookings, reviews và services.

## Base URL
```
http://localhost:3000/v1
```

## Authentication
Hầu hết các endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Tours API

#### GET /tours
Lấy danh sách tours
- **Query Parameters:**
  - `name` (string): Tên tour
  - `destination` (string): Điểm đến
  - `sortBy` (string): Sắp xếp theo field (ví dụ: `pricePerPerson:asc`)
  - `limit` (number): Số kết quả mỗi trang (default: 10)
  - `page` (number): Trang hiện tại (default: 1)
- **Auth Required:** No
- **Response:** Paginated list of tours

#### GET /tours/search
Tìm kiếm tours với bộ lọc nâng cao
- **Query Parameters:**
  - `destination` (string): Điểm đến
  - `minPrice` (number): Giá tối thiểu
  - `maxPrice` (number): Giá tối đa
  - `duration` (string): Thời lượng tour
  - `sortBy`, `limit`, `page`
- **Auth Required:** No

#### GET /tours/:tourId
Lấy chi tiết một tour
- **Auth Required:** No
- **Response:** Tour details with populated hotels

#### POST /tours
Tạo tour mới
- **Auth Required:** Yes (admin only - `manageTours`)
- **Body:**
  ```json
  {
    "name": "Tour Hà Nội - Hạ Long",
    "description": "Tour 2 ngày 1 đêm",
    "destination": "Quảng Ninh",
    "duration": "2 ngày 1 đêm",
    "pricePerPerson": 2500000,
    "itinerary": [
      {
        "day": 1,
        "activities": ["Khởi hành từ Hà Nội", "Tham quan vịnh Hạ Long"]
      },
      {
        "day": 2,
        "activities": ["Tham quan hang Sửng Sốt", "Về Hà Nội"]
      }
    ],
    "images": ["url1.jpg", "url2.jpg"],
    "includedServices": ["Xe du lịch", "Khách sạn 3*", "Bữa ăn"],
    "hotels": ["hotel_id_1", "hotel_id_2"]
  }
  ```

#### PATCH /tours/:tourId
Cập nhật tour
- **Auth Required:** Yes (admin only - `manageTours`)
- **Body:** Các trường cần cập nhật

#### DELETE /tours/:tourId
Xóa tour
- **Auth Required:** Yes (admin only - `manageTours`)

---

### 2. Hotels API

#### GET /hotels
Lấy danh sách khách sạn
- **Query Parameters:**
  - `name` (string): Tên khách sạn
  - `city` (string): Thành phố
  - `sortBy`, `limit`, `page`
- **Auth Required:** No

#### GET /hotels/search
Tìm kiếm khách sạn với bộ lọc
- **Query Parameters:**
  - `city` (string): Thành phố
  - `minPrice` (number): Giá tối thiểu/đêm
  - `maxPrice` (number): Giá tối đa/đêm
  - `minRating` (number): Rating tối thiểu (0-5)
  - `sortBy`, `limit`, `page`
- **Auth Required:** No

#### GET /hotels/:hotelId
Lấy chi tiết khách sạn
- **Auth Required:** No

#### POST /hotels
Tạo khách sạn mới
- **Auth Required:** Yes (admin only - `manageHotels`)
- **Body:**
  ```json
  {
    "name": "Khách sạn Mường Thanh",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "description": "Khách sạn 4 sao",
    "rating": 4.5,
    "pricePerNight": 800000,
    "amenities": ["WiFi", "Hồ bơi", "Gym", "Spa"],
    "images": ["url1.jpg", "url2.jpg"],
    "contactInfo": {
      "phone": "0123456789",
      "email": "info@hotel.com"
    }
  }
  ```

#### PATCH /hotels/:hotelId
Cập nhật khách sạn
- **Auth Required:** Yes (admin only - `manageHotels`)

#### DELETE /hotels/:hotelId
Xóa khách sạn
- **Auth Required:** Yes (admin only - `manageHotels`)

---

### 3. Bookings API

#### GET /bookings
Lấy tất cả bookings (admin only)
- **Query Parameters:**
  - `userId` (ObjectId): Filter by user
  - `tourId` (ObjectId): Filter by tour
  - `status` (string): `pending`, `confirmed`, `cancelled`, `completed`
  - `paymentStatus` (string): `unpaid`, `paid`, `refunded`
  - `sortBy`, `limit`, `page`
- **Auth Required:** Yes (admin only - `manageBookings`)

#### GET /bookings/my-bookings
Lấy bookings của user hiện tại
- **Auth Required:** Yes
- **Query Parameters:** `sortBy`, `limit`, `page`

#### GET /bookings/:bookingId
Lấy chi tiết một booking
- **Auth Required:** Yes
- **Response:** Booking with populated user, tour, hotel, services

#### POST /bookings
Tạo booking mới
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "tourId": "tour_id",
    "hotelId": "hotel_id",
    "services": ["service_id_1", "service_id_2"],
    "numberOfPeople": 4,
    "startDate": "2025-12-01",
    "endDate": "2025-12-03",
    "totalPrice": 12000000,
    "status": "pending",
    "paymentStatus": "unpaid"
  }
  ```

#### PATCH /bookings/:bookingId
Cập nhật booking (admin only)
- **Auth Required:** Yes (admin only - `manageBookings`)

#### PATCH /bookings/:bookingId/cancel
User hủy booking của mình
- **Auth Required:** Yes
- **Note:** Chỉ hủy được booking ở trạng thái `pending` hoặc `confirmed`

#### PATCH /bookings/:bookingId/confirm
Admin xác nhận booking
- **Auth Required:** Yes (admin only - `manageBookings`)

#### DELETE /bookings/:bookingId
Xóa booking (admin only)
- **Auth Required:** Yes (admin only - `manageBookings`)

---

### 4. Reviews API

#### GET /reviews
Lấy tất cả reviews
- **Query Parameters:**
  - `userId` (ObjectId): Filter by user
  - `targetType` (string): `tour` hoặc `hotel`
  - `targetId` (ObjectId): ID của tour hoặc hotel
  - `rating` (number): Filter by rating (1-5)
  - `sortBy`, `limit`, `page`
- **Auth Required:** No

#### GET /reviews/my-reviews
Lấy reviews của user hiện tại
- **Auth Required:** Yes
- **Query Parameters:** `sortBy`, `limit`, `page`

#### GET /reviews/:targetType/:targetId
Lấy tất cả reviews cho một tour hoặc hotel
- **Path Parameters:**
  - `targetType`: `tour` hoặc `hotel`
  - `targetId`: ID của tour hoặc hotel
- **Query Parameters:** `sortBy`, `limit`, `page`
- **Auth Required:** No

#### GET /reviews/:reviewId
Lấy chi tiết một review
- **Auth Required:** No

#### POST /reviews
Tạo review mới
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "targetType": "tour",
    "targetId": "tour_id",
    "rating": 5,
    "comment": "Tour rất tuyệt vời, hướng dẫn viên nhiệt tình!"
  }
  ```

#### PATCH /reviews/:reviewId
Cập nhật review của mình
- **Auth Required:** Yes
- **Note:** Chỉ cập nhật được review của chính mình
- **Body:**
  ```json
  {
    "rating": 4,
    "comment": "Updated comment"
  }
  ```

#### DELETE /reviews/:reviewId
Xóa review của mình
- **Auth Required:** Yes
- **Note:** Chỉ xóa được review của chính mình

---

### 5. Services API

#### GET /services
Lấy danh sách dịch vụ
- **Query Parameters:**
  - `name` (string): Tên dịch vụ
  - `type` (string): `transport`, `food`, `guide`, `ticket`, `other`
  - `sortBy`, `limit`, `page`
- **Auth Required:** No

#### GET /services/search
Tìm kiếm dịch vụ với bộ lọc
- **Query Parameters:**
  - `type` (string): Loại dịch vụ
  - `minPrice` (number): Giá tối thiểu
  - `maxPrice` (number): Giá tối đa
  - `sortBy`, `limit`, `page`
- **Auth Required:** No

#### GET /services/:serviceId
Lấy chi tiết một dịch vụ
- **Auth Required:** No

#### POST /services
Tạo dịch vụ mới
- **Auth Required:** Yes (admin only - `manageServices`)
- **Body:**
  ```json
  {
    "name": "Thuê xe máy",
    "description": "Thuê xe máy tự lái theo ngày",
    "price": 150000,
    "type": "transport"
  }
  ```

#### PATCH /services/:serviceId
Cập nhật dịch vụ
- **Auth Required:** Yes (admin only - `manageServices`)

#### DELETE /services/:serviceId
Xóa dịch vụ
- **Auth Required:** Yes (admin only - `manageServices`)

---

## Roles & Permissions

### User Role
- Có thể xem tours, hotels, services, reviews
- Có thể tạo bookings cho chính mình
- Có thể tạo, sửa, xóa reviews của mình
- Có thể hủy bookings của mình
- Có thể xem danh sách bookings của mình

### Admin Role
Có tất cả quyền của User, cộng thêm:
- `manageTours`: CRUD tours
- `manageHotels`: CRUD hotels
- `manageBookings`: Xem tất cả bookings, cập nhật, xóa, xác nhận bookings
- `manageServices`: CRUD services
- `manageUsers`: Quản lý users (sẵn có)

## Error Responses

Tất cả errors trả về format:
```json
{
  "code": 404,
  "message": "Tour not found"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `204`: No Content (for DELETE)
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Pagination Response Format

```json
{
  "results": [...],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 50
}
```

## Notes

1. Tất cả dates sử dụng ISO 8601 format
2. Tất cả giá tiền tính bằng VND
3. ObjectId phải là valid MongoDB ObjectId
4. Rating từ 1-5 (có thể có decimal)
5. Pagination mặc định: limit=10, page=1
