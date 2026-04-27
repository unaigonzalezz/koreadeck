<h1 align="center">
  <br>
  <a><img src="./com.unai-gonzalez.koreadeck.sdPlugin/imgs/logo/koreadeck-logo-bg.png" alt="KOReadeck Logo" height="200px"></a>
</h1>

<h3 align="center">Control your KOReader device directly from your Stream Deck.</h3>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#actions">Actions</a> •
  <a href="#setup">Setup</a> •
  <a href="#requirements">Requirements</a> •
  <a href="#download">Download</a> •
  <a href="#support">Support</a> •
  <a href="#license">License</a>
</p>

<h1 align="center">
  <img src="./com.unai-gonzalez.koreadeck.sdPlugin/imgs/previews/1.png" alt="KOReadeck Banner">
</h1>

[![Get it on Marketplace](./com.unai-gonzalez.koreadeck.sdPlugin/imgs/previews/marketplace.png "Get KOReadeck on Marketplace")](https://marketplace.elgato.com/product/koreadeck-e829b8cc-85d1-4675-8b5a-d842f87d61f4)

[![Marketplace download badge](https://img.shields.io/badge/dynamic/json?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMjMwIiBoZWlnaHQ9IjIzMCIgdmlld0JveD0iMCAwIDIzMCAyMzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02My45NzEgMzguNDgzTDY0LjA5MSAzOC41NzNMMTA5LjY5MiA2NC43NzdDMTA3LjQ1MyA3Ny4yODUgMTAwLjg5NCA4OC43MTIgOTEuMTgzIDk2Ljk3NkM4MS4zMTYgMTA1LjM3MyA2OC43NDkgMTEwIDU1Ljc5MSAxMTBDNDEuMTU5IDExMCAyNy40MDMgMTA0LjI4IDE3LjA1IDkzLjg5MUM2LjcwMiA4My41MDIgMSA2OS42ODYgMSA1NUMxIDQwLjMxNCA2LjcwMiAyNi40OTggMTcuMDQ5IDE2LjEwOUMyNy4zOTYgNS43MiA0MS4xNTIgMCA1NS43OSAwQzY2Ljk3MSAwIDc3LjcyIDMuMzYxIDg2Ljg3OSA5LjcxMUM5NS44MjggMTUuOTE3IDEwMi42NzYgMjQuNTQxIDEwNi42OTEgMzQuNjU0QzEwNy4yMDEgMzUuOTUgMTA3LjY3NSAzNy4yODMgMTA4LjA4OSAzOC42MjFMOTguMzQ4IDQ0LjI4N0M5OC4wMTIgNDIuOTQzIDk3LjYxIDQxLjYwNCA5Ny4xNDggNDAuMzAyQzkwLjk0MiAyMi43NDcgNzQuMzE3IDEwLjk0NyA1NS43OSAxMC45NDdDMzEuNTkxIDEwLjk0NyAxMS45MDUgMzAuNzExIDExLjkwNSA1NUMxMS45MDUgNzkuMjg5IDMxLjU5MSA5OS4wNTMgNTUuNzkgOTkuMDUzQzY1LjE5NCA5OS4wNTMgNzQuMTYyIDk2LjEgODEuNzMgOTAuNTA3Qzg5LjE0MiA4NS4wMjcgOTQuNTc5IDc3LjUxOSA5Ny40NTQgNjguNzk5TDk3LjQ4NCA2OC42MDdMNDQuMzAyIDM4LjA2NFY3MS4xODJMNjIuNjM3IDYwLjU3N0w3Mi4wNzggNjUuOTkxTDQ0LjU5NiA4MS44ODlMMzQuODc5IDc2LjMzMVYzMi45NzRMNDQuNTg0IDI3LjM2Mkw2My45NzYgMzguNDg5TDYzLjk3IDM4LjQ4M0g2My45NzFaIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTFfNDU2KSI+CjxwYXRoIGQ9Ik0yMzAgOTBDMjMwIDEwMS4wNDYgMjIxLjA0NiAxMTAgMjEwIDExMEMyMDUuOTQyIDExMCAyMDIuMTY2IDEwOC43OTIgMTk5LjAxMyAxMDYuNzE1QzE5NS44NiAxMDQuNjM4IDE5My4zMjkgMTAxLjY5MiAxOTEuNzYyIDk4LjIxOUwxNzcuMjggNjYuMTMxQzE3Ni44ODggNjUuMjYzIDE3Ni4wMTYgNjQuNjU4IDE3NS4wMDEgNjQuNjU4QzE3My45ODYgNjQuNjU4IDE3My4xMTMgNjUuMjY0IDE3Mi43MjIgNjYuMTMzTDE1OC4yNCA5OC4yMTlDMTU1LjEwNSAxMDUuMTY2IDE0OC4xMTggMTEwIDE0MC4wMDEgMTEwQzEyOC45NTYgMTEwIDEyMC4wMDEgMTAxLjA0NiAxMjAuMDAxIDkwQzEyMC4wMDEgODUuOTQyIDEyMS4yMSA4Mi4xNjYgMTIzLjI4NyA3OS4wMTNDMTI1LjM2NCA3NS44NiAxMjguMzEgNzMuMzMgMTMxLjc4MyA3MS43NjJMMTYzLjg3MSA1Ny4yOEMxNjQuNzM5IDU2Ljg4OCAxNjUuMzQzIDU2LjAxNSAxNjUuMzQzIDU1QzE2NS4zNDMgNTMuOTg1IDE2NC43MzggNTMuMTEyIDE2My44NjkgNTIuNzIxTDEzMS43ODIgMzguMjM5QzEyNC44MzUgMzUuMTA0IDEyMCAyOC4xMTcgMTIwIDIwQzEyMCA4Ljk1NSAxMjguOTU1IDAgMTQwIDBDMTQ0LjA1OSAwIDE0Ny44MzUgMS4yMDkgMTUwLjk4OCAzLjI4NkMxNTQuMTQxIDUuMzYzIDE1Ni42NzEgOC4zMDggMTU4LjIzOSAxMS43ODJMMTcyLjcyMSA0My44N0MxNzMuMTEzIDQ0LjczOCAxNzMuOTg2IDQ1LjM0MiAxNzUgNDUuMzQyQzE3Ni4wMTQgNDUuMzQyIDE3Ni44ODkgNDQuNzM3IDE3Ny4yOCA0My44NjhMMTkxLjc2MiAxMS43ODJDMTk0Ljg5NyA0LjgzNSAyMDEuODg0IDAgMjEwIDBDMjIxLjA0NiAwIDIzMCA4Ljk1NSAyMzAgMjBDMjMwIDI0LjA1OCAyMjguNzkxIDI3LjgzNCAyMjYuNzE0IDMwLjk4OEMyMjQuNjM3IDM0LjE0MSAyMjEuNjkyIDM2LjY3MiAyMTguMjE5IDM4LjIzOUwxODYuMTMzIDUyLjcyMUMxODUuMjY0IDUzLjExMiAxODQuNjU4IDUzLjk4NSAxODQuNjU4IDU1QzE4NC42NTggNTYuMTQgMTg1LjM4NiA1Ni45NDMgMTg2LjEzMSA1Ny4yOEwyMTguMjE5IDcxLjc2MkMyMjUuMTY1IDc0Ljg5NyAyMzAgODEuODg0IDIzMCA5MFoiIGZpbGw9IiM0RERBNzkiLz4KPC9nPgo8cGF0aCBkPSJNMTIuNTAxIDEyNUM1LjU5NyAxMjUgMC4wMDEgMTMwLjU5NiAwLjAwMSAxMzcuNUMwLjAwMSAxNDQuNDA0IDUuNTk3IDE1MCAxMi41MDEgMTUwSDc1LjQyMkw5LjA5NCAxOTMuMjMzQzMuNjE5IDE5Ni44MDIgMCAyMDIuOTc4IDAgMjEwQzAgMjIxLjA0NiA4Ljk1NCAyMzAgMjAgMjMwQzI3LjAyMiAyMzAgMzMuMTk4IDIyNi4zOCAzNi43NjYgMjIwLjkwNkw4MC4wMDEgMTU0LjU3OVYyMTcuNUM4MC4wMDEgMjI0LjQwNCA4NS41OTcgMjMwIDkyLjUwMSAyMzBDOTkuNDA1IDIzMCAxMDUuMDAxIDIyNC40MDQgMTA1LjAwMSAyMTcuNVYxMjVIMTIuNTAxWiIgZmlsbD0iI0VBM0I5QyIvPgo8cGF0aCBkPSJNMTc3LjUgMTIwQzE0OC41MDUgMTIwIDEyNSAxNDMuNTA1IDEyNSAxNzIuNVYyMjVIMTc3LjVDMjA2LjQ5NSAyMjUgMjMwIDIwMS40OTUgMjMwIDE3Mi41QzIzMCAxNDMuNTA1IDIwNi40OTUgMTIwIDE3Ny41IDEyMFoiIGZpbGw9IiNGNEI2MzUiLz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTFfNDU2Ij4KPHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMTAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjApIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==&query=download_count&suffix=%20Downloads&label=Marketplace&labelColor=151515&color=204cfe&url=https%3A%2F%2Fmp-gateway.elgato.com%2Fproducts%2Fe829b8cc-85d1-4675-8b5a-d842f87d61f4 "Marketplace download badge")](https://marketplace.elgato.com/product/koreadeck-e829b8cc-85d1-4675-8b5a-d842f87d61f4)

**KOReadeck** is a Stream Deck plugin that lets you control [KOReader](https://koreader.rocks/) over your local network — no touch required. Turn pages, adjust brightness, monitor battery, preview your screen, and more, all from a single button press.

---

## Key Features

- **17 actions** — page navigation, frontlight control, bookmarks, screen orientation, battery level, and more.
- **Fully wireless** — talks to KOReader over HTTP on your local network. No wires.
- **Book cover on your deck** — pulls the cover art for whatever you're currently reading and puts it right on the button, with optional title, author, or page number underneath.
- **Live screen preview** — one press spins up a local server and opens a browser tab showing your device's screen in real time, so you can read on a bigger screen.
- Works on **macOS** and **Windows**.

---

## Actions

### Configuration

> _Set up your connection once — all other actions use it automatically._

Opens a local configuration page in your browser where you set your KOReader device's **IP address**, **port** (default: `8080`), and **request timeout**. This is the first action you should add; without it, nothing else will work.

---

### Change Page

> _Navigate your book without touching the device._

Flips pages forward or backward. Choose from:

- **Next / Prev** — single page at a time.
- **Next 10 / Prev 10** — jump 10 pages at once.
- **Custom** — define any page delta (e.g. `+5`, `-3`).

---

### Toggle Night Mode

> _Switch between light and dark reading in one press._

Toggles KOReader between light mode and night mode. The button icon updates to reflect the current state so you always know which mode is active.

---

### Toggle Frontlight

> _On/off control for devices with a built-in frontlight._

Turns the frontlight on or off. The button reflects the current state visually.

---

### Frontlight Brightness

> _Fine-tune your reading light without opening menus._

Increases or decreases frontlight intensity by one step, or a **custom delta** of your choice (range: −24 to +24). Brightness is always clamped to the safe 0–24 range.

---

### Show Bookmarks

> _Jump straight to your bookmark list._

Opens the bookmarks panel for the current book on your device.

---

### Toggle Bookmark on Current Page

> _Bookmark the current page instantly._

Adds or removes a bookmark on the page you are currently reading.

---

### Book Info

> _Your book's cover, right on your Stream Deck._

Fetches the cover art for the book currently open on your device (via **Open Library** or **Google Books** as a fallback) and displays it on the button. Below the cover you can optionally show:

- Current page number
- Title, Author, or Series
- Nothing — just the cover.

---

### Screen Preview

> _See exactly what is on your device._

Starts a local web server and opens a browser tab showing a live screenshot of your KOReader screen. Useful for checking your device without physically looking at it.

---

### Take Screenshot

> _Capture your current reading view._

Triggers a screenshot on the device and saves it directly to device storage.

---

### Open Last Document

> _Resume reading instantly._

Opens the last document you had open on your KOReader device.

---

### Battery Level

> _Keep an eye on your device's charge._

Displays the current battery percentage using a set of visual icons across 6 charge levels (empty through full), including a charging indicator. The percentage number overlay can be toggled on or off.

---

### Change Screen Orientation

> _Portrait or landscape — your choice._

Switches between portrait and landscape display mode. The button icon updates to show the current orientation.

---

### Reader Settings

> _Access reading options without touching the screen._

Opens the reader settings menu for the document currently open on your device.

---

### Status Bar

> _Toggle the KOReader footer in one press._

Shows or hides the KOReader status bar at the bottom of the screen.

---

### Exit KOReader

> _Close the app remotely._

Sends an exit command to KOReader. You will need to relaunch the app manually on the device afterward.

---

### Restart KOReader

> _Restart the app without touching your device._

Restarts KOReader remotely — useful after installing plugins or recovering from an unresponsive state.

---

## Requirements

- **Stream Deck** 6.9 or later
- **KOReader** with the HTTP server plugin enabled
- **macOS** 12+ or **Windows** 10+

---

## Download

Get the latest release from the [Stream Deck Marketplace](https://marketplace.elgato.com) or the [GitHub Releases page](https://github.com/unaigonzalezz/koreadeck/releases).

---

## Setup

1. **Install the plugin** from the Stream Deck Marketplace or from the [Releases page](https://github.com/unaigonzalezz/koreadeck/releases).
2. **Add the Configuration action** to your Stream Deck and press it — a browser page will open.
3. **Follow the steps on screen to enable HTTP Inspector** and save.
4. **You can now delete the config action**, add it again to change current settings.
5. Add any other actions. They will connect to the device automatically using the saved configuration.

> **Note:** Your PC and KOReader device must be on the same local network.

---

## Support

If you would like to support development:

<a href="https://ko-fi.com/unaigonzalez" target="_blank">
  <img src="https://user-images.githubusercontent.com/7586345/125668092-55af2a45-aa7d-4795-93ed-de0a9a2828c5.png" width="160">
</a>

If you can't donate, leaving a ⭐ on the repo goes a long way — it genuinely makes my day.

---

## Future improvements

- Custom KOReader plugin to improve interaction with Stream Deck plugin.
- Improve range of actions that work with Live Preview

Feel free to suggest new actions in the Discussions tab.

---

## No Stream Deck?

You don't need a physical Stream Deck to use this plugin. There are free and affordable alternatives:

- **[Elgato Stream Deck Mobile](https://www.elgato.com/en/stream-deck-mobile)** — the official app for iOS and Android, free for up to 6 actions.
- **Compatible keyboards** — some keyboards include built-in Stream Deck keys (e.g. Corsair Vanguard 96, Corsair Galleon...) and work natively with the Stream Deck software.

<br />
<img src="./com.unai-gonzalez.koreadeck.sdPlugin/imgs/previews/5.png" alt="KOReadeck Banner" style="width:100vh">

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to improve.

---

## Thanks

- [Elgato Stream Deck SDK](https://github.com/elgatosf/streamdeck) for the Node.js plugin framework.
- [KOReader](https://koreader.rocks/) for the open-source e-reader that made this possible.
- [Open Library](https://openlibrary.org/) and [Google Books](https://books.google.com/) for cover image data.
- [Google](https://google.com) for Material Icons.

---

## License

[MIT](https://choosealicense.com/licenses/mit/)

---
