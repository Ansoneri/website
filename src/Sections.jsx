// Sections.jsx — AIDA flow with editorial section numbers
// Hero → Marquee → Practices → About → Metrics → Pricing
// → Manifesto (quote) → Journal → CTA (30-min disc) → Footer

// Big thin section numeral that sits in the background of every section
const SectionNumeral = ({ n }) =>
<span className="section-bg-num" aria-hidden="true">{n}</span>;

// ───────── TOP NAV ─────────
const TopNav = ({ active, theme, onTheme, lang, onLang }) => {
  const [showBrand, setShowBrand] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      // show ANSONS. once we've scrolled past the hero name
      const heroName = document.querySelector('.hero-name');
      if (!heroName) return;
      const r = heroName.getBoundingClientRect();
      setShowBrand(r.bottom < 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {setMenuOpen(false);}, [active]);
  const items = [
  ['hero', '00', 'Index'],
  ['about', '01', 'About'],
  ['practices', '02', 'Practices'],
  ['pricing', '03', 'Pricing'],
  ['journal', '04', 'Journal'],
  ['contact', '05', 'Contact']];

  return (
    <nav className={`nav ${menuOpen ? 'nav-open' : ''} ${showBrand ? 'nav-revealed' : 'nav-hidden'}`}>
      <a className={`nav-brand nav-brand-scroll ${showBrand ? 'is-visible' : ''}`} href="#hero" aria-label="Ansoneri">
        <span className="nav-brand-word">ANSONS<span className="o">.</span></span>
      </a>
      <div className="nav-menu">
        {items.map(([id, n, l]) =>
        <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
            <span className="num">{n}</span>{l}
          </a>
        )}
      </div>
      <div className="nav-right">
        <a className="nav-cta" href="#contact"><span className="dot"></span> Book a call</a>
        <button
          className={`nav-burger ${menuOpen ? 'is-open' : ''}`}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}>
          
          <span></span><span></span><span></span>
        </button>
      </div>
      <div className={`nav-drawer ${menuOpen ? 'is-open' : ''}`} role="menu">
        {items.map(([id, n, l]) =>
        <a key={id} href={`#${id}`} role="menuitem" onClick={() => setMenuOpen(false)}>
            <span className="num">{n}</span>{l}
          </a>
        )}
      </div>
    </nav>);

};

// ───────── HERO ─────────
const Hero = () => {
  const bgRef = React.useRef(null);
  const fgRef = React.useRef(null);
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.04)`;
      if (fgRef.current) fgRef.current.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section className="hero hero-v2 hero-v3" id="hero">
      <div className="hero-bg hero-bg-single" ref={bgRef}>
        <div className="hero-half full">
          <img src="assets/portrait-mercedes.jpg" alt="" />
        </div>
        <div className="hero-fog" />
        <div className="hero-grit" />
      </div>

      <div className="hero-top hero-top-bar hero-top-inline hero-top-top">
        <span className="hero-top-l">
          <span className="hero-top-line"><span className="o-red">FOUNDED</span> <span className="lt">RIGA · LV</span></span>
          <span className="hero-top-line"><span className="o-red">OFFER</span> <span className="lt">INTERNATIONAL</span></span>
        </span>
        <span className="hero-top-r">
          <span className="coord">56°57′N&nbsp;&nbsp;24°06′E</span>
          <span className="anno" style={{ color: "rgb(200, 40, 28)" }}>ANNO 2026</span>
        </span>
      </div>
      <div className="hero-hook hero-hook-low" ref={fgRef}>
        <div className="hero-headline-stack">
          <div className="hero-name-block hero-name-left hero-name-bigger">
          <h1 className="hero-name">
            <span className="hn-first"> KRISTERS</span>
            <span className="hn-last">ANSONS<span className="o">.</span></span>
          </h1>
          <div className="hero-role-row hero-role-row-shifted">
            <span className="hero-role hero-role-sf"><span className="sf">THE PERFORMANCE</span></span>
            <span className="role-orn role-orn-l" aria-hidden="true">
              <span className="role-dot"></span>
              <span className="role-rule"></span>
              <svg className="role-x" viewBox="0 0 16 16" width="14" height="14" preserveAspectRatio="xMidYMid meet">
                <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5"></line>
                <line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5"></line>
              </svg>
            </span>
            <span className="role-orn role-orn-r" aria-hidden="true">
              <svg className="role-x" viewBox="0 0 16 16" width="14" height="14" preserveAspectRatio="xMidYMid meet">
                <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5"></line>
                <line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5"></line>
              </svg>
              <span className="role-rule"></span>
              <span className="role-dot"></span>
            </span>
            <span className="hero-role hero-role-arch"><span className="hr-arch">Architect</span></span>
          </div>
        </div>
        </div>

        <div className="hero-triad">
          <div className="hero-triad-col">
            <h2 className="hero-triad-word">Physique<span className="o" style={{ color: "var(--accent-studio)" }}>.</span></h2>
            <p className="hero-triad-desc">An athletic body, engineered for sustained health, performance and aesthetics.</p>
          </div>
          <div className="hero-triad-col">
            <h2 className="hero-triad-word">Intellect<span className="o">.</span></h2>
            <p className="hero-triad-desc">Cognitive enhancement, crafted on the principles of neuroscience.</p>
          </div>
          <div className="hero-triad-col">
            <h2 className="hero-triad-word">Brand<span className="o">.</span></h2>
            <p className="hero-triad-desc">Your offer and charisma, crafted into a profitable digital presence.</p>
          </div>
        </div>
        <blockquote className="hero-philosophy">
          <p className="hero-sub hero-sub-v2">&ldquo;Three practices, all crafted by the Performance Architect. The standard, held constant by the Ansoneri method: the athlete&rsquo;s discipline, the scientist&rsquo;s rigour, and the designer&rsquo;s eye, built for the modern load. No programmes. A system, composed by hand and tested in real conditions.&rdquo;</p>
        </blockquote>

      </div>
    </section>);};

// ───────── MARQUEE ─────────
// Lifestyle / fitness / branding keywords with orange-square separators
// vertically centred against the cap-height of the text.
const Marquee = () => {
  const words = [
  'PERFORMANCE', 'AUTHENTIC DESIGN', 'HYBRID ATHLETE',
  'EVIDENCE-BASED', 'COFFEE SNOB', 'BODY · MIND · RECOVERY',
  'BRAND BY HAND', 'LATE NIGHTS · EARLY KMs', 'DEEP WORK',
  'NO TEMPLATES', 'STRENGTH IS A SKILL', 'CHARISMA IS A SYSTEM',
  'RIGA · LV', 'BUILT TO LAST', 'TRAIN. FILM. BUILD.'];

  const block = (key) =>
  <span className="m-block" key={key}>
      {words.map((w, i) =>
    <React.Fragment key={i}>
          <span className="m-word">{w}</span>
          <span className="m-sep" aria-hidden="true" />
        </React.Fragment>
    )}
    </span>;

  return (
    <div className="marquee marquee-v2">
      <div className="marquee-track">
        {block('a')}{block('b')}
      </div>
    </div>);
};

// ───────── PRACTICES ─────────
// Big stylized headlines with gritty texture. Draggable colorful fog blobs.
const DraggableBlob = ({ id, color, defaultX, defaultY, locked }) => {
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState(() => {
    const stored = localStorage.getItem('blob-' + id);
    return stored ? JSON.parse(stored) : { x: defaultX, y: defaultY };
  });
  const [drag, setDrag] = React.useState(null);

  React.useEffect(() => {localStorage.setItem('blob-' + id, JSON.stringify(pos));}, [pos, id]);

  const onDown = (e) => {
    if (locked) return;
    e.preventDefault();
    const r = ref.current.getBoundingClientRect();
    setDrag({ ox: e.clientX - r.left, oy: e.clientY - r.top });
  };
  React.useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const parent = ref.current.parentElement.getBoundingClientRect();
      setPos({
        x: (e.clientX - parent.left - drag.ox) / parent.width * 100,
        y: (e.clientY - parent.top - drag.oy) / parent.height * 100
      });
    };
    const onUp = () => setDrag(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {window.removeEventListener('mousemove', onMove);window.removeEventListener('mouseup', onUp);};
  }, [drag]);

  return (
    <div
      ref={ref}
      className={`p-blob ${locked ? 'locked' : 'unlocked'}`}
      onMouseDown={onDown}
      style={{ left: pos.x + '%', top: pos.y + '%', background: `radial-gradient(circle, ${color}, transparent 70%)` }} />);


};

// ───────── PATTERN LAB ─────────
const PatternBlock = ({ kind = 'dots' }) => {
  const id = React.useMemo(() => 'p-' + kind + '-' + Math.random().toString(36).slice(2, 7), [kind]);
  return (
    <svg className={`pattern-block pattern-${kind}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        {kind === 'dots' &&
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="currentColor" />
          </pattern>}

        {kind === 'diag' &&
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="2" />
          </pattern>}

        {kind === 'cross' &&
        <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M11 4 V18 M4 11 H18" stroke="currentColor" strokeWidth="1.5" />
          </pattern>}

        {kind === 'grid' &&
        <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 0 H18 M0 0 V18" stroke="currentColor" strokeWidth="0.8" />
          </pattern>}

      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>);

};

const Practices = ({ blobsLocked }) =>
<section className="section practices-section" id="practices">
    <SectionNumeral n="02" />
    <div className="section-head section-head-pattern">
      <div className="head-l">
        <div className="section-num">◆ 02 / Practices</div>
        <h2 className="section-h">
          <span className="sf">One operator.</span><br />
          Two fields of expertise<span className="o">.</span>
        </h2>
        <div className="head-pattern-row" style={{ display: "none" }}>
          <PatternBlock kind="dots" />
          <PatternBlock kind="diag" />
          <PatternBlock kind="cross" />
        </div>
      </div>
      <div className="head-r">
        <div className="meta">
          <span><span className="o">◆</span> Est. Riga / 2024</span>
          <span>Book 1:1 or project-based</span>
        </div>
        <div className="head-pattern-tall">
          <PatternBlock kind="grid" />
          <span className="hp-stamp"><span className="o">◆</span> FIELD / 01</span>
        </div>
      </div>
    </div>

    <div className="practices-grid">
      <article className="practice fitness" style={{ fontSize: "2px", borderWidth: "0.8px", padding: "41.599998px 535.200001px 41.599998px 35.200001px" }}>
        <DraggableBlob id="f1" color="#ff6b1a" defaultX={70} defaultY={5} locked={blobsLocked} />
        <DraggableBlob id="f2" color="#c8281c" defaultX={10} defaultY={70} locked={blobsLocked} />
        <div className="tagline">For the people who train.</div>
        <div className="practice-photo fitness-photo" aria-hidden="true">
          <img src="assets/hero-fitness.jpeg" alt="" />
        </div>
        <div className="practice-mark big">ANSONERI <span className="sub big">FITNESS</span></div>
        <h3 className="title big">
          Body.<br />Mind.<br /><span className="accent">Recovery.</span>
        </h3>
        <p className="desc">
          Performance and lifestyle architecture for{' '}
          <strong>athletes, ex-athletes, and operators</strong> whose work demands
          more than average output.
        </p>
        <ul className="list">
          {['Personalised training', 'Nutrition strategy', 'Recovery protocols', 'Mindset coaching'].map((x, i) =>
        <li key={x}><span>{x}</span><span className="n">/{String(i + 1).padStart(2, '0')}</span></li>
        )}
        </ul>
        <div className="arrow-row">
          <span>View packages</span>
          <span className="arrow">→</span>
        </div>
      </article>

      <article className="practice studio" style={{ padding: "41.599998px 535.200001px 41.599998px 35.200001px", margin: "3px" }}>
        <DraggableBlob id="s1" color="#c8281c" defaultX={10} defaultY={5} locked={blobsLocked} />
        <DraggableBlob id="s2" color="#ff6b1a" defaultX={75} defaultY={75} locked={blobsLocked} />
        <div className="tagline">For the people who teach.</div>
        <div className="practice-photo studio-photo" aria-hidden="true">
          <img src="assets/hero-studio.jpeg" alt="" />
        </div>
        <div className="practice-mark big">ANSONERI <span className="sub red big">STUDIO</span></div>
        <h3 className="title big">
          Brand.<br />Strategy.<br /><span className="red">Charisma.</span>
        </h3>
        <p className="desc">
          Brand and digital-presence consulting for{' '}
          <strong>coaches, creators, and craftspeople</strong> ready to convert
          deep expertise into a system that sells.
        </p>
        <ul className="list">
          {['Brand identity', 'Digital strategy', 'Content systems', 'Web + product'].map((x, i) =>
        <li key={x}><span>{x}</span><span className="n">/{String(i + 1).padStart(2, '0')}</span></li>
        )}
        </ul>
        <div className="arrow-row">
          <span>View packages</span>
          <span className="arrow">→</span>
        </div>
      </article>
    </div>
  </section>;

// ───────── ABOUT ─────────
// Photo with a faded right edge that bleeds into the text column. No bullet
// duplicate of credentials. Bigger desktop type.
const About = () =>
<section className="section alt about-section" id="about">
    <SectionNumeral n="01" />
    <div className="section-head">
      <div>
        <div className="section-num about-section-num">◆ 01 / About</div>
      </div>
      <div className="meta">
        <span><span className="o">◆</span> Kristers Ansons</span>
        <span>Riga · LV · 56.95° N</span>
      </div>
    </div>

    <div className="about-grid about-grid-v2">
      <div className="about-photo about-photo-v2">
        <img src="assets/about-portrait.jpg" alt="Kristers Ansons" />
        <div className="about-photo-grit" />
      </div>

      <div className="about-body">
        <p className="about-lead">
          PART ATHLETE, PART SCIENTIST, PART DESIGNER.
        </p>

        <p className="about-p">
          Twelve seasons as a pro cyclist, racing internationally with starts at
          the European Championships. There I learned the intensity, the
          discipline, and the long pursuit of results that builds a champion's
          mindset season by season. Today I train as a hybrid athlete: strength
          training, HYROX, and an Ironman in progress. The aim is to push the
          body across disciplines, see how it responds to each, and develop it
          to the fullest of what is physically possible.
        </p>
        <p className="about-p">
          The body is just part of it; the mind does the rest. The academic side
          runs in parallel for that reason - an MSc in Psychological Coaching and
          Sports Science, and a PhD in progress at Riga Stradiņš University in
          Latvia. The research is where practical experience gets tested against
          the literature - against the physiology, the cognitive science, and the
          evidence that actually replicates.
        </p>
        <p className="about-p">
          Today I run three practices: Physique, Intellect, and Brand. The
          Ansoneri standard is the core of all three - the same blueprint, the
          same rigour, the same refusal to publish anything that has not been
          tested in the real world. A client may come for one, for two, or for
          all three; the standard is what stays constant.
        </p>
        <p className="about-p">
          That standard is what I have built across twelve seasons of competition,
          years of academic work, and a relentless pursuit of personal excellence.
          The foundation is real. The pursuit continues - deeper in the science,
          sharper in the practice, into what the next decade of work still has
          to find.
        </p>

        <div className="about-sign">
          <span className="sig">— K. Ansons</span>
          <span className="loc">Riga, LV</span>
        </div>
      </div>
    </div>
  </section>; // ───────── METRICS ─────────
const Metrics = () =>
<div className="metrics">
    <div className="metric">
      <span className="top">YR</span>
      <div className="v"><span className="o">12</span></div>
      <div className="lbl">◆ Seasons pro cycling</div>
    </div>
    <div className="metric">
      <span className="top">EDU</span>
      <div className="v">MSc</div>
      <div className="lbl">◆ Sport psychology</div>
    </div>
    <div className="metric">
      <span className="top">RES</span>
      <div className="v">RSU</div>
      <div className="lbl">◆ Sports healthcare research</div>
    </div>
    <div className="metric">
      <span className="top">RACE</span>
      <div className="v"><span className="red">HYROX</span></div>
      <div className="lbl">◆ Hybrid athlete · 2024–</div>
    </div>
  </div>;

// ───────── PRICING ─────────
const Pricing = () =>
<section className="section" id="pricing">
    <SectionNumeral n="03" />
    <div className="section-head">
      <div>
        <div className="section-num">◆ 03 / Pricing</div>
        <h2 className="section-h">
          <span className="sf">Three blocks.</span><br />
          Pick the room<span className="o">.</span>
        </h2>
      </div>
      <div className="meta">
        <span><span className="o">◆</span> Booking opens monthly</span>
        <span>Prices in EUR · ed. 04</span>
      </div>
    </div>

    <div className="pricing-grid">
      <div className="card glow org">
        <div className="num">01 · Foundation</div>
        <h4>Body Reset<br /><span className="accent">— 8 weeks</span></h4>
        <div className="price"><span className="cur">€</span>1,200<span className="per">/ block</span></div>
        <ul>
          <li>Onboarding intake + screening</li>
          <li>Personalised programme</li>
          <li>Weekly check-in calls</li>
          <li>Recovery + sleep protocol</li>
        </ul>
        <div className="foot"><span>Book block</span><span className="arrow">→</span></div>
      </div>

      <div className="card stripe-bg featured">
        <div className="num">02 · Operator <span style={{ color: 'var(--accent)' }}>· popular</span></div>
        <h4>Hybrid Performance<br /><span className="accent">— 16 weeks</span></h4>
        <div className="price"><span className="cur">€</span>2,800<span className="per">/ block</span></div>
        <ul>
          <li>Strength + conditioning</li>
          <li>Mindset coaching (psych-led)</li>
          <li>Nutrition strategy</li>
          <li>Quarterly review with data</li>
        </ul>
        <div className="foot"><span>Book block</span><span className="arrow">→</span></div>
      </div>

      <div className="card glow red">
        <div className="num">03 · Studio</div>
        <h4>Brand Build<br /><span className="studio-red">— project-based</span></h4>
        <div className="price"><span className="cur">€</span>5,400<span className="per">/ from</span></div>
        <ul>
          <li>Strategy + positioning</li>
          <li>Identity system</li>
          <li>Site or product build</li>
          <li>90-day handoff support</li>
        </ul>
        <div className="foot"><span>Request brief</span><span className="arrow">→</span></div>
      </div>
    </div>
  </section>;

// ───────── MANIFESTO (quote-essence) ─────────
const Manifesto = () =>
<section className="section manifesto-section" id="manifesto">
    <SectionNumeral n="04" />
    <div className="eyebrow-row">
      <span className="bar" />
      <span className="lbl">◆ Manifesto / 04</span>
      <span className="dash" />
    </div>
    <blockquote className="manifesto-quote">
      <span className="qmark">&ldquo;</span>
      <p>
        I don't sell programmes — I architect the system that makes
        you <em>unrecognisable</em> in twelve months. Body, mind and brand
        coached as <em>one structure.</em>
      </p>
      <span className="qmark right">&rdquo;</span>
    </blockquote>
    <div className="manifesto-foot">
      <span className="sig">— K. Ansons</span>
      <span className="loc">◆ RIGA · 2026 · ED. 04</span>
    </div>
  </section>;

// ───────── JOURNAL ─────────
const Journal = () => {
  const items = [
  { n: '01', d: '06.05.26', tag: 'TRAINING', title: 'Compress the curve', body: 'Why the first eight weeks of any block matter more than the next sixteen — load is a story of patience.' },
  { n: '02', d: '02.05.26', tag: 'STUDIO', title: 'No template, by hand', body: 'Why I keep building the site by hand. Templates round off the corners that make a brand feel like a person.' },
  { n: '03', d: '28.04.26', tag: 'RECOVERY', title: 'Sleep is the protocol', body: 'Eight years of HRV data, one rule. Cobble brown coffee at 06:42, ten hours after the last hard set.' },
  { n: '04', d: '21.04.26', tag: 'RESEARCH', title: 'RSU notes — week 14', body: 'Sport-IE project notes from the Centre. What the data actually says about psychological coaching at scale.' },
  { n: '05', d: '15.04.26', tag: 'HYROX', title: '12 seasons later', body: 'How road racing prepared me — and didn\u2019t — for hybrid sport. The leg work translates. The mental work does not.' },
  { n: '06', d: '07.04.26', tag: 'BRAND', title: 'Charisma is a system', body: 'A practice for coaches turning craft into a brand. Reps for the camera, reps for the page.' }];

  return (
    <section className="section alt" id="journal">
      <SectionNumeral n="05" />
      <div className="section-head">
        <div>
          <div className="section-num">◆ 05 / Journal — Field notes</div>
          <h2 className="section-h">
            Notes<span className="o">.</span><br />
            <span className="sf">From the room.</span>
          </h2>
        </div>
        <div className="meta">
          <span><span className="o">◆</span> Riga / weekly</span>
          <span>06 entries · ed. 04</span>
        </div>
      </div>

      <div className="notes-grid">
        {items.map((it) =>
        <article className="note" key={it.n}>
            <div className="meta">
              <span className="num">◆ N{it.n}</span>
              <span>{it.d}</span>
              <span style={{ color: 'var(--accent)' }}>{it.tag}</span>
            </div>
            <h5>{it.title}</h5>
            <p className="excerpt">{it.body}</p>
            <div className="foot">
              <span>Read note</span>
              <span>→</span>
            </div>
          </article>
        )}
      </div>
    </section>);
};

// ───────── CTA — 30-MIN PARALLELOGRAM BANNER ─────────
const Cta = () =>
<section className="cta-band cta-banner" id="contact">
    <SectionNumeral n="06" />
    <a href="#" className="cta-banner-inner">
      <div className="cta-banner-l">
        <span className="cta-kicker">FREE</span>
        <span className="cta-big">30-MIN</span>
      </div>
      <span className="cta-paral" aria-hidden="true" />
      <div className="cta-banner-r">
        <span className="cta-kicker">ACTION</span>
        <span className="cta-big">BOOK CALL</span>
      </div>
    </a>
    <p className="cta-band-sub">
      No pitch. No script. We map where you are, where you want to go, and
      whether body, mind or brand is the right place to start.
    </p>
  </section>;

// ───────── FOOTER ─────────
const Footer = () =>
<footer className="footer">
    <img src="assets/ansoneri-wordmark.svg" alt="Ansoneri" className="footer-logo" />
    <div className="footer-contacts">
      <a href="https://instagram.com/ansons_k" target="_blank" rel="noopener noreferrer" className="footer-c">
        <span className="footer-c-tag">◆ IG</span>
        <span className="footer-c-val">@ansons_k</span>
      </a>
      <a href="https://wa.me/37100000000" target="_blank" rel="noopener noreferrer" className="footer-c">
        <span className="footer-c-tag">◆ WHATSAPP</span>
        <span className="footer-c-val">Direct line</span>
      </a>
      <a href="mailto:kristersansons14@gmail.com" className="footer-c">
        <span className="footer-c-tag">◆ EMAIL</span>
        <span className="footer-c-val">kristersansons14@gmail.com</span>
      </a>
    </div>
    <div className="legal">
      <span><span className="o">◆</span> © 2026 / Kristers Ansons / Riga, LV</span>
      <span>Built by hand — no templates</span>
      <span style={{ color: 'var(--accent)' }}>Edition 04 / v0.4</span>
    </div>
  </footer>;

// Cursor flame removed.
const CursorFlame = () => null;

Object.assign(window, {
  TopNav, Hero, Marquee, PatternBlock,
  Practices, About, Metrics, Pricing,
  Manifesto, Journal, Cta, Footer, CursorFlame
});