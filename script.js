const startButton = document.getElementById("start-btn");
const startOverlay = document.getElementById("start-overlay");
const passage = document.getElementById("passage");
const typingInput = document.getElementById("typing-input");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const accuracyDisplay = document.getElementById("accuracy");
const wpm = document.getElementById("wpm");
const restartBtn = document.getElementById("restart-btn");

const testInfo = document.querySelector(".test-info");
const typingTest = document.querySelector(".typing-test");
const actions = document.querySelector(".actions");

const resultsScreen = document.getElementById("test-results");
const wpmDisplay = document.getElementById("wpm");
const personalBestDisplay = document.getElementById("personal-best");

const resultWpm = document.getElementById("result-wpm");
const resultAccuracy = document.getElementById("result-accuracy");
const correctCharactersDisplay = document.getElementById("correct-characters");
const incorrectCharactersDisplay = document.getElementById(
  "incorrect-characters",
);

const resultsIcon = document.getElementById("results-icon");
const confettiContainer = document.getElementById("confetti-container");


const difficultySelect = document.getElementById("difficulty");

const resultsTitle = document.getElementById("results-title");
const resultsMessage = document.getElementById("results-message");
const resultButton = document.getElementById("result-btn");

const timeDisplay = document.getElementById("time");
let timerInterval = null;
let timeRemaining = 60;
let currentMode = "timed";
let timeElapsed = 0;

const modeButtons = document.querySelectorAll(".mode-btn");
const modeSelect = document.getElementById("mode");

let totalTypedCharacters = 0;
let correctTypedCharacters = 0;
let incorrectTypedCharacters = 0;
let previousInput = "";

let testStartedAt = null;
let testFinished = false;

let personalBest = Number(localStorage.getItem("typingTestBest") || 0);

personalBestDisplay.textContent = `${personalBest} WPM`;

let currentDifficulty = "hard";
let currentPassage = "";
let passageData = {};

// Render the passage as individual characters
function showPassage(text) {
  currentPassage = text;

  totalTypedCharacters = 0;
  correctTypedCharacters = 0;
  incorrectTypedCharacters = 0;
  previousInput = "";

  testStartedAt = null;
  testFinished = false;

  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timeRemaining = 60;
  timeElapsed = 0;

  updateTimeDisplay();

  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";

  accuracyDisplay.textContent = "100%";
  typingInput.value = "";
  typingInput.maxLength = text.length;
  passage.innerHTML = "";

  typingInput.value = "";
  typingInput.maxLength = text.length;
  passage.innerHTML = "";

  for (const character of currentPassage) {
    const span = document.createElement("span");
    span.textContent = character;
    passage.appendChild(span);
  }

  updateCharacterStyles();
}

function startTimer() {
  if (timerInterval !== null) return;

  timerInterval = setInterval(function () {
    if (currentMode === "timed") {
      timeRemaining--;
    } else {
      timeElapsed++;
    }

    updateTimeDisplay();

    if (currentMode === "timed" && timeRemaining <= 0) {
      timeRemaining = 0;
      updateTimeDisplay();

      clearInterval(timerInterval);
      timerInterval = null;

      finishTest();
    }
  }, 1000);
}

function updateTimeDisplay() {
  if (currentMode === "timed") {
    timeDisplay.textContent = `0:${String(timeRemaining).padStart(2, "0")}`;
  } else {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;

    timeDisplay.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
}

// Apply correct, incorrect, and current classes
function updateCharacterStyles() {
  const characters = passage.querySelectorAll("span");
  const typedText = typingInput.value;

  characters.forEach(function (character, index) {
    character.classList.remove("correct", "incorrect", "current");

    if (index < typedText.length) {
      if (typedText[index] === currentPassage[index]) {
        character.classList.add("correct");
      } else {
        character.classList.add("incorrect");
      }
    } else if (index === typedText.length) {
      character.classList.add("current");
    }
  });
}

function finishTest() {
  if (testFinished) return;

  testFinished = true;
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const elapsedSeconds = Math.max((Date.now() - testStartedAt) / 1000, 1);

  const wpm = Math.round((correctTypedCharacters / 5) * (60 / elapsedSeconds));

  const accuracy =
    totalTypedCharacters === 0
      ? 100
      : Math.round((correctTypedCharacters / totalTypedCharacters) * 100);

  // Update the result statistics
  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;

  resultWpm.textContent = wpm;
  resultAccuracy.textContent = `${accuracy}%`;

  correctCharactersDisplay.textContent = correctTypedCharacters;
  incorrectCharactersDisplay.textContent = incorrectTypedCharacters;

  // Decide which result message to show
  if (personalBest === 0) {
    resultsScreen.classList.remove("is-baseline", "is-new-best");
    resultsIcon.classList.remove("celebration");
    resultsScreen.classList.add("is-baseline");
resultsIcon.textContent = "✓";
    confettiContainer.innerHTML = "";
    resultsTitle.textContent = "Baseline Established!";
    resultsMessage.textContent =
      "You've set the bar. Now the real challenge begins—time to beat it.";

    personalBest = wpm;
    localStorage.setItem("typingTestBest", String(personalBest));

    resultButton.textContent = "Beat This Score ↻";
  } else if (wpm > personalBest) {
    resultsScreen.classList.add("is-new-best");
    resultsIcon.textContent = "🎉";
    resultsIcon.classList.add("celebration");

launchConfetti();
    resultsTitle.textContent = "High Score Smashed!";
    resultsMessage.textContent =
      "You've beaten your personal best. Keep pushing!";

    personalBest = wpm;
    localStorage.setItem("typingTestBest", String(personalBest));

    resultButton.textContent = "Beat This Score ↻";
  } else {
    resultsIcon.textContent = "✓";
    resultsTitle.textContent = "Test Complete!";
    resultsMessage.textContent =
      "Solid run. Keep pushing to beat your high score.";

    resultButton.textContent = "Go Again ↻";
  }

  personalBestDisplay.textContent = `${personalBest} WPM`;

  // Switch from the typing view to the results view
  testInfo.hidden = true;
  typingTest.hidden = true;
  actions.hidden = true;
  resultsScreen.hidden = false;
}

// Load a random passage for the selected difficulty
function loadRandomPassage() {
  const passages = passageData[currentDifficulty];

  if (!passages || passages.length === 0) return;

  const randomIndex = Math.floor(Math.random() * passages.length);

  showPassage(passages[randomIndex].text);
}

// Load data.json once
fetch("./data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Could not load data.json");
    }

    return response.json();
  })
  .then((data) => {
    passageData = data;
    loadRandomPassage();
  })
  .catch((error) => {
    console.error("Error loading passages:", error);
  });

// Switch difficulty and update the active button
difficultyButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentDifficulty = button.dataset.difficulty;

    difficultyButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    loadRandomPassage();
  });
});

function updateAccuracy() {
  const accuracy =
    totalTypedCharacters === 0
      ? 100
      : Math.round((correctTypedCharacters / totalTypedCharacters) * 100);

  accuracyDisplay.textContent = `${accuracy}%`;
}

function handleTypingInput() {
  if (testFinished) return;

  const typedText = typingInput.value;

  // Start the timer when the first character is typed
  if (typedText.length > 0 && testStartedAt === null) {
    testStartedAt = Date.now();
    startTimer();
  }

  // Count newly typed characters
  if (typedText.length > previousInput.length) {
    const newCharacters = typedText.slice(previousInput.length);

    for (let i = 0; i < newCharacters.length; i++) {
      const position = previousInput.length + i;

      totalTypedCharacters++;

      if (newCharacters[i] === currentPassage[position]) {
        correctTypedCharacters++;
      } else {
        incorrectTypedCharacters++;
      }
    }
  }

  // Update the previous input, including after backspacing
  previousInput = typedText;

  updateAccuracy();
  updateCharacterStyles();

  // Update live WPM
  if (testStartedAt !== null) {
    const elapsedSeconds = Math.max((Date.now() - testStartedAt) / 1000, 1);

    const currentWPM = Math.round(
      (correctTypedCharacters / 5) * (60 / elapsedSeconds),
    );

    wpmDisplay.textContent = currentWPM;
  }

  // Finish only after all passage characters have been typed
  if (currentPassage.length > 0 && typedText.length === currentPassage.length) {
    finishTest();
  }
}

// Start typing
function startTest() {
  startOverlay.style.display = "none";
  typingInput.focus();
}

function restartTest() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    resultsScreen.hidden = true;
    testInfo.hidden = false;
    typingTest.hidden = false;
    actions.hidden = false;

    resultsScreen.classList.remove("is-baseline", "is-new-best");
    resultsIcon.classList.remove("celebration");
    confettiContainer.innerHTML = "";

    loadRandomPassage();

    startOverlay.style.display = "none";
    typingInput.focus();
}



function setMode(mode) {
    currentMode = mode;

    modeButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.mode === mode
        );
    });

    modeSelect.value = mode;

    // Reset the current attempt when the mode changes
    if (currentPassage) {
        showPassage(currentPassage);
    }
}

modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        setMode(button.dataset.mode);
    });
});

modeSelect.addEventListener("change", function () {
    setMode(modeSelect.value);
});


startButton.addEventListener("click", startTest);
passage.addEventListener("click", startTest);
restartBtn.addEventListener("click", restartTest);
resultButton.addEventListener("click", restartTest);
resultButton.addEventListener("click", restartTest);
typingInput.addEventListener("input", handleTypingInput);






function setDifficulty(difficulty) {
    currentDifficulty = difficulty;

    difficultyButtons.forEach(function(button) {
        button.classList.toggle(
            "active",
            button.dataset.difficulty === difficulty
        );
    });

    difficultySelect.value = difficulty;

    loadRandomPassage();
}

difficultyButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        setDifficulty(button.dataset.difficulty);
    });
});

difficultySelect.addEventListener("change", function() {
    setDifficulty(difficultySelect.value);
});






function launchConfetti() {
    confettiContainer.innerHTML = "";

    const colors = [
        "#2F80ED",
        "#4ADE80",
        "#F7D65B",
        "#E65B70"
    ];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement("span");

        piece.classList.add("confetti-piece");

        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.setProperty(
            "--duration",
            `${3 + Math.random() * 3}s`
        );

        piece.style.setProperty(
            "--delay",
            `${Math.random() * 1.5}s`
        );

        piece.style.setProperty(
            "--drift",
            `${(Math.random() - 0.5) * 300}px`
        );

        confettiContainer.appendChild(piece);
    }
}