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
