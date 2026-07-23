import React, { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export const MusicToggle: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio('/bgm.mp3')
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  return (
    <button
      onClick={toggleMusic}
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      aria-pressed={isPlaying}
      data-cursor="MUSIC"
      className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-accent-300 hover:bg-white/10 transition-all duration-200 cursor-pointer"
    >
      {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  )
}

export default MusicToggle
