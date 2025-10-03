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

    // Template email - Exclusive & Premium Design
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesan Baru - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px 0;">
        
        <div style="max-width: 640px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); overflow: hidden; position: relative;">
          
          <!-- Decorative Top Border -->
          <div style="height: 6px; background: linear-gradient(90deg, #4B061A 0%, #732E39 25%, #994555 50%, #FFE8DB 75%, #4B061A 100%);"></div>
          
          <!-- Header -->
          <div style="position: relative; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 50px 40px; text-align: center; overflow: hidden;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: -50px; left: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%; opacity: 0.6;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.03); border-radius: 50%; opacity: 0.8;"></div>
            
            <div style="position: relative; z-index: 2;">
              <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #4B061A 0%, #732E39 100%); border-radius: 50px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(75,6,26,0.3);">
                <h1 style="color: #FFE8DB; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                  New Message
                </h1>
              </div>
              <h2 style="color: white; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 1px;">
                HIMASI UNAS
              </h2>
              <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0 0; font-size: 14px; font-weight: 400; letter-spacing: 0.5px;">
                Contact Form Submission
              </p>
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 45px 40px;">
            
            <!-- Contact Information -->
            <div style="margin-bottom: 40px;">
              <h3 style="color: #2c3e50; margin: 0 0 30px 0; font-size: 22px; font-weight: 600; text-align: center; position: relative;">
                Contact Details
                <div style="width: 50px; height: 3px; background: linear-gradient(90deg, #4B061A, #732E39); margin: 12px auto; border-radius: 2px;"></div>
              </h3>
              
              <!-- Name Section -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border: 1px solid #e8ecf0; border-radius: 16px; padding: 25px; margin-bottom: 20px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 60px; height: 60px; background: linear-gradient(135deg, #4B061A, #732E39); opacity: 0.05; border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="width: 8px; height: 8px; background: #4B061A; border-radius: 50%; margin-right: 12px;"></div>
                    <span style="color: #6c757d; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Full Name</span>
                  </div>
                  <h4 style="color: #2c3e50; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.3px;">${namaLengkap}</h4>
                </div>
              </div>

              <!-- Contact Info Grid -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Email -->
                <div style="background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%); border: 1px solid #e1e8f0; border-radius: 16px; padding: 20px; position: relative; overflow: hidden;">
                  <div style="position: absolute; bottom: -15px; right: -15px; width: 40px; height: 40px; background: linear-gradient(135deg, #732E39, #994555); opacity: 0.08; border-radius: 50%;"></div>
                  <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <div style="width: 6px; height: 6px; background: #732E39; border-radius: 50%; margin-right: 10px;"></div>
                      <span style="color: #6c757d; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">Email</span>
                    </div>
                    <a href="mailto:${email}" style="color: #2c3e50; font-size: 14px; font-weight: 600; text-decoration: none; display: block; word-break: break-all; line-height: 1.4;">${email}</a>
                  </div>
                </div>

                <!-- Phone -->
                <div style="background: linear-gradient(135deg, #fff0f4 0%, #ffffff 100%); border: 1px solid #f0e1e8; border-radius: 16px; padding: 20px; position: relative; overflow: hidden;">
                  <div style="position: absolute; bottom: -15px; left: -15px; width: 40px; height: 40px; background: linear-gradient(135deg, #994555, #FFE8DB); opacity: 0.08; border-radius: 50%;"></div>
                  <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <div style="width: 6px; height: 6px; background: #994555; border-radius: 50%; margin-right: 10px;"></div>
                      <span style="color: #6c757d; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">Phone</span>
                    </div>
                    <a href="https://wa.me/${nomorTelepon.replace(/\D/g, '')}" style="color: #2c3e50; font-size: 14px; font-weight: 600; text-decoration: none; display: block; line-height: 1.4;">${nomorTelepon}</a>
                  </div>
                </div>
              </div>

              <!-- Subject -->
              <div style="background: linear-gradient(135deg, #fffaf0 0%, #ffffff 100%); border: 1px solid #f0ebe1; border-radius: 16px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -25px; left: -25px; width: 70px; height: 70px; background: linear-gradient(135deg, #FFE8DB, #4B061A); opacity: 0.04; border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="width: 10px; height: 10px; background: #FFE8DB; border: 2px solid #4B061A; border-radius: 50%; margin-right: 12px;"></div>
                    <span style="color: #6c757d; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Subject</span>
                  </div>
                  <h4 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600; line-height: 1.4; letter-spacing: 0.2px;">${subjek}</h4>
                </div>
              </div>

              <!-- Message -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border: 1px solid #e8ecf0; border-radius: 16px; padding: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background: linear-gradient(135deg, #4B061A, #732E39); opacity: 0.03; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -20px; left: -20px; width: 60px; height: 60px; background: linear-gradient(135deg, #732E39, #994555); opacity: 0.03; border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #4B061A, #732E39); border-radius: 3px; margin-right: 12px;"></div>
                    <span style="color: #6c757d; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Message Content</span>
                  </div>
                  <div style="background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 25px; backdrop-filter: blur(10px);">
                    <p style="color: #2c3e50; margin: 0; font-size: 16px; line-height: 1.8; font-weight: 400; letter-spacing: 0.2px;">
                      ${isiPesan.replace(/\n/g, '<br>')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Section -->
            <div style="text-align: center; padding: 30px 0; border-top: 1px solid #f1f3f4; margin-top: 20px;">
              <h4 style="color: #4B061A; margin: 0 0 25px 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">Take Action</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 380px; margin: 0 auto;">
                <a href="mailto:${email}" style="background: linear-gradient(135deg, #4B061A 0%, #732E39 100%); color: white; text-decoration: none; padding: 16px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; text-align: center; display: block; box-shadow: 0 8px 25px rgba(75,6,26,0.2); transition: all 0.3s ease;">
                  Reply via Email
                </a>
                <a href="https://wa.me/${nomorTelepon.replace(/\D/g, '')}" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 16px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; text-align: center; display: block; box-shadow: 0 8px 25px rgba(37,211,102,0.2); transition: all 0.3s ease;">
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 35px 40px; text-align: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -40px; left: -40px; width: 100px; height: 100px; background: rgba(255,255,255,0.02); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.02); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 2;">
              <h4 style="color: #FFE8DB; margin: 0 0 12px 0; font-size: 20px; font-weight: 600; letter-spacing: 1px;">HIMASI UNAS</h4>
              <p style="color: rgba(255,232,219,0.7); margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                Himpunan Mahasiswa Sistem Informasi<br>
                Universitas Nasional Jakarta
              </p>
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <p style="color: rgba(255,255,255,0.4); margin: 0; font-size: 11px; line-height: 1.5;">
                  Automated message sent on ${new Date().toLocaleDateString('id-ID', { 
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

    // Template konfirmasi - Exclusive & Premium Design
    const confirmationTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Pesan - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); min-height: 100vh; padding: 20px 0;">
        
        <div style="max-width: 640px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); overflow: hidden; position: relative;">
          
          <!-- Decorative Top Border -->
          <div style="height: 6px; background: linear-gradient(90deg, #56ab2f 0%, #a8e6cf 25%, #4CAF50 50%, #8BC34A 75%, #56ab2f 100%);"></div>
          
          <!-- Header Success -->
          <div style="position: relative; background: linear-gradient(135deg, #1e3a2e 0%, #2d5a3d 100%); padding: 50px 40px; text-align: center; overflow: hidden;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: -40px; left: -40px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border-radius: 50%; opacity: 0.6;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 90px; height: 90px; background: rgba(255,255,255,0.03); border-radius: 50%; opacity: 0.8;"></div>
            
            <div style="position: relative; z-index: 2;">
              <!-- Success Icon -->
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; box-shadow: 0 15px 35px rgba(86,171,47,0.3); position: relative; overflow: hidden;">
                <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);"></div>
              </div>
              
              <div style="display: inline-block; padding: 12px 25px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(86,171,47,0.3);">
                <span style="color: white; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                  Success
                </span>
              </div>
              
              <h1 style="color: white; margin: 0 0 8px 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                Thank You, ${namaLengkap}!
              </h1>
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 16px; font-weight: 400;">
                Your message has been sent successfully
              </p>
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 45px 40px;">
            
            <!-- Success Status -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); border: 1px solid #e8f5e8; border-radius: 16px; padding: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -25px; right: -25px; width: 80px; height: 80px; background: linear-gradient(135deg, #56ab2f, #a8e6cf); opacity: 0.05; border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 25px rgba(86,171,47,0.2);">
                  </div>
                  <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">Message Delivered Successfully!</h2>
                  <p style="color: #6c757d; margin: 0; font-size: 15px; line-height: 1.6;">
                    Thank you for contacting <strong style="color: #4B061A;">HIMASI UNAS</strong>. 
                    Your message with subject "<strong>${subjek}</strong>" has been received by our team.
                  </p>
                </div>
              </div>
            </div>

            <!-- Response Timeline -->
            <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border: 1px solid #e8ecf0; border-radius: 16px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
              <div style="position: absolute; bottom: -20px; left: -20px; width: 60px; height: 60px; background: linear-gradient(135deg, #4B061A, #732E39); opacity: 0.05; border-radius: 50%;"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 10px; height: 10px; background: #4B061A; border-radius: 50%; margin-right: 12px;"></div>
                  <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">Response Timeline</h3>
                </div>
                <p style="color: #6c757d; margin: 0; font-size: 14px; line-height: 1.6;">
                  Our team will respond to your message within <strong>24 hours</strong> during business days. 
                  For urgent matters, please contact us directly via WhatsApp.
                </p>
              </div>
            </div>

            <!-- Message Summary -->
            <div style="background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%); border: 1px solid #f0e8e1; border-radius: 16px; padding: 25px; margin-bottom: 30px; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background: linear-gradient(135deg, #732E39, #994555); opacity: 0.04; border-radius: 50%;"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                  <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #732E39, #994555); border-radius: 3px; margin-right: 12px;"></div>
                  <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">Message Summary</h3>
                </div>
                <div style="background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 20px;">
                  <div style="margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #f1f3f4;">
                    <span style="color: #6c757d; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px;">Subject:</span>
                    <p style="margin: 4px 0 0 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${subjek}</p>
                  </div>
                  <div style="margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #f1f3f4;">
                    <span style="color: #6c757d; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px;">Email:</span>
                    <p style="margin: 4px 0 0 0; color: #2c3e50; font-size: 14px;">${email}</p>
                  </div>
                  <div>
                    <span style="color: #6c757d; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px;">Phone:</span>
                    <p style="margin: 4px 0 0 0; color: #2c3e50; font-size: 14px;">${nomorTelepon}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Contact -->
            <div style="text-align: center; padding: 25px 0; border-top: 1px solid #f1f3f4;">
              <h4 style="color: #56ab2f; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">Need Quick Response?</h4>
              <a href="https://wa.me/qr/4AZXPQ4P7H4CG1" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 8px 25px rgba(37,211,102,0.2); transition: all 0.3s ease; letter-spacing: 0.3px;">
                Contact via WhatsApp
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #1e3a2e 0%, #2d5a3d 100%); padding: 35px 40px; text-align: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -40px; left: -40px; width: 100px; height: 100px; background: rgba(255,255,255,0.02); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.02); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 2;">
              <h4 style="color: #a8e6cf; margin: 0 0 12px 0; font-size: 20px; font-weight: 600; letter-spacing: 1px;">HIMASI UNAS</h4>
              <p style="color: rgba(168,230,207,0.7); margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                Himpunan Mahasiswa Sistem Informasi<br>
                Universitas Nasional Jakarta
              </p>
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <p style="color: rgba(255,255,255,0.4); margin: 0; font-size: 11px; line-height: 1.5;">
                  Confirmation email sent on ${new Date().toLocaleDateString('id-ID', { 
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