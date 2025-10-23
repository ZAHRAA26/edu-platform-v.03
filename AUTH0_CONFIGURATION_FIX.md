# حل مشكلة "Unknown host: your-tenant.auth0.com"

## 🚨 المشكلة
الرسالة `Unknown host: your-tenant.auth0.com` تظهر لأنك تستخدم القيم الافتراضية بدلاً من معلومات حسابك الحقيقي في Auth0.

## 🔧 الحل خطوة بخطوة

### الخطوة 1: الحصول على معلومات Auth0 الحقيقية

1. **اذهب إلى Auth0 Dashboard**: https://manage.auth0.com
2. **سجل دخول** إلى حسابك
3. **اذهب إلى Applications** من القائمة الجانبية
4. **اختر التطبيق** الذي أنشأته (أو أنشئ واحد جديد)

### الخطوة 2: نسخ المعلومات المطلوبة

من صفحة Application Settings، انسخ:

- **Domain**: مثل `dev-abc123.us.auth0.com`
- **Client ID**: مثل `1234567890abcdef`
- **Client Secret**: مثل `abcdef1234567890` (للـ Backend فقط)

### الخطوة 3: إنشاء API في Auth0

1. اذهب إلى **APIs** في Auth0 Dashboard
2. اضغط **Create API**
3. أدخل:
   - **Name**: Educational Platform API
   - **Identifier**: `https://edu-platform-api.com` (يمكن أن يكون أي URL)
   - **Signing Algorithm**: RS256

### الخطوة 4: تحديث ملف .env

```bash
# انسخ ملف .env.example إلى .env
cp .env.example .env
```

ثم عدل ملف `.env` بالقيم الحقيقية:

```env
# Database Configuration
MONGODB_URI=mongodb://admin:password@localhost:27017/edu-platform?authSource=admin

# Backend Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Auth0 Configuration - استبدل بالقيم الحقيقية
AUTH0_DOMAIN=dev-abc123.us.auth0.com
AUTH0_CLIENT_ID=1234567890abcdef
AUTH0_CLIENT_SECRET=abcdef1234567890
AUTH0_AUDIENCE=https://edu-platform-api.com
AUTH0_ISSUER=https://dev-abc123.us.auth0.com/

# Frontend Auth0 Configuration - استبدل بالقيم الحقيقية
VITE_AUTH0_DOMAIN=dev-abc123.us.auth0.com
VITE_AUTH0_CLIENT_ID=1234567890abcdef

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# API Configuration
VITE_BACKEND_URL=http://localhost:5000/api

# Logging
LOG_LEVEL=info

# Security
DEVICE_LIMIT=2
```

### الخطوة 5: تحديث إعدادات Application في Auth0

في Auth0 Dashboard > Applications > [Your App] > Settings:

**Allowed Callback URLs**:
```
http://localhost:3000/callback,http://localhost:3000
```

**Allowed Logout URLs**:
```
http://localhost:3000
```

**Allowed Web Origins**:
```
http://localhost:3000
```

**Allowed Origins (CORS)**:
```
http://localhost:3000
```

### الخطوة 6: إعادة تشغيل المشروع

```bash
# أوقف المشروع إذا كان يعمل
docker-compose down

# أعد تشغيله
docker-compose up -d

# أو إذا كنت تشغل بدون Docker
# أعد تشغيل Frontend و Backend
```

## 🔍 التحقق من الإعدادات

### 1. تحقق من ملف .env
```bash
cat .env | grep AUTH0
```

يجب أن ترى قيم حقيقية وليس `your-domain.auth0.com`

### 2. تحقق من logs
```bash
# تحقق من logs الـ Backend
docker-compose logs backend

# تحقق من logs الـ Frontend
docker-compose logs frontend
```

### 3. اختبر في المتصفح
1. اذهب إلى `http://localhost:3000`
2. اضغط على "ابدأ رحلتك التعليمية"
3. يجب أن يتم توجيهك إلى صفحة تسجيل الدخول في Auth0

## 🚨 مشاكل شائعة وحلولها

### المشكلة: "Invalid Callback URL"
**الحل**: تأكد من إضافة `http://localhost:3000/callback` في Allowed Callback URLs

### المشكلة: "Access Denied"
**الحل**: تأكد من أن Client ID صحيح في كل من Backend و Frontend

### المشكلة: "CORS Error"
**الحل**: تأكد من إضافة `http://localhost:3000` في Allowed Origins (CORS)

### المشكلة: "Invalid Audience"
**الحل**: تأكد من أن AUTH0_AUDIENCE يطابق Identifier في API settings

## 📝 مثال كامل لملف .env

```env
# Database Configuration
MONGODB_URI=mongodb://admin:password@localhost:27017/edu-platform?authSource=admin

# Backend Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Auth0 Configuration (مثال - استبدل بقيمك الحقيقية)
AUTH0_DOMAIN=dev-xyz789.us.auth0.com
AUTH0_CLIENT_ID=AbCdEf123456789
AUTH0_CLIENT_SECRET=XyZ987654321aBc
AUTH0_AUDIENCE=https://edu-platform-api.com
AUTH0_ISSUER=https://dev-xyz789.us.auth0.com/

# Frontend Auth0 Configuration
VITE_AUTH0_DOMAIN=dev-xyz789.us.auth0.com
VITE_AUTH0_CLIENT_ID=AbCdEf123456789

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# API Configuration
VITE_BACKEND_URL=http://localhost:5000/api

# Logging
LOG_LEVEL=info

# Security
DEVICE_LIMIT=2
```

## ✅ التأكد من نجاح الإعداد

بعد تطبيق هذه الخطوات:

1. ✅ لا توجد رسالة "Unknown host"
2. ✅ يتم توجيهك إلى صفحة Auth0 للتسجيل
3. ✅ يمكنك تسجيل الدخول بنجاح
4. ✅ يتم توجيهك مرة أخرى إلى التطبيق

---

**ملاحظة مهمة**: لا تشارك Client Secret مع أحد واحتفظ به آمناً!