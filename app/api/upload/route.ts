import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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
        { success: false, message: 'Invalid file type. Only JPG, JPEG, PNG, WEBP allowed' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max for activity images, 5MB for others)
    const maxSize = type === 'activity-image' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = type === 'activity-image' ? '10MB' : '5MB'
      return NextResponse.json(
        { success: false, message: `File too large. Maximum size is ${maxSizeMB}` },
        { status: 400 }
      )
    }

    // Convert file to bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename based on type
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    
    let filename: string
    let uploadSubDir: string

    switch (type) {
      case 'activity-image':
        filename = `activity-${timestamp}-${randomStr}.${fileExtension}`
        uploadSubDir = 'activities'
        break
      case 'instagram-proof':
      default:
        filename = `instagram-proof-${timestamp}-${randomStr}.${fileExtension}`
        uploadSubDir = 'registrations'
        break
    }
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', uploadSubDir)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // Directory might already exist, continue
    }

    // Save file to public/uploads directory
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)
    
    // Return the public URL
    const fileUrl = `/uploads/${uploadSubDir}/${filename}`

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: fileUrl,
        filename: filename,
        size: file.size,
        type: file.type,
        uploadType: type
      }
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    )
  }
}