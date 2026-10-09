"""Rebuilds css/tokens.css and css/bundle.css from the Kristers Ansons design system.

Download these files from the design-system artifact into one folder, keeping their paths:
  project/design-system.json, project/tokens.json, project/components/bundle.css
then run, from the repo root:
  python3 tools/ds_to_site.py <that folder> .
tokens.json becomes css/tokens.css; bundle.css is copied with its asset URLs (/_blob/<id>)
pointed at the matching files under assets/. Changed images (see design-system.json) are
downloaded separately into assets/. js/bundle.js is copied as is."""
import json, re, sys
DS = sys.argv[1]; OUT = sys.argv[2]
FOLDER = {"Glows": "glows", "Icons": "icons", "Logos": "logos", "Photography": "photos", "Reference": "reference",
          "Texture": "texture", "Lines": "lines", "Service icons": "service-icons", "Card backgrounds": "card-backgrounds"}
ds = json.load(open(f"{DS}/project/design-system.json"))
blob = {}
for grp in ds["assetGroups"].values():   # keys may be URL-encoded ("Card~20backgrounds"); the name is not
    for name, f in grp["files"].items():
        blob[f["blob"]] = f"../assets/{FOLDER[grp['name']]}/{name}"
css = open(f"{DS}/project/components/bundle.css").read()
missing = set()
def sub(m):
    b = m.group(1)
    if b not in blob: missing.add(b); return m.group(0)
    return blob[b]
css = re.sub(r"/_blob/([0-9a-f]{32})", sub, css)
open(f"{OUT}/css/bundle.css", "w").write(css)
print("bundle.css written; unmapped blobs:", missing or "none")

t = json.load(open(f"{DS}/project/tokens.json"))
ref = lambda v: re.sub(r"\{([a-z0-9-]+)\}", r"var(--\1)", v)
web, paper, root = [], [], []
for c in t["color"]["tokens"]:
    v = c["value"]
    if isinstance(v, dict):   # {"web": ...} for raw colours, plus "paper" for the themed ones
        web.append(f"  --{c['name']}: {ref(v['web'])};")
        if "paper" in v: paper.append(f"  --{c['name']}: {ref(v['paper'])};")
    else:
        web.append(f"  --{c['name']}: {v};")
for sec in ("spacing", "radius", "stroke", "size", "opacity"):
    for x in t[sec]["tokens"]:
        root.append(f"  --{x['name']}: {x['value']};")
for k, v in t["type"]["families"].items():
    root.append(f"  --font-{k}: {v};")
out = ["/* Generated from the Kristers Ansons design system tokens.json - do not edit by hand; change the design system and re-export. */",
       ':root, [data-theme="web"] {', *web, "}", '[data-theme="paper"] {', *paper, "}", ":root {", *root, "}"]
for f in t["type"]["fonts"]:
    out.append(f"@font-face {{ font-family: '{f['family']}'; src: url('../{f['file']}') format('woff2'); font-weight: {f['weight']}; font-style: {f['style']}; font-display: swap; }}")
open(f"{OUT}/css/tokens.css", "w").write("\n".join(out) + "\n")
print("tokens.css written")
