#!/bin/bash
# Environment Setup Script for Payment Gateway

# Create environment variables file
cat > .env.example << 'EOF'
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE

# API Configuration
API_BASE_URL=http://localhost:3000/api/
PAYMENT_GATEWAY_URL=https://checkout.razorpay.com/v1/checkout.js

# Payment Settings
AMOUNT_PER_SEAT=500
CURRENCY=INR

# Application Settings
ENVIRONMENT=development
EOF

echo "✅ Created .env.example file"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Add your Razorpay keys to .env"
echo "3. Never commit .env to version control"
echo ""
echo "👉 Get your Razorpay keys from: https://dashboard.razorpay.com/app/settings/api-keys"
