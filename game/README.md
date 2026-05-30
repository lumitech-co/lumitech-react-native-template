# Bubble Pop 🫧 — a tiny iPhone/Safari game

A single-file, zero-dependency tap game tuned to run **perfectly on iPhone in
Safari**. No build step, no framework — just open `index.html`.

## Play

- **Tap blue bubbles** for +1.
- **Tap yellow bubbles** for +3 (they're fast — pop them quick).
- **Never tap a 💣** — it costs a life.
- **Don't let a bubble expire** — a missed bubble also costs a life.
- 3 lives. Survive as long as you can; it speeds up the longer you last.
- Your best score is saved on-device (`localStorage`).

## Why it works well on iOS Safari

- `viewport-fit=cover` + `env(safe-area-inset-*)` so the HUD and buttons clear
  the notch / Dynamic Island and the home indicator.
- `user-scalable=no` and `touch-action: manipulation` remove the 300 ms
  double-tap zoom delay and accidental pinch-zoom.
- Bubbles respond to `touchstart` (instant) with a `click` fallback for desktop.
- `overscroll-behavior: none` + a `touchmove` preventer stop the rubber-band
  scroll and pull-to-refresh.
- `-webkit-tap-highlight-color: transparent` removes the grey tap flash.
- Game auto-ends if you background the tab, so you don't return to a dead run.

## Run it

It's pure static HTML — any of these work:

```bash
# Option A: just open the file
open game/index.html            # macOS

# Option B: serve it (better for testing on a real iPhone on the same Wi-Fi)
cd game && python3 -m http.server 8000
# then visit http://<your-computer-ip>:8000 on your iPhone
```

To test on a physical iPhone, run the server option above and browse to your
computer's LAN IP from Safari on the phone.
