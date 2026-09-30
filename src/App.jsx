import { useEffect, useMemo, useRef, useState } from "react"
import { site } from "./config"

function parseVideo(url) {
  if (!url || !url.trim()) return null
  const value = url.trim()
  let match = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  )
  if (match) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    }
  }
  match = value.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (match) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${match[1]}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`,
    }
  }
  return { kind: "file", src: value }
}

function Media({ video }) {
  if (video.kind === "iframe") {
    return (
      <iframe
        src={video.src}
        title="The final cut"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }
  return <video src={video.src} controls autoPlay playsInline />
}

export default function App() {
  const video = useMemo(() => parseVideo(site.video.url), [])
  const [playing, setPlaying] = useState(false)
  const [theater, setTheater] = useState(false)
  const [palette, setPalette] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [toast, setToast] = useState("")
  const [hr, setHr] = useState(false)
  const [yearHits, setYearHits] = useState(0)
  const [load, setLoad] = useState(12)
  const inputRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--bg", site.colors.bg)
    root.style.setProperty("--ink", site.colors.ink)
    root.style.setProperty("--muted", site.colors.muted)
    root.style.setProperty("--yellow", site.colors.yellow)
    root.style.setProperty("--line", site.colors.line)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in")
        })
      },
      { threshold: 0.16 }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const steps = [12, 38, 61, 84, 99]
    let index = 0
    const timer = setInterval(() => {
      index += 1
      if (index >= steps.length) {
        clearInterval(timer)
        return
      }
      setLoad(steps[index])
    }, 850)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const node = heroRef.current
      if (!node) return
      const shift = Math.min(window.scrollY * 0.18, 70)
      node.style.setProperty("--shift", `${shift}px`)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = theater || palette ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [theater, palette])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(""), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!hr) return undefined
    const timer = setTimeout(() => setHr(false), 4200)
    return () => clearTimeout(timer)
  }, [hr])

  const commands = useMemo(
    () => [
      {
        label: "replay trauma",
        run: () => {
          document.getElementById("final-cut")?.scrollIntoView({ behavior: "smooth", block: "center" })
          if (video) {
            window.setTimeout(() => setTheater(true), 500)
          }
        },
      },
      {
        label: "pretend this meeting could have been an email",
        run: () => setToast("This could have been an email."),
      },
      {
        label: "close 47 open tabs",
        run: () => setToast("47 tabs closed. The feeling remains."),
      },
    ],
    [video]
  )

  const filtered = commands.filter((item) => item.label.includes(query.trim().toLowerCase()))

  useEffect(() => {
    setActive(0)
  }, [query, palette])

  useEffect(() => {
    if (palette) inputRef.current?.focus()
  }, [palette])

  useEffect(() => {
    const onKey = (event) => {
      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setPalette((open) => !open)
        setQuery("")
        return
      }
      if (event.key === "Escape") {
        setPalette(false)
        setTheater(false)
      }
      if (palette) {
        if (event.key === "ArrowDown") {
          event.preventDefault()
          setActive((index) => Math.min(index + 1, Math.max(filtered.length - 1, 0)))
        }
        if (event.key === "ArrowUp") {
          event.preventDefault()
          setActive((index) => Math.max(index - 1, 0))
        }
        if (event.key === "Enter" && filtered[active]) {
          event.preventDefault()
          filtered[active].run()
          setPalette(false)
          setQuery("")
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [palette, filtered, active])

  function openCut(asTheater) {
    document.getElementById("final-cut")?.scrollIntoView({ behavior: "smooth", block: "center" })
    if (!video) return
    if (asTheater) {
      window.setTimeout(() => setTheater(true), 620)
    } else {
      setPlaying(true)
    }
  }

  function onYears() {
    const next = yearHits + 1
    if (next >= 4) {
      setHr(true)
      setYearHits(0)
      return
    }
    setYearHits(next)
  }

  const showInline = playing && !theater && video

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#final-cut">
        Skip to the cut
      </a>

      <header className="topbar">
        <img className="logo logo-laba" src={site.logos.laba} alt="Laba" />
        <button className="kicker-btn" type="button" onClick={() => setPalette(true)}>
          <span>Command</span>
          <kbd>⌘K</kbd>
        </button>
      </header>

      <main>
        <section className="hero" ref={heroRef}>
          <div className="hero-copy">
            <p className="eyebrow rise d1">
              {site.meta.brand}
              <span aria-hidden="true"> · </span>
              <button className="years" type="button" onClick={onYears}>
                {site.meta.years}
              </button>
              <span aria-hidden="true"> · </span>
              {site.meta.tag}
              {hr && <span className="hr-note">HR has been notified.</span>}
            </p>
            <h1 className="rise d2">
              {site.title.map((line, index) => (
                <span key={line} className={index === site.title.length - 1 ? "em" : undefined}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="lede rise d3">
              {site.subtitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <button className="play rise d4" type="button" onClick={() => openCut(true)}>
              <span className="play-orb" aria-hidden="true">
                <i />
              </span>
              <span>
                Play the director’s cut <em>— {site.video.duration}</em>
              </span>
            </button>
          </div>
          <p className="loader" title="Still loading emotional attachment.zip">
            emotional attachment.zip — {load}%
          </p>
        </section>

        <section className="block" id="final-cut">
          <div className="block-head reveal">
            <p className="index">01</p>
            <h2>The final cut</h2>
          </div>
          <div className="stage reveal">
            <p className="side">
              <span>One sitting</span>
              <span>No chapters</span>
              <span>9:16</span>
            </p>
            <div className={`frame ${showInline ? "is-live" : ""}`}>
              {showInline ? (
                <Media video={video} />
              ) : (
                <button className="poster" type="button" onClick={() => (video ? setPlaying(true) : openCut(false))}>
                  <span className="hud hud-tl">Laba · Final cut</span>
                  <span className="poster-mid">
                    <span className="play-orb lg" aria-hidden="true">
                      <i />
                    </span>
                    <span className="poster-title">{video ? "Play" : "The reel isn’t mounted yet."}</span>
                    {!video && <span className="poster-sub">videoUrl in src/config.js</span>}
                  </span>
                  <span className="hud hud-br">{site.video.duration}</span>
                </button>
              )}
              {showInline && (
                <button className="expand" type="button" onClick={() => setTheater(true)}>
                  Full frame
                </button>
              )}
            </div>
            <p className="side right">
              <span>{site.meta.brand}</span>
              <span>{site.meta.date}</span>
              <span>Director’s cut</span>
            </p>
          </div>
        </section>

        <section className="block tight">
          <div className="block-head reveal">
            <p className="index">02</p>
            <h2 className="quiet" title="No KPIs were harmed in the making of this website.">
              Rough numbers
              <span className="tip">No KPIs were harmed in the making of this website.</span>
            </h2>
          </div>
          <div className="stats reveal">
            {site.stats.map((stat) => (
              <article key={stat.label} className="stat">
                <p className={stat.value.length > 3 ? "value long" : "value"}>{stat.value}</p>
                <p className="label">{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="block">
          <div className="split">
            <div className="reveal">
              <p className="index">03</p>
              <h2>Taking with me</h2>
              <ol className="inv">
                {site.taking.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className="reveal">
              <p className="index">04</p>
              <h2>Leaving behind</h2>
              <ol className="inv">
                {site.leaving.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="block universe">
          <div className="reveal">
            <p className="index">05</p>
            <h2>The universe</h2>
            <div className="brands">
              <img src={site.logos.laba} alt="Laba" className="uni laba" />
              <img src={site.logos.skvot} alt="Skvot" className="uni skvot" />
              <img src={site.logos.robotDreams} alt="robot_dreams" className="uni rd" />
            </div>
            <p className="brand-line">Laba · Skvot · robot_dreams</p>
          </div>
        </section>

        <section className="block goodbye" id="close">
          <div className="reveal">
            <h2>That’s all, folks.</h2>
            <p className="thanks">
              Thanks for the chaos, the trust, the people, the stupid jokes, the launches, the
              lessons and everything in between.
            </p>
            <p className="bye" title="This could have been an email.">
              Okay bye, before this becomes a company funeral.
            </p>
            <p className="sign">
              S láskou,
              <br />
              Anet ❤️
            </p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <img className="logo logo-s" src={site.logos.laba} alt="" />
        <p>
          Anet has left the chat. · {site.meta.date}
        </p>
      </footer>

      {theater && video && (
        <div className="theater" role="dialog" aria-modal="true" aria-label="The final cut">
          <button className="scrim" type="button" aria-label="Close" onClick={() => setTheater(false)} />
          <div className="theater-bar">
            <p>The final cut · {site.video.duration}</p>
            <button type="button" onClick={() => setTheater(false)}>
              Close
            </button>
          </div>
          <div className="theater-frame">
            <Media video={video} />
          </div>
        </div>
      )}

      {palette && (
        <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
          <button className="scrim" type="button" aria-label="Close" onClick={() => setPalette(false)} />
          <div className="palette-panel">
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type a command"
              aria-label="Command"
            />
            <ul>
              {filtered.length === 0 && <li className="empty">Nothing under that name.</li>}
              {filtered.map((item, index) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className={index === active ? "is-on" : undefined}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => {
                      item.run()
                      setPalette(false)
                      setQuery("")
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="palette-hint">esc to leave</p>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
