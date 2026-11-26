'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { contactDetails, doors } from '@/data/doors'
import { ContactStop, ReducedTour, SiteHeader, WhatsappButton } from './showroom-tour'

const VIDEO_SRC = '/showroom-tour.mp4'
const FALLBACK_DURATION = 36.18
// Second of the walkthrough video at which each scene starts.
const SCENES = [0, 3.4, 8.6, 21.2, 25.8, 31.4]
const POP_START = 8.6
const POP_STEP = 3.15
const POP_COUNT = doors.length

const sceneAt = (t: number) => SCENES.reduce((found, start, i) => (t >= start ? i : found), 0)
const doorAt = (t: number) => Math.max(0, Math.min(POP_COUNT - 1, Math.floor((t - POP_START) / POP_STEP)))

function PopDoor({ index }: { index: number }) {
  const door = doors[index]
  return (
    <article className="door-card vt-pop">
      <div className="door-photo"><Image src={door.image} alt={door.imageAlt} fill sizes="110px" /><span className="door-index">0{index + 1}</span></div>
      <div className="door-info"><h3>{door.name}</h3><dl><div><dt>Material</dt><dd>{door.material}</dd></div><div><dt>Finish</dt><dd>{door.finish}</dd></div><div><dt>Made for</dt><dd>{door.use}</dd></div></dl></div>
    </article>
  )
}

function TourStage() {
  const runway = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [scene, setScene] = useState(0)
  const [pop, setPop] = useState(0)

  // Download the whole walkthrough once, so every scroll position can be shown instantly.
  useEffect(() => {
    const el = video.current
    if (!el) return
    let url = ''
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(VIDEO_SRC)
        if (!res.ok || !res.body) throw new Error('video unavailable')
        const total = Number(res.headers.get('content-length')) || 0
        const reader = res.body.getReader()
        const chunks: Uint8Array[] = []
        let got = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          got += value.length
          if (total && !cancelled) setLoaded(Math.min(1, got / total))
        }
        if (cancelled) return
        url = URL.createObjectURL(new Blob(chunks as unknown as BlobPart[], { type: 'video/mp4' }))
        el.src = url
        el.load()
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  // Scroll position -> moment of the video (smoothed), plus which scene and door card to show.
  useEffect(() => {
    const el = video.current
    const box = runway.current
    if (!ready || !el || !box) return
    let target = 0
    let current = 0
    let raf = 0
    let shown = -1
    let lastScene = -1
    let lastPop = -1

    const measure = () => {
      const rect = box.getBoundingClientRect()
      target = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)))
    }
    const tick = () => {
      current += (target - current) * 0.16
      if (Math.abs(target - current) < 0.0004) current = target
      const duration = el.duration || FALLBACK_DURATION
      const t = current * duration
      if (!el.seeking && Math.abs(t - shown) > 1 / 48) {
        el.currentTime = Math.min(t, duration - 0.04)
        shown = t
      }
      const s = sceneAt(t)
      if (s !== lastScene) { lastScene = s; setScene(s) }
      const p = doorAt(t)
      if (p !== lastPop) { lastPop = p; setPop(p) }
      if (bar.current) bar.current.style.transform = `scaleX(${current})`
      raf = current !== target ? requestAnimationFrame(tick) : 0
    }
    const wake = () => {
      measure()
      if (!raf) raf = requestAnimationFrame(tick)
    }
    measure()
    current = target
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)
    return () => {
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ready])

  return (
    <main id="top"><SiteHeader />
      <section ref={runway} className="vt-runway" aria-label="A scroll-driven walk through the Cam Wood showroom">
        <div className="vt-stage">
          <div className="vt-frame">
            <video ref={video} className="vt-video" muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture onLoadedData={() => setReady(true)} onError={() => setFailed(true)} />
            <div className="vt-shade" aria-hidden="true" />
            <div className="vt-bar" ref={bar} aria-hidden="true" />

            {!ready && (
              <div className="vt-loading" role="status">
                {failed
                  ? <><b>The showroom tour could not load.</b><span>Please refresh, or call us on <a href={`tel:${contactDetails.mobile}`}>{contactDetails.mobile}</a>.</span></>
                  : <><i /><b>Opening the showroom</b><span>{loaded > 0 ? `${Math.round(loaded * 100)}%` : 'Loading'}</span></>}
              </div>
            )}

            {scene === 0 && (
              <div className="vt-caption" key="s0"><span className="eyebrow font-mono">Khushi Designer Doors &amp; Windows</span><h1>Every home has<br />a way <em className="font-serif">in.</em></h1><p>Come inside. See the craft, the details and the doors made to feel like yours.</p><span className="scroll-cue"><i /> Scroll to enter</span></div>
            )}
            {scene === 1 && (
              <div className="vt-caption" key="s1"><span className="eyebrow font-mono">Step inside</span><h2>Push the<br />glass <em className="font-serif">door.</em></h2><p>The showroom opens up the moment you walk in.</p></div>
            )}
            {scene === 2 && (
              <>
                <div className="vt-top" key="s2"><span className="eyebrow font-mono">The collection · Varanasi</span><h2>Find the door<br /><em className="font-serif">that feels like home.</em></h2></div>
                <PopDoor key={pop} index={pop} />
              </>
            )}
            {scene === 3 && (
              <div className="vt-caption" key="s3"><span className="eyebrow font-mono">The finishing touch</span><h2>A detail worth<br /><em className="font-serif">reaching for.</em></h2><p>Door handles, hinges and hardware chosen to bring the whole composition together.</p></div>
            )}
            {scene === 4 && (
              <div className="vt-caption" key="s4"><span className="eyebrow font-mono">Locks &amp; fittings</span><h2>Everything that<br /><em className="font-serif">finishes</em> a door.</h2><p>Locks, latches and fittings laid out so you can hold them before you choose.</p></div>
            )}
            {scene === 5 && <div className="vt-contact" key="s5"><ContactStop /></div>}
          </div>
        </div>
      </section>
      <WhatsappButton />
    </main>
  )
}

export function VideoTour() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced ? <ReducedTour /> : <TourStage />
}
