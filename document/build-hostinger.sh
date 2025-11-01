#!/bin/bash
# Build script untuk deploy ke Hostinger

echo "🚀 Building HIMASI UNAS for Hostinger..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 3: Generate Prisma client
echo "🗄️ Generating Prisma client..."
npm run db:generate

# Step 4: Build Next.js app
echo "🔨 Building Next.js application..."
npm run build

# Step 5: Export static files
echo "📤 Exporting static files..."
npm run export

# Step 6: Create upload-ready structure
echo "📁 Preparing files for upload..."
mkdir -p hostinger-upload

# Copy static files
cp -r out/* hostinger-upload/

# Copy PHP backend
mkdir -p hostinger-upload/api
cp php-backend/*.php hostinger-upload/api/

# Copy uploads directory
mkdir -p hostinger-upload/uploads
cp public/uploads/.gitkeep hostinger-upload/uploads/

# Create .htaccess
cat > hostinger-upload/.htaccess << EOF
# Enable mod_rewrite
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^admin/ /admin/index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
EOF

echo "✅ Build completed!"
echo "📂 Files ready for upload in 'hostinger-upload' folder"
echo ""
echo "📋 Next steps:"
echo "1. Login to Hostinger hPanel"
echo "2. Go to File Manager → public_html"
echo "3. Upload all files from 'hostinger-upload' folder"
echo "4. Setup database connection"
echo "5. Test website functionality"