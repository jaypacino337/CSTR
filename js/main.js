/* =========================================================
   CSTR Lending — main.js
   Mobile nav, loan calculator, quick quote, form handling
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  const fmtMoney = (n, decimals = 0) =>
    "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  /** Standard amortized monthly payment. */
  function monthlyPayment(principal, annualRatePct, months) {
    const r = annualRatePct / 100 / 12;
    if (r === 0) return principal / months;
    return (principal * r) / (1 - Math.pow(1 + r, -months));
  }

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#navToggle");
  const nav = $("#nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Loan calculator ---------- */
  const amountRange = $("#amountRange");
  const termRange = $("#termRange");
  const rateRange = $("#rateRange");

  function updateCalc() {
    if (!amountRange) return;
    const amount = Number(amountRange.value);
    const term = Number(termRange.value);
    const rate = Number(rateRange.value);

    const monthly = monthlyPayment(amount, rate, term);
    const total = monthly * term;

    $("#amountOut").textContent = fmtMoney(amount);
    $("#termOut").textContent = term + " months";
    $("#rateOut").textContent = rate.toFixed(2) + "%";
    $("#monthlyOut").textContent = fmtMoney(monthly);
    $("#interestOut").textContent = fmtMoney(total - amount);
    $("#totalOut").textContent = fmtMoney(total);
  }
  [amountRange, termRange, rateRange].forEach((el) => el && el.addEventListener("input", updateCalc));
  updateCalc();

  /* ---------- Quick quote (hero) ---------- */
  const BASE_RATES = { personal: 6.49, business: 7.25, home: 5.89, auto: 5.49 };
  const CREDIT_ADJ = { excellent: 0, good: 2.5, fair: 6.5, poor: 12 };
  const DEFAULT_TERM = { personal: 36, business: 60, home: 360, auto: 60 };

  const quoteForm = $("#quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const type = $("#quoteType").value;
      const credit = $("#quoteCredit").value;
      const amountInput = $("#quoteAmount");
      const amount = Number(amountInput.value);

      if (!amount || amount < 1000) {
        amountInput.classList.add("is-invalid");
        amountInput.focus();
        return;
      }
      amountInput.classList.remove("is-invalid");

      const rate = BASE_RATES[type] + CREDIT_ADJ[credit];
      const term = DEFAULT_TERM[type];
      const monthly = monthlyPayment(amount, rate, term);

      $("#quoteRate").textContent = rate.toFixed(2) + "% APR";
      $("#quotePayment").textContent = `≈ ${fmtMoney(monthly)}/mo over ${term / 12} years`;
      $("#quoteResult").hidden = false;
    });
  }

  /* ---------- Application form ---------- */
  const applyForm = $("#applyForm");
  if (applyForm) {
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = $("#applyMsg");
      let valid = true;

      applyForm.querySelectorAll("[required]").forEach((field) => {
        const ok = field.type === "checkbox" ? field.checked : field.checkValidity() && field.value.trim() !== "";
        field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        msg.className = "form-msg err";
        msg.textContent = "Please complete the highlighted fields.";
        return;
      }

      const btn = applyForm.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Checking…";
      msg.className = "form-msg";
      msg.textContent = "";

      // Simulated submission — replace with a real API call.
      setTimeout(() => {
        const first = applyForm.first.value.trim();
        msg.className = "form-msg ok";
        msg.textContent = `Thanks ${first}! Your rate check is in progress. Check your email for next steps.`;
        btn.textContent = "Submitted ✓";
        applyForm.reset();
        setTimeout(() => { btn.disabled = false; btn.textContent = "Check My Rate"; }, 4000);
      }, 900);
    });

    applyForm.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
  }

  /* ---------- Newsletter ---------- */
  const newsletter = $("#newsletterForm");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletter.querySelector("input");
      if (!input.checkValidity() || !input.value) { input.classList.add("is-invalid"); return; }
      input.classList.remove("is-invalid");
      const btn = newsletter.querySelector("button");
      btn.textContent = "Subscribed ✓";
      btn.disabled = true;
      input.value = "";
    });
  }

  /* ---------- Misc ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
