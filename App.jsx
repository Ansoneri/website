// App.jsx — root, scroll-spy, Tweaks (day/night, accent, density, variants)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "density": "editorial",
  "showGrid": true,
  "marquee": true,
  "palette": ["#ff6b1a", "#c8281c"],
  "accent": "#ff6b1a",
  "accentStudio": "#c8281c",
  "lang": "en",
  "blobsLocked": false
}/*EDITMODE-END*/;

const PALETTES = [
  ['#ff6b1a', '#c8281c'],   // Signal + Studio (default)
  ['#d65a25', '#c8281c'],   // Persimmon + Studio
  ['#c4ff3a', '#ff6b1a'],   // Acid lime + Signal
  ['#3a8dff', '#ff6b1a'],   // Blueprint + Signal
  ['#ffce1a', '#c8281c'],   // Goldenrod + Studio
  ['#f5f3ee', '#ff6b1a'],   // Bone + Signal
];

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState('hero');

  // Sync theme + tokens
  React.useEffect(() => {
    const b = document.body;
    b.dataset.theme = t.theme;
    b.dataset.density = t.density;
    b.dataset.showGrid = String(t.showGrid);
    const accent = (t.palette && t.palette[0]) || t.accent;
    const studio = (t.palette && t.palette[1]) || t.accentStudio;
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent-2', accent);
    document.documentElement.style.setProperty('--accent-studio', studio);
  }, [t]);

  // Scroll-spy
  React.useEffect(() => {
    const ids = ['hero','practices','about','pricing','manifesto','journal','contact'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <TopNav
        active={active}
        theme={t.theme}
        onTheme={(v) => setTweak('theme', v)}
        lang={t.lang}
        onLang={(v) => setTweak('lang', v)}
      />

      <Hero />
      <About />
      <Practices blobsLocked={t.blobsLocked} />
      <Metrics />
      <Pricing />
      <Manifesto />
      <Journal />
      <Cta />
      <Footer />
      <CursorFlame />

      <TweaksPanel>
        <TweakSection label="Theme">
          <TweakRadio
            label="Day / Night"
            value={t.theme}
            options={[{value:'dark',label:'Night'},{value:'light',label:'Day'}]}
            onChange={(v) => setTweak('theme', v)}
          />
          <TweakRadio
            label="Density"
            value={t.density}
            options={[{value:'editorial',label:'Editorial'},{value:'tight',label:'Tight'}]}
            onChange={(v) => setTweak('density', v)}
          />
        </TweakSection>

        <TweakSection label="Accent palette">
          <TweakColor
            label="Signal + Studio"
            value={t.palette}
            options={PALETTES}
            onChange={(v) => setTweak({ palette: v, accent: v[0], accentStudio: v[1] })}
          />
        </TweakSection>

        <TweakSection label="Decoration">
          <TweakToggle label="Architect grid" value={t.showGrid} onChange={(v) => setTweak('showGrid', v)} />
          <TweakToggle label="Marquee ticker" value={t.marquee} onChange={(v) => setTweak('marquee', v)} />
          <TweakToggle label="Lock practice blobs" value={t.blobsLocked} onChange={(v) => setTweak('blobsLocked', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
