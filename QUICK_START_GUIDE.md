# 🚀 دليل البدء السريع - المنصة التعليمية

## 📋 المتطلبات الأساسية

- Docker و Docker Compose
- حساب Auth0 (مجاني)
- Git

## ⚡ البدء السريع (5 دقائق)

### الخطوة 1: إعداد Auth0

1. **إنشاء حساب Auth0**:
   - اذهب إلى [auth0.com](https://auth0.com)
   - أنشئ حساب مجاني

2. **إنشاء Application**:
   ```
   Dashboard → Applications → Create Application
   - Name: "Educational Platform"
   - Type: "Single Page Web Applications"
   - Technology: "React"
   ```

3. **إعداد Application**:
   ```
   Settings:
   - Allowed Callback URLs: http://localhost:3000
   - Allowed Logout URLs: http://localhost:3000
   - Allowed Web Origins: http://localhost:3000
   - Allowed Origins (CORS): http://localhost:3000
   ```

4. **إنشاء API**:
   ```
   Dashboard → APIs → Create API
   - Name: "Educational Platform API"
   - Identifier: https://edu-platform-api.com
   - Signing Algorithm: RS256
   ```

### الخطوة 2: تحديث إعدادات المشروع

1. **تحديث ملف .env**:
   ```bash
   # نسخ من الملف المثال
   cp .env.example .env
   
   # تحديث القيم التالية في .env:
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_AUDIENCE=https://edu-platform-api.com
   AUTH0_ISSUER=https://your-domain.auth0.com/
   
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   ```

### الخطوة 3: تشغيل المشروع

```bash
# استخدام script الإعداد التلقائي
./setup-project.sh

# أو يدوياً:
docker-compose up -d
```

### الخطوة 4: اختبار المشروع

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **MinIO Console**: http://localhost:9001

## 🔧 حل المشاكل الشائعة

### مشكلة: "Unknown host" في Auth0

**الحل**:
```bash
# تحقق من إعدادات Auth0
./check-auth0-config.sh

# راجع الملف التفصيلي
cat AUTH0_CONFIGURATION_FIX.md
```

### مشكلة: الحاويات لا تعمل

**الحل**:
```bash
# تشخيص المشاكل
./diagnose-issues.sh

# إعادة بناء الحاويات
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### مشكلة: خطأ في الاتصال بقاعدة البيانات

**الحل**:
```bash
# فحص حالة MongoDB
docker-compose logs mongo

# إعادة تشغيل قاعدة البيانات
docker-compose restart mongo
```

### مشكلة: CORS Error

**الحل**:
```bash
# تحقق من CORS_ORIGIN في .env
CORS_ORIGIN=http://localhost:3000

# إعادة تشغيل Backend
docker-compose restart backend
```

## 📁 هيكل المشروع

```
edu-platform-v.03/
├── backend/                 # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/         # إعدادات Auth0 وقاعدة البيانات
│   │   ├── api/            # Routes و Controllers
│   │   └── models/         # نماذج قاعدة البيانات
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # مكونات React
│   │   ├── pages/          # صفحات التطبيق
│   │   └── services/       # خدمات API
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # إعدادات Docker
├── .env                    # متغيرات البيئة
└── docs/                   # التوثيق
```

## 🛠️ أوامر مفيدة

### إدارة Docker

```bash
# تشغيل المشروع
docker-compose up -d

# إيقاف المشروع
docker-compose down

# مشاهدة الـ logs
docker-compose logs -f backend
docker-compose logs -f frontend

# إعادة بناء حاوية معينة
docker-compose build backend
docker-compose up -d backend

# فحص حالة الحاويات
docker-compose ps
```

### التطوير

```bash
# تشغيل Backend في وضع التطوير
cd backend
npm run dev

# تشغيل Frontend في وضع التطوير
cd frontend
npm run dev

# بناء المشروع للإنتاج
npm run build
```

### التشخيص

```bash
# تشخيص شامل للمشاكل
./diagnose-issues.sh

# فحص إعدادات Auth0
./check-auth0-config.sh

# إعداد تلقائي للمشروع
./setup-project.sh
```

## 📚 ملفات التوثيق

- `PROJECT_ISSUES_ANALYSIS.md` - تحليل المشاكل وحلولها
- `AUTH0_CONFIGURATION_FIX.md` - دليل إصلاح Auth0
- `auth0-setup.md` - دليل إعداد Auth0 التفصيلي
- `.env.template` - أمثلة على متغيرات البيئة

## 🆘 الحصول على المساعدة

### 1. فحص الـ Logs
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# جميع الـ logs
docker-compose logs
```

### 2. فحص Auth0 Dashboard
- تحقق من إعدادات Application
- راجع قسم Logs في Auth0
- تأكد من Callback URLs

### 3. استخدام أدوات التشخيص
```bash
# تشخيص شامل
./diagnose-issues.sh

# فحص Auth0
./check-auth0-config.sh
```

### 4. إعادة الإعداد الكامل
```bash
# إعادة إعداد كاملة
docker-compose down -v
docker system prune -f
./setup-project.sh
```

## ✅ Checklist للتأكد من العمل

- [ ] حساب Auth0 مُعد بشكل صحيح
- [ ] ملف .env محدث بالقيم الحقيقية
- [ ] جميع الحاويات تعمل: `docker-compose ps`
- [ ] Backend يستجيب: `curl http://localhost:5000/health`
- [ ] Frontend يعمل: http://localhost:3000
- [ ] تسجيل الدخول يعمل بدون أخطاء
- [ ] API calls تعمل بشكل صحيح

## 🎯 الخطوات التالية

1. **تخصيص التطبيق**: تعديل الألوان والشعار
2. **إضافة المحتوى**: إنشاء الكورسات والدروس
3. **إعداد الإنتاج**: نشر على خادم حقيقي
4. **إضافة المزيد من الميزات**: دفع، شهادات، إلخ

---

**💡 نصيحة**: ابدأ بالتأكد من عمل Auth0 أولاً، فمعظم المشاكل مرتبطة به!