(function () {
  "use strict";

  var WEDDING_DATE = new Date("2027-09-25T13:30:00+02:00");
  var CURRENT_LANG_KEY = "wedding-lang";

  /* ---------------- language ---------------- */

  function applyLanguage(lang) {
    var dict = I18N[lang] || I18N.it;

    document.documentElement.lang = lang;
    if (dict["meta.title"]) document.title = dict["meta.title"];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    try { localStorage.setItem(CURRENT_LANG_KEY, lang); } catch (e) {}
  }

  function initLanguage() {
    var saved = null;
    try { saved = localStorage.getItem(CURRENT_LANG_KEY); } catch (e) {}
    var browserLang = (navigator.language || "it").slice(0, 2);
    var initial = saved || (I18N[browserLang] ? browserLang : "it");
    applyLanguage(initial);

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ---------------- mobile nav ---------------- */

  function initNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- countdown ---------------- */

  function initCountdown() {
    var els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds")
    };
    if (!els.days) return;

    function tick() {
      var diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) {
        var box = document.getElementById("countdown");
        var dict = I18N[document.documentElement.lang] || I18N.it;
        box.innerHTML = '<div class="countdown-item" style="min-width:auto"><span class="countdown-label" style="font-size:16px">' + dict["countdown.today"] + '</span></div>';
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;

      els.days.textContent = d;
      els.hours.textContent = String(h).padStart(2, "0");
      els.minutes.textContent = String(m).padStart(2, "0");
      els.seconds.textContent = String(s).padStart(2, "0");
    }

    var timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------------- add to calendar (.ics) ---------------- */

  function initCalendar() {
    var btn = document.getElementById("addToCalendar");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var start = "20270925T113000Z";
      var end = "20270925T230000Z";
      var ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Domenica e Antonio//Matrimonio//IT",
        "BEGIN:VEVENT",
        "UID:domenica-antonio-2027@wedding",
        "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        "DTSTART:" + start,
        "DTEND:" + end,
        "SUMMARY:Matrimonio di Domenica e Antonio",
        "LOCATION:Tenuta Sei Ore\\, Cascina S. Orio\\, 14\\, 25020 Gambara BS\\, Italia",
        "DESCRIPTION:Siamo emozionati di avervi con noi!",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "matrimonio-domenica-antonio.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });
  }

  /* ---------------- rsvp: extra guest names ---------------- */

  function updateExtraGuestsVisibility() {
    var select = document.getElementById("guests");
    var group = document.getElementById("extraGuestsGroup");
    var field = document.getElementById("extraGuestNames");
    if (!select || !group || !field) return;

    var show = select.value !== "1";
    group.hidden = !show;
    if (show) {
      field.setAttribute("required", "required");
    } else {
      field.removeAttribute("required");
      field.value = "";
    }
  }

  function initExtraGuestsToggle() {
    var select = document.getElementById("guests");
    if (!select) return;
    select.addEventListener("change", updateExtraGuestsVisibility);
    updateExtraGuestsVisibility();
  }

  /* ---------------- travel tabs ---------------- */

  function initTabs() {
    document.querySelectorAll(".tabs").forEach(function (group) {
      var buttons = group.querySelectorAll(".tab-btn");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");

          var targetId = btn.getAttribute("data-tab");
          var panels = group.parentElement.querySelectorAll(".tab-panel");
          panels.forEach(function (p) { p.classList.toggle("active", p.id === targetId); });
        });
      });
    });
  }

  /* ---------------- copy IBAN ---------------- */

  function initCopyIban() {
    var btn = document.getElementById("copyIban");
    var code = document.getElementById("ibanCode");
    if (!btn || !code) return;

    btn.addEventListener("click", function () {
      var text = code.textContent.replace(/\s+/g, " ").trim();
      var dict = I18N[document.documentElement.lang] || I18N.it;
      var originalKey = btn.getAttribute("data-i18n");

      function done() {
        btn.textContent = dict["gift.iban.copied"];
        setTimeout(function () {
          btn.textContent = dict[originalKey];
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  /* ---------------- RSVP form ---------------- */

  function initRsvpForm() {
    var form = document.getElementById("rsvpForm");
    var status = document.getElementById("rsvpStatus");
    var submitBtn = document.getElementById("rsvpSubmit");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var dict = I18N[document.documentElement.lang] || I18N.it;

      status.className = "form-status";
      status.textContent = "";

      if (!GOOGLE_SCRIPT_URL) {
        status.textContent = dict["rsvp.error"] + " (RSVP non ancora configurato: manca GOOGLE_SCRIPT_URL in js/config.js)";
        status.className = "form-status error";
        return;
      }

      var data = new FormData(form);
      var firstname = (data.get("firstname") || "").trim();
      var lastname = (data.get("lastname") || "").trim();

      if (!firstname || !lastname) {
        status.textContent = dict["rsvp.required"];
        status.className = "form-status error";
        var missingField = document.getElementById(firstname ? "lastname" : "firstname");
        if (missingField) missingField.focus();
        return;
      }

      var payload = {
        firstname: firstname,
        lastname: lastname,
        email: data.get("email") || "",
        attending: data.get("attending") || "",
        guests: data.get("guests") || "",
        extraGuestNames: data.get("extraGuestNames") || "",
        children: data.get("children") || "",
        allergies: data.get("allergies") || "",
        notes: data.get("notes") || "",
        language: document.documentElement.lang
      };

      submitBtn.disabled = true;
      submitBtn.textContent = dict["rsvp.submitting"];

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).then(function () {
        status.textContent = dict["rsvp.success"];
        status.className = "form-status success";
        form.reset();
        updateExtraGuestsVisibility();
      }).catch(function () {
        status.textContent = dict["rsvp.error"];
        status.className = "form-status error";
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = dict["rsvp.submit"];
      });
    });
  }

  /* ---------------- stay map ---------------- */

  var STAY_MARKERS = [
    { name: "Tenuta Sei Ore", tier: "venue", lat: 45.2552, lng: 10.2934, url: "https://www.tenutaseiore.it/" },
    { name: "Le Magnolie Agriturismo", tier: "high", lat: 45.3261, lng: 10.0759, url: "https://lemagnolieagriturismo.it" },
    { name: "Hotel Gambara", tier: "low", lat: 45.2559, lng: 10.2931, url: "https://www.hotelgambara.com" },
    { name: "Hotel Vittoria", tier: "high", lat: 45.5383, lng: 10.2201, url: "https://www.hotelvittoria.com" },
    { name: "Albergo Orologio", tier: "low", lat: 45.5397, lng: 10.2214, url: "https://www.albergoorologio.it" },
    { name: "Hotel Estée", tier: "high", lat: 45.4673, lng: 10.5461, url: "https://www.hotelestee.it" },
    { name: "Hotel Piroscafo", tier: "low", lat: 45.4712, lng: 10.5403, url: "https://hotelpiroscafo.it" }
  ];

  var TIER_COLORS = { venue: "#8b7ba8", high: "#c7a45f", low: "#5f6b46" };

  function initStayMap() {
    var el = document.getElementById("stayMap");
    if (!el || typeof L === "undefined") return;

    var map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18
    }).addTo(map);

    var group = [];
    STAY_MARKERS.forEach(function (m) {
      var marker = L.circleMarker([m.lat, m.lng], {
        radius: m.tier === "venue" ? 10 : 8,
        weight: 2,
        color: "#fff",
        fillColor: TIER_COLORS[m.tier],
        fillOpacity: 0.95
      }).addTo(map);

      marker.bindPopup(
        '<strong>' + m.name + '</strong>' +
        '<a href="' + m.url + '" target="_blank" rel="noopener">' + m.url.replace(/^https?:\/\//, "").replace(/\/$/, "") + ' ↗</a>'
      );
      group.push(marker);
    });

    var bounds = L.featureGroup(group).getBounds();
    map.fitBounds(bounds, { padding: [30, 30] });
  }

  /* ---------------- init ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    initLanguage();
    initNav();
    initCountdown();
    initCalendar();
    initTabs();
    initCopyIban();
    initRsvpForm();
    initExtraGuestsToggle();
    initStayMap();
  });
})();
