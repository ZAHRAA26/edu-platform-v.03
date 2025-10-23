#!/bin/bash

echo "🚀 إعداد مشروع المنصة التعليمية"
echo "=================================="

# التحقق من وجود ملف .env
if [ ! -f .env ]; then
    echo "📝 إنشاء ملف .env من .env.example..."
    cp .env.example .env
    echo "✅ تم إنشاء ملف .env"
    echo ""
    echo "⚠️  تحذير: يجب تحديث ملف .env بمعلومات Auth0 الحقيقية!"
    echo "   راجع الملف: AUTH0_CONFIGURATION_FIX.md"
    echo ""
else
    echo "✅ ملف .env موجود"
fi

# فحص إعدادات Auth0
echo "🔍 فحص إعدادات Auth0..."
./check-auth0-config.sh

echo ""
echo "🐳 بناء وتشغيل المشروع باستخدام Docker..."

# إيقاف الحاويات الموجودة
echo "⏹️  إيقاف الحاويات الموجودة..."
docker-compose down

# بناء الحاويات
echo "🔨 بناء الحاويات..."
docker-compose build --no-cache

# تشغيل المشروع
echo "▶️  تشغيل المشروع..."
docker-compose up -d

echo ""
echo "⏳ انتظار تشغيل الخدمات..."
sleep 10

# فحص حالة الخدمات
echo "🔍 فحص حالة الخدمات..."
docker-compose ps

echo ""
echo "🌐 روابط المشروع:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Backend Health: http://localhost:5000/health"
echo "   MinIO Console: http://localhost:9001"
echo "   MongoDB: localhost:27017"

echo ""
echo "📋 الخطوات التالية:"
echo "1. تحديث ملف .env بمعلومات Auth0 الحقيقية"
echo "2. إعادة تشغيل المشروع: docker-compose restart"
echo "3. اختبار التطبيق على: http://localhost:3000"

echo ""
echo "📖 للمساعدة:"
echo "   - راجع: AUTH0_CONFIGURATION_FIX.md"
echo "   - راجع: auth0-setup.md"
echo "   - راجع: PROJECT_ISSUES_ANALYSIS.md"

echo ""
echo "🎉 تم الانتهاء من الإعداد!"