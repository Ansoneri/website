"""Builds preview-hero-1/2/3.html from index.html (hero accent experiments). Not linked anywhere, noindex."""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / "index.html").read_text()
NAMES = {"1": "Ember", "2": "Horizon", "3": "Quiet glass"}
SVG_DEFS = ('<defs><linearGradient id="hxg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a120c" stop-opacity=".15"/>'
  '<stop offset=".25" stop-color="#c8281c"/><stop offset=".6" stop-color="#ff6b1a"/><stop offset=".92" stop-color="#ffd7b0"/><stop offset="1" stop-color="#f5f3ee" stop-opacity="0"/></linearGradient>'
  '<linearGradient id="hxg2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff6b1a" stop-opacity="0"/><stop offset=".35" stop-color="#ff6b1a"/><stop offset=".8" stop-color="#ffd7b0"/><stop offset="1" stop-color="#f5f3ee" stop-opacity="0"/></linearGradient></defs>')
D1 = "M -20 935 C 240 942, 430 930, 560 885 S 800 720, 1030 640"
P1 = "M -20 905 C 300 915, 620 880, 1030 790"
D2 = "M -10 600 C 120 760, 300 900, 620 1010"
P2 = "M -10 760 C 180 860, 460 960, 1010 1010"
def paths(cls, d, p, layers):
    out = ""
    for k, extra in layers:
        out += f'<path class="{k} dk {extra}" d="{d}" pathLength="1"/><path class="{k} ph {extra}" d="{p}" pathLength="1"/>'
    return out
ACCENTS = ('<div class="hx hx--1" aria-hidden="true"><i class="glow"></i><i class="gr"></i><i class="rim"></i></div>'
  '<div class="hx hx--2" aria-hidden="true"><i class="corner"></i><i class="gr c"></i><i class="band"></i><i class="gr b"></i></div>'
  '<div class="hx hx--3" aria-hidden="true"><i class="glow"></i><i class="gr"></i></div>')
SCRIPT = ('<script>(function(){var s=document.querySelector("#hero .stage");function f(){var o=Math.max(0,1-scrollY/(innerHeight*.55));'
  's.style.setProperty("--hxO",o.toFixed(3));}var v=document.getElementById("vframe");if(v)s.style.setProperty("--vl",v.getBoundingClientRect().left+"px");addEventListener("scroll",f,{passive:true});f();})();</script>')
for n, name in NAMES.items():
    h = src.replace('<html lang="lv"', f'<html lang="lv" data-hero="{n}"', 1)
    assert 'data-hero' in h
    h = h.replace("<head>", '<head>\n<meta name="robots" content="noindex, nofollow">', 1)
    h = h.replace("</head>", '<link rel="stylesheet" href="css/hero-preview.css">\n</head>', 1)
    k = h.index('<div class="vshade" id="shade" aria-hidden="true"></div>') + len('<div class="vshade" id="shade" aria-hidden="true"></div>')
    h = h[:k] + ACCENTS + h[k:]
    bar = '<nav class="hxbar">' + "".join(f'<a href="preview-hero-{m}.html"{" class=\"on\"" if m == n else ""}>{m}<span class=\"nm\"> {nm}</span></a>' for m, nm in NAMES.items()) + '<a href="index.html">Tagad</a></nav>'
    h = h.replace("</body>", bar + SCRIPT + "\n</body>", 1)
    (root / f"preview-hero-{n}.html").write_text(h)
print("ok")
