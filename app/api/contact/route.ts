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

    // Konfigurasi transporter email
    // Anda perlu mengganti dengan konfigurasi email server Anda
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true untuk port 465, false untuk port lainnya
      auth: {
        user: process.env.SMTP_USER, // Email pengirim
        pass: process.env.SMTP_PASS, // Password atau App Password
      },
    });

    // Template email
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #4B061A, #732E39); padding: 30px; border-radius: 15px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; text-align: center; font-size: 24px;">
            Pesan Baru dari Website HIMASI UNAS
          </h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #4B061A; margin-top: 0; border-bottom: 2px solid #4B061A; padding-bottom: 10px;">
            Detail Pesan
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #732E39; margin-bottom: 5px; font-size: 16px;">👤 Nama Lengkap:</h3>
            <p style="margin: 0; padding: 10px; background-color: #f8f9fa; border-radius: 8px;">${namaLengkap}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #732E39; margin-bottom: 5px; font-size: 16px;">📧 Email:</h3>
            <p style="margin: 0; padding: 10px; background-color: #f8f9fa; border-radius: 8px;">
              <a href="mailto:${email}" style="color: #4B061A; text-decoration: none;">${email}</a>
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #732E39; margin-bottom: 5px; font-size: 16px;">📱 Nomor Telepon:</h3>
            <p style="margin: 0; padding: 10px; background-color: #f8f9fa; border-radius: 8px;">
              <a href="https://wa.me/${nomorTelepon.replace(/\D/g, '')}" style="color: #4B061A; text-decoration: none;">${nomorTelepon}</a>
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #732E39; margin-bottom: 5px; font-size: 16px;">📝 Subjek:</h3>
            <p style="margin: 0; padding: 10px; background-color: #f8f9fa; border-radius: 8px; font-weight: bold;">${subjek}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #732E39; margin-bottom: 5px; font-size: 16px;">💬 Isi Pesan:</h3>
            <div style="margin: 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; line-height: 1.6;">
              ${isiPesan.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              Pesan ini dikirim melalui form kontak website HIMASI UNAS<br>
              Tanggal: ${new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <div style="display: inline-block; padding: 15px; background: linear-gradient(135deg, #4B061A, #732E39); border-radius: 10px;">
            <p style="color: white; margin: 0; font-size: 14px;">
              <strong>HIMASI UNAS</strong><br>
              Himpunan Mahasiswa Sistem Informasi<br>
              Universitas Nasional
            </p>
          </div>
        </div>
      </div>
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
    await transporter.sendMail(mailOptions);

    // Optional: Kirim email konfirmasi ke pengirim
    const confirmationTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #4B061A, #732E39); padding: 30px; border-radius: 15px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; text-align: center; font-size: 24px;">
            Terima Kasih ${namaLengkap}!
          </h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #4B061A; margin-top: 0;">Pesan Anda Telah Diterima</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Halo <strong>${namaLengkap}</strong>,
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Terima kasih telah menghubungi HIMASI UNAS. Pesan Anda dengan subjek "<strong>${subjek}</strong>" telah kami terima dan akan segera kami proses.
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Tim kami akan merespons pesan Anda dalam waktu 1x24 jam pada hari kerja. Jika ada hal yang urgent, Anda dapat menghubungi kami langsung melalui WhatsApp di nomor yang tersedia di website.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #4B061A; margin-top: 0;">Ringkasan Pesan Anda:</h3>
            <p style="margin: 5px 0;"><strong>Subjek:</strong> ${subjek}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Telepon:</strong> ${nomorTelepon}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            Salam hangat,<br>
            <strong>Tim HIMASI UNAS</strong>
          </p>
        </div>
      </div>
    `;

    const confirmationOptions = {
      from: `"HIMASI UNAS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Konfirmasi: Pesan Anda telah diterima - ${subjek}`,
      html: confirmationTemplate,
    };

    await transporter.sendMail(confirmationOptions);

    return NextResponse.json(
      { message: 'Pesan berhasil dikirim' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim pesan' },
      { status: 500 }
    );
  }
}