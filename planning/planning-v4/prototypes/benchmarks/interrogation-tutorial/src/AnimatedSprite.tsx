import { useEffect, useMemo, useState } from 'react'
import type { AtlasManifest } from './types'

const manifests = new Map<string, Promise<AtlasManifest>>()

function loadManifest(root: string) {
  if (!manifests.has(root)) {
    manifests.set(
      root,
      fetch(`${root}/manifest.json`).then((response) => {
        if (!response.ok) throw new Error(`Missing atlas manifest: ${root}`)
        return response.json() as Promise<AtlasManifest>
      }),
    )
  }
  return manifests.get(root)!
}

export function AnimatedSprite({
  root,
  animation,
  className = '',
  alt,
}: {
  root: string
  animation: string
  className?: string
  alt: string
}) {
  const [manifest, setManifest] = useState<AtlasManifest>()
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    let live = true
    loadManifest(root).then((loaded) => live && setManifest(loaded))
    return () => {
      live = false
    }
  }, [root])

  const clip = manifest?.animations[animation]
  const speed = Math.max(1000 / (clip?.fps || 5), 80)

  useEffect(() => {
    setFrame(0)
    if (!clip || clip.frames.length < 2) return
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % clip.frames.length)
    }, speed)
    return () => window.clearInterval(timer)
  }, [animation, clip, speed])

  const source = useMemo(() => {
    if (!clip) return ''
    return `${root}/${clip.frames[frame % clip.frames.length]}`
  }, [clip, frame, root])

  if (!source) return <div className={`${className} sprite-loading`} aria-label={alt} />
  return <img className={className} src={source} alt={alt} draggable={false} />
}
