
(function () {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;

  var swUrl = new URL('sw.js', document.currentScript.src).href;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl).catch(function (err) {
      console.warn('Falha ao registrar o Service Worker:', err);
    });
  });
})();
