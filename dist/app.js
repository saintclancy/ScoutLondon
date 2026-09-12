const themeButton = document.querySelector('#theme');
function setTheme(night) {
  document.documentElement.dataset.theme = night ? 'night' : 'dusk';
  themeButton.setAttribute('aria-pressed', String(night));
  document.querySelector('#mood').textContent = night ? 'After dark' : 'Dusk';
  document.querySelector('#sky-label').textContent = night ? 'MIAMI / AFTER DARK' : 'MIAMI / DUSK';
  document.querySelector('meta[name="theme-color"]').content = night ? '#09251d' : '#d7eee8';

}
try { setTheme(localStorage.getItem('scout-mood') === 'night'); } catch {}
themeButton.addEventListener('click', () => {
  const night = document.documentElement.dataset.theme !== 'night';
  setTheme(night);
  try { localStorage.setItem('scout-mood', night ? 'night' : 'dusk'); } catch {}
});
const photos = {
  miami: { file: 'miami-sunrise-trim-v2', video: true, title: 'NORTH BISCAYNE SUNRISE', description: 'Miami, Florida.', alt: 'North Biscayne sunrise', credit: 'Clancy Saint Cooper' },
  ocean: { file: 'havana', title: 'LITTLE HAVANA', description: 'Ball & Chain, Calle Ocho. Miami, Florida.', alt: 'Ball and Chain in Little Havana at night', source: 'https://unsplash.com/s/photos/little-havana' }
};
const dialog = document.querySelector('#photo-dialog');
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.photo;
  const photo = photos[key];
  const detailImage = document.querySelector('#dialog-image');
  const detailVideo = document.querySelector('#dialog-video');
  detailVideo.pause();
  detailImage.hidden = !!photo.video;
  detailVideo.hidden = !photo.video;
  if (photo.video) {
    detailVideo.src = `./assets/${photo.file}.mp4`;
    detailVideo.muted = true;
  } else {
    detailImage.src = `./assets/${photo.file}.jpg`;
    detailImage.alt = photo.alt;
  }
  document.querySelector('#dialog-title').textContent = photo.title;
  document.querySelector('#dialog-description').textContent = photo.description;
  const credit = document.querySelector('#credit');
  credit.textContent = photo.credit ? `Video source: ${photo.credit}` : 'Photo source ↗';
  if (photo.source) credit.href = photo.source;
  else credit.removeAttribute('href');
  dialog.showModal();
  if (photo.video && !motionPreference.matches) detailVideo.play().catch(() => {});
}));
dialog.addEventListener('close', () => document.querySelector('#dialog-video').pause());
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const bannerVideo = document.querySelector('.banner-video');
const cardVideo = document.querySelector('.card-video');
cardVideo.muted = true;
const bannerMotion = document.createElement('button');
bannerMotion.className = 'banner-motion';
bannerMotion.type = 'button';
document.querySelector('.intro').append(bannerMotion);
bannerVideo.muted = true;
function updateBannerLabel() {
  bannerMotion.textContent = bannerVideo.paused ? 'Play videos' : 'Pause videos';
}
function syncBannerMotion() {
  if (motionPreference.matches) { bannerVideo.pause(); cardVideo.pause(); }
  else { bannerVideo.play().catch(updateBannerLabel); cardVideo.play().catch(() => {}); }
  updateBannerLabel();
}
bannerMotion.addEventListener('click', () => {
  if (bannerVideo.paused) { bannerVideo.play().catch(updateBannerLabel); cardVideo.play().catch(() => {}); }
  else { bannerVideo.pause(); cardVideo.pause(); }
});
bannerVideo.addEventListener('play', updateBannerLabel);
bannerVideo.addEventListener('pause', updateBannerLabel);
motionPreference.addEventListener('change', syncBannerMotion);
syncBannerMotion();
