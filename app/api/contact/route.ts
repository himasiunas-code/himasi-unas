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

    // Template email - Design eksklusif dan modern
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesan Baru - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
        
        <!-- Main Container -->
        <div style="max-width: 650px; margin: 0 auto; padding: 40px 20px; background: transparent;">
          
          <!-- Header dengan Logo dan Brand -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, #4B061A 0%, #732E39 50%, #994555 100%); border-radius: 25px; box-shadow: 0 20px 40px rgba(75, 6, 26, 0.3); position: relative; overflow: hidden;">
              <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: shimmer 3s ease-in-out infinite;"></div>
              <h1 style="color: #FFE8DB; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); position: relative; z-index: 1;">
                ✨ HIMASI UNAS ✨
              </h1>
              <p style="color: #FFE8DB; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; letter-spacing: 1px; position: relative; z-index: 1;">
                HIMPUNAN MAHASISWA SISTEM INFORMASI
              </p>
            </div>
          </div>

          <!-- Alert Badge -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #ff6b6b, #ee5a24); border-radius: 50px; box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);">
              <span style="color: white; font-size: 14px; font-weight: 600; letter-spacing: 1px;">
                🚨 PESAN BARU MASUK 🚨
              </span>
            </div>
          </div>

          <!-- Main Content Card -->
          <div style="background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%); border-radius: 25px; box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1); overflow: hidden; position: relative;">
            
            <!-- Decorative Header -->
            <div style="height: 6px; background: linear-gradient(90deg, #4B061A 0%, #732E39 25%, #994555 50%, #732E39 75%, #4B061A 100%);"></div>
            
            <!-- Content -->
            <div style="padding: 40px 35px;">
              
              <!-- Title Section -->
              <div style="text-align: center; margin-bottom: 35px;">
                <h2 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                  📩 Detail Pesan Kontak
                </h2>
                <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #4B061A, #732E39); margin: 15px auto; border-radius: 2px;"></div>
                <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 14px;">
                  Diterima pada ${new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <!-- Contact Info Cards -->
              <div style="display: grid; gap: 20px; margin-bottom: 30px;">
                
                <!-- Nama Card -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 20px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                  <div style="display: flex; align-items: center; position: relative; z-index: 1;">
                    <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                      <span style="font-size: 24px;">👤</span>
                    </div>
                    <div>
                      <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Nama Lengkap</p>
                      <p style="color: white; margin: 5px 0 0 0; font-size: 18px; font-weight: 600;">${namaLengkap}</p>
                    </div>
                  </div>
                </div>

                <!-- Email & Phone Row -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <!-- Email Card -->
                  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 15px; padding: 20px; position: relative; overflow: hidden;">
                    <div style="position: absolute; bottom: -15px; right: -15px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    <div style="position: relative; z-index: 1;">
                      <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <span style="font-size: 20px;">📧</span>
                      </div>
                      <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Email</p>
                      <a href="mailto:${email}" style="color: white; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-decoration: none; display: block; word-break: break-all;">${email}</a>
                    </div>
                  </div>

                  <!-- Phone Card -->
                  <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 15px; padding: 20px; position: relative; overflow: hidden;">
                    <div style="position: absolute; bottom: -15px; left: -15px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    <div style="position: relative; z-index: 1;">
                      <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <span style="font-size: 20px;">📱</span>
                      </div>
                      <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Telepon</p>
                      <a href="https://wa.me/${nomorTelepon.replace(/\D/g, '')}" style="color: white; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-decoration: none; display: block;">${nomorTelepon}</a>
                    </div>
                  </div>
                </div>

                <!-- Subject Card -->
                <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 15px; padding: 25px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                  <div style="display: flex; align-items: center; position: relative; z-index: 1;">
                    <div style="width: 55px; height: 55px; background: rgba(255,255,255,0.2); border-radius: 15px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
                      <span style="font-size: 28px;">📝</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Subjek Pesan</p>
                      <p style="color: white; margin: 8px 0 0 0; font-size: 20px; font-weight: 700; line-height: 1.3;">${subjek}</p>
                    </div>
                  </div>
                </div>

                <!-- Message Card -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 30px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                  <div style="position: absolute; bottom: -20px; left: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                  <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                      <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                        <span style="font-size: 24px;">💬</span>
                      </div>
                      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Isi Pesan</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 25px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);">
                      <p style="color: white; margin: 0; font-size: 16px; line-height: 1.8; font-weight: 400;">
                        ${isiPesan.replace(/\n/g, '<br>')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Section -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px dashed #e0e0e0;">
                <div style="background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 15px; padding: 25px; margin-bottom: 25px;">
                  <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">⚡ Action Required</h3>
                  <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px; line-height: 1.5;">
                    Silakan balas email ini atau hubungi pengirim langsung untuk memberikan respons terbaik.
                  </p>
                </div>
                
                <!-- Quick Actions -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                  <a href="mailto:${email}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; display: block; transition: transform 0.2s;">
                    📧 Balas Email
                  </a>
                  <a href="https://wa.me/${nomorTelepon.replace(/\D/g, '')}" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 15px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; display: block; transition: transform 0.2s;">
                    💬 WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px;">
            <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 20px; padding: 30px; position: relative; overflow: hidden; box-shadow: 0 15px 35px rgba(30, 60, 114, 0.3);">
              <div style="position: absolute; top: -50px; left: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -30px; right: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
              <div style="position: relative; z-index: 1;">
                <h3 style="color: #FFE8DB; margin: 0 0 15px 0; font-size: 22px; font-weight: 700; letter-spacing: 1px;">
                  HIMASI UNAS
                </h3>
                <p style="color: rgba(255, 232, 219, 0.8); margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                  Himpunan Mahasiswa Sistem Informasi<br>
                  Universitas Nasional Jakarta
                </p>
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
                  <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
                    Email otomatis dikirim pada ${new Date().toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}<br>
                    Melalui sistem kontak website HIMASI UNAS
                  </p>
                </div>
              </div>
            </div>
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

    // Template konfirmasi - Design eksklusif untuk pengirim
    const confirmationTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Pesan - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        
        <!-- Main Container -->
        <div style="max-width: 650px; margin: 0 auto; padding: 40px 20px;">
          
          <!-- Success Animation Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 50%; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2); margin-bottom: 20px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%); animation: shimmer 2s infinite;"></div>
                <span style="font-size: 40px; position: relative; z-index: 1;">✅</span>
              </div>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">
              Terima Kasih, ${namaLengkap}! 🙏
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 16px; font-weight: 500;">
              Pesan Anda telah berhasil dikirim
            </p>
          </div>

          <!-- Main Content Card -->
          <div style="background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%); border-radius: 25px; box-shadow: 0 25px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1); overflow: hidden; position: relative;">
            
            <!-- Decorative Header -->
            <div style="height: 6px; background: linear-gradient(90deg, #56ab2f 0%, #a8e6cf 50%, #56ab2f 100%);"></div>
            
            <!-- Content -->
            <div style="padding: 40px 35px;">
              
              <!-- Status Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50px; box-shadow: 0 10px 25px rgba(86, 171, 47, 0.3);">
                  <span style="color: white; font-size: 16px; font-weight: 600; letter-spacing: 1px;">
                    ✨ PESAN TERKIRIM SUKSES ✨
                  </span>
                </div>
              </div>

              <!-- Personal Message -->
              <div style="text-align: center; margin-bottom: 35px;">
                <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                  Halo ${namaLengkap}! 👋
                </h2>
                <p style="color: #34495e; margin: 0; font-size: 16px; line-height: 1.7;">
                  Terima kasih telah menghubungi <strong style="color: #4B061A;">HIMASI UNAS</strong>. 
                  Pesan Anda dengan subjek "<strong style="color: #732E39;">${subjek}</strong>" telah berhasil kami terima dan akan segera diproses oleh tim kami.
                </p>
              </div>

              <!-- Timeline Card -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                      <span style="font-size: 24px;">⏰</span>
                    </div>
                    <h3 style="color: white; margin: 0; font-size: 18px; font-weight: 600;">Waktu Respons</h3>
                  </div>
                  <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 15px; line-height: 1.6;">
                    Tim kami akan merespons pesan Anda dalam waktu <strong>1x24 jam</strong> pada hari kerja. 
                    Untuk hal yang urgent, silakan hubungi kami langsung melalui WhatsApp.
                  </p>
                </div>
              </div>

              <!-- Summary Card -->
              <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <h3 style="color: white; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                    <span style="margin-right: 10px; font-size: 24px;">📋</span>
                    Ringkasan Pesan Anda
                  </h3>
                  <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 20px; backdrop-filter: blur(10px);">
                    <div style="display: grid; gap: 12px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">Subjek:</span>
                        <span style="color: white; font-size: 14px; font-weight: 600;">${subjek}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">Email:</span>
                        <span style="color: white; font-size: 14px; font-weight: 600;">${email}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">Telepon:</span>
                        <span style="color: white; font-size: 14px; font-weight: 600;">${nomorTelepon}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div style="text-align: center; margin-top: 40px;">
                <p style="color: #7f8c8d; margin: 0 0 20px 0; font-size: 14px;">
                  Ingin menghubungi kami langsung?
                </p>
                <a href="https://wa.me/6281234567890" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3); transition: transform 0.2s;">
                  💬 Chat WhatsApp
                </a>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px;">
            <div style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">
                HIMASI UNAS
              </h3>
              <p style="color: rgba(255,255,255,0.8); margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                Himpunan Mahasiswa Sistem Informasi<br>
                Universitas Nasional Jakarta
              </p>
              <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
                <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
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