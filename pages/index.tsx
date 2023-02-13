import Head from 'next/head'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })
import UrlShortenForm from './components/ShortenUrlForm'

export default function Home() {

  return (
      <>
        <Head>
          <title>Url Shortener</title>
          <meta name="description" content="A simple url shortener" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <UrlShortenForm />
      </>
  )
}
