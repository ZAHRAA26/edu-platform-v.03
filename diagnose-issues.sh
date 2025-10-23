#!/bin/bash

echo "🔍 تشخيص مشاكل المشروع"
echo "======================="

# فحص ملف .env
echo "1. فحص ملف .env:"
if [ -f .env ]; then
    echo "   ✅ ملف .env موجود"
    
    # فحص المتغيرات المطلوبة
    required_vars=("AUTH0_DOMAIN" "AUTH0_CLIENT_ID" "AUTH0_CLIENT_SECRET" "AUTH0_AUDIENCE" "VITE_AUTH0_DOMAIN" "VITE_AUTH0_CLIENT_ID")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env; then
            value=$(grep "^${var}=" .env | cut -d'=' -f2)
            if [[ "$value" == "your-"* ]] || [[ -z "$value" ]]; then
                echo "   ❌ $var: قيمة افتراضية (يجب التحديث)"
            else
                echo "   ✅ $var: محدد"
            fi
        else
            echo "   ❌ $var: غير موجود"
        fi
    done
else
    echo "   ❌ ملف .env غير موجود"
fi

echo ""

# فحص حالة Docker
echo "2. فحص حالة Docker:"
if command -v docker &> /dev/null; then
    echo "   ✅ Docker مثبت"
    
    if docker info &> /dev/null; then
        echo "   ✅ Docker يعمل"
        
        # فحص الحاويات
        echo "   📦 حالة الحاويات:"
        docker-compose ps 2>/dev/null || echo "   ⚠️  لم يتم تشغيل docker-compose بعد"
        
    else
        echo "   ❌ Docker لا يعمل"
    fi
else
    echo "   ❌ Docker غير مثبت"
fi

echo ""

# فحص الشبكة والاتصال
echo "3. فحص الاتصال بالخدمات:"

# فحص Backend
echo "   🔍 Backend (http://localhost:5000):"
if curl -s http://localhost:5000/health &> /dev/null; then
    echo "   ✅ Backend يعمل"
else
    echo "   ❌ Backend لا يستجيب"
fi

# فحص Frontend
echo "   🔍 Frontend (http://localhost:3000):"
if curl -s http://localhost:3000 &> /dev/null; then
    echo "   ✅ Frontend يعمل"
else
    echo "   ❌ Frontend لا يستجيب"
fi

# فحص MongoDB
echo "   🔍 MongoDB (localhost:27017):"
if docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
    echo "   ✅ MongoDB يعمل"
else
    echo "   ❌ MongoDB لا يستجيب"
fi

# فحص MinIO
echo "   🔍 MinIO (http://localhost:9000):"
if curl -s http://localhost:9000/minio/health/live &> /dev/null; then
    echo "   ✅ MinIO يعمل"
else
    echo "   ❌ MinIO لا يستجيب"
fi

echo ""

# فحص الـ logs
echo "4. آخر الأخطاء في الـ logs:"
echo "   📋 Backend logs:"
docker-compose logs --tail=5 backend 2>/dev/null | grep -i error || echo "   ✅ لا توجد أخطاء حديثة"

echo "   📋 Frontend logs:"
docker-compose logs --tail=5 frontend 2>/dev/null | grep -i error || echo "   ✅ لا توجد أخطاء حديثة"

echo ""

# التوصيات
echo "💡 التوصيات:"

if [ ! -f .env ]; then
    echo "   1. إنشاء ملف .env: cp .env.example .env"
fi

if grep -q "your-domain.auth0.com" .env 2>/dev/null; then
    echo "   2. تحديث إعدادات Auth0 في ملف .env"
    echo "      راجع: AUTH0_CONFIGURATION_FIX.md"
fi

if ! docker-compose ps &> /dev/null; then
    echo "   3. تشغيل المشروع: docker-compose up -d"
fi

echo "   4. للحصول على logs مفصلة: docker-compose logs -f [service-name]"
echo "   5. لإعادة بناء الحاويات: docker-compose build --no-cache"

echo ""
echo "📖 للمزيد من المساعدة:"
echo "   - راجع: PROJECT_ISSUES_ANALYSIS.md"
echo "   - راجع: AUTH0_CONFIGURATION_FIX.md"
echo "   - استخدم: ./setup-project.sh للإعداد التلقائي"

echo ""
echo "🏁 انتهى التشخيص"