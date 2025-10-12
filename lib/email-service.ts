import * as nodemailer from 'nodemailer';

export interface RegistrationEmailData {
  fullName: string;
  email: string;
  activityTitle: string;
  activitySlug?: string;
  activityStartDate: string;
  activityLocation?: string;
  reason?: string; // untuk penolakan
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendApprovalEmail(data: RegistrationEmailData): Promise<void> {
    const approvalTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pendaftaran Disetujui - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); min-height: 100vh; padding: 20px 0;">
        
        <div style="max-width: 640px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); overflow: hidden; position: relative;">
          
          <!-- Decorative Top Border -->
          <div style="height: 6px; background: linear-gradient(90deg, #4B061A 0%, #732E39 25%, #56ab2f 50%, #a8e6cf 75%, #4B061A 100%);"></div>
          
          <!-- Header Success -->
          <div style="position: relative; background: linear-gradient(135deg, #1e3a2e 0%, #2d5a3d 100%); padding: 50px 40px; text-align: center; overflow: hidden;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: -40px; left: -40px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border-radius: 50%; opacity: 0.6;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 90px; height: 90px; background: rgba(255,255,255,0.03); border-radius: 50%; opacity: 0.8;"></div>
            
            <div style="position: relative; z-index: 2;">
              <!-- Success Icon -->
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; box-shadow: 0 15px 35px rgba(86,171,47,0.3); position: relative; overflow: hidden;">
                <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);"></div>
                <div style="color: white; font-size: 32px; font-weight: bold;">✓</div>
              </div>
              
              <div style="display: inline-block; padding: 12px 25px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(86,171,47,0.3);">
                <span style="color: white; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                  Approved
                </span>
              </div>
              
              <h1 style="color: white; margin: 0 0 8px 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                Selamat, ${data.fullName}!
              </h1>
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 16px; font-weight: 400;">
                Pendaftaran Anda telah disetujui
              </p>
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 45px 40px;">
            
            <!-- Approval Status -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); border: 1px solid #e8f5e8; border-radius: 16px; padding: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -25px; right: -25px; width: 80px; height: 80px; background: linear-gradient(135deg, #56ab2f, #a8e6cf); opacity: 0.05; border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 25px rgba(86,171,47,0.2);">
                    <div style="color: white; font-size: 24px; font-weight: bold;">✓</div>
                  </div>
                  <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">Pendaftaran Disetujui!</h2>
                  <p style="color: #6c757d; margin: 0; font-size: 15px; line-height: 1.6;">
                    Selamat! Pendaftaran Anda untuk kegiatan <strong style="color: #4B061A;">${data.activityTitle}</strong> telah disetujui oleh tim HIMASI UNAS.
                  </p>
                </div>
              </div>
            </div>

            <!-- Activity Details -->
            <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border: 1px solid #e8ecf0; border-radius: 16px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
              <div style="position: absolute; bottom: -20px; left: -20px; width: 60px; height: 60px; background: linear-gradient(135deg, #4B061A, #732E39); opacity: 0.05; border-radius: 50%;"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 10px; height: 10px; background: #4B061A; border-radius: 50%; margin-right: 12px;"></div>
                  <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">Detail Kegiatan</h3>
                </div>
                <div style="space-y: 12px;">
                  <div style="margin-bottom: 12px;">
                    <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px;">Nama Kegiatan:</span>
                    <p style="margin: 4px 0 0 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${data.activityTitle}</p>
                  </div>
                  <div style="margin-bottom: 12px;">
                    <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px;">Tanggal:</span>
                    <p style="margin: 4px 0 0 0; color: #2c3e50; font-size: 14px;">${data.activityStartDate}</p>
                  </div>
                  ${data.activityLocation ? `
                  <div>
                    <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px;">Lokasi:</span>
                    <p style="margin: 4px 0 0 0; color: #2c3e50; font-size: 14px;">${data.activityLocation}</p>
                  </div>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%); border: 1px solid #f0e8e1; border-radius: 16px; padding: 25px; margin-bottom: 30px; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background: linear-gradient(135deg, #732E39, #994555); opacity: 0.04; border-radius: 50%;"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items; margin-bottom: 20px;">
                  <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #732E39, #994555); border-radius: 3px; margin-right: 12px;"></div>
                  <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">Langkah Selanjutnya</h3>
                </div>
                <div style="background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 20px;">
                  <ul style="margin: 0; padding-left: 20px; color: #4c5563; font-size: 14px; line-height: 1.8;">
                    <li style="margin-bottom: 8px;">Hadir tepat waktu pada hari kegiatan</li>
                    <li style="margin-bottom: 8px;">Bawa identitas diri (KTM/KTP)</li>
                    <li style="margin-bottom: 8px;">Ikuti protokol kesehatan yang berlaku</li>
                    <li style="margin-bottom: 8px;">Pantau terus informasi terbaru melalui Instagram @himasi_unas</li>
                    <li>Jika ada perubahan mendadak, kami akan menginformasikan melalui email atau WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; padding: 25px 0; border-top: 1px solid #f1f3f4;">
              <h4 style="color: #4B061A; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">Butuh Bantuan?</h4>
              <a href="https://wa.me/qr/4AZXPQ4P7H4CG1" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 8px 25px rgba(37,211,102,0.2); transition: all 0.3s ease; letter-spacing: 0.3px;">
                Hubungi Kami via WhatsApp
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
                  Email dikirim pada ${new Date().toLocaleDateString('id-ID', { 
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

    const mailOptions = {
      from: `"HIMASI UNAS" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `🎉 Pendaftaran Disetujui - ${data.activityTitle}`,
      html: approvalTemplate,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendRejectionEmail(data: RegistrationEmailData): Promise<void> {
    const rejectionTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pemberitahuan Pendaftaran - HIMASI UNAS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); min-height: 100vh; padding: 20px 0;">
        
        <div style="max-width: 640px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); overflow: hidden; position: relative;">
          
          <!-- Decorative Top Border -->
          <div style="height: 6px; background: linear-gradient(90deg, #4B061A 0%, #732E39 25%, #ff6b6b 50%, #feca57 75%, #4B061A 100%);"></div>
          
          <!-- Header -->
          <div style="position: relative; background: linear-gradient(135deg, #2c2c54 0%, #40407a 100%); padding: 50px 40px; text-align: center; overflow: hidden;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: -40px; left: -40px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border-radius: 50%; opacity: 0.6;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 90px; height: 90px; background: rgba(255,255,255,0.03); border-radius: 50%; opacity: 0.8;"></div>
            
            <div style="position: relative; z-index: 2;">
              <!-- Info Icon -->
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; box-shadow: 0 15px 35px rgba(255,107,107,0.3); position: relative; overflow: hidden;">
                <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);"></div>
                <div style="color: white; font-size: 32px; font-weight: bold;">!</div>
              </div>
              
              <div style="display: inline-block; padding: 12px 25px; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); border-radius: 50px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(255,107,107,0.3);">
                <span style="color: white; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                  Information
                </span>
              </div>
              
              <h1 style="color: white; margin: 0 0 8px 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                Hai, ${data.fullName}
              </h1>
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 16px; font-weight: 400;">
                Pemberitahuan terkait pendaftaran Anda
              </p>
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 45px 40px;">
            
            <!-- Rejection Status -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%); border: 1px solid #fed7d7; border-radius: 16px; padding: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -25px; right: -25px; width: 80px; height: 80px; background: linear-gradient(135deg, #ff6b6b, #feca57); opacity: 0.05; border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 25px rgba(255,107,107,0.2);">
                    <div style="color: white; font-size: 24px; font-weight: bold;">!</div>
                  </div>
                  <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">Pendaftaran Tidak Dapat Diproses</h2>
                  <p style="color: #6c757d; margin: 0; font-size: 15px; line-height: 1.6;">
                    Mohon maaf, pendaftaran Anda untuk kegiatan <strong style="color: #4B061A;">${data.activityTitle}</strong> tidak dapat kami proses saat ini.
                  </p>
                </div>
              </div>
            </div>

            <!-- Re-registration Opportunity -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%); border: 1px solid #e0f2fe; border-radius: 16px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
              <div style="position: absolute; bottom: -20px; right: -20px; width: 60px; height: 60px; background: linear-gradient(135deg, #0ea5e9, #0284c7); opacity: 0.05; border-radius: 50%;"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 10px; height: 10px; background: #0ea5e9; border-radius: 50%; margin-right: 12px;"></div>
                  <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">Kesempatan Mendaftar Lagi</h3>
                </div>
                <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                  Jika Anda telah memperbaiki hal-hal yang menjadi alasan penolakan dan masih ada slot tersedia, Anda dapat mendaftar kembali untuk kegiatan <strong style="color: #4B061A;">${data.activityTitle}</strong>.
                </p>
                <div style="background: rgba(14, 165, 233, 0.1); border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 8px;">
                  <p style="color: #0c4a6e; margin: 0; font-size: 13px; font-weight: 500;">
                    💡 <strong>Tips:</strong> Pastikan semua persyaratan sudah dipenuhi sebelum mendaftar ulang. Hubungi kami jika ada yang kurang jelas!
                  </p>
                </div>
              </div>
            </div>

            ${data.reason ? `
            <!-- Rejection Reason -->
            <div style="background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%); border: 1px solid #f0e8e1; border-radius: 16px; padding: 25px; margin-bottom: 30px; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background: linear-gradient(135deg, #ff6b6b, #feca57); opacity: 0.04; border-radius: 50%;"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                  <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #ff6b6b, #feca57); border-radius: 3px; margin-right: 12px;"></div>
                  <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">Informasi dari Admin</h3>
                </div>
                <div style="background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 20px;">
                  <p style="margin: 0; color: #4c5563; font-size: 14px; line-height: 1.8;">
                    ${data.reason.replace(/\n/g, '<br>')}
                  </p>
                </div>
              </div>
            </div>
            ` : ''}



            <!-- Action Buttons -->
            <div style="text-align: center; padding: 25px 0; border-top: 1px solid #f1f3f4;">
              <h4 style="color: #4B061A; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">Pilihan Tindakan</h4>
              
              <!-- Primary Action - Re-register -->
              <div style="margin-bottom: 20px;">
                <a href="${data.activitySlug ? `https://himasi-unas.vercel.app/pendaftaran/` : '#'}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; text-decoration: none; padding: 18px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 30px rgba(5,150,105,0.3); transition: all 0.3s ease; letter-spacing: 0.3px; text-transform: uppercase;">
                  Daftar Ulang Sekarang
                </a>
                <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 12px;">
                  *Pastikan persyaratan sudah dipenuhi
                </p>
              </div>

              <!-- Secondary Actions -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 380px; margin: 0 auto;">
                <a href="https://wa.me/qr/4AZXPQ4P7H4CG1" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 16px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; text-align: center; display: block; box-shadow: 0 8px 25px rgba(37,211,102,0.2); transition: all 0.3s ease;">
                  WhatsApp
                </a>
                <a href="https://instagram.com/himasi_unas" style="background: linear-gradient(135deg, #E4405F 0%, #C13584 100%); color: white; text-decoration: none; padding: 16px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; text-align: center; display: block; box-shadow: 0 8px 25px rgba(228,64,95,0.2); transition: all 0.3s ease;">
                  Instagram
                </a>
              </div>
              
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #f3f4f6;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px; line-height: 1.4;">
                  Atau tunggu kegiatan menarik lainnya di HIMASI UNAS
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #2c2c54 0%, #40407a 100%); padding: 35px 40px; text-align: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -40px; left: -40px; width: 100px; height: 100px; background: rgba(255,255,255,0.02); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.02); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 2;">
              <h4 style="color: #feca57; margin: 0 0 12px 0; font-size: 20px; font-weight: 600; letter-spacing: 1px;">HIMASI UNAS</h4>
              <p style="color: rgba(254,202,87,0.7); margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                Himpunan Mahasiswa Sistem Informasi<br>
                Universitas Nasional Jakarta
              </p>
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <p style="color: rgba(255,255,255,0.4); margin: 0; font-size: 11px; line-height: 1.5;">
                  Email dikirim pada ${new Date().toLocaleDateString('id-ID', { 
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

    const mailOptions = {
      from: `"HIMASI UNAS" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `📋 Pemberitahuan Pendaftaran - ${data.activityTitle}`,
      html: rejectionTemplate,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}