import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'


import { PlayerContext } from '../../contexts/PlayerContext'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './styles.module.scss'

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setIsPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
    clearPlayerState
  } = useContext(PlayerContext)
   
  const episode = episodeList[currentEpisodeIndex]

  function setupProgressListener(): void {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number):void {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      isPlaying
        ? audioRef.current.play() 
        : audioRef.current.pause()
    }
  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {episode ? ( 
        <div className={styles.currentEpisode}>
          <Image 
            width={592} 
            height={592} 
            src={episode.thumbnail} 
            objectFit='cover'  
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider 
                max={episode.duration}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
            <div className={styles.emptySlider} />
            ) }
          </div>
          <span>{convertDurationToTimeString(episode?.duration || 0)}</span>
        </div>

        { episode && (
          <audio 
            autoPlay
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        ) }

        <div className={styles.buttons}>
          <button 
            type='button' 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
            >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button 
            type='button' 
            disabled={!episode || !hasPrevious} 
            onClick={playPrevious}  
          >
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button 
            type='button' 
            className={styles.playButton} 
            disabled={!episode}
            onClick={togglePlay}
          >
            { isPlaying 
              ? <img src="/pause.svg" alt="Tocar"className={styles.playButton} /> 
              : <img src="/play.svg" alt="Tocar"className={styles.playButton} /> 
            }
          </button>
          <button 
            type='button' 
            disabled={!episode || !hasNext} 
            onClick={playNext}
            >
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button 
            type='button' 
            disabled={!episode} 
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
            >
            <img src="/repeat.svg" alt="Tocar novamente"/>
          </button>
        </div>
      </footer>
    </div>
  )
} 