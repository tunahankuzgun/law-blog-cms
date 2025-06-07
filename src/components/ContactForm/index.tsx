'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FaWhatsapp, FaPhoneAlt, FaRegEnvelope } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(2, { message: 'İsim en az 2 karakter olmalıdır.' }),
  email: z.string().email({ message: 'Geçersiz e-posta adresi.' }),
  topic: z.string().min(1, { message: 'Lütfen bir konu seçin.' }),
  otherTopic: z.string().optional(),
  message: z.string().min(10, { message: 'Mesaj en az 10 karakter olmalıdır.' }),
})

type FormData = z.infer<typeof formSchema>

export default function ContactForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      topic: '',
      otherTopic: '',
      message: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const watchTopic = watch('topic')

  const handleEmail = () => {
    window.location.href = 'mailto:av.doganbilgic@gmail.com'
  }

  const handleWhatsApp = () => {
    window.open('https://wa.me/905462993413', '_blank')
  }

  const handleCall = () => {
    window.location.href = 'tel:+905462993413'
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Bir hata oluştu')
      }

      toast.success('Mesajınız başarıyla gönderildi', {
        description: 'En kısa sürede size dönüş yapacağız.',
      })
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Mesajınız gönderilirken bir hata oluştu', {
        description: 'Lütfen daha sonra tekrar deneyin.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>İletişime Geçin</CardTitle>
          <CardDescription>Bizimle nasıl iletişim kurmak istediğinizi seçin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <FaRegEnvelope className="h-8 w-8 text-primary" />
              <Button onClick={handleEmail} className="w-full">
                E-posta
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaWhatsapp className="h-8 w-8 text-primary" />
              <Button onClick={handleWhatsApp} className="w-full">
                WhatsApp
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaPhoneAlt className="h-8 w-8 text-primary" />
              <Button onClick={handleCall} className="w-full">
                Ara
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bize Ulaşın</CardTitle>
          <CardDescription>Aşağıdaki formu doldurun, size geri döneceğiz</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Adınız</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    id="name"
                    placeholder="Ad Soyad"
                    {...field}
                  />
                )}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresiniz</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    {...field}
                  />
                )}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Konu</Label>
              <Controller
                name="topic"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bir konu seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Danışma Talebi</SelectItem>
                      <SelectItem value="appointment">Randevu Talebi</SelectItem>
                      <SelectItem value="case">Dava Bilgisi</SelectItem>
                      <SelectItem value="price">Ücret Bilgisi</SelectItem>
                      <SelectItem value="other">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}
            </div>
            {watchTopic === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="otherTopic">Konuyu Belirtin</Label>
                <Controller
                  name="otherTopic"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      id="otherTopic"
                      placeholder="Konunuzu girin"
                      {...field}
                    />
                  )}
                />
                {errors.otherTopic && (
                  <p className="text-sm text-red-500">{errors.otherTopic.message}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="message">Mesaj İçeriği</Label>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="message"
                    placeholder="Mesajınızı buraya yazın"
                    className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
                    {...field}
                  />
                )}
              />
              {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
