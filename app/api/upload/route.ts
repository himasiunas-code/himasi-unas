import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, JPEG, PNG allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Convert file to bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `instagram-proof-${timestamp}-${randomStr}.${fileExtension}`
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // Directory might already exist, continue
    }

    // Save file to public/uploads directory
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)
    
    // Return the public URL
    const fileUrl = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: fileUrl,
        filename: filename,
        size: file.size,
        type: file.type
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