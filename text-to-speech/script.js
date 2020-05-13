// the API
const synth = window.speechSynthesis;

// The DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name}  (${voice.lang})`;

    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = getVoices;
}

// Speak Function
const speak = () => {
  if (synth.speaking) {
    console.error('Already speaking ...');
    return;
  }
  if (textInput.value !== '') {
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // when end speaking + when an error
    speakText.onend = (e) => {
      console.log('Done Speaking');
    };
    speakText.onerror = () => {
      console.error('Something went wrong');
    };
    // Get the selected Voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );
    // Looop trough the voices
    voices.forEach((voice) => {
      if (voice.name == selectedVoice) {
        speakText.voice = voice;
      }
    });
    // Pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Finally speak
    synth.speak(speakText);
  }
};

// Event Listeners

// 1 for text form submit
textForm.addEventListener('submit', (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// 2 for clicking Enter key
textInput.addEventListener('keyup', (e) => {
  if (e.keyCode == 13) {
    speak();
    textInput.blur();
  }
});

// 3 for rate value change
rate.addEventListener('change', (e) => {
  rateValue.textContent = rate.value;
});

// 4 for pitch value change
pitch.addEventListener('change', (e) => {
  pitchValue.textContent = pitch.value;
});

// for selecting other voice
// ( exp : on selecting other voices it speak without hitting Speak button again )
voiceSelect.addEventListener('change', (e) => speak());
