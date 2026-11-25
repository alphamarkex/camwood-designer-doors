"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { contactDetails, doors, tourScenes } from "@/data/doors"

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (value: number) => {
  const amount = clamp(value)
  return amount * amount * (3 - 2 * amount)
}

function BrandHeader() {
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLElement>(null)
  const activeLink = useRef<HTMLAnchorElement | null>(null)

  const moveHighlight = (link: HTMLAnchorElement) => {
    const highlight = highlightRef.current
    if (!highlight) return
    highlight.style.width = `${link.offsetWidth}px`
    highlight.style.transform = `translateX(${link.offsetLeft}px)`
    linksRef.current?.querySelectorAll("a").forEach((item) => {
      item.classList.toggle("hv", item === link)
    })
  }

  useEffect(() => {
    const homeLink = activeLink.current
    if (!homeLink) return
    const positionHighlight = () => moveHighlight(homeLink)
    const frame = window.requestAnimationFrame(positionHighlight)
    window.addEventListener("resize", positionHighlight)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("resize", positionHighlight)
    }
  }, [])

  return (
    <nav
      id="nav"
      aria-label="Main navigation"
      ref={navRef}
      onPointerMove={(event) => {
        const links = linksRef.current
        if (!links) return
        const anchors = [...links.querySelectorAll("a")]
        anchors.forEach((link) => {
          const bounds = link.getBoundingClientRect()
          const distance = Math.abs(event.clientX - (bounds.left + bounds.width / 2))
          link.style.transform = `scale(${1 + 0.16 * Math.max(0, 1 - distance / 90)})`
        })
        const target = (event.target as HTMLElement).closest("a")
        if (target instanceof HTMLAnchorElement && links.contains(target)) moveHighlight(target)
      }}
      onPointerLeave={() => {
        linksRef.current?.querySelectorAll("a").forEach((link) => (link.style.transform = ""))
        if (activeLink.current) moveHighlight(activeLink.current)
      }}
    >
      <a href="index.html" aria-label="Camwood home">
        <Image id="nl" src="/camwood-logo.png" alt="Camwood" width={148} height={38} priority />
      </a>
      <div className="links" id="links" ref={linksRef}>
        <i className="hl" id="hl" ref={highlightRef} aria-hidden="true" />
        <a href="index.html" aria-current="page" ref={activeLink}>
          Home
        </a>
        <a href="about.html">About</a>
        <a href="collections.html">Collections</a>
        <a href="contact.html">Contact</a>
      </div>
      <a className="cta trail" href="contact.html">
        Enquire
      </a>
    </nav>
  )
}

function WhatsAppButton() {
  const message = encodeURIComponent("Hello, I’d like to know more about Cam Wood designer doors and windows.")
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/91${contactDetails.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with Cam Wood on WhatsApp at ${contactDetails.whatsapp}`}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3.5A12.4 12.4 0 0 0 5.3 22.2L4 28l6-1.3A12.5 12.5 0 1 0 16 3.5Zm0 22.5a10 10 0 0 1-5.1-1.4l-.4-.2-3.5.8.8-3.4-.2-.4A10.1 10.1 0 1 1 16 26Zm5.5-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.3 8.3 0 0 1-2.5-1.6 9.4 9.4 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.2-.5c.1-.2 0-.5 0-.6s-.7-1.7-1-2.3-.5-.5-.7-.5H11c-.2 0-.6.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.3 3.1a12 12 0 0 0 4.7 4.1c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.3-.6-.4Z" />
      </svg>
      <span>WhatsApp</span>
    </a>
  )
}

function DoorCard({ sceneIndex }: { sceneIndex: number }) {
  const scene = tourScenes[sceneIndex]
  if (scene.kind !== "door" || !scene.image || !scene.detail) return null
  return (
    <div className="door-display">
      <div className="door-product">
        <div className="door-photo-wrap">
          <Image src={scene.image} alt={scene.imageAlt ?? scene.detail.name} fill sizes="(max-width: 700px) 72vw, 34vw" />
        </div>
        <div className="door-copy">
          <span className="scene-count">SHOWROOM DISPLAY</span>
          <h2>{scene.detail.name}</h2>
          <dl>
            <div><dt>Material</dt><dd>{scene.detail.material}</dd></div>
            <div><dt>Finish</dt><dd>{scene.detail.finish}</dd></div>
            <div><dt>Use</dt><dd>{scene.detail.use}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default function ShowroomTour() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage) return

    const scenes = [...stage.querySelectorAll<HTMLElement>("[data-scene]")]
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) {
      scenes.forEach((scene) => {
        scene.style.opacity = "1"
        scene.style.transform = "none"
        scene.setAttribute("aria-hidden", "false")
        scene.inert = false
      })
      return
    }

    let frame = 0
    const entrance = stage.querySelector<HTMLElement>(".glass-doors")

    const render = () => {
      const bounds = track.getBoundingClientRect()
      const runway = Math.max(1, track.offsetHeight - window.innerHeight)
      const progress = clamp(-bounds.top / runway)
      const chapter = progress * tourScenes.length
      track.style.setProperty("--tour-progress", String(progress))

      scenes.forEach((scene, index) => {
        const local = chapter - index
        const enter = index === 0 ? 1 : smooth((local + 0.12) / 0.22)
        const leave = index === scenes.length - 1 ? 1 : 1 - smooth((local - 0.76) / 0.24)
        const opacity = enter * leave
        scene.style.opacity = String(opacity)
        scene.style.transform = `scale(${1.035 - enter * 0.035})`
        scene.setAttribute("aria-hidden", opacity < 0.08 ? "true" : "false")
        scene.inert = opacity < 0.08
      })

      if (entrance) {
        const enterProgress = chapter - 1
        entrance.style.setProperty("--door-open", String(smooth((enterProgress - 0.12) / 0.66)))
      }
      frame = 0
    }

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }
    window.addEventListener("scroll", requestRender, { passive: true })
    window.addEventListener("resize", requestRender)
    render()

    return () => {
      window.removeEventListener("scroll", requestRender)
      window.removeEventListener("resize", requestRender)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <BrandHeader />
      <main className="tour-track" ref={trackRef}>
        <section className="tour-stage" ref={stageRef} aria-label="Cam Wood showroom tour">
          <div className="tour-scenes">
            {tourScenes.map((scene, index) => (
              <article
                key={scene.id}
                className={`tour-scene scene-${scene.kind}`}
                data-scene
                data-index={index}
                aria-label={scene.title}
                aria-hidden={index === 0 ? "false" : "true"}
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                {scene.kind === "exterior" && scene.image && (
                  <>
                    <Image className="exterior-photo" src={scene.image} alt={scene.imageAlt ?? "Cam Wood showroom"} fill priority sizes="100vw" />
                    <div className="exterior-shade" />
                    <div className="hero-caption">
                      <span>{scene.eyebrow}</span>
                      <p>Scroll to step inside <b aria-hidden="true">↓</b></p>
                    </div>
                  </>
                )}

                {scene.kind === "entry" && (
                  <div className="entry-environment" aria-hidden="true">
                    <div className="entry-depth" />
                    <div className="entry-door-display">
                      {doors.slice(0, 3).map((door) => <div className="entry-door" key={door.image}><Image src={door.image} alt="" fill sizes="18vw" /></div>)}
                    </div>
                    <div className="entry-reception"><span>CAM WOOD</span><small>Khushi Designer</small></div>
                    <div className="glass-doors">
                      <div className="glass-panel glass-left" />
                      <div className="glass-panel glass-right" />
                      <span className="glass-handle glass-handle-left" />
                      <span className="glass-handle glass-handle-right" />
                    </div>
                  </div>
                )}

                {scene.kind === "door" && scene.image && <DoorCard sceneIndex={index} />}

                {scene.kind === "reception" && scene.image && (
                  <div className="reception-view">
                    <div className="reception-picture">
                      <Image src={scene.image} alt={scene.imageAlt ?? "Door finish on display"} fill sizes="(max-width: 700px) 86vw, 45vw" />
                    </div>
                    <div className="reception-mark"><span>CAM WOOD</span><small>Khushi Designer</small></div>
                    <div className="reception-counter"><span>RECEPTION</span></div>
                  </div>
                )}

                {scene.kind === "hardware" && (
                  <div className="hardware-wall" aria-label="Designer door hardware display">
                    <div className="hardware-rail" />
                    <div className="hardware-item"><i className="lever-handle" /><span>LEVER</span></div>
                    <div className="hardware-item"><i className="pull-handle" /><span>PULL</span></div>
                    <div className="hardware-item"><i className="round-knob" /><span>KNOB</span></div>
                    <div className="hardware-item"><i className="lock-set" /><span>LOCK SET</span></div>
                  </div>
                )}

                {scene.kind === "windows" && scene.image && (
                  <div className="window-display">
                    <div className="window-photo"><Image src={scene.image} alt={scene.imageAlt ?? "Solid wood window"} fill sizes="(max-width: 700px) 82vw, 42vw" /></div>
                    <div className="finish-swatch"><span /><span /><span /></div>
                  </div>
                )}

                {scene.kind === "contact" && (
                  <div className="contact-scene-mark" aria-hidden="true">
                    <Image src="/camwood-logo.png" alt="" width={180} height={50} />
                    <span>Khushi Designer Doors and Windows</span>
                  </div>
                )}

                {scene.kind !== "exterior" && (
                  <div className={`scene-copy scene-copy-${scene.kind}`}>
                    <span className="scene-eyebrow">{scene.eyebrow}</span>
                    <h1>{scene.title}</h1>
                    <p>{scene.description}</p>
                    {scene.kind === "contact" && (
                      <div className="contact-actions">
                        <a href={`tel:${contactDetails.mobile}`}>Call {contactDetails.mobile}</a>
                        <a href={`https://wa.me/91${contactDetails.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp {contactDetails.whatsapp}</a>
                      </div>
                    )}
                  </div>
                )}
                {scene.kind !== "exterior" && <div className="chapter-label">CAM WOOD <span>SHOWROOM TOUR</span></div>}
              </article>
            ))}
          </div>
          <div className="stage-vignette" aria-hidden="true" />
          <div className="tour-progress" aria-hidden="true"><span /></div>
        </section>
      </main>
      <WhatsAppButton />
    </>
  )
}

