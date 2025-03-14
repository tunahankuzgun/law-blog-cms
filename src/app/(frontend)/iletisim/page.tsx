import ContactForm from '@/components/ContactForm'
import PageClient from './page.client'

export default async function Page() {
  return (
    <article className="container pt-16 pb-24">
      <PageClient />
      <div className="mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>
            <strong>Bizimle İletişime Geçin</strong>
          </h1>
          <p>
            Bilgiç Hukuk Bürosu, hukuki konularda size yardımcı olmaktan mutluluk duyar. Hukuki
            sorularınızı, görüşme taleplerinizi ve diğer tüm konuları aşağıdaki form aracılığıyla
            bize iletebilirsiniz.
          </p>
        </div>

        {/* Form'u prose dışında çağırın */}
      </div>
      <ContactForm />
    </article>
  )
}
