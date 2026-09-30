(function () {
  "use strict";
  var ICONS = {
"globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18\"/><path d=\"M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z\"/>",
"mail": "<rect x=\"3\" y=\"5.5\" width=\"18\" height=\"13\" rx=\"2.5\"/><path d=\"m3.8 7.2 8.2 6 8.2-6\"/>",
"instagram": "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.2\" cy=\"6.8\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/>",
"youtube": "<rect x=\"2.5\" y=\"5.5\" width=\"19\" height=\"13\" rx=\"3.5\"/><path d=\"M10.2 9.3v5.4l4.6-2.7z\"/>",
"pin": "<path d=\"M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.4\"/>",
"phone": "<rect x=\"6.5\" y=\"2.5\" width=\"11\" height=\"19\" rx=\"2.5\"/><path d=\"M10.5 18h3\"/>",
"calendar": "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15.5\" rx=\"2.5\"/><path d=\"M3.5 10h17M8 3v4M16 3v4\"/>",
"arrow-right": "<path d=\"M4 12h15.5\"/><path d=\"m13.5 6 6 6-6 6\"/>",
"arrow-up-right": "<path d=\"M7 17 17 7\"/><path d=\"M8.5 7H17v8.5\"/>",
"arrow-down": "<path d=\"M12 4v15.5\"/><path d=\"m6 13.5 6 6 6-6\"/>",
"menu": "<path d=\"M4 7h16M4 12h16M4 17h10\"/>",
"close": "<path d=\"m6 6 12 12M18 6 6 18\"/>",
"check": "<path d=\"m5 12.5 4.5 4.5L19 7.5\"/>",
"plus": "<path d=\"M12 5v14M5 12h14\"/>",
"practice-preparation": "<rect x=\"4\" y=\"9\" width=\"10.5\" height=\"10.5\" rx=\"2.5\"/><rect x=\"9.5\" y=\"4.5\" width=\"10.5\" height=\"10.5\" rx=\"2.5\"/>",
"practice-lifestyle": "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"3\"/><path d=\"M11 3.5v6.5M11 14v6.5M11 14h9.5M3.5 10.5h4\"/>",
"practice-mental": "<path d=\"M4 20v-3.5a.5.5 0 0 1 .5-.5H8v-3.5a.5.5 0 0 1 .5-.5H12V8.5a.5.5 0 0 1 .5-.5H16V4.5a.5.5 0 0 1 .5-.5H20\"/><path d=\"M4 20h16\"/>"
};
  var reduce = function () { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); };
  function icon(name, opts) {
    var body = ICONS[name]; if (!body) return "";
    var size = (opts && opts.size) || 24, label = opts && opts.label;
    return '<svg class="ka-icon" viewBox="0 0 24 24" width="' + size + '" height="' + size + '"' +
      (label ? ' role="img" aria-label="' + String(label).replace(/"/g, "&quot;") + '"' : ' aria-hidden="true"') + ">" + body + "</svg>";
  }
  // initNav: the header gets a hairline once the page scrolls, and its small ANSONS. mark appears only
  // after the big hero surname ([data-hero-name]) has scrolled out of view. Works with the window or with
  // a scrolling container marked [data-scroll-root] (the previews use one to act as a laptop screen).
  function initNav(nav) {
    nav = nav || document.querySelector(".ka-nav"); if (!nav) return function () {};
    var root = document.querySelector("[data-scroll-root]");
    var target = root || window;
    var on = function () { nav.classList.toggle("is-scrolled", ((root ? root.scrollTop : window.scrollY) || 0) > 8); };
    on(); target.addEventListener("scroll", on, { passive: true });
    var hero = document.querySelector("[data-hero-name]"), io = null;
    if (!hero) nav.classList.add("is-brand-shown");
    else if (!("IntersectionObserver" in window)) nav.classList.add("is-brand-shown");
    else {
      io = new IntersectionObserver(function (entries) {
        nav.classList.toggle("is-brand-shown", !entries[0].isIntersecting);
      }, { root: root || null, rootMargin: "-" + (nav.offsetHeight || 80) + "px 0px 0px 0px", threshold: 0 });
      io.observe(hero);
    }
    return function () { target.removeEventListener("scroll", on); if (io) io.disconnect(); };
  }
  function initMotion(root) {
    root = root || document;
    var items = Array.prototype.slice.call(root.querySelectorAll("[data-reveal]"));
    var lines = Array.prototype.slice.call(root.querySelectorAll(".ka-line[data-draw]"));
    if (reduce() || !("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("is-in"); }); return function () {}; }
    lines.forEach(function (el) { el.classList.add("ka-line--draw"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.forEach(function (el) { io.observe(el); });
    return function () { io.disconnect(); };
  }
  function setLang(lang) {
    document.documentElement.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll(".ka-lang [data-lang]"), function (el) {
      el.setAttribute("aria-current", el.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }
  window.Ansons = Object.assign(window.Ansons || {}, { icons: ICONS, icon: icon, initNav: initNav, initMotion: initMotion, setLang: setLang });
})();
