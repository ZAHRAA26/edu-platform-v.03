#!/bin/bash

echo "🛑 إيقاف منصة التعلم الذكية..."

# Stop all services
docker-compose down

echo "✅ تم إيقاف جميع الخدمات بنجاح!"
echo ""
echo "💡 لحذف جميع البيانات والحاويات: docker-compose down -v"
echo "💡 لإعادة التشغيل: ./start.sh"