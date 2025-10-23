#!/bin/bash

# Database Seeding Script for Educational Platform
# This script seeds the database with initial data including admin user

set -e

echo "🌱 Starting Database Seeding Process..."
echo "======================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your settings:"
    echo "cp .env.example .env"
    exit 1
fi

# Load environment variables
source .env

# Check if required environment variables are set
required_vars=("MONGODB_URI" "AUTH0_DOMAIN" "AUTH0_CLIENT_ID")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '   - %s\n' "${missing_vars[@]}"
    echo "Please update your .env file with the correct values."
    exit 1
fi

echo "✅ Environment variables validated"

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! docker-compose ps mongo | grep -q "Up"; then
    echo "⚠️  MongoDB container is not running. Starting services..."
    docker-compose up -d mongo
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 10
fi

# Check MongoDB connection
if ! docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "❌ Cannot connect to MongoDB. Please check your MongoDB service."
    exit 1
fi

echo "✅ MongoDB is running and accessible"

# Build backend if needed
echo "🔨 Building backend..."
if [ ! -d "backend/dist" ]; then
    echo "Building TypeScript files..."
    cd backend
    npm run build
    cd ..
fi

# Run seeding
echo "🌱 Running database seeding..."
cd backend

# Run the seed script
if npm run seed; then
    echo ""
    echo "🎉 Database seeding completed successfully!"
    echo ""
    echo "📊 What was created:"
    echo "   ✅ Admin user: ${ADMIN_EMAIL:-admin@edu-platform.com}"
    echo "   ✅ Sample teacher and student accounts"
    echo "   ✅ 3 sample courses with lessons"
    echo "   ✅ Course-lesson relationships"
    echo ""
    echo "🔑 Default Login Credentials:"
    echo "   Admin: ${ADMIN_EMAIL:-admin@edu-platform.com}"
    echo "   Teacher: teacher@edu-platform.com"
    echo "   Student: student@edu-platform.com"
    echo ""
    echo "⚠️  Important Notes:"
    echo "   - Auth0 IDs are temporary and will be updated when users log in"
    echo "   - Make sure to configure Auth0 with the correct callback URLs"
    echo "   - Users need to sign up through Auth0 first, then their data will be synced"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Start the full application: docker-compose up -d"
    echo "   2. Access the frontend: http://localhost:3000"
    echo "   3. Access the backend API: http://localhost:5000/api"
    echo "   4. Sign up through Auth0 to sync your account"
    echo ""
else
    echo "❌ Database seeding failed!"
    echo "Please check the error messages above and try again."
    exit 1
fi

cd ..

echo "✨ Seeding process completed!"