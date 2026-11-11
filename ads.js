(function () {
  // true = إعلانات تجريبية (آمنة). بدّلها لـ false بعد وضع معرفاتك الحقيقية من AdMob
  var TEST = true;
  var INTERSTITIAL_ID = TEST
    ? 'ca-app-pub-3940256099942544/1033173712'
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
  var EVERY = 10; // إعلان عند كل درس جديد (كل 10 مستويات)

  var cap = window.Capacitor;
  if (!cap || !cap.registerPlugin) return;
  if (cap.isNativePlatform && !cap.isNativePlatform()) return;

  var AdMob = cap.registerPlugin('AdMob');
  var ready = AdMob.initialize({ initializeForTesting: TEST }).catch(function () {});

  function seen() {
    try { return JSON.parse(localStorage.getItem('adsSeen') || '{}'); } catch (e) { return {}; }
  }
  function mark(k) {
    var s = seen();
    s[k] = 1;
    try { localStorage.setItem('adsSeen', JSON.stringify(s)); } catch (e) {}
  }
  function showAd() {
    ready
      .then(function () {
        return AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID, isTesting: TEST });
      })
      .then(function () { return AdMob.showInterstitial(); })
      .catch(function () {});
  }

  var originalPlay = window.play;
  if (typeof originalPlay !== 'function') return;

  window.play = function (s, i, skip) {
    originalPlay.apply(this, arguments);
    if (i > 0 && i % EVERY === 0 && navigator.onLine) {
      var key = s.k + ':' + i;
      if (!seen()[key]) {
        mark(key);
        setTimeout(showAd, 600);
      }
    }
  };
})();
