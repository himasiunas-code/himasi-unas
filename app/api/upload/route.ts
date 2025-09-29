import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'instagram-proof'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `File type ${file.type} not allowed. Only JPG, JPEG, PNG, WEBP are supported.` },
        { status: 400 }
      )
    }

    // Validate file size (10MB max for activity images, 5MB for others)
    const maxSize = type === 'activity-image' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = type === 'activity-image' ? '10MB' : '5MB'
      const currentSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json(
        { success: false, message: `File too large (${currentSizeMB}MB). Maximum size is ${maxSizeMB}. Please compress your image.` },
        { status: 400 }
      )
    }

    // Convert file to base64 for serverless compatibility
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type

    // Generate unique filename for reference
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    
    let filename: string
    switch (type) {
      case 'activity-image':
        filename = `activity-${timestamp}-${randomStr}.${fileExtension}`
        break
      case 'instagram-proof':
      default:
        filename = `instagram-proof-${timestamp}-${randomStr}.${fileExtension}`
        break
    }

    // For serverless environments like Vercel, return base64 data URL
    // This ensures compatibility without filesystem dependencies
    const dataUrl = `data:${mimeType};base64,${base64}`

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    console.log(`📁 File processed successfully:`)
    console.log(`   - Filename: ${filename}`)
    console.log(`   - Size: ${fileSizeMB}MB (${file.size} bytes)`)
    console.log(`   - Type: ${file.type}`)
    console.log(`   - Upload Type: ${type}`)
    console.log(`   - Base64 length: ${base64.length} chars`)

    return NextResponse.json({
      success: true,
      message: `File processed successfully (${fileSizeMB}MB)`,
      data: {
        url: dataUrl,
        filename: filename,
        size: file.size,
        type: file.type,
        uploadType: type,
        processingMethod: 'base64-dataurl'
      }
    })

  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process file', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}