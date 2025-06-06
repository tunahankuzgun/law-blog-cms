import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, topic, otherTopic, message } = body

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL,
      subject: `İletişim Formu: ${topic}${otherTopic ? ` - ${otherTopic}` : ''}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${topic}${otherTopic ? ` - ${otherTopic}` : ''}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'E-posta başarıyla gönderildi' }, { status: 200 })
  } catch (error) {
    console.error('E-posta gönderimi sırasında hata:', error)
    return NextResponse.json({ message: 'E-posta gönderilirken bir hata oluştu' }, { status: 500 })
  }
}
