import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import Image from 'next/image'
import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Facebook, FacebookIcon, Instagram, Linkedin, Youtube } from 'lucide-react'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto py-5 border-t-2 border-gray-300 bg-black dark:bg-card text-white">
      <div className="container flex items-center justify-between flex-wrap gap-12 sm:gap-14">
        <div className="flex-1 flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <Logo href="/" className="flex-shrink-0 !max-w-[50px]" theme="dark" />
            <h1 className="text-xl dark:text-white">theblog by Kuzgun</h1>
          </div>
          <p className="font-light dark:text-gray-300">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim necessitatibus similique
            aspernatur obcaecati veritatis. Aperiam cum porro sequi, totam minima consequuntur,
            aspernatur deleniti vero repellendus dorales.
          </p>
          <div className="mt-2.5 flex gap-2.5">
            <Facebook width={24} height={24} />
            <Youtube width={24} height={24} />
            <Linkedin width={24} height={24} />
            <Instagram width={24} height={24} />
            {/* <Image src="/" alt="facebook" width={18} height={18} />
            <Image src="/" alt="instagram" width={18} height={18} />
            <Image src="/" alt="tiktok" width={18} height={18} />
            <Image src="/" alt="youtube" width={18} height={18} /> */}
          </div>
        </div>
        <div className="flex-1 flex lg:justify-end lg:gap-[100px] gap-[50px] w-full justify-between text-sm lg:text-base">
          <div className="flex flex-col gap-2.5 font-light">
            <span className="font-bold dark:text-white">Links</span>
            {navItems.map(({ link }, i) => {
              return <CMSLink className="dark:text-gray-300" key={i} {...link} />
            })}
          </div>
          <div className="flex flex-col gap-2.5 font-light">
            <span className="font-bold dark:text-white">Tags</span>
            <CMSLink className="dark:text-gray-300" url="/">
              Style
            </CMSLink>
            <CMSLink className="dark:text-gray-300" url="/">
              Fashion
            </CMSLink>
            <CMSLink className="dark:text-gray-300" url="/">
              Coding
            </CMSLink>
            <CMSLink className="dark:text-gray-300" url="/">
              Travel
            </CMSLink>
          </div>
          <div className="flex flex-col gap-2.5 font-light">
            <span className="font-bold dark:text-white">Social</span>
            <CMSLink className="dark:text-gray-300" url="/">
              Facebook
            </CMSLink>
            <CMSLink className="dark:text-gray-300" url="/">
              Instagram
            </CMSLink>
            <CMSLink className="dark:text-gray-300" url="/">
              Tiktok
            </CMSLink>
            <CMSLink className="dark:text-gray-300" url="/">
              Youtube
            </CMSLink>
          </div>
        </div>
        <ThemeSelector />
      </div>
    </footer>
  )
}
