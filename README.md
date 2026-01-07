# PageUp — Swipe-based Reading MVP

A mobile web prototype exploring whether **chunked, swipe-based interaction** can reduce friction in mobile long-form reading.

This project was built as a **product experiment**, not a full-featured reading application.

---

## Problem

Reading long-form text on mobile devices often feels cognitively heavy, especially in short, frequent reading sessions. Most e-book readers are optimized for page-based navigation or scrolling, which do not align well with gesture-native mobile behavior shaped by short-form media.

PageUp explores whether **vertical swipe navigation combined with smaller text chunks** changes how readers engage with long-form content on mobile.

---

## Hypothesis

Long-form text may feel less cognitively heavy on mobile if content is broken into discrete chunks and navigated using familiar vertical swipe gestures.

A counter-hypothesis is that chunking could disrupt narrative flow or feel artificial for deep readers.

---

## MVP Scope

The MVP was intentionally scoped to test **interaction quality and learning**, not product completeness.

### Included
- Vertical swipe-based navigation (forward / backward)
- Variable text density (Less / Medium / More)
- Reading progress indicators
- Basic resume state on the same device
- Clean, preloaded Chapter 1 of *The Great Gatsby*
- Optional EPUB upload
- Session-level reading analytics

### Intentionally excluded
- Backend or server-side persistence
- User accounts or authentication
- Highlights, bookmarks, or annotations
- Personalization or recommendations
- Monetization
- Robust EPUB normalization

---

## Live Demo

👉 **[https://rohitsonawane1.github.io/PageUp-MVP3/]**

*(Best experienced on a mobile device)*

---

## Tech Stack (brief)

- HTML / CSS / JavaScript
- EPUB.js for EPUB handling
- LocalStorage for resume state
- Google Forms for session-level analytics

---

## Repository Structure

- `index.html` — App shell  
- `script.js` — Interaction and state logic  
- `styles.css` — Styling and animations  
- `books.js` — Preloaded content  

---

## More Context

- 📄 **1-page case study:** https://rohitsonawane1.github.io/PageUp-MVP3/projects/PageUp.html
- ✍️ **Deep-dive blog:** 

---

## Notes

This repository is intentionally lightweight and experimentation-focused.  
The goal was to learn from real interaction behavior rather than to ship a complete reading product.
