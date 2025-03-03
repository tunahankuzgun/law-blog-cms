'use client'
import { ImageMedia } from '@/components/Media/ImageMedia'
import React from 'react'
import type { Media as MediaType } from '@/payload-types'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export type CarouselBlockProps = {
  blockType: 'carouselBlock'
}

// Carousel Block
export type CarouselBlockPropTypes = {
  slides: { image: MediaType; caption?: string; link?: string }[]
}

export const CarouselBlock: React.FC<CarouselBlockPropTypes> = ({ slides }) => {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <div className="">
      <div className="container">
        <h1 className="text-center text-4xl font-semibold">Referanslar</h1>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-screen-md mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {slides.map((slide, index) => {
              return (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center p-2">
                    <ImageMedia className="object-cover" fill={false} resource={slide.image} />
                    <p>{slide.caption}</p>
                    <p>{slide.link}</p>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
