import { ImageMedia } from '@/components/Media/ImageMedia'
import React from 'react'
import type { Media as MediaType } from '@/payload-types'

export type CarouselBlockProps = {
  blockType: 'carouselBlock'
}

// Carousel Block
export type CarouselBlockPropTypes = {
  slides: { image: MediaType; caption?: string; link?: string }[]
}

export const CarouselBlock: React.FC<CarouselBlockPropTypes> = ({ slides }) => {
  // console.log('CarouselBlock', props)

  return (
    <div className="container">
      {slides.map((slide, index) => {
        return (
          <div key={index}>
            <ImageMedia fill={false} resource={slide.image} />
            <p>{slide.caption}</p>
            <p>{slide.link}</p>
          </div>
        )
      })}
    </div>
  )
}
