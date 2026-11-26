'use client'

import Image from 'next/image'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { contactDetails, doors } from '@/data/doors'

const clamp = { clamp: true } as const
const formatPhone = (phone: string) => `${phone.slice(0, 5)} ${phone.slice(5)}`

type DoorCardProps = { door: (typeof doors)[number]; index: number; progress: MotionValue<number>; reduced: boolean }

function DoorCard({ door, index, progress, reduced }: DoorCardProps) {
  const start = 0.3 + index * 0.045
  const opacity = useTransform(progress, [start, start + 0.055, start + 0.16], [0, 1, 1], clamp)
  const y = useTransform(progress, [start, start + 0.09], [54, 0], clamp)
  const rotateY = useTransform(progress, [start, start + 0.12], [-13, 0], clamp)
  return (
    <motion.article className="door-card" style={reduced ? undefined : { opacity, y, rotateY }}>
      <div className="door-photo"><Image src={door.image} alt={door.imageAlt} fill sizes="(max-width: 700px) 42vw, 23vw" loading="lazy" /><span className="door-index">0{index + 1}</span></div>
      <div className="door-info"><h3>{door.name}</h3><dl><div><dt>Material</dt><dd>{door.material}</dd></div><div><dt>Finish</dt><dd>{door.finish}</dd></div><div><dt>Made for</dt><dd>{door.use}</dd></div></dl></div>
    </motion.article>
  )
}

function DoorWall({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const opacity = useTransform(progress, [0.27, 0.32, 0.63, 0.69], [0, 1, 1, 0], clamp)
  return (
    <motion.div className="door-wall" style={reduced ? undefined : { opacity }}>
      <div className="wall-heading"><div><span className="eyebrow font-mono">The collection · Varanasi</span><h2>Find the door<br /><em className="font-serif">that feels like home.</em></h2></div></div>
      <div className="door-grid">{doors.map((door, index) => <DoorCard door={door} index={index} progress={progress} reduced={reduced} key={door.name} />)}</div>
      <span className="wall-caption">A closer look at the collection</span>
    </motion.div>
  )
}

export function SiteHeader() {
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
        <a href="index.html" aria-current="page" ref={activeLink}>Home</a>
        <a href="about.html">About</a>
        <a href="collections.html">Collections</a>
        <a href="contact.html">Contact</a>
      </div>
      <a className="cta trail" href="contact.html">Enquire</a>
    </nav>
  )
}

export function ContactStop() {
  return (
    <section className="contact-stop" aria-label="Contact and visit Cam Wood">
      <div className="contact-panel"><span className="eyebrow font-mono">The last stop · your first step</span><h2>Let&apos;s find<br />your <em className="font-serif">door.</em></h2><p>Visit the showroom, explore the finishes and talk with our team about your space.</p>
        <div className="contact-actions"><a href={`tel:${contactDetails.mobile}`} className="contact-link"><small>CALL THE SHOWROOM</small><strong>{formatPhone(contactDetails.mobile)}</strong></a><a href={`https://wa.me/91${contactDetails.whatsapp}`} target="_blank" rel="noreferrer" className="contact-link"><small>WHATSAPP / PHONE</small><strong>{formatPhone(contactDetails.whatsapp)}</strong></a></div>
        <div className="visit-note"><span className="visit-pin" aria-hidden="true">●</span><span><b>Cam Wood</b><br />Khushi Designer Doors and Windows<br />Varanasi, Uttar Pradesh</span></div>
        <a className="visit-button" href="https://maps.google.com/?q=Cam+Wood+Khushi+Designer+Doors+Varanasi" target="_blank" rel="noreferrer">Plan your visit <span aria-hidden="true">↗</span></a><span className="contact-signoff">THANK YOU FOR WALKING THROUGH.</span>
      </div>
    </section>
  )
}

export function WhatsappButton() {
  return <a className="whatsapp-float" href={`https://wa.me/91${contactDetails.whatsapp}`} target="_blank" rel="noreferrer" aria-label={`Chat with Cam Wood on WhatsApp at ${formatPhone(contactDetails.whatsapp)}`}><span aria-hidden="true">WhatsApp</span></a>
}

export function ReducedTour() {
  const progress = useMotionValue(0)
  return (
    <main className="reduced-tour" id="top"><SiteHeader />
      <div className="reduced-hero"><Image src="/showroom-exterior.png" alt="Cam Wood designer doors showroom at night" fill priority sizes="100vw" /><div className="reduced-hero-copy"><span className="eyebrow font-mono">Khushi Designer Doors &amp; Windows</span><h1>A warmer welcome<br />starts at the door.</h1></div></div>
      <section className="reduced-collection"><DoorWall progress={progress} reduced /></section>
      <section className="reduced-chapters" aria-label="More of the showroom"><article><span className="eyebrow font-mono">The welcome desk</span><h2>Thoughtful design, from the first hello.</h2><p>Talk through the space, the measurements and the feeling you want to come home to.</p></article><article><span className="eyebrow font-mono">The finishing touch</span><h2>Handles and hardware, chosen with care.</h2><p>Explore details that bring a door, its frame and its room together.</p></article><article><span className="eyebrow font-mono">Let the daylight in</span><h2>Windows made for the way you live.</h2><p>Discover options that balance natural light, privacy and lasting character.</p></article></section>
      <ContactStop /><WhatsappButton />
    </main>
  )
}

