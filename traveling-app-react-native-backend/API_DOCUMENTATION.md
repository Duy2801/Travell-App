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
