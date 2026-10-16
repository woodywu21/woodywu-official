'use strict';

// Navigation stays usable without animations; the mobile button exposes its state.
const menuButton = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
function closeMenu(returnFocus = false) {
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '開啟導覽選單');
  menuButton.firstElementChild.className = 'fa-solid fa-bars';
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  mobileMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
  menuButton.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!mobileMenu.hidden && !document.getElementById('navbar').contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

// The full photo remains a regular link when dialogs are unsupported or JS is off.
const viewer = document.getElementById('portfolio-viewer');
const fullImage = document.getElementById('portfolio-full-image');
let previousOverflow = '';
document.querySelectorAll('.portfolio-photo').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    fullImage.src = link.href;
    fullImage.alt = link.dataset.caption;
    document.getElementById('portfolio-caption').textContent = link.dataset.caption;
    previousOverflow = document.body.style.overflow;
    viewer.showModal();
    document.body.style.overflow = 'hidden';
  });
});
document.getElementById('portfolio-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const box = viewer.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close();
});
viewer.addEventListener('close', () => {
  document.body.style.overflow = previousOverflow;
  fullImage.removeAttribute('src');
});

if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  navLinks.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
}

// Local photo customization retains the previous browser storage key.
const photo = document.getElementById('profile-img');
const photoStatus = document.getElementById('photo-status');
const photoKey = 'woody_profile_photo_saved';
const primaryPhoto = photo.getAttribute('src');
const fallbackPhotos = [
  'https://lh3.googleusercontent.com/d/1mnprnCNe83R4A2tLp8SHKXCv746noC8P=w1000',
  'https://drive.google.com/uc?export=view&id=1mnprnCNe83R4A2tLp8SHKXCv746noC8P',
  'assets/profile-placeholder.svg'
];
let fallbackIndex = 0;
photo.addEventListener('error', () => {
  if (fallbackIndex < fallbackPhotos.length) photo.src = fallbackPhotos[fallbackIndex++];
});
function validPhotoUrl(value) {
  return /^https:\/\//i.test(value) || /^data:image\/(png|jpeg|webp|gif|avif|bmp);base64,/i.test(value);
}
function loadSavedPhoto() {
  let saved = '';
  for (const storageName of ['localStorage', 'sessionStorage']) {
    try { saved = window[storageName].getItem(photoKey) || ''; } catch { /* Storage can be unavailable on local files. */ }
    if (saved) break;
  }
  if (validPhotoUrl(saved)) photo.src = saved;
}
function savePhoto(source) {
  fallbackIndex = 0;
  photo.src = source;
  let saved = false;
  for (const storageName of ['localStorage', 'sessionStorage']) {
    try { window[storageName].setItem(photoKey, source); saved = true; break; } catch { /* Try the session fallback. */ }
  }
  photoStatus.textContent = saved ? '已套用，設定保存在目前瀏覽器。' : '已顯示照片；瀏覽器無法儲存此設定。';
}
document.getElementById('photo-file-input').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    photoStatus.textContent = '請選擇 JPG、PNG 或 WebP 等點陣圖片。'; return;
  }
  if (file.size > 5 * 1024 * 1024) { photoStatus.textContent = '請選擇 5 MB 以內的照片。'; return; }
  const reader = new FileReader();
  reader.onload = () => savePhoto(String(reader.result));
  reader.onerror = () => { photoStatus.textContent = '照片讀取失敗，請重新選擇。'; };
  reader.readAsDataURL(file);
});
document.getElementById('photo-url-save').addEventListener('click', () => {
  const value = document.getElementById('custom-photo-url-input').value.trim();
  if (!/^https:\/\//i.test(value)) { photoStatus.textContent = '請輸入完整的 HTTPS 圖片網址。'; return; }
  try { new URL(value); savePhoto(value); } catch { photoStatus.textContent = '圖片網址格式有誤，請重新確認。'; }
});
document.getElementById('btn-reset-photo').addEventListener('click', () => {
  for (const storageName of ['localStorage', 'sessionStorage']) {
    try { window[storageName].removeItem(photoKey); } catch { /* Reset still works without storage. */ }
  }
  fallbackIndex = 0;
  photo.src = primaryPhoto;
  document.getElementById('custom-photo-url-input').value = '';
  document.getElementById('photo-file-input').value = '';
  photoStatus.textContent = '已還原預設照片。';
});
loadSavedPhoto();
if (photo.complete && photo.naturalWidth === 0) photo.dispatchEvent(new Event('error'));
