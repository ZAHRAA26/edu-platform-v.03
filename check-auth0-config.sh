#!/bin/bash

echo "🔍 فحص إعدادات Auth0..."
echo "================================"

# التحقق من وجود ملف .env
if [ ! -f .env ]; then
    echo "❌ ملف .env غير موجود!"
    echo "💡 قم بتشغيل: cp .env.example .env"
    exit 1
fi

echo "✅ ملف .env موجود"

# قراءة متغيرات البيئة
source .env

# التحقق من AUTH0_DOMAIN
echo ""
echo "🔍 فحص AUTH0_DOMAIN..."
if [[ "$AUTH0_DOMAIN" == "your-domain.auth0.com" ]]; then
    echo "❌ AUTH0_DOMAIN لا يزال يحتوي على القيمة الافتراضية!"
    echo "💡 يجب استبداله بـ Domain الحقيقي من Auth0 Dashboard"
    echo "   مثال: dev-abc123.us.auth0.com"
else
    echo "✅ AUTH0_DOMAIN: $AUTH0_DOMAIN"
fi

# التحقق من AUTH0_CLIENT_ID
echo ""
echo "🔍 فحص AUTH0_CLIENT_ID..."
if [[ "$AUTH0_CLIENT_ID" == "your-client-id" ]]; then
    echo "❌ AUTH0_CLIENT_ID لا يزال يحتوي على القيمة الافتراضية!"
    echo "💡 يجب استبداله بـ Client ID الحقيقي من Auth0 Dashboard"
else
    echo "✅ AUTH0_CLIENT_ID: ${AUTH0_CLIENT_ID:0:10}..."
fi

# التحقق من AUTH0_CLIENT_SECRET
echo ""
echo "🔍 فحص AUTH0_CLIENT_SECRET..."
if [[ "$AUTH0_CLIENT_SECRET" == "your-client-secret" ]]; then
    echo "❌ AUTH0_CLIENT_SECRET لا يزال يحتوي على القيمة الافتراضية!"
    echo "💡 يجب استبداله بـ Client Secret الحقيقي من Auth0 Dashboard"
else
    echo "✅ AUTH0_CLIENT_SECRET: ${AUTH0_CLIENT_SECRET:0:10}..."
fi

# التحقق من AUTH0_AUDIENCE
echo ""
echo "🔍 فحص AUTH0_AUDIENCE..."
if [[ "$AUTH0_AUDIENCE" == "https://your-api.com" ]]; then
    echo "❌ AUTH0_AUDIENCE لا يزال يحتوي على القيمة الافتراضية!"
    echo "💡 يجب استبداله بـ API Identifier من Auth0 Dashboard"
    echo "   مثال: https://edu-platform-api.com"
else
    echo "✅ AUTH0_AUDIENCE: $AUTH0_AUDIENCE"
fi

# التحقق من VITE_AUTH0_DOMAIN
echo ""
echo "🔍 فحص VITE_AUTH0_DOMAIN..."
if [[ "$VITE_AUTH0_DOMAIN" == "your-domain.auth0.com" ]]; then
    echo "❌ VITE_AUTH0_DOMAIN لا يزال يحتوي على القيمة الافتراضية!"
    echo "💡 يجب أن يكون نفس AUTH0_DOMAIN"
else
    echo "✅ VITE_AUTH0_DOMAIN: $VITE_AUTH0_DOMAIN"
fi

# التحقق من VITE_AUTH0_CLIENT_ID
echo ""
echo "🔍 فحص VITE_AUTH0_CLIENT_ID..."
if [[ "$VITE_AUTH0_CLIENT_ID" == "your-client-id" ]]; then
    echo "❌ VITE_AUTH0_CLIENT_ID لا يزال يحتوي على القيمة الافتراضية!"
    echo "💡 يجب أن يكون نفس AUTH0_CLIENT_ID"
else
    echo "✅ VITE_AUTH0_CLIENT_ID: ${VITE_AUTH0_CLIENT_ID:0:10}..."
fi

echo ""
echo "================================"

# التحقق من وجود قيم افتراضية
if [[ "$AUTH0_DOMAIN" == "your-domain.auth0.com" ]] || 
   [[ "$AUTH0_CLIENT_ID" == "your-client-id" ]] || 
   [[ "$AUTH0_CLIENT_SECRET" == "your-client-secret" ]] || 
   [[ "$AUTH0_AUDIENCE" == "https://your-api.com" ]] || 
   [[ "$VITE_AUTH0_DOMAIN" == "your-domain.auth0.com" ]] || 
   [[ "$VITE_AUTH0_CLIENT_ID" == "your-client-id" ]]; then
    echo "❌ يوجد قيم افتراضية لم يتم تحديثها!"
    echo ""
    echo "📋 الخطوات المطلوبة:"
    echo "1. اذهب إلى Auth0 Dashboard: https://manage.auth0.com"
    echo "2. انسخ Domain, Client ID, Client Secret من Application Settings"
    echo "3. أنشئ API واحصل على Identifier"
    echo "4. حدث ملف .env بالقيم الحقيقية"
    echo "5. أعد تشغيل المشروع: docker-compose down && docker-compose up -d"
    echo ""
    echo "📖 راجع الدليل المفصل في: AUTH0_CONFIGURATION_FIX.md"
else
    echo "🎉 جميع الإعدادات تبدو صحيحة!"
    echo ""
    echo "🚀 الخطوات التالية:"
    echo "1. تأكد من إعدادات Callback URLs في Auth0 Dashboard"
    echo "2. أعد تشغيل المشروع: docker-compose down && docker-compose up -d"
    echo "3. اختبر التطبيق على: http://localhost:3000"
fi

echo ""