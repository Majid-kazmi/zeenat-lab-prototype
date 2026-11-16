/* ==========================================================================
   Zeenat Lab — shared prototype behaviour
   - Mock data (one place, so every screen shows the same names and prices)
   - Tab bar, patient switcher, cart, sheets, toasts, choice groups, entrance motion
   Pages opt in with data-attributes; see README.md for the list.
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Mock data ---------- */
  const TESTS = {
    cbc:      { name: "Complete Blood Count (CBC)", price: 950,  tat: "Same day" },
    fbs:      { name: "Fasting Blood Sugar",        price: 800,  tat: "Same day", fast: 10 },
    hba1c:    { name: "HbA1c",                      price: 1450, tat: "Same day" },
    lipid:    { name: "Lipid Profile",              price: 2100, tat: "Next day", fast: 12 },
    lft:      { name: "Liver Function Test (LFT)",  price: 1850, tat: "Same day" },
    rft:      { name: "Kidney Function Test (RFT)", price: 1600, tat: "Same day" },
    tsh:      { name: "Thyroid (TSH)",              price: 1300, tat: "Next day" },
    vitd:     { name: "Vitamin D",                  price: 2900, tat: "2 days" },
    urine:    { name: "Urine Routine Examination",  price: 500,  tat: "Same day" },
    fullbody: { name: "Full Body Checkup",          price: 5999, was: 8500, tat: "2 days", fast: 12 },
  };

  const PEOPLE = {
    self:   { name: "Tariq Mahmood", first: "Tariq",  initials: "TM", rel: "You",    meta: "Male · 42 yrs" },
    mother: { name: "Zainab Bibi",   first: "Zainab", initials: "ZB", rel: "Mother", meta: "Female · 68 yrs" },
    wife:   { name: "Amina Tariq",   first: "Amina",  initials: "AT", rel: "Wife",   meta: "Female · 38 yrs" },
    son:    { name: "Hamza Tariq",   first: "Hamza",  initials: "HT", rel: "Son",    meta: "Male · 12 yrs" },
  };

  const HELPLINE = "+924211100000"; // placeholder — replace with the real helpline

  /* ---------- Storage (never required; prototype still works without it) ---------- */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem("zl." + key); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) { try { localStorage.setItem("zl." + key, JSON.stringify(value)); } catch { /* ignore */ } },
  };

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pkr = (n) => "Rs " + Number(n).toLocaleString("en-PK");

  /* ---------- Toast ---------- */
  let toastEl, toastTimer;
  function toast(msg, icon = "check_circle") {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = `<span class="icon icon--fill">${icon}</span><span>${msg}</span>`;
    if (!$(".tabbar") ) toastEl.style.bottom = "calc(var(--safe-bottom) + 100px)";
    requestAnimationFrame(() => toastEl.classList.add("is-show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2200);
  }

  /* ---------- Sheets ---------- */
  let backdrop;
  function ensureBackdrop() {
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    backdrop.addEventListener("click", closeSheets);
    document.body.appendChild(backdrop);
    return backdrop;
  }
  function openSheet(id) {
    const sheet = document.getElementById(id);
    if (!sheet) return;
    ensureBackdrop().classList.add("is-open");
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
  }
  function closeSheets() {
    $$(".sheet.is-open").forEach((s) => { s.classList.remove("is-open"); s.setAttribute("aria-hidden", "true"); });
    backdrop && backdrop.classList.remove("is-open");
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheets(); });

  /* ---------- Tab bar ---------- */
  const TABS = [
    { id: "home",     label: "Home",     icon: "home",           href: "10-home.html" },
    { id: "tests",    label: "Tests",    icon: "science",        href: "11-tests.html" },
    { id: "bookings", label: "Bookings", icon: "calendar_month", href: "20-bookings.html" },
    { id: "reports",  label: "Reports",  icon: "description",    href: "30-reports.html", count: 1 },
    { id: "profile",  label: "Profile",  icon: "person",         href: "40-profile.html" },
  ];
  function renderTabbar() {
    const nav = $("[data-tabbar]");
    if (!nav) return;
    const active = nav.dataset.tabbar;
    nav.className = "tabbar";
    nav.setAttribute("aria-label", "Main");
    nav.innerHTML = TABS.map((t) => `
      <a class="tab${t.id === active ? " is-active" : ""}" href="${t.href}"${t.id === active ? ' aria-current="page"' : ""}>
        <span class="icon">${t.icon}</span>${t.label}
        ${t.count && t.id !== active ? `<span class="tab__count">${t.count}</span>` : ""}
      </a>`).join("");
  }

  /* ---------- Patient ("booking for") ---------- */
  function patientId() { return store.get("patient", "self"); }
  function renderPatient() {
    const p = PEOPLE[patientId()] || PEOPLE.self;
    $$("[data-patient-name]").forEach((el) => (el.textContent = p.name));
    $$("[data-patient-first]").forEach((el) => (el.textContent = p.first));
    $$("[data-patient-initials]").forEach((el) => (el.textContent = p.initials));
    $$("[data-patient-meta]").forEach((el) => (el.textContent = `${p.rel} · ${p.meta}`));
    $$("[data-patient-option]").forEach((el) => el.classList.toggle("is-active", el.dataset.patientOption === patientId()));
  }
  function buildPatientSheet() {
    if (!$("[data-patient-switch]") || $("#patient-sheet")) return;
    const sheet = document.createElement("div");
    sheet.className = "sheet"; sheet.id = "patient-sheet";
    sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-label", "Choose patient"); sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = `
      <div class="sheet__handle"></div>
      <h2 class="sheet__title">Who is this for?</h2>
      <div class="stack-sm">
        ${Object.entries(PEOPLE).map(([id, p]) => `
          <button class="option" data-patient-option="${id}">
            <span class="avatar avatar--sm">${p.initials}</span>
            <span class="grow"><span class="t-strong" style="display:block">${p.name}</span><span class="t-xs t-muted">${p.rel} · ${p.meta}</span></span>
            <span class="option__radio"></span>
          </button>`).join("")}
      </div>
      <a class="btn btn--ghost btn--block" href="42-add-family-member.html" style="margin-top:12px"><span class="icon">person_add</span>Add family member</a>`;
    document.body.appendChild(sheet);
  }

  /* ---------- Cart ---------- */
  const cart = {
    ids() { return store.get("cart", []).filter((id) => TESTS[id]); },
    has(id) { return this.ids().includes(id); },
    toggle(id) {
      const ids = this.ids();
      const i = ids.indexOf(id);
      i > -1 ? ids.splice(i, 1) : ids.push(id);
      store.set("cart", ids);
      return i === -1;
    },
    remove(id) { store.set("cart", this.ids().filter((x) => x !== id)); },
    total() { return this.ids().reduce((s, id) => s + TESTS[id].price, 0); },
    maxFast() { return this.ids().reduce((m, id) => Math.max(m, TESTS[id].fast || 0), 0); },
  };

  function renderCart(bump) {
    const ids = cart.ids();
    const count = ids.length;
    $$("[data-add]").forEach((btn) => {
      const on = ids.includes(btn.dataset.add);
      btn.classList.toggle("is-added", on);
      btn.setAttribute("aria-pressed", on);
      btn.innerHTML = on ? '<span class="icon">check</span>Added' : '<span class="icon">add</span>Add';
    });
    $$("[data-cart-count]").forEach((el) => {
      el.textContent = count;
      if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    $$("[data-cart-label]").forEach((el) => (el.textContent = count === 1 ? "1 test" : `${count} tests`));
    $$("[data-cart-total]").forEach((el) => (el.textContent = pkr(cart.total())));
    $$("[data-cartbar]").forEach((el) => (el.hidden = count === 0));
    $$("[data-cart-lines]").forEach((el) => {
      el.innerHTML = ids.map((id) => `
        <div class="row-between" style="padding:6px 0">
          <span class="t-sm">${TESTS[id].name}</span>
          <span class="t-sm t-strong num">${pkr(TESTS[id].price)}</span>
        </div>`).join("");
    });
    const fast = cart.maxFast();
    $$("[data-cart-fasting]").forEach((el) => {
      el.hidden = !fast;
      const h = $("[data-fast-hours]", el); if (h) h.textContent = fast;
    });
    $$("[data-cart-empty]").forEach((el) => (el.hidden = count > 0));
    $$("[data-cart-needs-items]").forEach((el) => el.setAttribute("aria-disabled", count === 0));
  }

  /* ---------- Choice groups (single select) ---------- */
  function initChoices() {
    $$("[data-choice]").forEach((group) => {
      group.addEventListener("click", (e) => {
        const item = e.target.closest("[data-value]");
        if (!item || !group.contains(item) || item.classList.contains("is-disabled")) return;
        $$("[data-value]", group).forEach((el) => {
          el.classList.toggle("is-active", el === item);
          el.setAttribute("aria-checked", el === item);
        });
        group.dispatchEvent(new CustomEvent("choice", { detail: item.dataset.value, bubbles: true }));
      });
    });
  }

  /* ---------- Global clicks ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const add = t.closest("[data-add]");
    if (add) { e.preventDefault(); const added = cart.toggle(add.dataset.add); renderCart(true); if (added && !$("[data-cartbar]")) toast("Added to your tests"); return; }

    const open = t.closest("[data-sheet-open]");
    if (open) { e.preventDefault(); openSheet(open.dataset.sheetOpen); return; }
    if (t.closest("[data-sheet-close]")) { e.preventDefault(); closeSheets(); return; }

    if (t.closest("[data-patient-switch]")) { e.preventDefault(); openSheet("patient-sheet"); return; }
    const pick = t.closest("[data-patient-option]");
    if (pick) {
      store.set("patient", pick.dataset.patientOption);
      renderPatient();
      setTimeout(closeSheets, 180);
      toast(`Now booking for ${PEOPLE[pick.dataset.patientOption].first}`, "person");
      return;
    }

    const msg = t.closest("[data-toast]");
    if (msg) { e.preventDefault(); toast(msg.dataset.toast, msg.dataset.toastIcon || "check_circle"); }
  });

  /* ---------- Misc ---------- */
  function initStagger() {
    $$("[data-stagger]").forEach((parent) => Array.from(parent.children).forEach((c, i) => c.style.setProperty("--i", i)));
  }
  function initTopbar() {
    const bar = $(".topbar");
    if (!bar) return;
    const onScroll = () => bar.classList.toggle("is-scrolled", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  function initHelpline() {
    $$("[data-helpline]").forEach((a) => a.setAttribute("href", "tel:" + HELPLINE));
  }

  function boot() {
    const d = document.body.dataset.cartDefault;
    if (d && cart.ids().length === 0) store.set("cart", d.split(","));
    renderTabbar();
    buildPatientSheet();
    renderPatient();
    renderCart(false);
    initChoices();
    initStagger();
    initTopbar();
    initHelpline();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();

  window.ZL = { TESTS, PEOPLE, cart, store, toast, openSheet, closeSheets, renderCart, pkr };
})();
