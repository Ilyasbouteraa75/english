(function () {
  var cap = window.Capacitor;
  if (!cap || !cap.registerPlugin) return;
  if (cap.isNativePlatform && !cap.isNativePlatform()) return;

  var TTS = cap.registerPlugin('TextToSpeech');

  function Utterance(text) {
    this.text = text;
    this.lang = 'en-US';
    this.rate = 1;
    this.voice = null;
  }

  var synth = {
    onvoiceschanged: null,
    getVoices: function () { return []; },
    cancel: function () { try { TTS.stop(); } catch (e) {} },
    speak: function (u) {
      TTS.speak({
        text: u.text,
        lang: u.lang || 'en-US',
        rate: u.rate || 1,
        pitch: 1,
        volume: 1
      }).catch(function () {});
    }
  };

  function define(name, value) {
    try {
      Object.defineProperty(window, name, { value: value, configurable: true, writable: true });
    } catch (e) {
      try { window[name] = value; } catch (e2) {}
    }
  }

  define('SpeechSynthesisUtterance', Utterance);
  define('speechSynthesis', synth);
})();
