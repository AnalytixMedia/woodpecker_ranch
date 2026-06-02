(function () {
  "use strict";

  /* ---------- Lightbox gallery ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".gallery a"));
  var lb = document.getElementById("lb");
  if (lb && links.length) {
    var img = lb.querySelector(".lb__img");
    var count = lb.querySelector(".lb__count");
    var idx = 0;

    function show(i) {
      idx = (i + links.length) % links.length;
      var a = links[idx];
      img.src = a.getAttribute("href");
      img.alt = a.getAttribute("data-alt") || "";
      if (count) count.textContent = (idx + 1) + " / " + links.length;
    }
    function open(i) {
      show(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      img.src = "";
    }

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        open(i);
      });
    });

    lb.querySelector(".lb__close").addEventListener("click", close);
    lb.querySelector(".lb__prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector(".lb__next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });

    // Preload neighbours for snappy nav
    img.addEventListener("load", function () {
      [idx + 1, idx - 1].forEach(function (n) {
        var p = new Image();
        p.src = links[(n + links.length) % links.length].getAttribute("href");
      });
    });
  }

  /* ---------- Map pins: tap to toggle on touch devices ---------- */
  var pins = Array.prototype.slice.call(document.querySelectorAll(".pin"));
  pins.forEach(function (pin) {
    pin.addEventListener("click", function () {
      var wasActive = pin.classList.contains("active");
      pins.forEach(function (p) { p.classList.remove("active"); });
      if (!wasActive) pin.classList.add("active");
    });
    pin.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pin.classList.toggle("active");
      }
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".pin")) pins.forEach(function (p) { p.classList.remove("active"); });
  });

  /* ---------- Hero zoom on scroll ---------- */
  var heroBg = document.querySelector(".hero__bg");
  var hero = document.querySelector(".hero");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroBg && hero && !reduce) {
    var ticking = false;
    function zoomUpdate() {
      var h = hero.offsetHeight || 1;
      var p = Math.min(Math.max(window.pageYOffset / h, 0), 1);
      var scale = 1 + p * 0.1;
      heroBg.style.transform = "scale(" + scale.toFixed(4) + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(zoomUpdate); ticking = true; }
    }, { passive: true });
    zoomUpdate();
  }
})();
