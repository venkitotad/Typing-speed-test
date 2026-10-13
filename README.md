# Typing Speed Test

A responsive typing speed test built with **HTML, CSS, and vanilla JavaScript** as a Frontend Mentor challenge. Choose a difficulty, type a passage, track your performance, and try to beat your personal best.

## Features

- **Three difficulty levels:** Easy, Medium, and Hard, with passages loaded randomly from `data.json`.
- **Two test modes:** Timed mode counts down from 60 seconds; Passage mode counts up until the passage is completed.
- **Live typing feedback:** Correct characters appear green, incorrect characters appear red and underlined, and the current position is highlighted.
- **Live statistics:** Words per minute (WPM), accuracy, and remaining or elapsed time.
- **Results screen:** Displays WPM, accuracy, and correct/incorrect character counts when a test ends.
- **Personal best:** Saves the highest WPM in browser `localStorage` so it remains after refreshing the page.
- **Result states:** Shows a baseline message on the first completed test and a high-score celebration with confetti for a new personal best.
- **Restart:** Starts a fresh random passage at the selected difficulty.
- **Responsive layout:** Uses desktop difficulty/mode buttons and mobile dropdowns.

## Built With

- HTML5
- CSS3, including custom properties and responsive media queries
- Vanilla JavaScript
- JSON for passage data
- Browser `localStorage` for the personal best
- Google Fonts: Sora

No JavaScript frameworks, package manager, or build step is required.

## Getting Started

### Run locally

1. Clone or download this repository.
2. Open the project folder in your editor.
3. Serve the folder using a local development server, such as the **Live Server** extension in Visual Studio Code.
4. Open the local URL provided by the server.

Use a local server rather than opening `index.html` directly with a `file://` URL, because the app loads passages using `fetch()` from `data.json`.


## How to Use

1. Choose a difficulty level.
2. Select **Timed (60s)** or **Passage** mode.
3. Click **Start Typing Test**, or click the passage to focus the typing input.
4. Type the displayed passage. Use Backspace to correct the current text; mistakes still count toward the accuracy history.
5. Review your results when the passage is complete or the timed test reaches zero.
6. Select **Beat This Score** or **Go Again** to start another attempt.

## Performance Metrics

- **WPM:** calculated from correctly typed characters using five characters as one standard word, adjusted for elapsed time.
- **Accuracy:** correct typing attempts divided by all counted typing attempts, expressed as a percentage. Correcting a mistake with Backspace does not erase the earlier mistake from the accuracy history.
- **Personal best:** the highest recorded WPM is stored in `localStorage` under `typingTestBest` in the current browser.

## Deployment

This is a static website and can be deployed using GitHub Pages, Netlify, or Vercel. After deployment, add the public URL here:

**Live demo:** [_Add the deployed site URL before submitting._](https://venkitotad.github.io/Typing-speed-test/)

## Credits

- Challenge and design: [Frontend Mentor](https://www.frontendmentor.io)
- Developer: [venkitotad](https://github.com/venkitotad)

---

Built as a Frontend Mentor practice project to strengthen responsive UI development, DOM manipulation, event handling, timing logic, and client-side persistence.
