# Notification Flow - Booking System

## 📬 Tổng quan hệ thống thông báo

Hệ thống tự động gửi thông báo cho người dùng khi có các sự kiện liên quan đến booking.

## 🔔 Các loại thông báo

### 1. **Tạo Booking Mới** (Created)
**Khi nào:** User tạo booking mới thành công

**Thông báo:**
- 📱 Title: `🎉 Đặt tour thành công!`
- 📝 Message: `Bạn đã đặt tour "{tourName}" thành công. Mã đặt tour: {bookingId}`
- ⚡ Priority: `high`
- 🏷️ Type: `booking`

**Code Location:**
```javascript
// src/services/booking.service.js - createBooking()
await notificationService.createBookingNotification(userId, { bookingId, tourName }, 'created');
```

---

### 2. **Phê Duyệt Booking** (Confirmed)
**Khi nào:** Admin xác nhận/phê duyệt booking

**Thông báo:**
- 📱 Title: `✅ Booking được xác nhận`
- 📝 Message: `Booking {bookingId} của bạn đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!`
- ⚡ Priority: `high`
- 🏷️ Type: `booking`

**Code Location:**
```javascript
// src/services/booking.service.js - confirmBooking()
await notificationService.createBookingNotification(userId, { bookingId, tourName }, 'confirmed');
```

**API Endpoint:**
```
PATCH /v1/bookings/:bookingId/confirm
Headers: Authorization: Bearer {admin_token}
```

---

### 3. **Từ Chối Booking** (Cancelled)
**Khi nào:** Admin từ chối/hủy booking

**Thông báo:**
- 📱 Title: `❌ Booking bị hủy`
- 📝 Message: `Booking {bookingId} đã bị hủy. Vui lòng liên hệ để biết thêm chi tiết.`
- ⚡ Priority: `high`
- 🏷️ Type: `booking`

**Code Location:**
```javascript
// src/services/booking.service.js - updateBookingById()
if (status changed to 'cancelled') {
  await notificationService.createBookingNotification(userId, { bookingId, tourName }, 'cancelled');
}
```

**API Endpoint:**
```
PATCH /v1/bookings/:bookingId
Headers: Authorization: Bearer {admin_token}
Body: { "status": "cancelled" }
```

---

## 🔄 Flow Diagram

```
User Creates Booking
       ↓
   [Database]
       ↓
✅ Notification: "Đặt tour thành công!"
       ↓
   Status: pending
       ↓
Admin Reviews → [Admin Dashboard]
       ↓
    Decision?
       ├─→ Approve → PATCH /confirm
       │      ↓
       │   [Database Update: confirmed]
       │      ↓
       │   ✅ Notification: "Booking được xác nhận"
       │
       └─→ Reject → PATCH /update {status: cancelled}
              ↓
          [Database Update: cancelled]
              ↓
          ❌ Notification: "Booking bị hủy"
```

---

## 📊 Notification Data Structure

```javascript
{
  userId: ObjectId,           // Người nhận
  type: 'booking',            // Loại thông báo
  title: String,              // Tiêu đề
  message: String,            // Nội dung
  relatedId: ObjectId,        // ID booking
  relatedType: 'booking',     // Loại liên quan
  priority: 'high' | 'normal' | 'low',
  isRead: false,              // Trạng thái đọc
  data: {
    bookingId: String,
    tourName: String
  },
  createdAt: Date
}
```

---

## 🧪 Testing

### Test 1: Tạo booking mới
```bash
POST /v1/bookings
Authorization: Bearer {user_token}
Body: {
  "tourId": "...",
  "numberOfPeople": 2,
  "startDate": "2024-03-01",
  "endDate": "2024-03-03",
  "totalPrice": 5000000
}

# Check notifications
GET /v1/notifications
# Should see: "🎉 Đặt tour thành công!"
```

### Test 2: Admin phê duyệt
```bash
PATCH /v1/bookings/{bookingId}/confirm
Authorization: Bearer {admin_token}

# Check user's notifications
GET /v1/notifications (as user)
# Should see: "✅ Booking được xác nhận"
```

### Test 3: Admin từ chối
```bash
PATCH /v1/bookings/{bookingId}
Authorization: Bearer {admin_token}
Body: { "status": "cancelled" }

# Check user's notifications
GET /v1/notifications (as user)
# Should see: "❌ Booking bị hủy"
```

---

## 🚀 Frontend Integration

Notifications sẽ tự động hiển thị trong:
- 🔔 Tab "Thông báo" của user
- 🔴 Badge số lượng thông báo chưa đọc
- 📲 Real-time updates (nếu có WebSocket/Push Notifications)

---

## ⚙️ Configuration

### Error Handling
- Nếu notification service fail, booking vẫn được tạo/cập nhật
- Lỗi được log nhưng không làm gián đoạn flow chính
- User có thể xem lại booking trong tab "Đặt tour của tôi"

### Priority Levels
- `high`: Booking created, confirmed, cancelled
- `normal`: System notifications
- `low`: Promotional notifications

---

## 📝 Notes

1. ✅ Notifications được tạo **tự động** khi admin thực hiện action
2. ✅ User không cần làm gì, sẽ nhận notification trong app
3. ✅ Notification có `relatedId` để link đến booking detail
4. ✅ Badge counter tự động update
5. ⚠️ Cần restart backend để apply changes

---

## 🔧 Maintenance

### Add new notification type
```javascript
// src/services/notification.service.js
const createBookingNotification = async (userId, bookingData, status) => {
  // Add new case
  case 'completed':
    title = '🏆 Hoàn thành chuyến đi';
    message = `Cảm ơn bạn đã sử dụng dịch vụ!`;
    break;
}
```

### Debug notifications
```javascript
// Check logs
console.log('Notification sent:', notification);

// Query database
db.notifications.find({ userId: ObjectId("...") }).sort({ createdAt: -1 })
```
