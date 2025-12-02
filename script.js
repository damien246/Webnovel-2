// Fonctions utilitaires pour gérer le stockage des messages par roman
function getMessages(novelId) {
  const key = `messages_${novelId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

function saveMessages(novelId, messages) {
  const key = `messages_${novelId}`;
  localStorage.setItem(key, JSON.stringify(messages));
}

// Afficher la liste des romans sur la page d'accueil
function renderNovelList() {
  const listElem = document.getElementById('novel-list');
  if (!listElem) return;
  novels.forEach(novel => {
    const li = document.createElement('li');
    li.className = 'novel-item';
    const link = document.createElement('a');
    link.href = `novel.html?id=${encodeURIComponent(novel.id)}`;
    link.textContent = `${novel.title} – par ${novel.author}`;
    li.appendChild(link);
    listElem.appendChild(li);
  });
}

// Afficher la grille des romans sur la page d'accueil
function renderNovelGrid() {
  const gridElem = document.getElementById('novel-grid');
  if (!gridElem) return;
  novels.forEach(novel => {
    const card = document.createElement('div');
    card.className = 'novel-card';
    // Image de couverture aléatoire pour chaque roman à partir de Unsplash
    const img = document.createElement('img');
    // Utiliser un paramètre "sig" pour obtenir une image différente pour chaque ID
    img.src = `https://source.unsplash.com/random/400x300?book,novel&sig=${novel.id}`;
    img.alt = novel.title;
    card.appendChild(img);
    // Corps de la carte
    const body = document.createElement('div');
    body.className = 'card-body';
    const titleElem = document.createElement('h3');
    titleElem.textContent = novel.title;
    body.appendChild(titleElem);
    const authorElem = document.createElement('p');
    authorElem.className = 'author';
    authorElem.textContent = `par ${novel.author}`;
    body.appendChild(authorElem);
    card.appendChild(body);
    // Lien pour consulter le roman
    const link = document.createElement('a');
    link.href = `novel.html?id=${encodeURIComponent(novel.id)}`;
    link.className = 'view-link';
    link.textContent = 'Lire';
    card.appendChild(link);
    gridElem.appendChild(card);
  });
}

// Charger les détails du roman en fonction de l'ID passé dans l'URL
function loadNovelDetail() {
  const params = new URLSearchParams(window.location.search);
  const novelId = params.get('id');
  if (!novelId) return;
  const novel = novels.find(n => n.id === novelId);
  if (!novel) return;
  document.getElementById('novel-title').textContent = novel.title;
  document.getElementById('novel-author').textContent = `par ${novel.author}`;
  document.getElementById('novel-description').textContent = novel.description;
  const chapterList = document.getElementById('chapter-list');
  novel.chapters.forEach(ch => {
    const li = document.createElement('li');
    li.textContent = ch;
    chapterList.appendChild(li);
  });
  // Discussion
  const messages = getMessages(novelId);
  const messageList = document.getElementById('message-list');
  function displayMessages() {
    messageList.innerHTML = '';
    messages.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'message';
      div.textContent = msg;
      messageList.appendChild(div);
    });
  }
  displayMessages();
  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message-text');
  sendButton.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
      messages.push(text);
      saveMessages(novelId, messages);
      displayMessages();
      messageInput.value = '';
    }
  });
}

// À l'initialisation de chaque page, exécuter les fonctions appropriées
document.addEventListener('DOMContentLoaded', () => {
  renderNovelList();
  renderNovelGrid();
  loadNovelDetail();
});