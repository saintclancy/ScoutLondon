const themeButton = document.querySelector('#theme');
function setTheme(night) {
  document.documentElement.dataset.theme = night ? 'night' : 'dusk';
  themeButton.setAttribute('aria-pressed', String(night));
  document.querySelector('#mood').textContent = night ? 'After dark' : 'Dusk';
  document.querySelector('#sky-label').textContent = night ? 'SOUTH FLORIDA, AFTER THE LIGHTS COME ON' : 'SOUTH FLORIDA, SOMEWHERE AT DUSK';
  document.querySelector('meta[name="theme-color"]').content = night ? '#0b172a' : '#143f4b';
}
try { setTheme(localStorage.getItem('scout-mood') === 'night'); } catch {}
themeButton.addEventListener('click', () => {
  const night = document.documentElement.dataset.theme !== 'night';
  setTheme(night);
  try { localStorage.setItem('scout-mood', night ? 'night' : 'dusk'); } catch {}
});
const photos = {
  miami: { title: 'Meet me on Ocean Drive.', description: 'Pastel walls, palm shadows, and nowhere in particular to be. A postcard for the kind of afternoon that turns into a very good evening.', alt: 'Pastel Art Deco architecture and palms in Miami', source: 'https://www.expedia.com/Miami.dx178286.Where-To-Stay' },
  ocean: { title: 'Stay until the sky turns pink.', description: 'One more minute by the water. Then one more after that. Some things are worth taking the long way home for.', alt: 'The ocean beneath a colorful sunset sky', source: 'https://unsplash.com/photos/a-beach-that-has-some-waves-in-it-pZ5hrxUSJrc' }
};
const dialog = document.querySelector('#photo-dialog');
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.photo;
  const photo = photos[key];
  document.querySelector('#dialog-image').src = `./assets/${key}.jpg`;
  document.querySelector('#dialog-image').alt = photo.alt;
  document.querySelector('#dialog-title').textContent = photo.title;
  document.querySelector('#dialog-description').textContent = photo.description;
  document.querySelector('#credit').href = photo.source;
  dialog.showModal();
}));
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
