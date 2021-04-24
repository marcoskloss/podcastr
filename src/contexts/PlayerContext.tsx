import { createContext, useState, ReactNode } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Array<Episode>
  currentEpisodeIndex: number
  isPlaying: boolean
  hasNext: boolean
  hasPrevious: boolean
  isLooping: boolean
  isShuffling: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  playNext: () => void
  playPrevious: () => void
  setIsPlayingState: (state: boolean) => void;
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  clearPlayerState: () => void
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider(
  { children } :PlayerContextProviderProps
) {
  const [episodeList, setEpisodeList ] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1
  const hasPrevious = currentEpisodeIndex > 0

  function play(episode: Episode): void {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number): void {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(): void {
    setIsPlaying(prevState => !prevState)
  }

  function toggleLoop(): void {
    setIsLooping(prevState => !prevState)
  }

  function toggleShuffle(): void {
    setIsShuffling(prevState => !prevState)
  }

  function setIsPlayingState(state: boolean): void {
    setIsPlaying(state)
  }

  function playNext(): void {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      )
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }

  }

  function playPrevious(): void {
    const previousEpisodeIndex = currentEpisodeIndex - 1

    if (previousEpisodeIndex < 0) return;

    setCurrentEpisodeIndex(previousEpisodeIndex)
  }

  function clearPlayerState(): void {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{
        currentEpisodeIndex, 
        episodeList, 
        play,
        playList,
        playNext,
        playPrevious,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setIsPlayingState,
        clearPlayerState,
        hasNext,
        hasPrevious
    }}>
      {children}
    </PlayerContext.Provider>
  )
}


