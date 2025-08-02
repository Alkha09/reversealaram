let alarmTimeout;
let riddleInterval;
let currentAnswer = "";
let alarmVolume = 0.5;

const riddles = [
  { q: "I speak without a mouth and hear without ears. What am I?", a: "echo" },
  { q: "What has keys but can’t open locks?", a: "piano" },
  { q: "What runs but never walks?", a: "water" },
  { q: "I have hands but no arms. What am I?", a: "clock" },
  { q: "The more you take, the more you leave behind. What are they?", a: "footsteps" }
];

const roasts = [
  "Are you even trying?",
  "That answer was almost as sleepy as you.",
  "I've seen snails solve riddles faster.",
  "Wake up your brain!",
  "Not even close."
];

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function setAlarms() {
  const status = document.getElementById("status");
  const sleep = document.getElementById("sleepTime").value;
  const wake = document.getElementById("wakeTime").value;

  if (!sleep || !wake) {
    alert("Please set both sleep and wake time.");
    return;
  }

  clearTimeout(alarmTimeout);
  clearInterval(riddleInterval);

  status.textContent = "Alarm set. Sweet nightmares!";
  speak("Alarm set");

  alarmTimeout = setTimeout(triggerAlarm, 2 * 60 * 1000); // 2 minutes
}

function triggerAlarm() {
  const alarmBox = document.getElementById("alarm");
  const bell = document.getElementById("bell");

  alarmBox.classList.remove("hidden");
  bell.volume = alarmVolume;
  bell.play();
  speak("Wake up! Solve the riddle to stop the alarm.");
  showNewRiddle();

  
  riddleInterval = setInterval(showNewRiddle, 10000);
}

function showNewRiddle() {
  const riddle = riddles[Math.floor(Math.random() * riddles.length)];
  document.getElementById("puzzle").textContent = riddle.q;
  currentAnswer = riddle.a.toLowerCase();
}

function checkPuzzle() {
  const userInput = document.getElementById("answer").value.trim().toLowerCase();
  const bell = document.getElementById("bell");

  if (userInput === currentAnswer) {
    clearInterval(riddleInterval);
    bell.pause();
    document.getElementById("alarm").classList.add("hidden");
    speak("Correct. Face scan initiated.");
    startWebcamScan();
  } else {
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    speak(roast);
    bell.volume = Math.min(1, bell.volume + 0.1);
  }
}

function startWebcamScan() {
  const webcam = document.getElementById("webcam");
  const loading = document.getElementById("loading");

  webcam.classList.remove("hidden");
  loading.classList.remove("hidden");

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      webcam.srcObject = stream;
      setTimeout(() => {
        stopWebcamScan(stream);
      }, 5000); 
    })
    .catch((err) => {
      console.error("Webcam error:", err);
      loading.textContent = "Webcam not available. Scan skipped.";
    });
}

function stopWebcamScan(stream) {
  const webcam = document.getElementById("webcam");
  const loading = document.getElementById("loading");

  stream.getTracks().forEach(track => track.stop());
  webcam.classList.add("hidden");
  loading.textContent = "Scan complete. You may now go back to sleep.";
  speak("Scan complete. Alarm deactivated.");
}
