# منصة التعلم الذكية - Educational Platform v3.0

منصة تعليمية متكاملة مع نظام أمان متقدم للأجهزة وواجهة مستخدم حديثة.

## 🌟 المميزات الرئيسية

### 🔐 نظام الأمان المتقدم
- **تقييد الوصول للأجهزة**: يمكن للمستخدم الوصول من جهازين فقط
- **Device Fingerprinting**: تتبع فريد لكل جهاز
- **حماية الحساب**: حذف تلقائي للحساب عند تجاوز حد الأجهزة
- **مصادقة Keycloak**: نظام مصادقة آمن ومتقدم

### 🎨 واجهة المستخدم الحديثة
- **تصميم متجاوب**: يعمل على جميع الأجهزة
- **واجهة عربية**: دعم كامل للغة العربية
- **تصميم جذاب**: استخدام Tailwind CSS مع تدرجات لونية
- **تجربة مستخدم سلسة**: انتقالات وحركات سلسة

### 📚 إدارة الدورات
- **إنشاء وإدارة الدورات**: للمدرسين والمدراء
- **نظام التسجيل**: تسجيل سهل في الدورات
- **تتبع التقدم**: متابعة تقدم الطلاب
- **نظام التقييم**: تقييم الدورات والمراجعات

### 🎥 إدارة المحتوى
- **رفع الملفات**: دعم الصور والفيديوهات
- **تخزين آمن**: استخدام MinIO للتخزين
- **معاينة المحتوى**: عرض المحتوى بشكل آمن

## 🏗️ البنية التقنية

### Backend
- **Node.js + Express**: خادم API
- **TypeScript**: للتطوير الآمن
- **MongoDB**: قاعدة البيانات
- **Keycloak**: نظام المصادقة
- **MinIO**: تخزين الملفات

### Frontend
- **React 18**: مكتبة واجهة المستخدم
- **TypeScript**: للتطوير الآمن
- **Tailwind CSS**: للتصميم
- **React Query**: لإدارة البيانات
- **React Router**: للتنقل

### Infrastructure
- **Docker**: للحاويات
- **Nginx**: خادم الويب
- **PostgreSQL**: لقاعدة بيانات Keycloak

## 🚀 التشغيل السريع

### المتطلبات
- Docker & Docker Compose
- Node.js 18+ (للتطوير المحلي)
- Git

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd edu-platform-v.03
```

### 2. تشغيل جميع الخدمات
```bash
docker-compose up -d
```

### 3. إعداد Keycloak
1. افتح http://localhost:8080
2. سجل دخول بـ admin/admin
3. أنشئ realm جديد باسم "edu-platform"
4. أنشئ clients للـ frontend والـ backend
5. أنشئ roles: student, teacher, admin
6. أنشئ مستخدمين وأعطهم الأدوار المناسبة

### 4. الوصول للتطبيق
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Keycloak**: http://localhost:8080
- **MinIO Console**: http://localhost:9001

## 🛠️ التطوير المحلي

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 هيكل المشروع

```
edu-platform-v.03/
├── backend/                 # خادم API
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/ # المتحكمات
│   │   │   └── routes/      # المسارات
│   │   ├── models/          # نماذج البيانات
│   │   ├── config/          # الإعدادات
│   │   └── utils/           # الأدوات المساعدة
│   ├── Dockerfile
│   └── package.json
├── frontend/                # واجهة المستخدم
│   ├── src/
│   │   ├── components/      # المكونات
│   │   ├── pages/           # الصفحات
│   │   ├── contexts/        # السياقات
│   │   └── api/             # طبقة API
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # إعداد Docker
└── README.md
```

## 🔧 الإعدادات

### متغيرات البيئة - Backend
```env
MONGODB_URI=mongodb://localhost:27017/edu-platform
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=edu-platform
KEYCLOAK_CLIENT_ID=edu-platform-backend
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
PORT=5000
```

### متغيرات البيئة - Frontend
```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=edu-platform
VITE_KEYCLOAK_CLIENT_ID=edu-platform-frontend
```

## 🔐 نظام الأمان

### Device Security
- كل مستخدم يمكنه الوصول من جهازين فقط
- يتم تتبع الأجهزة باستخدام Device Fingerprinting
- عند محاولة الوصول من جهاز ثالث، يتم حذف الحساب تلقائياً
- يمكن للمستخدم إدارة أجهزته المسجلة

### Authentication Flow
1. المستخدم يسجل دخول عبر Keycloak
2. يتم إنشاء Device Fingerprint
3. يتم التحقق من عدد الأجهزة المسجلة
4. إذا تجاوز الحد، يتم رفض الوصول وحذف الحساب
5. إذا كان ضمن الحد، يتم السماح بالوصول

## 👥 الأدوار والصلاحيات

### Student (طالب)
- عرض الدورات والتسجيل فيها
- متابعة التقدم الشخصي
- تقييم الدورات
- عرض الشهادات

### Teacher (مدرس)
- إنشاء وإدارة الدورات
- رفع المحتوى التعليمي
- متابعة تقدم الطلاب
- إدارة التقييمات

### Admin (مدير)
- جميع صلاحيات المدرس
- إدارة المستخدمين
- عرض التقارير والإحصائيات
- إدارة النظام

## 🎯 الميزات المتقدمة

### Device Management
- عرض قائمة الأجهزة المسجلة
- إزالة أجهزة غير مرغوب فيها
- تتبع آخر نشاط لكل جهاز
- معلومات تفصيلية عن كل جهاز

### File Management
- رفع آمن للملفات
- دعم أنواع ملفات متعددة
- ضغط وتحسين الصور
- روابط آمنة للملفات

### Progress Tracking
- تتبع دقيق لتقدم الطلاب
- إحصائيات مفصلة
- تقارير التقدم
- شهادات الإنجاز

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الاتصال بـ Keycloak**
   - تأكد من تشغيل Keycloak على المنفذ 8080
   - تحقق من إعدادات الـ realm والـ client

2. **خطأ في قاعدة البيانات**
   - تأكد من تشغيل MongoDB
   - تحقق من صحة connection string

3. **مشاكل في رفع الملفات**
   - تأكد من تشغيل MinIO
   - تحقق من صحة credentials

## 📞 الدعم والمساهمة

للمساهمة في المشروع أو الإبلاغ عن مشاكل، يرجى:
1. إنشاء Issue في GitHub
2. إرسال Pull Request مع التحسينات
3. التواصل مع فريق التطوير

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف LICENSE للمزيد من التفاصيل.

---

**تم تطوير هذا المشروع بـ ❤️ لخدمة التعليم الرقمي**