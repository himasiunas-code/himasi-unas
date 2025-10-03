import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { namaLengkap, email, nomorTelepon, subjek, isiPesan } = await request.json();

    // Validasi input
    if (!namaLengkap || !email || !nomorTelepon || !subjek || !isiPesan) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Debug: Log environment variables (tanpa password)
    console.log('Environment check:', {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      CONTACT_EMAIL: process.env.CONTACT_EMAIL,
      hasPassword: !!process.env.SMTP_PASS
    });

    // Konfigurasi transporter email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true untuk port 465, false untuk port lainnya
      auth: {
        user: process.env.SMTP_USER, // Email pengirim
        pass: process.env.SMTP_PASS, // Password atau App Password
      },
    });

    // Test koneksi SMTP
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection successful');

    // Template email - Simple & Elegant
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesan Baru - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
        
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4B061A 0%, #732E39 100%); padding: 30px; text-align: center;">
            <h1 style="color: #FFE8DB; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">
              Pesan Baru dari Website
            </h1>
            <p style="color: rgba(255, 232, 219, 0.8); margin: 10px 0 0 0; font-size: 14px;">
              HIMASI UNAS - Sistem Informasi
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            
            <!-- Info Grid -->
            <div style="margin-bottom: 25px;">
              
              <!-- Nama -->
              <div style="background: #f8f9fa; padding: 18px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #4B061A;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 20px; margin-right: 15px; margin-top: 2px; flex-shrink: 0;">👤</span>
                  <div style="flex: 1;">
                    <p style="margin: 0 0 6px 0; color: #6c757d; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Nama Lengkap</p>
                    <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600; line-height: 1.3;">${namaLengkap}</p>
                  </div>
                </div>
              </div>

              <!-- Email & Phone Row -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #f8f9fa; padding: 18px; border-radius: 12px; border-left: 4px solid #732E39;">
                  <div style="display: flex; align-items: flex-start;">
                    <span style="font-size: 18px; margin-right: 12px; margin-top: 2px; flex-shrink: 0;">📧</span>
                    <div style="flex: 1; min-width: 0;">
                      <p style="margin: 0 0 6px 0; color: #6c757d; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                      <a href="mailto:${email}" style="margin: 0; color: #4B061A; font-size: 13px; font-weight: 600; text-decoration: none; display: block; word-break: break-all; line-height: 1.3;">${email}</a>
                    </div>
                  </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 18px; border-radius: 12px; border-left: 4px solid #994555;">
                  <div style="display: flex; align-items: flex-start;">
                    <span style="font-size: 18px; margin-right: 12px; margin-top: 2px; flex-shrink: 0;">📱</span>
                    <div style="flex: 1; min-width: 0;">
                      <p style="margin: 0 0 6px 0; color: #6c757d; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Telepon</p>
                      <a href="https://wa.me/${nomorTelepon.replace(/\D/g, '')}" style="margin: 0; color: #4B061A; font-size: 13px; font-weight: 600; text-decoration: none; display: block; line-height: 1.3;">${nomorTelepon}</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subjek -->
              <div style="background: #f8f9fa; padding: 18px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #FFE8DB;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 20px; margin-right: 15px; margin-top: 2px; flex-shrink: 0;">📝</span>
                  <div style="flex: 1;">
                    <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Subjek Pesan</p>
                    <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600; line-height: 1.4;">${subjek}</p>
                  </div>
                </div>
              </div>

              <!-- Pesan -->
              <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 0; border-left: 4px solid #4B061A;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 20px; margin-right: 15px; margin-top: 2px; flex-shrink: 0;">💬</span>
                  <div style="flex: 1;">
                    <p style="margin: 0 0 12px 0; color: #6c757d; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Isi Pesan</p>
                    <div style="background: white; padding: 18px; border-radius: 8px; border: 1px solid #e9ecef; margin-top: 4px;">
                      <p style="margin: 0; color: #2c3e50; font-size: 15px; line-height: 1.7; word-wrap: break-word;">
                        ${isiPesan.replace(/\n/g, '<br>')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 35px; padding-top: 30px; border-top: 2px solid #f1f3f4;">
              <p style="margin: 0 0 20px 0; color: #6c757d; font-size: 14px; font-weight: 500;">Silakan balas pesan ini:</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 400px; margin: 0 auto;">
                <a href="mailto:${email}" style="background: #4B061A; color: white; text-decoration: none; padding: 14px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; display: block; text-align: center; transition: background-color 0.2s;">
                  📧 Balas Email
                </a>
                <a href="https://wa.me/${nomorTelepon.replace(/\D/g, '')}" style="background: #25D366; color: white; text-decoration: none; padding: 14px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; display: block; text-align: center; transition: background-color 0.2s;">
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 2px solid #e9ecef; margin-top: 0;">
            <h4 style="margin: 0 0 10px 0; color: #4B061A; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">HIMASI UNAS</h4>
            <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px; line-height: 1.5;">Himpunan Mahasiswa Sistem Informasi<br>Universitas Nasional Jakarta</p>
            <p style="margin: 0; color: #adb5bd; font-size: 12px; line-height: 1.4;">
              Dikirim otomatis pada ${new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    // Konfigurasi email
    const mailOptions = {
      from: `"HIMASI UNAS Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'himasiunas@gmail.com', // Email tujuan
      subject: `[HIMASI UNAS] ${subjek} - dari ${namaLengkap}`,
      html: htmlTemplate,
      replyTo: email, // Memungkinkan reply langsung ke pengirim
    };

    // Kirim email
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    // Template konfirmasi - Simple & Elegant
    const confirmationTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Pesan - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
        
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header Success -->
          <div style="background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); padding: 30px; text-align: center;">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 28px;">
              ✅
            </div>
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
              Terima Kasih, ${namaLengkap}!
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
              Pesan Anda telah berhasil dikirim
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            
            <!-- Success Message -->
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #56ab2f; margin-bottom: 20px;">
                <span style="font-size: 24px; margin-bottom: 10px; display: block;">🎉</span>
                <h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Pesan Terkirim Sukses!</h2>
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  Terima kasih telah menghubungi <strong style="color: #4B061A;">HIMASI UNAS</strong>. 
                  Pesan dengan subjek "<strong>${subjek}</strong>" telah kami terima.
                </p>
              </div>
            </div>

            <!-- Timeline Info -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #4B061A;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 20px; margin-right: 12px;">⏰</span>
                <h3 style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">Waktu Respons</h3>
              </div>
              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                Tim kami akan merespons dalam waktu <strong>1x24 jam</strong> pada hari kerja. 
                Untuk hal urgent, hubungi kami via WhatsApp.
              </p>
            </div>

            <!-- Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #732E39;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 20px; margin-right: 12px;">📋</span>
                <h3 style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">Ringkasan Pesan</h3>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;">
                <div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f1f3f4;">
                  <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; font-weight: 500;">Subjek:</span>
                  <p style="margin: 2px 0 0 0; color: #2c3e50; font-size: 14px; font-weight: 600;">${subjek}</p>
                </div>
                <div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f1f3f4;">
                  <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; font-weight: 500;">Email:</span>
                  <p style="margin: 2px 0 0 0; color: #2c3e50; font-size: 14px;">${email}</p>
                </div>
                <div>
                  <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; font-weight: 500;">Telepon:</span>
                  <p style="margin: 2px 0 0 0; color: #2c3e50; font-size: 14px;">${nomorTelepon}</p>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px;">Butuh respon cepat?</p>
              <a href="https://wa.me/6281234567890" style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                💬 Chat WhatsApp
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <h4 style="margin: 0 0 8px 0; color: #4B061A; font-size: 16px; font-weight: 600;">HIMASI UNAS</h4>
            <p style="margin: 0 0 12px 0; color: #6c757d; font-size: 13px;">Himpunan Mahasiswa Sistem Informasi<br>Universitas Nasional Jakarta</p>
            <p style="margin: 0; color: #adb5bd; font-size: 11px;">
              Email konfirmasi dikirim pada ${new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    const confirmationOptions = {
      from: `"HIMASI UNAS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Konfirmasi: Pesan Anda telah diterima - ${subjek}`,
      html: confirmationTemplate,
    };

    console.log('Sending confirmation email...');
    await transporter.sendMail(confirmationOptions);
    console.log('Confirmation email sent successfully');

    return NextResponse.json(
      { message: 'Pesan berhasil dikirim' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log detailed error untuk debugging di Vercel
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Gagal mengirim pesan',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
      },
      { status: 500 }
    );
  }
}