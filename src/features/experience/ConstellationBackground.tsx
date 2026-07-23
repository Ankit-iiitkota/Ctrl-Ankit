import React, { useEffect, useRef } from 'react'

// Slow-drifting constellation/particle-web background: small colored dots that
// connect with thin lines when close enough, matching the reference timeline's
// dark starfield look. Same performance-conscious pattern as the site's other
// canvases (IntersectionObserver-gated, pauses fully when scrolled out of view).
export const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx = context

    let animationFrameId: number
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const colors = ['rgba(34, 211, 238, 0.85)', 'rgba(52, 211, 153, 0.85)', 'rgba(236, 72, 153, 0.7)']

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    class Star {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.12
        this.vy = (Math.random() - 0.5) * 0.12
        this.radius = Math.random() * 1.6 + 0.6
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const starCount = Math.min(Math.floor((width * height) / 11000), 90)
    const stars = Array.from({ length: starCount }, () => new Star())
    const connectDistance = 130

    const drawConnections = () => {
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectDistance) {
            const alpha = (1 - dist / connectDistance) * 0.18
            ctx.beginPath()
            ctx.moveTo(stars[i].x, stars[i].y)
            ctx.lineTo(stars[j].x, stars[j].y)
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }

    let isIntersecting = true

    const animate = () => {
      if (!isIntersecting) return
      ctx.clearRect(0, 0, width, height)
      stars.forEach((s) => {
        s.update()
        s.draw()
      })
      drawConnections()
      animationFrameId = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasIntersecting = isIntersecting
        isIntersecting = entry.isIntersecting
        if (isIntersecting && !wasIntersecting) animate()
      },
      { threshold: 0.01 }
    )
    observer.observe(canvas)

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)

    animate()

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  )
}

export default ConstellationBackground
