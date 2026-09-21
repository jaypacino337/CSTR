# CSTR Lending — Website

A responsive, single-page marketing site for a loan company. Plain HTML, CSS and vanilla JavaScript — no build step required.

## Sections

- Sticky header with mobile menu
- Hero with live quick-quote widget
- Loan products (Personal, Business, Home, Auto)
- How it works (3 steps)
- Interactive loan calculator (amount / term / APR sliders)
- Rates table
- Why us / features
- Testimonials
- FAQ accordion
- Application form with client-side validation
- Footer with newsletter signup

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Structure

```
index.html        # page markup
css/styles.css    # styles (CSS variables at top for easy theming)
js/main.js        # calculator, quote widget, nav, form handling
assets/           # logo + favicon (SVG)
```

## Customizing

- **Brand colours / fonts:** edit the `:root` variables at the top of `css/styles.css`.
- **Rates & quote logic:** adjust `BASE_RATES`, `CREDIT_ADJ` and `DEFAULT_TERM` in `js/main.js`.
- **Form submission:** the application and newsletter forms currently simulate a submit; wire them to your backend in `js/main.js`.
