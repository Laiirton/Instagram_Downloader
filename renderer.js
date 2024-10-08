const urlInput = document.getElementById('url-input');
const selectDirectoryButton = document.getElementById('select-directory');
const downloadButton = document.getElementById('download-button');
const statusElement = document.getElementById('status');
const closeButton = document.getElementById('close-app');
const formatRadios = document.getElementsByName('format');
const progressBar = document.getElementById('progress-bar');

let savePath = '';

selectDirectoryButton.addEventListener('click', async () => {
  try {
    savePath = await window.electronAPI.selectDirectory();
    if (savePath) {
      statusElement.textContent = `Diretório selecionado: ${savePath.split('\\').pop()}`;
      selectDirectoryButton.textContent = 'Mudar diretório';
    }
  } catch (error) {
    console.error('Erro ao selecionar diretório:', error);
    statusElement.textContent = 'Erro ao selecionar diretório.';
  }
});

downloadButton.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url || !savePath) {
    statusElement.textContent = 'Por favor, insira uma URL e selecione um diretório de salvamento.';
    return;
  }

  const format = Array.from(formatRadios).find(radio => radio.checked).value;

  statusElement.textContent = 'Iniciando download...';
  downloadButton.disabled = true;
  progressBar.style.width = '0%';
  try {
    const result = await window.electronAPI.downloadVideo(url, savePath, format);
    statusElement.textContent = result;
    statusElement.style.color = 'var(--primary-color)';
  } catch (error) {
    statusElement.textContent = `Erro: ${error}`;
    statusElement.style.color = 'var(--secondary-color)';
  } finally {
    downloadButton.disabled = false;
    urlInput.value = '';
  }
});

urlInput.addEventListener('input', () => {
  const url = urlInput.value.trim();
  const isValidUrl = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels)\/[\w-]+\/?(\?.*)?$/.test(url);
  downloadButton.disabled = !isValidUrl;
});

window.electronAPI.onDownloadProgress((progress) => {
  progressBar.style.width = `${progress}%`;
});

document.getElementById('github-link').addEventListener('click', (event) => {
  event.preventDefault();
  window.electronAPI.openExternalLink('https://github.com/Laiirton');
});

document.getElementById('botao-fechar').addEventListener('click', () => {
  window.electronAPI.closeApp();
});

function addDragHandler(element) {
  let isDragging = false;
  let startX, startY;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      window.electronAPI.moveWindow(deltaX, deltaY);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addDragHandler(document.querySelector('.container'));
});