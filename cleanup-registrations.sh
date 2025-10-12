#!/bin/bash

# Cleanup script untuk registrasi HIMASI yang tidak selesai
# Script ini harus dijalankan secara berkala (misal setiap 15 menit) menggunakan cron

# Set environment variables
SITE_URL="${SITE_URL:-http://localhost:3000}"
API_KEY="${CLEANUP_API_KEY:-himasi-cleanup-2024}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[$(date)] Starting HIMASI registration cleanup...${NC}"

# Check incomplete registrations first
echo -e "${YELLOW}Checking incomplete registrations...${NC}"
CHECK_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" "$SITE_URL/api/registrations/cleanup")
CHECK_BODY=$(echo $CHECK_RESPONSE | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
CHECK_STATUS=$(echo $CHECK_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [ "$CHECK_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Incomplete registrations check successful${NC}"
    
    # Parse the response to get counts
    EXPIRED_COUNT=$(echo $CHECK_BODY | grep -o '"count":[0-9]*' | head -1 | grep -o '[0-9]*')
    RECENT_COUNT=$(echo $CHECK_BODY | grep -o '"count":[0-9]*' | tail -1 | grep -o '[0-9]*')
    
    echo -e "📊 Expired incomplete: ${EXPIRED_COUNT:-0}"
    echo -e "📊 Recent incomplete: ${RECENT_COUNT:-0}"
    
    # Only run cleanup if there are expired registrations
    if [ "${EXPIRED_COUNT:-0}" -gt 0 ]; then
        echo -e "${YELLOW}Running cleanup for $EXPIRED_COUNT expired registrations...${NC}"
        
        # Run cleanup
        CLEANUP_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
            -X POST \
            -H "Authorization: Bearer $API_KEY" \
            -H "Content-Type: application/json" \
            "$SITE_URL/api/registrations/cleanup")
        
        CLEANUP_BODY=$(echo $CLEANUP_RESPONSE | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
        CLEANUP_STATUS=$(echo $CLEANUP_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
        
        if [ "$CLEANUP_STATUS" -eq 200 ]; then
            CLEANED_UP=$(echo $CLEANUP_BODY | grep -o '"cleanedUp":[0-9]*' | grep -o '[0-9]*')
            echo -e "${GREEN}✅ Cleanup successful: ${CLEANED_UP:-0} registrations cleaned up${NC}"
            
            # Log details if available
            if command -v jq &> /dev/null; then
                echo -e "${GREEN}📋 Cleanup details:${NC}"
                echo $CLEANUP_BODY | jq -r '.data.details[]? | "  - \(.fullName) (\(.email)) from \(.activity)"'
            fi
        else
            echo -e "${RED}❌ Cleanup failed with status: $CLEANUP_STATUS${NC}"
            echo -e "${RED}Response: $CLEANUP_BODY${NC}"
        fi
    else
        echo -e "${GREEN}✅ No expired registrations to cleanup${NC}"
    fi
else
    echo -e "${RED}❌ Check failed with status: $CHECK_STATUS${NC}"
    echo -e "${RED}Response: $CHECK_BODY${NC}"
fi

echo -e "${YELLOW}[$(date)] HIMASI registration cleanup completed${NC}"
echo "----------------------------------------"