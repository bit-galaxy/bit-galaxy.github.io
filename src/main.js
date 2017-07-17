import './lib/css/normalize.css';
import './lib/css/skeleton.css';
import './css/custom.css';
import darkTheme from './css/dark.inline.css';
import lightTheme from './css/light.inline.css';

// ------------------------------------------------------------

const dark = `<style>${darkTheme.toString()}</style>`;
const light = `<style>${lightTheme.toString()}</style>`;

// ------------------------------------------------------------

const modeButton = document.getElementById('mode-button');
const styleDiv = document.getElementById('style');
const bitTest = document.getElementById('galaxy-test');
const iframe = document.getElementById('galaxy-iframe');

// ------------------------------------------------------------
// ------------------------------------------------------------

const setInitialMode = () => {
  const mode = localStorage.getItem('mode');

  if (mode === 'dark') {
    modeButton.value = 'Light Mode';
    styleDiv.innerHTML = dark;
  } else {
    styleDiv.innerHTML = light;
  }
};

// ------------------------------------------------------------

const handleModeChange = () => {
  modeButton.addEventListener('click', (e) => {
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
      e.target.value = 'Dark Mode';
      localStorage.setItem('mode', 'light');
      styleDiv.innerHTML = light;
    } else {
      e.target.value = 'Light Mode';
      localStorage.setItem('mode', 'dark');
      styleDiv.innerHTML = dark;
    }
  });
};

// ------------------------------------------------------------

const handleResize = () => {
  iframe.style.height = `${iframe.offsetWidth}px`;

  window.addEventListener('resize', () => {
    iframe.style.height = `${iframe.offsetWidth}px`;
  });
};

// ------------------------------------------------------------

const messages = [];
let messagesPos = 0;

const removeOversizeBits = (message) => {
  const split = message.split(/([^\s])(\d+)(?=\s|$)/ig);
  const mapped = split.map((val) => {
    if (!isNaN(+val) && +val > 10000) return '10000';
    return val;
  });
  return mapped.join('');
};

const pushMessage = (message) => {
  if (messages.length <= 10) {
    messages.pop();
    messages.push(message);
    messages.push('');
    messagesPos++;
  } else {
    messages.shift();
    messages.pop();
    messages.push(message);
    messages.push('');
  }
};

const handleBitInput = () => {
  bitTest.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && e.target.value !== '') { // enter
      e.target.style.background = '';
      iframe.contentWindow.postMessage(removeOversizeBits(e.target.value), '*');
      pushMessage(e.target.value);
      messagesPos = messages.length - 1;
      e.target.value = '';
    } else if (e.keyCode === 38 && messages.length > 0) { // up
      if (messagesPos === messages.length - 1) {
        messages[messages.length - 1] = e.target.value;
      }
      if (messagesPos > 0) {
        messagesPos--;
        e.target.value = messages[messagesPos];
      }
      e.target.style.background = 'rgba(0,0,0,0.25)';
    } else if (e.keyCode === 40 && messagesPos < messages.length - 1) { // down
      messagesPos++;
      e.target.value = messages[messagesPos];
      if (messagesPos === messages.length - 1) {
        e.target.style.background = '';
      }
    } else {
      e.target.style.background = '';
      messagesPos = messages.length - 1;
    }
  });
};

// ------------------------------------------------------------

const controller = () => {
  setInitialMode();
  handleModeChange();
  handleResize();
  handleBitInput();
};

// ------------------------------------------------------------
// ------------------------------------------------------------

controller();
