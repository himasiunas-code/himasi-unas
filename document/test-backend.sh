#!/bin/bash

# Test Smart Chatbot Backend using curl
echo "🧪 Testing HIMASI UNAS Smart Chatbot Backend"
echo "============================================="

# Test messages
declare -a messages=(
    "Apa itu HIMASI UNAS?"
    "Bagaimana cara bergabung?"
    "Ceritakan visi misi HIMASI"
    "Apakah ada kegiatan minggu ini?"
    "Siapa ketua HIMASI?"
)

# Test API endpoint (assuming PHP server running on localhost:8080)
API_URL="http://localhost:8080/chatbot-smart.php"

echo "📡 API Endpoint: $API_URL"
echo ""

# Function to test message
test_message() {
    local message="$1"
    echo "🗨️ Testing: $message"
    
    # Create JSON payload
    local json_payload="{\"message\": \"$message\"}"
    
    # Send POST request
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$json_payload" \
        "$API_URL")
    
    echo "📨 Response: $response"
    echo ""
    
    # Parse confidence level (basic check)
    if [[ $response == *"low"* ]]; then
        echo "⚠️ Low confidence detected - should show suggestions"
        
        # Test feedback API
        echo "📝 Testing feedback system..."
        local feedback_payload="{\"type\": \"feedback\", \"isHelpful\": false, \"originalMessage\": \"$message\", \"botResponse\": \"test response\"}"
        
        local feedback_response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$feedback_payload" \
            "$API_URL")
        
        echo "📝 Feedback response: $feedback_response"
    fi
    
    echo "---"
}

# Run tests
for message in "${messages[@]}"; do
    test_message "$message"
    sleep 1  # Rate limiting
done

# Test direct PHP execution if curl fails
echo "🐘 Testing PHP file directly:"
echo "================================"

if command -v php &> /dev/null; then
    echo "✅ PHP is available"
    
    # Test direct PHP execution
    cat > test_input.json << 'EOF'
{"message": "Apa itu HIMASI UNAS?"}
EOF
    
    echo "📝 Testing with direct PHP execution:"
    echo "Input: $(cat test_input.json)"
    echo ""
    
    # Simulate POST input for PHP script
    export REQUEST_METHOD=POST
    export CONTENT_TYPE="application/json"
    export HTTP_ORIGIN="http://localhost:3000"
    
    php -f chatbot-smart.php < test_input.json
    
    # Clean up
    rm test_input.json
    
else
    echo "⚠️ PHP not available for direct testing"
    echo "💡 Use the browser test instead at http://localhost:3000"
fi

echo ""
echo "✅ Testing completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Open http://localhost:3000 in browser"
echo "2. Test chatbot widget"
echo "3. Verify learning features work"
echo "4. Check feedback system"
echo "5. Review chat logs (chat_logs.txt)"