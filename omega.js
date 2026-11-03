'use strict';
// Presentation only: observe the existing status without changing speech or API handlers.
(() => {
  const scene = document.querySelector('.hero');
  const statusNode = document.getElementById('status');
  const caption = document.getElementById('signal-caption');
  const update = () => {
    const listening = statusNode.textContent === 'Höre zu …';
    scene.classList.toggle('visual-active', listening);
    caption.textContent = listening ? 'SPRACHEINGABE AKTIV · symbolische Visualisierung, kein Audiopegel' : 'SPRACHKANAL · Bereitschaft / kein Audiopegel';
  };
  new MutationObserver(update).observe(statusNode, {childList:true,subtree:true,characterData:true});
  update();
  document.getElementById('motion').addEventListener('click', event => {
    const paused = document.body.classList.toggle('paused');
    event.currentTarget.setAttribute('aria-pressed', String(paused));
    event.currentTarget.textContent = paused ? 'Animationen fortsetzen' : 'Animationen pausieren';
  });
})();
