import { Block } from 'payload'

export const CarouselBlock: Block = {
  slug: 'carousel',
  fields: [
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Caption',
          type: 'text',
          required: false,
        },
        {
          name: 'link',
          label: 'Link',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
}
