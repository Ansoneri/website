// Site-only behaviour on top of the design system's bundle.js: the phone menu
// panel behind .ka-nav__menu, which the Nav component leaves to the site.
(function () {
  "use strict";
  var button = document.querySelector(".ka-nav__menu");
  var panel = document.getElementById("site-menu");
  if (!button || !panel) return;
  var nav = button.closest(".ka-nav");
  var wide = window.matchMedia("(min-width: 961px)");

  function isOpen() { return button.getAttribute("aria-expanded") === "true"; }

  function setOpen(open) {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Aizvērt izvēlni" : "Izvēlne");
    button.innerHTML = Ansons.icon(open ? "close" : "menu");
    nav.classList.toggle("is-menu-open", open);
    document.documentElement.classList.toggle("site-menu-open", open);
    if (open) {
      panel.hidden = false;
      requestAnimationFrame(function () { panel.classList.add("is-open"); });
      var first = panel.querySelector("a");
      if (first) first.focus();
    } else {
      panel.classList.remove("is-open");
      panel.hidden = true;
    }
  }

  button.addEventListener("click", function () { setOpen(!isOpen()); });
  panel.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) { setOpen(false); button.focus(); }
  });
  wide.addEventListener("change", function (e) { if (e.matches && isOpen()) setOpen(false); });
})();

// Home page motion (7 Oct 2026; site-only until it is approved for the design system).
// The hero's photo, text and statement move at their own rates while the page scrolls, and the
// service cards slide in from the sides. The parallax follows the scroll position itself and the
// cards run at one steady speed - linear, as the brand's motion rule asks. With reduced motion
// on, <html> never gets .js-motion and nothing here runs.
(function () {
  "use strict";
  if (!document.documentElement.classList.contains("js-motion")) return;
  var layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-slide]"));
  var wide = window.matchMedia("(min-width: 961px)");

  // Parallax: data-parallax is the share of the scroll a layer lags behind (negative = moves ahead),
  // data-parallax-narrow the same below 961px, data-parallax-wide limits a layer to wide screens,
  // data-parallax-zoom grows it slowly and data-parallax-fade fades it as the hero leaves.
  // data-parallax-cut (the hero photo): the part pushed below the hero's edge is handed to the
  // photo's own bottom fade as --ka-cut, so the hero's clip never shows as a hard line.
  var queued = false;
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function frame() {
    queued = false;
    var vh = window.innerHeight || 800;
    var t = Math.min(window.scrollY || window.pageYOffset || 0, vh * 1.5);   // the hero is gone by then
    layers.forEach(function (el) {
      if (el.hasAttribute("data-parallax-wide") && !wide.matches) { el.style.translate = el.style.scale = el.style.opacity = ""; return; }
      var speed = parseFloat((!wide.matches && el.getAttribute("data-parallax-narrow")) || el.getAttribute("data-parallax")) || 0;
      el.style.translate = "0 " + (t * speed).toFixed(1) + "px";
      var zoom = parseFloat(el.getAttribute("data-parallax-zoom"));
      var sc = zoom ? 1 + zoom * clamp(t / vh) : 1;
      if (zoom) el.style.scale = sc.toFixed(4);
      if (el.hasAttribute("data-parallax-cut")) {
        var over = wide.matches ? (t * speed + (sc - 1) * el.offsetHeight) / sc : 0;
        el.style.setProperty("--ka-cut", Math.max(0, over).toFixed(1) + "px");
      }
      if (el.hasAttribute("data-parallax-fade")) el.style.opacity = (1 - clamp((t - vh * 0.2) / (vh * 0.6))).toFixed(3);
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  if (layers.length) {
    frame();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
  }

  // Cards: in place once a fifth of each is on screen; css/site.css sets the start and the speed.
  if (!slides.length) return;
  if (!("IntersectionObserver" in window)) { slides.forEach(function (el) { el.classList.add("is-in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  slides.forEach(function (el) { io.observe(el); });
})();

// Pakalpojumi (9 Oct 2026, from the Mentor programme page).
// 1. The header's "Sākt sadarbību" waits until the hero's own button ([data-hero-cta]) has scrolled
//    away, so the page never shows the same button twice at the top.
// 2. The three offer cards carry a soft light that follows the pointer; on touch screens it follows
//    the middle of the screen as the page scrolls.
(function () {
  "use strict";
  var heroCta = document.querySelector("[data-hero-cta]");
  var navCta = document.querySelector(".ka-nav__end .ka-cta");
  if (heroCta && navCta) {
    navCta.classList.add("nav-cta-wait");
    if (!("IntersectionObserver" in window)) navCta.classList.add("is-on");
    else new IntersectionObserver(function (e) { navCta.classList.toggle("is-on", !e[0].isIntersecting); },
      { rootMargin: "-80px 0px 0px 0px" }).observe(heroCta);
  }

  var tri = document.querySelector(".o-tri");
  if (!tri) return;
  var cards = Array.prototype.slice.call(tri.querySelectorAll(".o-card"));
  function set(c, x, y) { c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px"); }
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    tri.addEventListener("pointermove", function (e) {
      cards.forEach(function (c) { var r = c.getBoundingClientRect(); set(c, e.clientX - r.left, e.clientY - r.top); });
    });
    tri.addEventListener("pointerleave", function () { cards.forEach(function (c) { set(c, -999, -999); }); });
  } else {
    var queued = false;
    var follow = function () {
      queued = false;
      var mid = window.innerHeight * 0.5;
      cards.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        set(c, r.width * 0.5, mid - r.top);
      });
    };
    window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(follow); } }, { passive: true });
    follow();
  }
})();
