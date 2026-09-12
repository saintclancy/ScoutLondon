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
  miami: { file: 'skyline', title: 'BISCAYNE BAY', description: 'Miami, Florida.', alt: 'Miami skyline and reflections on Biscayne Bay at night', source: 'https://unsplash.com/s/photos/brickell-miami' },
  ocean: { file: 'havana', title: 'LITTLE HAVANA', description: 'Ball & Chain, Calle Ocho. Miami, Florida.', alt: 'Ball and Chain in Little Havana at night', source: 'https://unsplash.com/s/photos/little-havana' }
};
const dialog = document.querySelector('#photo-dialog');
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.photo;
  const photo = photos[key];
  document.querySelector('#dialog-image').src = `./assets/${photo.file}.jpg`;
  document.querySelector('#dialog-image').alt = photo.alt;
  document.querySelector('#dialog-title').textContent = photo.title;
  document.querySelector('#dialog-description').textContent = photo.description;
  document.querySelector('#credit').href = photo.source;
  dialog.showModal();
}));
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });



