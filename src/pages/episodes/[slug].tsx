import {format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from '../../styles/episode.module.scss'

type Episode = {
  id: string
  thumbnail: string
  title: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  url: string
  description: string
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.scrollWrapper}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href='/'>
            <button type='button'>
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image 
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit='cover'
          />  
          <button type='button'>
            <img src="/play.svg" alt="Ouvir episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span style={{textTransform: 'capitalize'}}>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div 
          className={styles.description} 
          dangerouslySetInnerHTML={{__html: episode.description}}
        />
      </div>
  </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback:'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params

  console.log(ctx)

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM, yy', { 
      locale: ptBR
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 //24 hours
  }
}