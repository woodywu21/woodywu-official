'use strict';
(() => {
  const hero = document.getElementById('hero');
  const iframe = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-video-toggle');
  const status = document.getElementById('hero-video-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let player;
  let ready = false;
  let started = false;
  let inView = true;
  let wantsPlayback = !reducedMotion.matches;
  let watchdog;

  function label(playing) {
    toggle.setAttribute('aria-label', playing ? '暫停背景影片' : '播放背景影片');
    toggle.innerHTML = playing
      ? '<i class="fa-solid fa-pause" aria-hidden="true"></i><span>暫停背景</span>'
      : '<i class="fa-solid fa-play" aria-hidden="true"></i><span>播放背景</span>';
  }
  function fallback() {
    clearTimeout(watchdog);
    hero.classList.remove('is-video-playing');
    status.textContent = '產品影片預覽';
    toggle.hidden = true;
  }
  function syncPlayback() {
    if (!ready) return;
    if (wantsPlayback && inView && !document.hidden) {
      player.mute();
      player.playVideo();
    } else player.pauseVideo();
  }
  function createPlayer() {
    if (player) return;
    player = new YT.Player('hero-video', {
      events: {
        onReady(event) {
          ready = true;
          clearTimeout(watchdog);
          event.target.mute();
          event.target.setLoop(true);
          toggle.hidden = false;
          label(false);
          syncPlayback();
        },
        onStateChange(event) {
          if (event.data === YT.PlayerState.PLAYING) {
            hero.classList.add('is-video-playing');
            status.textContent = '靜音循環播放';
            label(true);
          } else if (event.data === YT.PlayerState.PAUSED) {
            status.textContent = '背景影片已暫停';
            label(false);
          } else if (event.data === YT.PlayerState.ENDED && wantsPlayback) {
            // Also restart manually for players that do not honor single-video loops.
            event.target.seekTo(0, true);
            syncPlayback();
          }
        },
        onAutoplayBlocked() {
          wantsPlayback = false;
          status.textContent = '點擊播放背景';
          toggle.hidden = false;
          label(false);
        },
        onError: fallback
      }
    });
  }
  function start() {
    if (started) { syncPlayback(); return; }
    started = true;
    const url = new URL(`https://www.youtube-nocookie.com/embed/${iframe.dataset.videoId}`);
    const params = {
      autoplay: wantsPlayback ? '1' : '0', mute: '1', controls: '0',
      loop: '1', playlist: iframe.dataset.videoId, playsinline: '1',
      enablejsapi: '1', rel: '0', disablekb: '1', fs: '0', iv_load_policy: '3'
    };
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    if (/^https?:$/.test(location.protocol)) url.searchParams.set('origin', location.origin);
    iframe.src = url.href;
    watchdog = setTimeout(() => {
      if (!ready) fallback();
    }, 20000);
    if (window.YT && typeof window.YT.Player === 'function') createPlayer();
    else {
      window.onYouTubeIframeAPIReady = createPlayer;
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = fallback;
      document.head.appendChild(script);
    }
  }
  toggle.addEventListener('click', () => {
    wantsPlayback = !wantsPlayback;
    if (!started) start();
    else syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0 }).observe(hero);
  }
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { wantsPlayback = false; syncPlayback(); }
  });
  if (reducedMotion.matches) {
    status.textContent = '產品影片預覽';
    toggle.hidden = false;
    label(false);
  } else start();
})();
