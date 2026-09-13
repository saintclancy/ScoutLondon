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
  ocean: { file: 'scout-hot-tub', title: 'ROOFTOP STAYCATION', description: 'Charlotte / 01 — Shore House with Clancy', alt: 'Scout in a rooftop hot tub', credit: 'Clancy Saint Cooper' }
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
  credit.textContent = photo.credit ? `${photo.video ? 'Video' : 'Photo'} source: ${photo.credit}` : 'Photo source ↗';
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
  const paused = bannerVideo.paused;
  bannerMotion.setAttribute('aria-label', paused ? 'Play videos' : 'Pause videos');
  bannerMotion.title = paused ? 'Play videos' : 'Pause videos';
  bannerMotion.innerHTML = paused
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
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

const notesKey = 'scout-notes-v1';
const defaultNote = {
  id: 'welcome-note',
  title: 'Welcome to Scout Notes',
  body: '# Welcome to Markdown\n\nMarkdown lets you format notes with a few symbols. Put the command at the start of a line, then add a space.\n\n## Quick commands\n\n- `# Heading` creates a large heading.\n- `**bold**` makes text bold.\n- `*italic*` makes text italic.\n- `` `code` `` highlights a short command or phrase.\n- `> quote` creates a quote.\n- `- item` creates a bullet list.\n- `1. item` creates a numbered list.\n- `[link text](https://example.com)` creates a clickable link.\n- `![alt text](https://example.com/image.jpg)` adds an image.\n- `[watch video](https://example.com/video)` links to a video.\n\n## Example\n\n**Important** and *emphasis* can live together in one note.',
  updatedAt: Date.now()
};
const legacyWelcomeBody = '# Welcome\n\nThis is your private note space.\n\n- ideas\n- plans\n- memories\n\n> Keep it local, calm, and useful.';
const previousGuideBody = '# Welcome to Markdown\n\nMarkdown lets you format notes with a few symbols. Put the command at the start of a line, then add a space.\n\n## Quick commands\n\n- `# Heading` creates a large heading.\n- `**bold**` makes text bold.\n- `*italic*` makes text italic.\n- `` `code` `` highlights a short command or phrase.\n- `> quote` creates a quote.\n- `- item` creates a bullet list.\n- `1. item` creates a numbered list.\n\n## Example\n\n**Important** and *emphasis* can live together in one note.';

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function inlineFormat(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderMarkdown(markdown) {
  const source = (markdown || '').replace(/\r\n/g, '\n');
  const blocks = source.split(/\n\s*\n/).filter(Boolean);
  if (!blocks.length) return '<p>Write something beautiful.</p>';

  return blocks.map(block => {
    if (/^#\s+/.test(block)) return `<h1>${inlineFormat(block.replace(/^#\s+/, ''))}</h1>`;
    if (/^##\s+/.test(block)) return `<h2>${inlineFormat(block.replace(/^##\s+/, ''))}</h2>`;
    if (/^###\s+/.test(block)) return `<h3>${inlineFormat(block.replace(/^###\s+/, ''))}</h3>`;
    if (/^>\s+/.test(block)) return `<blockquote>${inlineFormat(block.replace(/^>\s+/, ''))}</blockquote>`;

    const lines = block.split('\n');
    if (lines.every(line => /^[-*]\s+/.test(line))) {
      const items = lines.map(line => `<li>${inlineFormat(line.replace(/^[-*]\s+/, ''))}</li>`).join('');
      return `<ul>${items}</ul>`;
    }

    if (lines.every(line => /^\d+\.\s+/.test(line))) {
      const items = lines.map(line => `<li>${inlineFormat(line.replace(/^\d+\.\s+/, ''))}</li>`).join('');
      return `<ol>${items}</ol>`;
    }

    const paragraphs = block
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `<p>${inlineFormat(line)}</p>`)
      .join('');

    return paragraphs;
  }).join('');
}

function createNote(title = 'Untitled note', body = '') {
  return {
    id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    body,
    updatedAt: Date.now()
  };
}

function loadNotes() {
  try {
    const saved = localStorage.getItem(notesKey);
    if (!saved) return [defaultNote];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.length) return [defaultNote];
    return parsed.map((note) => note.id === defaultNote.id && [legacyWelcomeBody, previousGuideBody].includes(note.body) ? defaultNote : note);
  } catch {
    return [defaultNote];
  }
}

function saveNotes(notes) {
  try { localStorage.setItem(notesKey, JSON.stringify(notes)); } catch {}
}

function ensureExistingNotes() {
  if (!notes.length) {
    notes = [createNote('Untitled note', '')];
  }
  if (!selectedNoteId || !notes.some(note => note.id === selectedNoteId)) {
    selectedNoteId = notes[0].id;
  }
}

let notes = loadNotes();
let selectedNoteId = notes[0]?.id || null;

function getSelectedNote() {
  return notes.find(note => note.id === selectedNoteId) || notes[0] || null;
}

function renderNoteList() {
  const list = document.querySelector('#note-list');
  const searchValue = document.querySelector('#note-search')?.value.trim().toLowerCase() || '';
  if (!list) return;

  const visibleNotes = notes.filter((note) => {
    if (!searchValue) return true;
    return (note.title || '').toLowerCase().includes(searchValue) || (note.body || '').toLowerCase().includes(searchValue);
  });

  if (!visibleNotes.length) {
    list.innerHTML = '<li class="empty-state">No matching notes</li>';
    return;
  }

  list.innerHTML = visibleNotes.map((note) => `
    <li>
      <button type="button" data-note-id="${note.id}" class="note-item-button ${note.id === selectedNoteId ? 'active' : ''}">
        <span class="note-item-title">${escapeHtml(note.title || 'Untitled note')}</span>
        <small>${new Date(note.updatedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small>
      </button>
    </li>
  `).join('');

  list.querySelectorAll('[data-note-id]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedNoteId = button.dataset.noteId;
      renderNoteList();
      syncEditorFromSelection();
    });
  });
}

function renderNotePreview() {
  const preview = document.querySelector('#note-preview');
  const content = preview?.querySelector('.preview-content');
  const note = getSelectedNote();
  if (!content || !note) return;
  content.innerHTML = renderMarkdown(note.body || '');
}

function syncEditorFromSelection() {
  const titleInput = document.querySelector('#note-title');
  const textarea = document.querySelector('#note-body');
  const note = getSelectedNote();
  if (!titleInput || !textarea || !note) return;

  titleInput.value = note.title || '';
  textarea.value = note.body || '';
  renderNotePreview();
}

function persistActiveNote() {
  const titleInput = document.querySelector('#note-title');
  const textarea = document.querySelector('#note-body');
  const note = getSelectedNote();
  if (!note || !titleInput || !textarea) return;

  note.title = titleInput.value.trim() || 'Untitled note';
  note.body = textarea.value;
  note.updatedAt = Date.now();
  saveNotes(notes);
  renderNoteList();
  renderNotePreview();
}

function persistPreviewEdit(previewContent) {
  const textarea = document.querySelector('#note-body');
  const note = getSelectedNote();
  if (!textarea || !note) return;

  const body = previewContent.innerText.replace(/\u00a0/g, ' ');
  textarea.value = body;
  note.body = body;
  note.updatedAt = Date.now();
  saveNotes(notes);
  renderNoteList();
}

function handleNewNote() {
  const note = createNote('New note', '# New note\n\nStart writing here.');
  notes.unshift(note);
  selectedNoteId = note.id;
  saveNotes(notes);
  renderNoteList();
  syncEditorFromSelection();
}

function handleDeleteNote() {
  const note = getSelectedNote();
  if (!note) return;
  const shouldDelete = window.confirm(`Delete “${note.title || 'Untitled note'}”?`);
  if (!shouldDelete) return;

  notes = notes.filter((item) => item.id !== note.id);
  if (!notes.length) {
    notes = [createNote('Untitled note', '')];
  }
  selectedNoteId = notes[0].id;
  saveNotes(notes);
  renderNoteList();
  syncEditorFromSelection();
}

function initNotes() {
  const newButton = document.querySelector('#new-note');
  const deleteButton = document.querySelector('#delete-note');
  const searchInput = document.querySelector('#note-search');
  const titleInput = document.querySelector('#note-title');
  const textarea = document.querySelector('#note-body');

  if (!newButton || !deleteButton || !searchInput || !titleInput || !textarea) return;

  ensureExistingNotes();
  renderNoteList();
  syncEditorFromSelection();

  newButton.addEventListener('click', handleNewNote);
  deleteButton.addEventListener('click', handleDeleteNote);
  searchInput.addEventListener('input', renderNoteList);
  titleInput.addEventListener('input', persistActiveNote);
  textarea.addEventListener('input', persistActiveNote);
  document.querySelector('#note-preview')?.addEventListener('input', (event) => {
    const previewContent = event.target.closest('.preview-content');
    if (previewContent) persistPreviewEdit(previewContent);
  });
}

initNotes();
