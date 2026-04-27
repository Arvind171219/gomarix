import React, { useState, useEffect, useRef, useMemo, useContext, createContext, useCallback } from 'react';
import { ThemeToggle } from './ThemeContext.jsx';

const logoUrl = `${import.meta.env.BASE_URL}gomarix_logo.png`;

/* =========================
   App context
   ========================= */
const ContactCtx = createContext({ openContact: () => {}, scrollToContact: () => {}, openAuth: () => {}, openScheduler: () => {} });
const useContact = () => useContext(ContactCtx);

/* =========================
   Custom Dropdown
   ========================= */
const Dropdown = ({ value, onChange, options, placeholder = 'Select…' }) => {
  const [open, setOpen] = useState(false);
  const [hl, setHl] = useState(0);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const onKey = (e) => {
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault(); setOpen(true); return;
    }
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHl(h => Math.min(h + 1, options.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHl(h => Math.max(h - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); onChange(options[hl].value); setOpen(false); }
  };

  return (
    <div className={`dd ${open ? 'open' : ''}`} ref={ref}>
      <button type="button" className="dd-trigger" onClick={() => setOpen(v => !v)} onKeyDown={onKey} aria-haspopup="listbox" aria-expanded={open}>
        <span className="left">
          <span className="bubble">
            {selected ? <Icon name={selected.icon} size={15}/> : <Icon name="sparkle" size={15}/>}
          </span>
          <span className="txt">{selected ? selected.label : placeholder}</span>
        </span>
        <span className="chev"><Icon name="chev" size={16}/></span>
      </button>
      <div className="dd-menu" role="listbox">
        {options.map((o, i) => (
          <button
            type="button"
            key={o.value}
            role="option"
            aria-selected={o.value === value}
            className={`dd-item ${i === hl ? 'hl' : ''} ${o.value === value ? 'selected' : ''}`}
            onMouseEnter={() => setHl(i)}
            onClick={() => { onChange(o.value); setOpen(false); }}
          >
            <span className="bubble"><Icon name={o.icon} size={16}/></span>
            <span style={{ minWidth: 0 }}>
              <span className="label">{o.label}</span>
              {o.desc && <span className="desc">{o.desc}</span>}
            </span>
            <span className="tick"><Icon name="check" size={15}/></span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* =========================
   Icon set (inline SVG)
   ========================= */
const Icon = ({ name, size = 20, stroke = 1.75, ...p }) => {
  const s = { width: size, height: size, strokeWidth: stroke, fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' };
  const paths = {
    arrow:    <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    check:    <><path d="M5 12l4 4L19 7"/></>,
    bolt:     <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></>,
    shield:   <><path d="M12 3l8 3v6c0 4.5-3.2 8.5-8 9-4.8-.5-8-4.5-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    cpu:      <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></>,
    code:     <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></>,
    layers:   <><path d="m12 2 10 6-10 6L2 8l10-6Z"/><path d="m2 14 10 6 10-6M2 11l10 6 10-6"/></>,
    target:   <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    workflow: <><rect x="2" y="4" width="7" height="7" rx="1"/><rect x="15" y="13" width="7" height="7" rx="1"/><path d="M9 7.5h4a3 3 0 0 1 3 3V15"/></>,
    lock:     <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    chart:    <><path d="M3 3v18h18"/><path d="m7 14 3-3 4 4 5-6"/></>,
    sparkle:  <><path d="M12 3v4M12 17v4M4 12H.5M23.5 12H20M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/><circle cx="12" cy="12" r="3"/></>,
    linkedin: <><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 10v7M7 7v.01M11 17v-5a2 2 0 0 1 4 0v5M11 12v5"/></>,
    twitter:  <><path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.8-4.1 4.1 0 .3 0 .6.1.9C8.4 8.6 5.1 6.9 2.9 4.2c-.3.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.4-.7 0-1.3-.2-1.8-.5 0 2 1.4 3.7 3.3 4.1-.3.1-.7.1-1.1.1-.3 0-.6 0-.8-.1.6 1.7 2.1 2.9 4 2.9-1.5 1.1-3.3 1.8-5.3 1.8H2c1.9 1.2 4.1 1.9 6.5 1.9 7.7 0 12-6.4 12-12v-.5c.8-.6 1.5-1.3 2-2.1Z"/></>,
    github:   <><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.8c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.5 5.4 2.8 5.4 2.8a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.2c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></>,
    star:     <><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9L2 9.3l6.9-1L12 2Z"/></>,
    eye:      <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:   <><path d="M17.9 17.9A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a19 19 0 0 1 4.2-5M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-2.1 3.1M10 10a3 3 0 1 0 4 4M2 2l20 20"/></>,
    chev:     <><path d="m6 9 6 6 6-6"/></>,
    user:     <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h.01M9 11h.01M9 15h.01M15 7h.01M15 11h.01M15 15h.01"/></>,
    message:  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></>,
    google:   <><path d="M21.35 11.1h-9.17v2.8h5.32c-.23 1.35-1.63 3.96-5.32 3.96-3.2 0-5.82-2.65-5.82-5.92S9 6.02 12.18 6.02c1.82 0 3.04.78 3.74 1.44l2.55-2.45C16.84 3.62 14.73 2.7 12.18 2.7 7.07 2.7 3 6.77 3 11.94s4.07 9.24 9.18 9.24c5.3 0 8.82-3.72 8.82-8.96 0-.6-.07-1.07-.17-1.52Z" fill="currentColor" stroke="none"/></>,
    githubBrand: <><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.87 10.9c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.35-3.88-1.35-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.76 1.2 1.76 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.72-1.55-2.55-.3-5.24-1.28-5.24-5.7 0-1.26.45-2.3 1.2-3.1-.13-.3-.53-1.5.1-3.12 0 0 .96-.3 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.18 3.14-1.18.63 1.62.23 2.82.1 3.12.75.8 1.2 1.84 1.2 3.1 0 4.44-2.7 5.4-5.26 5.68.4.36.77 1.08.77 2.18v3.24c0 .3.2.65.78.54A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" fill="currentColor" stroke="none"/></>,
    microsoft: <><rect x="2"  y="2"  width="9" height="9" fill="#F25022" stroke="none"/><rect x="13" y="2"  width="9" height="9" fill="#7FBA00" stroke="none"/><rect x="2"  y="13" width="9" height="9" fill="#00A4EF" stroke="none"/><rect x="13" y="13" width="9" height="9" fill="#FFB900" stroke="none"/></>,
    key:      <><circle cx="8" cy="15" r="4"/><path d="m10.9 13.1 9.6-9.6M15.5 8.5l3 3"/></>,
    phone:    <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/></>,
    whatsapp: <><path d="M17.5 14.4c-.3-.1-1.7-.85-2-.95-.27-.1-.47-.15-.67.15-.2.3-.77.95-.95 1.15-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.5-.5-.67-.51-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.5.71.3 1.27.48 1.7.62.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12 2.25a9.75 9.75 0 0 0-8.32 14.8L2.25 21.75l4.85-1.4A9.75 9.75 0 1 0 12 2.25zm0 17.75a8 8 0 0 1-4.07-1.12l-.29-.17-3 .87.92-2.92-.19-.3A8 8 0 1 1 12 20z" fill="currentColor" stroke="none"/></>,
    send:     <><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></>,
    pencil:   <><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  };
  return <svg {...s} {...p}>{paths[name]}</svg>;
};

/* =========================
   Reveal on scroll hook
   ========================= */
const useReveal = () => {
  useEffect(() => {
    const observed = new WeakSet();
    const markIn = (el) => {
      // Use a data attribute instead of a class so React className updates don't wipe it
      el.setAttribute('data-in', 'true');
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          markIn(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    const scanAndObserve = () => {
      document.querySelectorAll('.reveal').forEach(el => {
        if (!observed.has(el) && el.getAttribute('data-in') !== 'true') {
          observed.add(el);
          // If already in viewport on mount, mark immediately
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            markIn(el);
          } else {
            io.observe(el);
          }
        }
      });
    };

    scanAndObserve();
    // Re-scan on DOM changes so dynamically-added .reveal elements get picked up
    const mo = new MutationObserver(scanAndObserve);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
};

/* =========================
   Scroll progress bar
   ========================= */
const Progress = () => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setW(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div className="progress" style={{ width: `${w}%` }} />;
};

/* =========================
   Navbar
   ========================= */
const LINKS = [
  { label: 'Services',  href: '#features' },
  { label: 'Pricing',   href: '#pricing' },
  { label: 'Portfolio',  href: '#customers' },
  { label: 'FAQ',       href: '#faq' },
  { label: 'Contact',   href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openScheduler } = useContact();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const goContact = (e) => { e.preventDefault(); setOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); };
  const handleBook = (e) => { e.preventDefault(); setOpen(false); openScheduler(); };
  return (
    <>
      <div className="announce">
        <span>🚀 <strong>Now accepting new projects</strong> — Software, AI, SaaS & Data Platforms
          <a href="#contact">Get a free quote</a>
        </span>
      </div>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#top" className="brand">
            <span className="logo-wrap">
              <span className="logo-glow" aria-hidden="true"/>
              <img
                src={logoUrl}
                alt="Gomarix — Software, AI, SaaS & Data Platforms for Education, Healthcare & Rural Tech"
                className="brand-logo"
                width="160"
                height="40"
                fetchpriority="high"
                decoding="async"
              />
              <span className="logo-orbit" aria-hidden="true"/>
              <span className="logo-spark" aria-hidden="true"/>
            </span>
          </a>
          <ul className="nav-links">
            {LINKS.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
          <div className="nav-cta">
            <ThemeToggle />
            <a href="#contact" className="btn btn-ghost" onClick={goContact}>Contact</a>
            <a href="#contact" className="btn btn-primary" onClick={handleBook}>Book a call <Icon name="arrow" size={15}/></a>
            <button className="menu-btn" aria-label="Menu" onClick={() => setOpen(v => !v)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open
                  ? <path d="M6 6l12 12M18 6 6 18"/>
                  : <path d="M4 7h16M4 12h16M4 17h16"/>}
              </svg>
            </button>
          </div>
        </div>
        <div className={`mobile-menu ${open ? 'open' : ''}`}>
          <ul>
            {LINKS.map(l => <li key={l.href}><a href={l.href} onClick={() => setOpen(false)}>{l.label}</a></li>)}
            <li><a href="#contact" onClick={goContact}>Contact</a></li>
            <li><a href="#contact" className="btn btn-primary" style={{width:'100%'}} onClick={handleBook}>Book a call</a></li>
          </ul>
        </div>
      </header>
    </>
  );
};

/* =========================
   Hero
   ========================= */
const Hero = () => {
  const { openScheduler } = useContact();
  const goContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  return (
  <section className="hero" id="top">
    <div className="container hero-grid">
      <div className="reveal">
        <span className="eyebrow eyebrow-rotator"><span className="dot"/>
          <span className="eb-cycle">
            <span className="eb-word">Software</span>
            <span className="eb-sep">·</span>
            <span className="eb-word">AI Solutions</span>
            <span className="eb-sep">·</span>
            <span className="eb-word">SaaS &amp; Automation</span>
            <span className="eb-sep">·</span>
            <span className="eb-word">Data Platforms</span>
          </span>
        </span>
        <h1>
          <span className="accent">Built fast.</span> <span className="accent">Built right.</span> Built to scale.
        </h1>
        <p className="lead">
          Software development, AI solutions, web &amp; mobile platforms, SaaS &amp; automation tools, and data platforms —
          built for education, healthcare, and rural tech. Powering digital inclusion across India.
        </p>
        <div className="hero-cta">
          <button type="button" className="btn btn-primary btn-lg" onClick={goContact}>Get a free quote <Icon name="arrow" size={16}/></button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={openScheduler}>Book a free consultation</button>
        </div>
        <div className="hero-meta">
          <span><Icon name="check" size={16} className="check"/> Delivered on time</span>
          <span><Icon name="check" size={16} className="check"/> Production-ready code</span>
          <span><Icon name="check" size={16} className="check"/> Ongoing support</span>
        </div>
      </div>

      <DashboardMock />
    </div>

    <LogoCloud />
  </section>
  );
};

const DashboardMock = () => (
  <div className="dash reveal">
    <div className="dash-top">
      <div className="dots"><span/><span/><span/></div>
      <span className="url">gomarix.in/projects</span>
    </div>
    <div className="dash-row">
      {[
        { lbl: 'Projects', val: '120+', d: 'Delivered' },
        { lbl: 'Clients', val: '80+', d: 'Happy' },
        { lbl: 'Uptime', val: '99.9%', d: 'Guaranteed' },
      ].map(s => (
        <div className="stat" key={s.lbl}>
          <div className="lbl">{s.lbl}</div>
          <div className="val">{s.val}</div>
          <div className="delta">{s.d}</div>
        </div>
      ))}
    </div>

    <div className="dash-chart">
      <svg viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6f8dff" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#6f8dff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[30,60,90,120].map(y => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(255,255,255,0.05)"/>)}
        <path d="M0,120 C40,100 70,130 110,90 C160,40 200,110 250,70 C300,30 340,80 400,55 L400,160 L0,160 Z" fill="url(#ch)"/>
        <path d="M0,120 C40,100 70,130 110,90 C160,40 200,110 250,70 C300,30 340,80 400,55" fill="none" stroke="#8aa8ff" strokeWidth="2.5"/>
        <circle cx="250" cy="70" r="5" fill="#8aa8ff"/>
        <circle cx="250" cy="70" r="10" fill="#8aa8ff" opacity="0.25"/>
      </svg>
    </div>

    <div className="dash-event">
      <div className="icon"><Icon name="bolt" size={16} stroke={2.2}/></div>
      <div className="meta">
        <b>New project deployed</b>
        <small>Rural health platform · AI-assisted · Live</small>
      </div>
      <span className="live">● LIVE</span>
    </div>
  </div>
);

const LogoCloud = () => (
  <div className="container logos">
    <p>Trusted by businesses across industries</p>
    <div className="logos-row">
      {['EDUCATION', 'HEALTHCARE', 'RURAL TECH', 'STARTUPS', 'NGOs', 'GOVT & PUBLIC'].map(n => (
        <div className="logo-item" key={n}>{n}</div>
      ))}
    </div>
  </div>
);

/* =========================
   Animated tech stack illustration (HTML/CSS based)
   ========================= */
const TECH_ICONS = [
  { name: 'React',    short: 'React',   color: '#61DAFB', bg: '#20232a', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><circle r="2.1" fill="#61DAFB"/><g fill="none" stroke="#61DAFB" strokeWidth="1"><ellipse rx="10" ry="4"/><ellipse rx="10" ry="4" transform="rotate(60)"/><ellipse rx="10" ry="4" transform="rotate(120)"/></g></svg>
  )},
  { name: 'Node.js',  short: 'Node',    color: '#8CC84B', bg: '#1a2d0d', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><polygon points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" fill="#8CC84B"/><text y="3" textAnchor="middle" fontSize="8" fontWeight="800" fill="#0a1f04">N</text></svg>
  )},
  { name: 'Python',   short: 'Python',  color: '#FFD43B', bg: '#1a2d4a', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><rect x="-7" y="-8" width="14" height="16" rx="3.5" fill="#3776AB"/><rect x="-7" y="-8" width="14" height="8" rx="3.5" fill="#FFD43B"/><circle cx="-3.5" cy="-5" r="1.2" fill="#3776AB"/><circle cx="3.5" cy="5" r="1.2" fill="#FFD43B"/></svg>
  )},
  { name: 'Java',     short: 'Java',    color: '#f89820', bg: '#2d1a00', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><path d="M-5,-9 Q0,-5 5,-9 L5,3 Q0,7 -5,3 Z" fill="#f89820"/><path d="M-4,5 Q0,8 4,5" fill="none" stroke="#f89820" strokeWidth="2" strokeLinecap="round"/><path d="M-5,9 Q0,11 5,9" fill="none" stroke="#f89820" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )},
  { name: 'AWS',      short: 'AWS',     color: '#FF9900', bg: '#232F3E', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><text y="3" textAnchor="middle" fontSize="9" fontWeight="800" fill="#FF9900">aws</text><path d="M-9,7 Q0,11 9,7" fill="none" stroke="#FF9900" strokeWidth="1.8" strokeLinecap="round"/></svg>
  )},
  { name: 'AI / LLM', short: 'AI',      color: '#c4b5fd', bg: '#1e1b4b', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><circle r="8" fill="none" stroke="#c4b5fd" strokeWidth="1.5"/><circle r="3" fill="#c4b5fd"/><path d="M-5,0 L-3,0 M3,0 L5,0 M0,-5 L0,-3 M0,3 L0,5" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )},
  { name: 'Database', short: 'DB',      color: '#22d39a', bg: '#0a2218', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><ellipse cx="0" cy="-6" rx="7" ry="2.5" fill="#22d39a"/><path d="M-7,-6 L-7,6 Q-7,8.5 0,8.5 Q7,8.5 7,6 L7,-6" fill="#22d39a"/><ellipse cx="0" cy="-2" rx="7" ry="2.5" fill="none" stroke="#0a2218" strokeWidth="1"/><ellipse cx="0" cy="2" rx="7" ry="2.5" fill="none" stroke="#0a2218" strokeWidth="1"/></svg>
  )},
  { name: 'Docker',   short: 'Docker',  color: '#2496ED', bg: '#0d2847', icon: (
    <svg viewBox="-12 -12 24 24" width="22" height="22"><rect x="-7" y="-1" width="3" height="3" fill="#2496ED"/><rect x="-3" y="-1" width="3" height="3" fill="#2496ED"/><rect x="1" y="-1" width="3" height="3" fill="#2496ED"/><rect x="-3" y="-5" width="3" height="3" fill="#2496ED"/><rect x="1" y="-5" width="3" height="3" fill="#2496ED"/><path d="M-10,3 Q-2,8 10,3 L10,6 Q0,9 -10,6 Z" fill="#2496ED"/></svg>
  )},
];

const TechStackIllustration = () => (
  <div className="card-illu tech-illu">
    <div className="tech-grid">
      {TECH_ICONS.map((t, i) => (
        <div
          className="tech-chip"
          key={t.name}
          style={{ '--i': i, '--chip-color': t.color }}
          title={t.name}
        >
          <span className="tech-chip-icon">{t.icon}</span>
          <span className="tech-chip-label">{t.short}</span>
        </div>
      ))}
    </div>
    <div className="tech-orb tech-orb-1"/>
    <div className="tech-orb tech-orb-2"/>
  </div>
);

/* =========================
   Trust badges strip
   ========================= */
const TRUST_BADGES = [
  { icon: '🔒', label: 'SSL Secured',        sub: 'Encrypted by default' },
  { icon: '⚡', label: 'On-Time Delivery',   sub: 'Or your money back' },
  { icon: '📝', label: 'NDA-Friendly',       sub: 'Your idea stays safe' },
  { icon: '💯', label: '100% Code Ownership', sub: 'No vendor lock-in' },
  { icon: '🇮🇳', label: 'Made in India',     sub: 'Based in Bihar' },
  { icon: '💬', label: 'Real Human Support', sub: 'WhatsApp · Email · Call' },
];
const TrustBadges = () => (
  <section className="trust-strip">
    <div className="container">
      <div className="trust-row">
        {TRUST_BADGES.map(b => (
          <div className="trust-badge reveal" key={b.label}>
            <span className="trust-icon" aria-hidden="true">{b.icon}</span>
            <div className="trust-text">
              <b>{b.label}</b>
              <small>{b.sub}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* =========================
   Feature Showcase (big cards)
   ========================= */
const Showcase = () => (
  <section className="block" id="features">
    <div className="container">
      <div className="section-head reveal">
        <div className="kicker">Our Services</div>
        <h2>What we build</h2>
        <p>Software development, AI solutions, web &amp; mobile platforms, SaaS &amp; AI tools, automation software, and data platforms — engineered for education, healthcare, and rural tech.</p>
      </div>

      <div className="showcase">
        <div className="card reveal">
          <div className="ico"><Icon name="sparkle"/></div>
          <h3>SaaS &amp; AI Tools</h3>
          <p>Multi-tenant SaaS products and AI-powered tools — chatbots, copilots, document intelligence, and decision systems built on modern LLMs and your own data.</p>
          <TechStackIllustration />
        </div>

        <div className="card reveal">
          <div className="ico"><Icon name="cpu"/></div>
          <h3>Automation &amp; Data Platforms</h3>
          <p>Workflow automation, ETL pipelines, analytics dashboards, and data platforms that turn scattered information into reliable, actionable insight.</p>
        </div>

        <div className="card reveal">
          <div className="ico"><Icon name="layers"/></div>
          <h3>Web &amp; Mobile Platforms</h3>
          <p>Full-stack web and mobile apps for education, healthcare, and rural tech — student portals, telemedicine, field-worker apps, and digital inclusion projects.</p>
        </div>
      </div>
    </div>
  </section>
);

/* =========================
   Feature mini grid
   ========================= */
const MINIS = [
  { ico:'code',     h:'Custom Software Development', p:'End-to-end product engineering — architecture, development, testing, and deployment for web, mobile, and cloud-native systems.' },
  { ico:'cpu',      h:'AI Solutions',                p:'LLM apps, RAG, intelligent agents, and ML models — from prototype to production-grade AI integrated into your workflows.' },
  { ico:'layers',   h:'Web & Mobile Platforms',      p:'Cross-platform web and mobile apps — fast, accessible, and built to work even on low-bandwidth networks.' },
  { ico:'sparkle',  h:'SaaS & AI Tools',             p:'Multi-tenant SaaS products with subscriptions, billing, role-based access, and AI features baked in.' },
  { ico:'workflow', h:'Automation Software',         p:'Replace repetitive manual work with reliable automations — workflows, integrations, alerts, and scheduled jobs.' },
  { ico:'chart',    h:'Data Platforms',              p:'Pipelines, warehouses, analytics, and dashboards that turn messy data into trusted, real-time decisions.' },
];
const MiniFeatures = () => (
  <section className="block">
    <div className="container">
      <div className="section-head reveal">
        <div className="kicker">Focus Areas</div>
        <h2>Built for education, healthcare &amp; rural tech</h2>
        <p>We build apps for schools, clinics, and rural communities — and partner on digital inclusion projects that bring technology to the people who need it most.</p>
      </div>
      <div className="feature-grid">
        {MINIS.map(m => (
          <div className="mini reveal" key={m.h}>
            <div className="ico"><Icon name={m.ico}/></div>
            <h4>{m.h}</h4>
            <p dangerouslySetInnerHTML={{__html:m.p}}/>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* =========================
   How it works
   ========================= */
const PROCESS_STEPS = [
  {
    n: '01',
    icon: 'message',
    h: 'Discover',
    p: 'Free 30-min call to understand your goals. You get a fixed quote and clear timeline within 24 hours.',
    duration: 'Day 1',
  },
  {
    n: '02',
    icon: 'pencil',
    h: 'Design',
    p: 'We create the design and share a clickable preview. You review and approve before any code is written.',
    duration: 'Day 2-3',
  },
  {
    n: '03',
    icon: 'code',
    h: 'Build',
    p: 'Our team develops your project with daily progress updates. You get a live staging URL to test anytime.',
    duration: 'Day 3-6',
  },
  {
    n: '04',
    icon: 'bolt',
    h: 'Launch',
    p: 'We deploy to production, set up analytics, and hand over the keys. You go live with confidence.',
    duration: 'Day 7',
  },
  {
    n: '05',
    icon: 'sparkle',
    h: 'Grow',
    p: 'Free post-launch support, updates, and optimization. We become your long-term technology partner.',
    duration: 'Ongoing',
  },
];

const HowItWorks = () => (
  <section className="block" id="services">
    <div className="container">
      <div className="section-head reveal">
        <div className="kicker">Our Process</div>
        <h2>From idea to launch in <span className="accent">7 days</span></h2>
        <p>Fixed timeline. Daily updates. We deliver when we promise — or your money back.</p>
        <div className="speed-badge reveal">
          <span className="speed-icon" aria-hidden="true">⚡</span>
          <div>
            <b>Most websites delivered in 7 days</b>
            <small>Web apps &amp; SaaS may take 2-8 weeks — full timeline shared with quote</small>
          </div>
        </div>
      </div>

      <div className="timeline reveal">
        <div className="timeline-track" aria-hidden="true">
          <div className="timeline-fill"/>
        </div>
        <div className="timeline-steps">
          {PROCESS_STEPS.map((s, i) => (
            <div className="tl-step" key={s.n} style={{ '--i': i }}>
              <div className="tl-bubble">
                <Icon name={s.icon} size={22} stroke={2}/>
              </div>
              <div className="tl-num">{s.n}</div>
              <h4 className="tl-title">{s.h}</h4>
              <span className="tl-duration">{s.duration}</span>
              <p className="tl-desc">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* =========================
   Stats band
   ========================= */
/* Count-up hook — animates a number from 0 to target when its ref enters view */
const useCountUp = (target, { duration = 1600, decimals = 0, suffix = '', start = false } = {}) => {
  const [val, setVal] = useState(start ? target : 0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else setVal(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString('en-IN');
  return formatted + suffix;
};

const StatItem = ({ value, suffix = '+', decimals = 0, label }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const display = useCountUp(value, { decimals, suffix, start: inView });
  return (
    <div className="reveal" ref={ref}>
      <div className="k">{display}</div>
      <div className="v">{label}</div>
    </div>
  );
};

const Stats = () => (
  <section className="stats-band">
    <div className="container">
      <div className="stats-grid">
        <StatItem value={120}  suffix="+" label="Projects delivered" />
        <StatItem value={80}   suffix="+" label="Happy clients" />
        <StatItem value={15}   suffix="+" label="Industries served" />
        <StatItem value={99.9} suffix="%" decimals={1} label="Client satisfaction" />
      </div>
    </div>
  </section>
);

/* =========================
   Comparison Table — Gomarix vs Freelancer vs Big Agency
   ========================= */
const COMPARE_ROWS = [
  { feature: 'Starting price',          freelancer: '₹3K – ₹15K',     gomarix: '₹4,999 fixed', agency: '₹1L – ₹10L+' },
  { feature: 'Typical timeline',        freelancer: 'Often delayed',   gomarix: '1–8 weeks fixed', agency: '3–6 months' },
  { feature: 'Code ownership',          freelancer: 'Sometimes',       gomarix: '100% yours',      agency: 'Often locked-in' },
  { feature: 'Communication',           freelancer: 'Inconsistent',    gomarix: 'Daily WhatsApp',  agency: 'Account manager only' },
  { feature: 'Money-back guarantee',    freelancer: false,             gomarix: true,              agency: false },
  { feature: 'Post-launch support',     freelancer: 'Pay extra',       gomarix: '1–6 months free', agency: 'Expensive contract' },
  { feature: 'Modern tech stack',       freelancer: 'Hit or miss',     gomarix: true,              agency: true },
  { feature: 'Team disappears risk',    freelancer: 'High',            gomarix: 'No — full team',  agency: 'Low' },
  { feature: 'Designed for Indian SMBs', freelancer: 'Sometimes',      gomarix: true,              agency: false },
];

const ComparisonTable = () => (
  <section className="block compare-section" id="compare">
    <div className="container">
      <div className="section-head reveal">
        <div className="kicker">Why Gomarix</div>
        <h2>How we compare to other options</h2>
        <p>Honest comparison — so you can make the right choice for your business.</p>
      </div>

      <div className="compare-wrap reveal">
        <table className="compare-table">
          <thead>
            <tr>
              <th></th>
              <th><span className="ct-col">Freelancer</span></th>
              <th className="ct-featured-col">
                <span className="ct-col ct-col-featured">
                  <span className="ct-pill">⭐ Recommended</span>
                  Gomarix
                </span>
              </th>
              <th><span className="ct-col">Big Agency</span></th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((r, i) => (
              <tr key={r.feature}>
                <th scope="row">{r.feature}</th>
                <td>{r.freelancer === true ? <span className="ct-yes">✓</span> : r.freelancer === false ? <span className="ct-no">✕</span> : <span className="ct-text ct-text-muted">{r.freelancer}</span>}</td>
                <td className="ct-featured-cell">{r.gomarix === true ? <span className="ct-yes ct-yes-featured">✓</span> : <span className="ct-text ct-text-strong">{r.gomarix}</span>}</td>
                <td>{r.agency === true ? <span className="ct-yes">✓</span> : r.agency === false ? <span className="ct-no">✕</span> : <span className="ct-text ct-text-muted">{r.agency}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

/* =========================
   Pricing
   ========================= */
const Pricing = () => {
  const { openContact } = useContact();
  const goContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const plans = [
    { name:'Basic', price: 4999, blurb:'Perfect for local shops and personal brands getting online.',
      features:['Up to 5-page responsive website','Mobile-friendly design','Basic SEO setup','Contact form + WhatsApp button','Google Maps integration','Free hosting setup help','1 month free support'], cta:'Get started' },
    { name:'Standard', price: 12999, blurb:'For growing businesses that need more pages and features.',
      features:['Up to 10-page custom website','Advanced SEO + Google Search setup','Blog / CMS so you can update yourself','Lead capture forms with email alerts','Google Analytics + Search Console','Speed & security optimization','3 months free support'], cta:'Get started', featured:true },
    { name:'Premium', price: 24999, blurb:'Full web app with admin dashboard, payments, and automation.',
      features:['Everything in Standard','Custom web app or booking system','Admin dashboard with user roles','Payment gateway integration','WhatsApp / SMS automation','AI chatbot or auto-replies','6 months priority support'], cta:'Get started' },
  ];

  return (
    <section className="block" id="pricing">
      <div className="container">
        <div className="section-head reveal">
          <div className="kicker">Pricing</div>
          <h2>Honest, fixed pricing for every business</h2>
          <p>No hidden fees. Pay-as-you-go milestones. Custom quotes available for complex builds.</p>
        </div>

        <div className="guarantee-banner reveal">
          <div className="guarantee-shield" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div className="guarantee-text">
            <b>100% Money-Back Guarantee</b>
            <span>If we miss the deadline or you are not happy with the design in the first 7 days, we refund your money. Your risk is zero.</span>
          </div>
        </div>

        <div className="plans">
          {plans.map(p => (
            <div className={`plan reveal ${p.featured ? 'featured' : ''}`} key={p.name}>
              {p.featured && <span className="tag">MOST POPULAR</span>}
              <div className="name">{p.name}</div>
              <div className="price">
                {p.price === null ? 'Custom' : <>₹{p.price.toLocaleString('en-IN')}<small> /project</small></>}
              </div>
              <p className="blurb">{p.blurb}</p>
              <ul>
                {p.features.map(f => (
                  <li key={f}>
                    <Icon name="check" size={16} stroke={2.2}/>
                    {f}
                  </li>
                ))}
              </ul>
              <button type="button" className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} btn-lg`} onClick={() => p.cta === 'Contact sales' ? openContact('sales', p.name) : goContact()}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================
   Testimonials
   ========================= */
const TESTIMONIALS = [
  { q:"Gomarix built our entire college management portal in just 4 weeks. Students and faculty love it. Truly professional team.", n:"Dr. Rajesh Mehta", r:"Principal, Delhi Public School", a:"RM" },
  { q:"Our clinic's appointment booking system has cut no-shows by 60%. Patients book online and get automatic reminders. Game changer.", n:"Dr. Sneha Kapoor", r:"Founder, LifeCare Clinic", a:"SK" },
  { q:"They delivered a stunning website and an admin dashboard for our restaurant chain. On time, on budget, and beyond expectations.", n:"Arjun Patel", r:"CEO, Spice Route Group", a:"AP" },
  { q:"Our coaching institute now has online classes, fee management, and parent communication in one app. Enrollment doubled in 3 months.", n:"Priya Singh", r:"Director, BrightPath Academy", a:"PS" },
  { q:"The AI chatbot handles 70% of our customer queries automatically. Our support team finally has time to focus on real problems.", n:"Vikram Sharma", r:"Founder, ShopSwift", a:"VS" },
  { q:"Affordable, professional, and on time. Our boutique website looks better than competitors who paid 10x more. Highly recommend.", n:"Anjali Verma", r:"Owner, Aanchal Boutique", a:"AV" },
  { q:"From scratch to launch in 6 weeks. The admin dashboard saves us hours every day. Best decision we made for our business.", n:"Rohit Gupta", r:"CEO, FreshMart Logistics", a:"RG" },
  { q:"They built our doctor consultation app with payment gateway and video calls. Patients across Bihar can now reach us. Truly impressed.", n:"Dr. Amit Kumar", r:"Founder, MediConsult", a:"AK" },
  { q:"Our property listing website doubled enquiries in two months. Buyers can filter, schedule visits, and chat with us — all without us picking up the phone first.", n:"Manish Agarwal", r:"Owner, Prime Properties Patna", a:"MA" },
  { q:"The online booking system saves us 3 hours daily on phone calls. Direct bookings up 45% — and we stopped paying 20% commission to OTAs.", n:"Sunita Kumari", r:"Manager, Hotel Suvidha Inn", a:"SU" },
  { q:"Our client portal lets 200+ clients upload documents, track GST filings, and pay invoices online. What used to be email chaos is now organized.", n:"CA Manoj Verma", r:"Founder, Verma & Associates", a:"MV" },
  { q:"Membership renewals, attendance, and class bookings — all on one app. We doubled member retention because reminders go out automatically.", n:"Karan Singh", r:"Owner, FitZone Gym Bhagalpur", a:"KS" },
  { q:"We needed a donation page with UPI, cards, and transparency reports. Gomarix delivered something we are proud to share — donations are up 3x this year.", n:"Kavita Joshi", r:"Director, Bihar Rural Education Trust", a:"KJ" },
  { q:"Wholesale buyers can now log in, see inventory, place bulk orders, and track shipments. Cut our order processing from 2 days to 2 hours.", n:"Suresh Yadav", r:"MD, Yadav Cottons Pvt Ltd", a:"SY" },
  { q:"Walk-ins are great, but online booking changed our business. We are fully booked 5 days in advance now, and clients love getting WhatsApp reminders.", n:"Pooja Tiwari", r:"Owner, Glow & Style Beauty Parlour", a:"PT" },
];

/* Industry icons used in the "Trusted by" strip */
const INDUSTRIES = [
  { name: 'Education & EdTech', svg: <path d="M22 10 12 4 2 10l10 6 10-6Z M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5 M22 10v6"/> },
  { name: 'Healthcare & Clinics', svg: <g><path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M12 11v6 M9 14h6"/></g> },
  { name: 'Rural Tech', svg: <g><path d="M3 21V11l4-3 4 3v10 M11 21V8l5-4 5 4v13 M3 21h18"/></g> },
  { name: 'Digital Inclusion', svg: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"/> },
  { name: 'NGOs & Causes', svg: <g><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></g> },
  { name: 'Telemedicine', svg: <g><rect x="3" y="6" width="14" height="10" rx="2"/><path d="M17 10l4-2v8l-4-2 M8 11h6 M11 8v6"/></g> },
  { name: 'AgriTech', svg: <g><path d="M12 22V8 M12 14c-3 0-6-2-6-6 3 0 6 2 6 6Z M12 14c3 0 6-2 6-6-3 0-6 2-6 6Z"/></g> },
  { name: 'Govt & Public Sector', svg: <g><path d="M3 21h18 M5 21V10l7-5 7 5v11 M9 21v-6h6v6"/></g> },
  { name: 'Startups & SaaS', svg: <g><path d="M5 19c4-4 8-8 14-14 M5 19l-2 2 4 0 M19 5l2-2 0 4"/><circle cx="12" cy="12" r="2"/></g> },
  { name: 'Logistics & Supply', svg: <g><path d="M2 16V7a1 1 0 0 1 1-1h11v10 M14 8h5l3 4v4h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></g> },
  { name: 'E-commerce & Retail', svg: <g><path d="M5 7h14l-1 13H6Z M9 7V5a3 3 0 0 1 6 0v2"/></g> },
  { name: 'Finance & FinTech', svg: <g><path d="M14 4h-7 M14 8h-7 M14 14H6 M11 18H6 M14 4l3 6.5L14 17l-3-6.5z" strokeLinejoin="round"/></g> },
];

const IndustriesStrip = () => (
  <div className="industries-strip reveal">
    <div className="industries-grid">
      {INDUSTRIES.map((it, i) => (
        <div className="industry-chip" key={it.name} style={{ '--i': i }}>
          <span className="industry-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {it.svg}
            </svg>
          </span>
          <span className="industry-label">{it.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const Testimonials = () => {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Duplicate the list for seamless infinite scroll
  const cards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="block" id="customers">
      <div className="container">
        <div className="section-head reveal">
          <div className="kicker">Portfolio</div>
          <h2>Trusted across education, healthcare &amp; rural tech</h2>
          <p>From schools and clinics to rural-tech and digital-inclusion projects — hear what our partners have to say.</p>
        </div>

        <IndustriesStrip />

        <div
          className={`tcarousel ${paused ? 'paused' : ''}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="tcarousel-track" ref={trackRef}>
            {cards.map((t, i) => (
              <div className="tcarousel-card" key={`${t.n}-${i}`}>
                <div className="stars" aria-label="5 out of 5 stars">
                  {Array.from({length:5}).map((_,j) => <Icon key={j} name="star" size={15} stroke={0} fill="currentColor"/>)}
                </div>
                <blockquote>"{t.q}"</blockquote>
                <div className="who">
                  <div className="avatar">{t.a}</div>
                  <div>
                    <div className="name">{t.n}</div>
                    <div className="role">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="tcarousel-fade-l" aria-hidden="true"/>
          <div className="tcarousel-fade-r" aria-hidden="true"/>
        </div>
      </div>
    </section>
  );
};

/* =========================
   FAQ accordion
   ========================= */
const FAQS = [
  { q:'Do you offer a money-back guarantee?', a:'Yes — your risk is zero. If we miss our committed delivery date for any reason within our control, we refund your last milestone in full. If you are not satisfied with the design direction within the first 7 days of work, we issue a 100% refund minus any third-party costs (domain, hosting, paid plugins). We put it in writing in every contract.' },
  { q:'How long does a typical project take?', a:'Timelines vary by scope. A static business website usually takes 1-2 weeks. Full-stack web applications (school portal, clinic booking system, admin dashboard) take 4-8 weeks. Complex SaaS products or AI-powered platforms take 8-16 weeks. Once we understand your requirements, you get a detailed week-by-week timeline before we start — and we stick to it.' },
  { q:'How does pricing and payment work?', a:'We give you a fixed quote after a free consultation — no hidden fees, no surprise charges. For most projects, payment is split into milestones: 30% to start, 40% at mid-build review, and 30% on final delivery. For long-running SaaS builds, we offer monthly retainers. All quotes include revisions, testing, deployment, and documentation.' },
  { q:'What technologies do you use?', a:'We pick the best tool for each project. Frontend: React, Next.js, TypeScript, Tailwind. Backend: Node.js, Java/Spring Boot, Python (FastAPI/Django). Mobile: React Native. Databases: PostgreSQL, MongoDB, Redis. Cloud: AWS, Vercel, DigitalOcean. AI: OpenAI, Anthropic, LangChain, custom ML models. We are not locked to any one stack.' },
  { q:'Do I own the code and the product?', a:'Yes, 100%. Once the final payment is made, all source code, designs, database schemas, and intellectual property belong to you. We hand over the GitHub repo, deployment credentials, and full documentation. You are never locked in — you can take everything and work with any other developer if you choose.' },
  { q:'Do you provide ongoing support and maintenance?', a:'Every project includes free post-launch support (1-3 months depending on the plan) for bug fixes and small tweaks. After that, we offer affordable monthly maintenance packages covering hosting monitoring, security patches, feature updates, and priority WhatsApp/email support. Most of our clients stay with us long-term.' },
  { q:'Can you build custom SaaS products and AI automation?', a:'Absolutely — this is our specialty. We build multi-tenant SaaS platforms (subscriptions, billing, user roles, analytics dashboards) and AI-powered workflows (chatbots, document processing, smart recommendations, automated reports). We handle everything from idea validation to deployment to ongoing scale.' },
  { q:'How do we communicate during the project?', a:'You get a dedicated project manager and a private WhatsApp/Slack channel. We share weekly progress demos, a live staging URL you can test anytime, and a project tracker so you always know exactly where things stand. Response time: within a few hours on business days.' },
  { q:'What if I need changes during development?', a:'Revisions are expected and welcomed. Every milestone includes a review round where you test the work and request changes. Minor tweaks are always free. Major scope changes (new features, new modules) are discussed openly — we will give you a fair estimate rather than silently inflating hours.' },
  { q:'Which industries have you worked with?', a:'Our focus areas are education (schools, colleges, EdTech), healthcare (clinics, hospitals, telemedicine), and rural tech — including digital inclusion projects that bring software to underserved communities. We also build for NGOs, early-stage SaaS startups, government and public-sector teams, AgriTech, logistics, and FinTech. If your problem can be solved with software, AI, or automation, we can build it.' },
  { q:'Where is my project hosted after launch?', a:'We deploy on reliable, scalable infrastructure — typically AWS, Vercel, or DigitalOcean — depending on your needs and budget. Hosting accounts are registered in your name, so you keep full ownership and control. We also set up automated backups, SSL certificates, and monitoring so your site stays fast and secure.' },
];
const FAQ = () => {
  const [open, setOpen] = useState(-1);
  return (
    <section className="block" id="faq">
      <div className="container">
        <div className="section-head reveal">
          <div className="kicker">FAQ</div>
          <h2>Questions, answered</h2>
          <p>Still curious? <a href="#contact" style={{color:'var(--accent-2)',fontWeight:600}}>Talk to our team →</a></p>
        </div>

        <div className="faq">
          {FAQS.map((f, i) => (
            <div className={`q reveal ${open === i ? 'open' : ''}`} key={f.q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{f.q}</span>
                <span className="plus"/>
              </button>
              <div className="body" style={{ maxHeight: open === i ? '600px' : 0 }}>
                <div className="body-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================
   Big CTA
   ========================= */
const BigCTA = () => {
  const { openScheduler } = useContact();
  const goContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  return (
  <section className="cta-big">
    <div className="container">
      <div className="cta-card reveal">
        <h2>Ready to bring your idea to life?</h2>
        <p>Whether you need custom software, an AI solution, a SaaS or automation tool, a data platform, or an app for education, healthcare, or rural tech — let's build it together. Get a free consultation today.</p>
        <div className="btns">
          <button type="button" className="btn btn-primary btn-lg" onClick={goContact}>Get a free quote <Icon name="arrow" size={16}/></button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={openScheduler}>Book a free consultation</button>
        </div>
      </div>
    </div>
  </section>
  );
};

/* =========================
   Contact form (shared)
   ========================= */
const INITIAL_FORM = { name: '', email: '', company: '', interest: 'getstarted', message: '' };
const validate = (f) => {
  const errs = {};
  if (!f.name.trim())    errs.name    = 'Please enter your name';
  if (!f.email.trim())   errs.email   = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = 'Please enter a valid email';
  if (!f.message.trim()) errs.message = 'Please add a short message';
  return errs;
};

const ContactForm = ({ compact = false, defaultInterest = 'getstarted', onDone }) => {
  const [form, setForm] = useState({ ...INITIAL_FORM, interest: defaultInterest });
  const [errs, setErrs] = useState({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setForm(f => ({ ...f, interest: defaultInterest })); }, [defaultInterest]);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errs[k]) setErrs({ ...errs, [k]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrs(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/arvindkr40882@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Gomarix lead: ${form.interest} — ${form.name}`,
          _template: 'table',
          _captcha: 'false',
          name: form.name,
          email: form.email,
          company: form.company || '—',
          interest: form.interest,
          message: form.message,
          source: 'gomarix.in contact form',
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setDone(true);
      if (onDone) onDone(form);
    } catch (err) {
      setErrs({ message: 'Could not send right now. Please WhatsApp us at +91 87896 94039 — fastest reply.' });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="success-card">
        <div className="ring">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7"/></svg>
        </div>
        <h4>Thanks, {form.name.split(' ')[0] || 'there'}! 🎉</h4>
        <p>We've got your message and will be in touch within 1 business day.</p>
        <button type="button" className="btn btn-ghost" style={{ marginTop: 18 }} onClick={() => { setForm({ ...INITIAL_FORM, interest: defaultInterest }); setDone(false); }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-row two">
        <div className={`field ${errs.name ? 'invalid' : ''}`}>
          <label htmlFor="cf-name">Full name</label>
          <input id="cf-name" type="text" placeholder="Ada Lovelace" value={form.name} onChange={set('name')} autoComplete="name"/>
          <span className="err">{errs.name || ''}</span>
        </div>
        <div className={`field ${errs.email ? 'invalid' : ''}`}>
          <label htmlFor="cf-email">Work email</label>
          <input id="cf-email" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} autoComplete="email"/>
          <span className="err">{errs.email || ''}</span>
        </div>
      </div>

      {!compact && (
        <div className="form-row two">
          <div className="field">
            <label htmlFor="cf-company">Company</label>
            <input id="cf-company" type="text" placeholder="Acme Inc." value={form.company} onChange={set('company')} autoComplete="organization"/>
          </div>
          <div className="field">
            <label>I'm interested in</label>
            <Dropdown
              value={form.interest}
              onChange={(v) => setForm({ ...form, interest: v })}
              options={[
                { value: 'getstarted', label: 'Software development',  desc: 'Web, mobile, or custom platform', icon: 'code' },
                { value: 'ai',         label: 'AI solution',           desc: 'LLMs, agents, ML, automation',    icon: 'cpu' },
                { value: 'saas',       label: 'SaaS / AI tool',        desc: 'Multi-tenant product build',      icon: 'sparkle' },
                { value: 'data',       label: 'Data platform',         desc: 'Pipelines, analytics, dashboards',icon: 'chart' },
                { value: 'inclusion',  label: 'Education / Health / Rural', desc: 'EdTech, HealthTech, digital inclusion', icon: 'shield' },
                { value: 'demo',       label: 'Free consultation',     desc: 'Discuss your requirements',       icon: 'bolt' },
                { value: 'partner',    label: 'Partnership',           desc: 'NGO, agency, or referral',        icon: 'layers' },
                { value: 'other',      label: 'Something else',        desc: 'Tell us what you need',           icon: 'message' },
              ]}
            />
          </div>
        </div>
      )}

      <div className="form-row">
        <div className={`field ${errs.message ? 'invalid' : ''}`}>
          <label htmlFor="cf-msg">Message</label>
          <textarea id="cf-msg" placeholder="Tell us about your team and what you're trying to build…" value={form.message} onChange={set('message')}/>
          <span className="err">{errs.message || ''}</span>
        </div>
      </div>

      <div className="form-foot">
        <small>By submitting, you agree to our Terms &amp; Privacy Policy.</small>
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? 'Sending…' : 'Send message'} {!busy && <Icon name="arrow" size={15}/>}
        </button>
      </div>
    </form>
  );
};

/* =========================
   Contact page section
   ========================= */
const ContactSection = () => (
  <section className="block" id="contact">
    <div className="container">
      <div className="section-head reveal">
        <div className="kicker">Contact</div>
        <h2>Let's build something great together</h2>
        <p>Have a project in mind? Need a website, app, or SaaS product? Our team replies within one business day.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info reveal">
          <h3>Talk to a human</h3>
          <p>Pick the channel that suits you — we usually reply within minutes during business hours.</p>

          <a
            className="contact-channel contact-channel-wa"
            href={waLink("Hi Gomarix team! I'd like to learn more about your services. Can you help?")}
            target="_blank" rel="noreferrer noopener"
          >
            <span className="ico ico-wa">
              <Icon name="whatsapp" size={20} stroke={0}/>
            </span>
            <span>
              <span className="lbl">WhatsApp · Fastest reply</span>
              <span className="val">Tap to start a chat</span>
            </span>
            <span className="ch-arrow" aria-hidden="true">→</span>
          </a>
          <a
            className="contact-channel"
            href="mailto:arvindkr40882@gmail.com?subject=Hi%20Gomarix%20%E2%80%94%20I%E2%80%99d%20like%20to%20know%20more&body=Hi%20Gomarix%20team%2C%0A%0AI%E2%80%99d%20like%20to%20know%20more%20about%20your%20services.%0A%0AMy%20requirements%3A%0A%0AThanks%21"
          >
            <span className="ico"><Icon name="message" size={20}/></span>
            <span>
              <span className="lbl">Email Support</span>
              <span className="val">Reply within 1 business day</span>
            </span>
            <span className="ch-arrow" aria-hidden="true">→</span>
          </a>
          <a
            className="contact-channel contact-channel-li"
            href="https://www.linkedin.com/company/gomarix/"
            target="_blank" rel="noreferrer noopener"
          >
            <span className="ico ico-li">
              <Icon name="linkedin" size={20}/>
            </span>
            <span>
              <span className="lbl">LinkedIn · Follow us</span>
              <span className="val">linkedin.com/company/gomarix</span>
            </span>
            <span className="ch-arrow" aria-hidden="true">→</span>
          </a>
          <div className="contact-channel" style={{ cursor: 'default' }}>
            <span className="ico"><Icon name="target" size={18}/></span>
            <span>
              <span className="lbl">Based in</span>
              <span className="val">Bihar, India · Serving clients pan-India &amp; globally</span>
            </span>
          </div>
        </div>

        <div className="form-card reveal">
          <ContactForm defaultInterest="getstarted"/>
        </div>
      </div>
    </div>
  </section>
);

/* =========================
   Contact Modal
   ========================= */
const ContactModal = ({ mode, planName, onClose }) => {
  const wrapRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const titles = {
    getstarted: { h: 'Start your project with Gomarix', s: 'Tell us about your project — we will reply within 1 business day.' },
    demo:       { h: 'Book a free consultation',  s: 'Discuss your project with our team.' },
    sales:      { h: 'Get a custom quote',        s: 'Pricing for complex or enterprise projects.' },
    support:    { h: 'Contact support',           s: 'Our team responds within one business day.' },
  };
  const t = titles[mode] || titles.getstarted;

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal" ref={wrapRef}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <h3 id="modal-title">{t.h}</h3>
        <p className="sub">{planName ? `${planName} plan · ${t.s}` : t.s}</p>
        <ContactForm compact defaultInterest={mode}/>
      </div>
    </div>
  );
};

/* =========================
   Auth Modal (Sign In / Sign Up / Magic Link)
   ========================= */
const scorePassword = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 14) s = Math.min(4, s + 1);
  return s;
};
const STRENGTH_LABEL = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'];

const AuthModal = ({ tab: initialTab = 'signin', onClose }) => {
  const [tab, setTab] = useState(initialTab);
  const tabs = [
    { id: 'signin', label: 'Sign in' },
    { id: 'signup', label: 'Sign up' },
    { id: 'magic',  label: 'Magic link' },
  ];
  const [inkStyle, setInkStyle] = useState({});
  const tabRefs = useRef({});
  useEffect(() => {
    const el = tabRefs.current[tab];
    if (el) setInkStyle({ width: el.offsetWidth - 12, transform: `translateX(${el.offsetLeft + 6}px)` });
  }, [tab]);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const heroCopy = {
    signin: { h: 'Welcome back',           p: 'Sign in to your Gomarix account.' },
    signup: { h: 'Start your project',     p: 'Create an account and tell us what you need.' },
    magic:  { h: 'Sign in with email',     p: "We'll send a secure one-time link to your inbox." },
  }[tab];

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true">
      <div className="modal auth-modal">
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>

        <div className="auth-hero">
          <div className="mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 12 5l7 14Z"/><circle cx="12" cy="15" r="1.5" fill="#fff"/></svg>
          </div>
          <h3>{heroCopy.h}</h3>
          <p>{heroCopy.p}</p>
        </div>

        <div className="auth-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              ref={el => (tabRefs.current[t.id] = el)}
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >{t.label}</button>
          ))}
          <span className="ink" style={inkStyle}/>
        </div>

        <div className="auth-body">
          {tab === 'signin' && <SignInForm onSwitch={setTab}/>}
          {tab === 'signup' && <SignUpForm onSwitch={setTab}/>}
          {tab === 'magic'  && <MagicLinkForm onSwitch={setTab}/>}
        </div>
      </div>
    </div>
  );
};

const SocialRow = () => (
  <>
    <div className="social-row">
      <button type="button" className="social-btn" title="Continue with Google">
        <Icon name="google" size={16}/> Google
      </button>
      <button type="button" className="social-btn" title="Continue with GitHub">
        <Icon name="githubBrand" size={16}/> GitHub
      </button>
      <button type="button" className="social-btn" title="Continue with Microsoft">
        <Icon name="microsoft" size={16}/> Microsoft
      </button>
    </div>
    <button type="button" className="sso-btn">
      <Icon name="key" size={15}/> Continue with SSO
    </button>
    <div className="auth-divider">or</div>
  </>
);

const SignInForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) x.email = 'Enter a valid email';
    if (pw.length < 6) x.pw = 'Password must be at least 6 characters';
    setErr(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); setDone(true); }, 900);
  };

  if (done) return (
    <div className="success-card" style={{ padding: '10px 0 0' }}>
      <div className="ring"><Icon name="check" size={26} stroke={2.4}/></div>
      <h4>Signed in!</h4>
      <p>Redirecting you to your dashboard…</p>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <SocialRow/>
      <div className={`field ${err.email ? 'invalid' : ''}`}>
        <label>Work email</label>
        <input type="email" placeholder="you@company.com" value={email} onChange={e => { setEmail(e.target.value); setErr({...err, email: undefined}); }} autoComplete="email"/>
        <span className="err">{err.email || ''}</span>
      </div>
      <div className={`field ${err.pw ? 'invalid' : ''}`}>
        <label>Password</label>
        <div className="pw-wrap">
          <input type={show ? 'text' : 'password'} placeholder="••••••••" value={pw} onChange={e => { setPw(e.target.value); setErr({...err, pw: undefined}); }} autoComplete="current-password"/>
          <button type="button" className="pw-eye" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            <Icon name={show ? 'eyeOff' : 'eye'} size={16}/>
          </button>
        </div>
        <span className="err">{err.pw || ''}</span>
      </div>

      <div className="row-between">
        <label className="chk">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
          <span className="box"><Icon name="check" size={11} stroke={3}/></span>
          Remember me
        </label>
        <a className="link-muted" onClick={(e) => e.preventDefault()} href="#">Forgot password?</a>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'} {!busy && <Icon name="arrow" size={15}/>}
      </button>
      <div className="auth-foot">
        New to Gomarix? <a onClick={() => onSwitch('signup')}>Create an account →</a>
      </div>
    </form>
  );
};

const SignUpForm = ({ onSwitch }) => {
  const [f, setF] = useState({ name: '', email: '', pw: '', agree: false });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const score = useMemo(() => scorePassword(f.pw), [f.pw]);
  const strengthCls = f.pw ? `s${Math.max(1, score)}` : '';

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setF({ ...f, [k]: v });
    if (err[k]) setErr({ ...err, [k]: undefined });
  };

  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) x.email = 'Enter a valid email';
    if (score < 2) x.pw = 'Use at least 8 chars, uppercase, number';
    if (!f.agree) x.agree = 'You must agree to continue';
    setErr(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); setDone(true); }, 1100);
  };

  if (done) return (
    <div className="success-card" style={{ padding: '10px 0 0' }}>
      <div className="ring"><Icon name="check" size={26} stroke={2.4}/></div>
      <h4>Account created 🎉</h4>
      <p>Welcome aboard, {f.name.split(' ')[0]}! Check your inbox to verify.</p>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <SocialRow/>
      <div className="form-row two">
        <div className={`field ${err.name ? 'invalid' : ''}`}>
          <label>Full name</label>
          <input type="text" placeholder="Ada Lovelace" value={f.name} onChange={set('name')} autoComplete="name"/>
          <span className="err">{err.name || ''}</span>
        </div>
        <div className={`field ${err.email ? 'invalid' : ''}`}>
          <label>Work email</label>
          <input type="email" placeholder="you@company.com" value={f.email} onChange={set('email')} autoComplete="email"/>
          <span className="err">{err.email || ''}</span>
        </div>
      </div>

      <div className={`field ${err.pw ? 'invalid' : ''}`}>
        <label>Password</label>
        <div className="pw-wrap">
          <input type={show ? 'text' : 'password'} placeholder="At least 8 characters" value={f.pw} onChange={set('pw')} autoComplete="new-password"/>
          <button type="button" className="pw-eye" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            <Icon name={show ? 'eyeOff' : 'eye'} size={16}/>
          </button>
        </div>
        {f.pw && (
          <div className="strength">
            <div className={`strength-bars ${strengthCls}`}>
              <span/><span/><span/><span/>
            </div>
            <div className={`strength-label ${strengthCls}`}>{STRENGTH_LABEL[score]}</div>
          </div>
        )}
        <span className="err">{err.pw || ''}</span>
      </div>

      <label className={`chk ${err.agree ? 'invalid' : ''}`} style={{ margin: '8px 0 16px' }}>
        <input type="checkbox" checked={f.agree} onChange={set('agree')}/>
        <span className="box"><Icon name="check" size={11} stroke={3}/></span>
        <span>I agree to the <a className="link-muted" href="#" onClick={(e)=>e.preventDefault()}>Terms</a> and <a className="link-muted" href="#" onClick={(e)=>e.preventDefault()}>Privacy Policy</a></span>
      </label>
      {err.agree && <div className="err" style={{ color:'#ff7b7b', fontSize:12, marginTop:-10, marginBottom:10 }}>{err.agree}</div>}

      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={busy}>
        {busy ? 'Creating account…' : 'Create free account'} {!busy && <Icon name="arrow" size={15}/>}
      </button>
      <div className="auth-foot">
        Already have an account? <a onClick={() => onSwitch('signin')}>Sign in →</a>
      </div>
    </form>
  );
};

const MagicLinkForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Enter a valid email'); return; }
    setErr(''); setBusy(true);
    setTimeout(() => { setBusy(false); setDone(true); }, 900);
  };

  if (done) return (
    <div className="success-card" style={{ padding: '10px 0 0' }}>
      <div className="ring"><Icon name="mail" size={26}/></div>
      <h4>Check your inbox</h4>
      <p>We sent a secure sign-in link to <b style={{color:'var(--text)'}}>{email}</b>. It expires in 15 min.</p>
      <button type="button" className="btn btn-ghost" style={{ marginTop: 18 }} onClick={() => { setDone(false); setEmail(''); }}>Use a different email</button>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <div className={`field ${err ? 'invalid' : ''}`}>
        <label>Work email</label>
        <input type="email" placeholder="you@company.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} autoComplete="email"/>
        <span className="err">{err || ''}</span>
      </div>
      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={busy}>
        {busy ? 'Sending link…' : 'Send magic link'} {!busy && <Icon name="mail" size={15}/>}
      </button>
      <div className="auth-foot">
        Prefer a password? <a onClick={() => onSwitch('signin')}>Sign in →</a>
      </div>
    </form>
  );
};

/* =========================
   Scheduler Modal (Calendly-style)
   ========================= */
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const buildTimeSlots = (seed) => {
  // Deterministic pseudo-random "booked" slots per-date, stable between re-renders
  const rnd = (() => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
  const slots = [];
  for (let h = 9; h < 18; h++) {
    for (const m of [0, 30]) {
      const hour12 = ((h + 11) % 12) + 1;
      slots.push({
        key: `${h}:${m}`,
        label: `${hour12}:${String(m).padStart(2,'0')} ${h < 12 ? 'AM' : 'PM'}`,
        busy: rnd() < 0.22,
      });
    }
  }
  return slots;
};

const SchedulerModal = ({ onClose }) => {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const maxDate = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + 60); return d; }, [today]);

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate]     = useState(null);
  const [timeKey, setTime]  = useState(null);
  const [tz, setTz]         = useState(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch(e) { return 'UTC'; }
  });
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState({ name: '', email: '', company: '', size: 'small', notes: '' });
  const [errs, setErrs]     = useState({});
  const [busy, setBusy]     = useState(false);

  // Unique Jitsi Meet room generated once per modal session
  const meetRoom = useMemo(() => {
    const rand = Math.random().toString(36).slice(2, 10);
    const ts = Date.now().toString(36);
    return `gomarix-consult-${ts}-${rand}`;
  }, []);
  const meetUrl = `https://meet.jit.si/${meetRoom}`;
  const [copied, setCopied] = useState(false);
  const copyMeetLink = async () => {
    try {
      await navigator.clipboard.writeText(meetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {}
  };

  useEffect(() => {
    document.body.classList.add('no-scroll');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  // Build calendar cells
  const cells = useMemo(() => {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    const firstWd = new Date(y, m, 1).getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    const prevDim = new Date(y, m, 0).getDate();
    const out = [];
    for (let i = firstWd - 1; i >= 0; i--) out.push({ day: prevDim - i, out: true });
    for (let d = 1; d <= dim; d++) {
      const cd = new Date(y, m, d);
      const past = cd < today;
      const future = cd > maxDate;
      const weekend = cd.getDay() === 0 || cd.getDay() === 6;
      out.push({ day: d, date: cd, dis: past || future || weekend, today: sameDay(cd, today) });
    }
    while (out.length % 7 !== 0) out.push({ day: out.length, out: true });
    return out;
  }, [cursor, today, maxDate]);

  const slots = useMemo(() => {
    if (!date) return [];
    return buildTimeSlots(date.getDate() * 31 + date.getMonth() * 17 + date.getFullYear());
  }, [date]);

  const selectedSlot = slots.find(s => s.key === timeKey);

  const set = (k) => (e) => {
    const v = e && e.target ? e.target.value : e;
    setForm({ ...form, [k]: v });
    if (errs[k]) setErrs({ ...errs, [k]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (!form.name.trim())  x.name  = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) x.email = 'Enter a valid work email';
    setErrs(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    try {
      await fetch('https://formsubmit.co/ajax/arvindkr40882@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Gomarix consultation booking — ${form.name}`,
          _template: 'table',
          _captcha: 'false',
          name: form.name,
          email: form.email,
          company: form.company || '—',
          companySize: form.size || '—',
          date: prettyDate,
          time: selectedSlot ? selectedSlot.label : '—',
          timezone: tz,
          meetingLink: meetUrl,
          notes: form.notes || '—',
          source: 'gomarix.in scheduler',
        }),
      });
      setStep(3);
    } catch (_) {
      setStep(3);
    } finally {
      setBusy(false);
    }
  };

  const monthLabel = `${MONTHS_LONG[cursor.getMonth()]} ${cursor.getFullYear()}`;
  const canPrev = cursor.getFullYear() > today.getFullYear() || (cursor.getFullYear() === today.getFullYear() && cursor.getMonth() > today.getMonth());
  const canNext = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <= maxDate;

  const prettyDate = date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : '';

  // Google Calendar link for success (includes Jitsi meeting URL)
  const gcalHref = useMemo(() => {
    if (!date || !selectedSlot) return '#';
    const [h, m] = timeKey.split(':').map(Number);
    const start = new Date(date); start.setHours(h, m, 0, 0);
    const end = new Date(start); end.setMinutes(end.getMinutes() + 30);
    const fmt = (d) => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const details = `30-minute video consultation with the Gomarix team.\n\nJoin the meeting: ${meetUrl}\n\nAttendee: ${form.name} (${form.email})\nCompany: ${form.company || '—'}\nNotes: ${form.notes || '—'}`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Gomarix consultation',
      dates: `${fmt(start)}/${fmt(end)}`,
      details,
      location: meetUrl,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [date, timeKey, selectedSlot, form, meetUrl]);

  // Outlook.com "deep link" calendar invite
  const outlookHref = useMemo(() => {
    if (!date || !selectedSlot) return '#';
    const [h, m] = timeKey.split(':').map(Number);
    const start = new Date(date); start.setHours(h, m, 0, 0);
    const end = new Date(start); end.setMinutes(end.getMinutes() + 30);
    const body = `30-minute video consultation with the Gomarix team.\n\nJoin the meeting: ${meetUrl}\n\nAttendee: ${form.name} (${form.email})\nCompany: ${form.company || '—'}\nNotes: ${form.notes || '—'}`;
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: 'Gomarix consultation',
      startdt: start.toISOString(),
      enddt: end.toISOString(),
      body,
      location: meetUrl,
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }, [date, timeKey, selectedSlot, form, meetUrl]);

  // Downloadable .ics for Apple Calendar / any calendar app
  const icsDataUrl = useMemo(() => {
    if (!date || !selectedSlot) return '#';
    const [h, m] = timeKey.split(':').map(Number);
    const start = new Date(date); start.setHours(h, m, 0, 0);
    const end = new Date(start); end.setMinutes(end.getMinutes() + 30);
    const fmt = (d) => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const escape = (s) => String(s).replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
    const uid = `${meetRoom}@gomarix.in`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Gomarix//Consultation//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      'SUMMARY:Gomarix consultation',
      `DESCRIPTION:${escape(`Join the meeting: ${meetUrl}\n\nAttendee: ${form.name} (${form.email})\nCompany: ${form.company || '—'}\nNotes: ${form.notes || '—'}`)}`,
      `LOCATION:${meetUrl}`,
      `URL:${meetUrl}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }, [date, timeKey, selectedSlot, form, meetRoom, meetUrl]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-labelledby="sched-title">
      <div className="modal sched-modal">
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>

        <div className="sched-head">
          <div className="sched-host">
            <div className="sched-avatar">OM</div>
            <div>
              <h3 id="sched-title">Book a free consultation with Gomarix</h3>
              <p><Icon name="bolt" size={13}/> 30 min <span className="sep">·</span> Video call <span className="sep">·</span> Project consultation</p>
            </div>
          </div>
          <div className="stepper" style={{ margin: 0 }}>
            <span className={`pip ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}/>
            <span className={`pip ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}/>
            <span className={`pip ${step === 3 ? 'active' : ''}`}/>
            <span className="cnt">Step {step} of 3</span>
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="sched-body">
              <div className="sched-two">
                <div>
                  <div className="cal-head">
                    <h4>{monthLabel}</h4>
                    <div className="cal-nav">
                      <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
                      </button>
                      <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="cal-grid">
                    {DOW.map(d => <div className="cal-dow" key={d}>{d}</div>)}
                    {cells.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`cal-day ${c.out ? 'out' : ''} ${c.dis ? 'dis' : ''} ${c.today ? 'today' : ''} ${!c.out && !c.dis && sameDay(c.date, date) ? 'sel' : ''}`}
                        disabled={c.out || c.dis}
                        onClick={() => { if (!c.out && !c.dis) { setDate(c.date); setTime(null); } }}
                      >{c.day}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="slots-head">
                    <div className="date-lbl">{date ? prettyDate : 'Available times'}</div>
                    <div className="tz-chip">
                      <Icon name="target" size={12}/>
                      <span>{tz.replace('_',' ')}</span>
                    </div>
                  </div>

                  {!date && (
                    <div className="slots-empty">
                      <Icon name="sparkle" size={28}/>
                      <div>Pick a date on the left<br/>to see available 30-min slots.</div>
                    </div>
                  )}

                  {date && (
                    <div className="slots-list">
                      {slots.map(s => (
                        <button
                          type="button"
                          key={s.key}
                          className={`slot ${s.busy ? 'busy' : ''} ${timeKey === s.key ? 'sel' : ''}`}
                          disabled={s.busy}
                          onClick={() => setTime(s.key)}
                        >{s.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sched-foot">
              <div className="hint">
                {!date && 'Step 1 — Pick a date'}
                {date && !timeKey && 'Step 1 — Now pick a time'}
                {date && timeKey && `✓ ${prettyDate} at ${selectedSlot.label}`}
              </div>
              <button type="button" className="btn btn-primary" disabled={!date || !timeKey} onClick={() => setStep(2)}>
                Continue <Icon name="arrow" size={14}/>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <form onSubmit={submit} noValidate>
            <div className="sched-body">
              <div className="booked-chip">
                <span className="bicon"><Icon name="bolt" size={15} stroke={2.2}/></span>
                <div>
                  <b>{prettyDate} · {selectedSlot?.label}</b>
                  <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 2 }}>30 min video call · {tz.replace('_',' ')}</div>
                </div>
                <button type="button" className="change" onClick={() => setStep(1)}>Change</button>
              </div>

              <div className="form-row two">
                <div className={`field ${errs.name ? 'invalid' : ''}`}>
                  <label>Full name</label>
                  <input type="text" placeholder="Ada Lovelace" value={form.name} onChange={set('name')} autoComplete="name"/>
                  <span className="err">{errs.name || ''}</span>
                </div>
                <div className={`field ${errs.email ? 'invalid' : ''}`}>
                  <label>Work email</label>
                  <input type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} autoComplete="email"/>
                  <span className="err">{errs.email || ''}</span>
                </div>
              </div>

              <div className="form-row two">
                <div className="field">
                  <label>Company</label>
                  <input type="text" placeholder="Acme Inc." value={form.company} onChange={set('company')} autoComplete="organization"/>
                </div>
                <div className="field">
                  <label>Company size</label>
                  <Dropdown
                    value={form.size}
                    onChange={set('size')}
                    options={[
                      { value:'solo',     label:'Just me',        desc:'Freelancer / founder',     icon:'user' },
                      { value:'small',    label:'2–10 people',    desc:'Small team or startup',    icon:'workflow' },
                      { value:'mid',      label:'11–50 people',   desc:'Growing company',          icon:'layers' },
                      { value:'large',    label:'51–200 people',  desc:'Mid-market',               icon:'building' },
                      { value:'xlarge',   label:'200+ people',    desc:'Enterprise',               icon:'shield' },
                    ]}
                  />
                </div>
              </div>

              <div className="field">
                <label>What would you like to cover? <span style={{ color:'var(--text-mute)', fontWeight:400 }}>(optional)</span></label>
                <textarea placeholder="E.g. I'd like to see how Gomarix handles event pipelines at scale…" value={form.notes} onChange={set('notes')}/>
              </div>
            </div>

            <div className="sched-foot">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                <Icon name="chev" size={14} style={{ transform:'rotate(90deg)' }}/> Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Scheduling…' : 'Confirm meeting'} {!busy && <Icon name="check" size={15} stroke={2.4}/>}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (() => {
          const SIZE_LABELS = { solo:'Just me', small:'2–10 people', mid:'11–50 people', large:'51–200 people', xlarge:'200+ people' };
          const waMsg =
`🗓️ *New consultation booked via Gomarix.ai*

👤 *Name:* ${form.name}
📧 *Email:* ${form.email}${form.company ? `\n🏢 *Company:* ${form.company}` : ''}${form.size ? `\n👥 *Team size:* ${SIZE_LABELS[form.size] || form.size}` : ''}

📅 *Date:* ${prettyDate}
⏰ *Time:* ${selectedSlot?.label}
🌍 *Timezone:* ${tz.replace('_',' ')}
⏱️ *Duration:* 30 min video call

🎥 *Join meeting:* ${meetUrl}
${form.notes ? `\n📝 *Agenda / Notes:*\n${form.notes}\n` : ''}
Looking forward to our chat! 🚀`;

          return (
          <div className="sched-body">
            <div className="success-card" style={{ padding: '8px 0 0' }}>
              <div className="ring"><Icon name="check" size={28} stroke={2.4}/></div>
              <h4>You're booked! 🎉</h4>
              <p>A calendar invite is on its way to <b style={{ color:'var(--text)' }}>{form.email}</b></p>
              <div className="meet-card">
                <div className="row">
                  <span className="bubble"><Icon name="bolt" size={14}/></span>
                  <div><b>Gomarix consultation</b><small>30-minute video call</small></div>
                </div>
                <div className="row">
                  <span className="bubble"><Icon name="sparkle" size={14}/></span>
                  <div><b>{prettyDate}</b><small>{selectedSlot?.label} · {tz.replace('_',' ')}</small></div>
                </div>
                <div className="row">
                  <span className="bubble"><Icon name="user" size={14}/></span>
                  <div><b>{form.name || 'You'}</b><small>{form.company || 'Gomarix team'}</small></div>
                </div>
              </div>

              {/* Meeting link — prominent join button */}
              <div className="meet-link-box">
                <div className="meet-link-row">
                  <span className="meet-link-icon">🎥</span>
                  <div className="meet-link-text">
                    <b>Video meeting link</b>
                    <small>Click "Join" at your scheduled time — no download or account required.</small>
                  </div>
                </div>
                <div className="meet-link-url" onClick={copyMeetLink} title="Click to copy">
                  <code>{meetUrl}</code>
                  <span className={`copy-indicator ${copied ? 'copied' : ''}`}>{copied ? '✓ Copied' : 'Copy'}</span>
                </div>
                <div className="meet-link-actions">
                  <a href={meetUrl} target="_blank" rel="noreferrer noopener" className="btn btn-primary btn-join">
                    🎥 Join Meeting
                  </a>
                  <button type="button" className="btn btn-ghost" onClick={copyMeetLink}>
                    {copied ? '✓ Copied' : 'Copy link'}
                  </button>
                </div>
              </div>

              <button type="button" className="btn-wa" onClick={() => openWA(waMsg)} style={{ width:'100%', maxWidth: 420, margin: '14px auto 0' }}>
                <Icon name="whatsapp" size={18} stroke={0}/>
                Send details on WhatsApp
              </button>
              <small style={{ display:'block', marginTop: 8, color:'var(--text-mute)', fontSize: 12 }}>
                Shares booking + meeting link with <b style={{ color:'#7fe5a0' }}>+91 87896 94039</b>
              </small>

              <div className="cal-buttons" style={{ marginTop: 14 }}>
                <a href={gcalHref} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
                  <Icon name="google" size={14}/> Google Calendar
                </a>
                <a href={outlookHref} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
                  <Icon name="microsoft" size={14}/> Outlook
                </a>
                <a href={icsDataUrl} download="gomarix-consultation.ics" className="btn btn-ghost">
                  📅 .ics file
                </a>
              </div>
            </div>
            <div className="sched-foot" style={{ marginTop: 20, borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div className="hint">Need to reschedule? Reply on WhatsApp or use the calendar invite.</div>
              <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </div>
          );
        })()}
      </div>
    </div>
  );
};

/* =========================
   WhatsApp integration
   ========================= */
const WHATSAPP_NUMBER = '918789694039'; // +91 87896 94039
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const openWA = (msg) => window.open(waLink(msg), '_blank', 'noopener,noreferrer');

const timeNow = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

/* AI message generator — rule-based "assistant" that drafts
   personalized WhatsApp messages based on topic + optional user context. */
const AI_TOPICS = [
  {
    id: 'project',
    label: '🚀 Start a project',
    reply:
`Great choice! We build:
• Business websites & landing pages
• Full-stack apps (schools, clinics, booking systems)
• Custom SaaS products & automation

I've drafted a message below — edit anything, then tap *Send on WhatsApp* and our team will get right back to you.`,
    draft: (ctx) =>
`Hi Gomarix team! 👋

I'm interested in getting a project built:

*Project type:* [website / web app / SaaS / automation]
*Industry:* [e.g. healthcare, education, e-commerce]
*Brief description:* [what you need built]

${ctx.name ? `I'm ${ctx.name}` : 'A bit about me'}${ctx.company ? ` from ${ctx.company}` : ''}.

Can we schedule a free consultation?

Thanks!`,
  },
  {
    id: 'pricing',
    label: '💳 Pricing',
    reply:
`Great question — transparent pricing is our thing.

Quick overview:
• *Basic* — ₹4,999 — 5-page website, SEO, contact form
• *Standard* — ₹12,999 — 10 pages, blog, advanced SEO, analytics
• *Premium* — ₹24,999 — web app, admin panel, payments, automation

I've drafted a pricing question for you below. Send it on WhatsApp and we'll reply with a custom quote 👇`,
    draft: (ctx) =>
`Hi Gomarix! 💳

I'm looking for a quote on a project${ctx.company ? ` for ${ctx.company}` : ''}.

*What I need:* [website / app / SaaS / automation]
*Key features:* [list main features]
*Timeline:* [when do you need it]
*Budget range:* [if known]

Thanks!`,
  },
  {
    id: 'support',
    label: '🛠️ Existing project support',
    reply:
`Our support team typically replies within an hour during business hours.

Tell us about your issue below and we'll get it sorted 👇`,
    draft: (ctx) =>
`Hi Gomarix Support 🛠️

*Project:* [which project/website]
*Issue:* [describe what's happening]
*Urgency:* [low / medium / high]
*Contact email:* ${ctx.email || '[your email]'}

Thanks!`,
  },
  {
    id: 'partner',
    label: '🤝 Partnership',
    reply:
`We partner with agencies, freelancers, and businesses for white-label and referral collaborations.

Share a bit about your company and we'll set up a call 👇`,
    draft: (ctx) =>
`Hi Gomarix Partnerships 🤝

I'm ${ctx.name || '[your name]'}${ctx.company ? ` from ${ctx.company}` : ' from [company]'}.

We're interested in:
☐ White-label development
☐ Referral partnership
☐ Agency collaboration
☐ Reseller program

A bit about us: [1-2 sentences]

Could we schedule a 20-min intro call?

Thanks!`,
  },
  {
    id: 'other',
    label: '💬 Something else',
    reply:
`No problem! Just type your message below and we'll send it to our team on WhatsApp. We usually reply within a few minutes during business hours 👇`,
    draft: () => '',
  },
];

const WhatsAppWidget = () => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: `👋 Hi! I'm *Aria*, Gomarix's AI assistant.\n\nI can help you start a project, answer pricing questions, or connect you to our team on WhatsApp. What do you need today?`, time: timeNow() },
  ]);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing, topic]);

  const pickTopic = (t) => {
    setMessages(m => [...m, { from: 'user', text: t.label, time: timeNow() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setTopic(t);
      setMessages(m => [...m, { from: 'bot', text: t.reply, time: timeNow() }]);
      setDraft(t.draft({}));
    }, 900 + Math.random() * 400);
  };

  const reset = () => {
    setTopic(null);
    setDraft('');
    setMessages([{ from: 'bot', text: `👋 Hi! I'm *Aria*, Gomarix's AI assistant.\n\nI can help you start a project, answer pricing questions, or connect you to our team on WhatsApp. What do you need today?`, time: timeNow() }]);
  };

  const send = () => {
    if (!draft.trim()) return;
    openWA(draft);
    setMessages(m => [
      ...m,
      { from: 'user', text: draft, time: timeNow() },
      { from: 'bot',  text: `✅ Sent! Your WhatsApp should have opened in a new tab.\n\nOur team will reply from *+91 87896 94039* shortly. You can close this chat — the conversation continues on WhatsApp.`, time: timeNow() },
    ]);
    setDraft('');
    setTopic(null);
  };

  return (
    <>
      <button
        className={`wa-fab ${open ? 'hidden' : ''}`}
        aria-label="Open WhatsApp chat"
        onClick={() => setOpen(true)}
      >
        <Icon name="whatsapp" size={30} stroke={0}/>
        <span className="dot"/>
      </button>

      {open && (
        <div className="wa-widget" role="dialog" aria-label="WhatsApp chat">
          <div className="wa-head">
            <div className="wa-head-avatar">
              <Icon name="whatsapp" size={22} stroke={0}/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="name">
                Aria <span className="wa-ai-badge"><Icon name="sparkle" size={9} stroke={2.4}/> AI</span>
              </div>
              <div className="sub">Online · replies in minutes</div>
            </div>
            <button className="wa-close-btn" aria-label="Close chat" onClick={() => setOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          </div>

          <div className="wa-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`wa-bubble ${m.from}`}>
                {m.text}
                <span className="time">{m.time}</span>
              </div>
            ))}
            {typing && (
              <div className="wa-typing"><span/><span/><span/></div>
            )}
            {!topic && !typing && (
              <div className="wa-chips">
                {AI_TOPICS.map(t => (
                  <button key={t.id} type="button" className="wa-chip" onClick={() => pickTopic(t)}>
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {topic && (
            <div className="wa-input-area">
              <textarea
                rows={4}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your message…"
              />
              <button type="button" className="wa-send-btn" onClick={send} disabled={!draft.trim()}>
                <Icon name="whatsapp" size={16} stroke={0}/> Send on WhatsApp
              </button>
              <small className="wa-hint">
                Opens WhatsApp chat with <b>+91 87896 94039</b>
                <button
                  type="button"
                  onClick={reset}
                  style={{ marginLeft: 8, color: 'var(--accent-2)', fontWeight: 600, textDecoration: 'underline' }}
                >Start over</button>
              </small>
            </div>
          )}
        </div>
      )}
    </>
  );
};

/* =========================
   Footer
   ========================= */
/* =========================
   Sticky mobile CTA bar
   ========================= */
const MobileCTABar = () => {
  const goContact = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  const waMsg = encodeURIComponent("Hi Gomarix! I'd like to know more about your services.");
  return (
    <nav className="mobile-cta" aria-label="Quick contact">
      <a href="tel:+918789694039" className="mobile-cta-call" aria-label="Call Gomarix">
        📞 Call
      </a>
      <a
        href={`https://wa.me/918789694039?text=${waMsg}`}
        target="_blank"
        rel="noreferrer noopener"
        className="mobile-cta-wa"
        aria-label="WhatsApp Gomarix"
      >
        💬 WhatsApp
      </a>
      <a href="#contact" className="mobile-cta-quote" onClick={goContact}>
        ✨ Get Quote
      </a>
    </nav>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setBusy(true);
    try {
      await fetch('https://formsubmit.co/ajax/arvindkr40882@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'New Gomarix newsletter subscriber',
          _template: 'table',
          _captcha: 'false',
          email,
          source: 'gomarix.in footer newsletter',
        }),
      });
      setDone(true); setEmail('');
      setTimeout(() => setDone(false), 3500);
    } catch (_) {
      setDone(true); setEmail('');
      setTimeout(() => setDone(false), 3500);
    } finally {
      setBusy(false);
    }
  };
  return (
    <footer>
      <div className="container foot-grid foot">
        <div>
          <div className="brand" style={{ marginBottom: 14 }}>
            <span className="logo-wrap logo-wrap-sm">
              <span className="logo-glow" aria-hidden="true"/>
              <img
                src={logoUrl}
                alt="Gomarix"
                className="brand-logo"
                width="128"
                height="32"
                loading="lazy"
                decoding="async"
              />
            </span>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, maxWidth: 320, margin:'0 0 20px' }}>
            We build websites, full-stack applications, SaaS products, and AI-powered automation for businesses of all sizes.
          </p>
          <div className="social">
            <a
              href={waLink("Hi Gomarix team! I'd like to learn more about your platform.")}
              target="_blank" rel="noreferrer noopener"
              aria-label="WhatsApp"
              style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.35)' }}
            >
              <Icon name="whatsapp" size={17} stroke={0}/>
            </a>
            <a href="#" aria-label="LinkedIn"><Icon name="linkedin" size={17}/></a>
            <a href="#" aria-label="Twitter"><Icon name="twitter"  size={17}/></a>
            <a href="#" aria-label="GitHub"><Icon   name="github"   size={17}/></a>
          </div>
        </div>

        <div>
          <h5>Services</h5>
          <ul>
            <li><a href="#features">Software Development</a></li>
            <li><a href="#features">AI Solutions</a></li>
            <li><a href="#features">Web &amp; Mobile Platforms</a></li>
            <li><a href="#features">SaaS &amp; AI Tools</a></li>
            <li><a href="#features">Automation Software</a></li>
            <li><a href="#features">Data Platforms</a></li>
          </ul>
        </div>
        <div>
          <h5>Focus Areas</h5>
          <ul>
            <li><a href="#customers">Education &amp; EdTech</a></li>
            <li><a href="#customers">Healthcare</a></li>
            <li><a href="#customers">Rural Tech</a></li>
            <li><a href="#customers">Digital Inclusion</a></li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h5>Stay in the loop</h5>
          <p style={{ color:'var(--text-dim)', fontSize: 13, margin:'0 0 14px' }}>
            Get project tips, case studies, and updates from our team.
          </p>
          <form className="newsletter" onSubmit={submit}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={busy}>{done ? '✓ Subscribed' : busy ? 'Sending…' : 'Subscribe'}</button>
          </form>
        </div>
      </div>

      <div className="container foot-bottom">
        <span>© {new Date().getFullYear()} Gomarix, Inc. All rights reserved.</span>
        <div style={{ display:'flex', gap: 20 }}>
          <a href="#" style={{ color:'var(--text-mute)' }}>Privacy</a>
          <a href="#" style={{ color:'var(--text-mute)' }}>Terms</a>
          <a href="#" style={{ color:'var(--text-mute)' }}>Security</a>
        </div>
      </div>
    </footer>
  );
};

/* =========================
   App
   ========================= */
const App = () => {
  useReveal();
  const [modal, setModal]       = useState(null); // contact modal
  const [authTab, setAuthTab]   = useState(null); // 'signin' | 'signup' | 'magic'
  const [schedOpen, setSched]   = useState(false);

  // Defer the WhatsApp widget so it doesn't block first paint
  const [showWA, setShowWA] = useState(false);
  useEffect(() => {
    const idle = (cb) => (window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 3000 }) : setTimeout(cb, 1500));
    const handle = idle(() => setShowWA(true));
    return () => { if (window.cancelIdleCallback && typeof handle === 'number') window.cancelIdleCallback(handle); };
  }, []);

  const openContact = useCallback((mode = 'sales', planName = null) => setModal({ mode, planName }), []);
  const scrollToContact = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  const openAuth      = useCallback((tab = 'signin') => setAuthTab(tab), []);
  const openScheduler = useCallback(() => setSched(true), []);
  const closeModal    = useCallback(() => setModal(null), []);
  const closeAuth     = useCallback(() => setAuthTab(null), []);
  const closeSched    = useCallback(() => setSched(false), []);

  const ctxValue = useMemo(
    () => ({ openContact, scrollToContact, openAuth, openScheduler }),
    [openContact, scrollToContact, openAuth, openScheduler]
  );

  return (
    <ContactCtx.Provider value={ctxValue}>
      <Progress />
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <Showcase />
        <MiniFeatures />
        <HowItWorks />
        <Stats />
        <Pricing />
        <ComparisonTable />
        <Testimonials />
        <FAQ />
        <BigCTA />
        <ContactSection />
      </main>
      <Footer />
      <MobileCTABar />
      {showWA && <WhatsAppWidget />}
      {modal     && <ContactModal mode={modal.mode} planName={modal.planName} onClose={closeModal}/>}
      {authTab   && <AuthModal tab={authTab} onClose={closeAuth}/>}
      {schedOpen && <SchedulerModal onClose={closeSched}/>}
    </ContactCtx.Provider>
  );
};

export default App;
