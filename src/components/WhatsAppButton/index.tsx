import React from 'react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
// import { FaWhatsapp } from 'react-icons/fa';

type WhatsAppButtonProps = {
  phoneNumber: string
  message?: string
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = 'Merhaba, bilgi almak istiyorum.',
}) => {
  // Remove any non-numeric characters from the phone number
  const formattedPhone = phoneNumber.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 bg-[#25D366] hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      aria-label="WhatsApp ile iletişime geçin"
    >
      <FaWhatsapp size={28} />
    </Link>
  )
}
