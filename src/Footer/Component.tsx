// import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import {
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaMapPin,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa'

export async function Footer() {
  // const footerData: Footer = await getCachedGlobal('footer', 1)()

  // const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto py-5 border-t-2 border-gray-300 bg-black dark:bg-card text-white">
      <div className="container flex items-center justify-between flex-wrap gap-12 sm:gap-14">
        <div className="flex-1 flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <Logo href="/" className="flex-shrink-0 !max-w-[50px]" theme="dark" />
            <h1 className="text-xl dark:text-white">theblog by Kuzgun</h1>
          </div>
          <p className="font-light dark:text-gray-300">
            Bilgiç Hukuk Bürosu olarak güvenli, şeffaf ve etkin çözümler sunuyoruz. Adaletinize
            rehberlik etmek için buradayız.
          </p>
          <div className="mt-2.5 flex sm:justify-start justify-center gap-2.5">
            <FaFacebook size={24} />
            <FaYoutube size={24} />
            <FaLinkedinIn size={24} />
            <FaInstagram size={24} />
          </div>
        </div>
        <div className="flex-1 flex lg:justify-end lg:gap-[100px] gap-[30px] w-full justify-around text-sm lg:text-base">
          <div className="flex flex-col gap-2.5 font-light">
            <span className="font-bold dark:text-white">Sayfalar</span>
            <CMSLink className="" url="/makaleler">
              Makaleler
            </CMSLink>
            <CMSLink className="" url="/hakkimizda">
              Hakkımızda
            </CMSLink>
            <CMSLink className="" url="/calisma-alanlari">
              Çalışma Alanları
            </CMSLink>
            <CMSLink className="" url="/iletisim">
              İletişim
            </CMSLink>
          </div>
          <div className="flex flex-col gap-2.5 text-sm font-light">
            <span className="font-bold dark:text-white">İletişim</span>
            <div className="flex items-center gap-2">
              <FaMapPin size={16} />
              <p className="text-white">Şişli, İstanbul</p>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone size={16} />
              <p className="text-white">+90 555 555 55 55</p>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope size={16} />
              <p className="text-white">info@theblog.com</p>
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-[69px]">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  )
}
