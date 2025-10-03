const textInput = document.getElementById('textInput');
const submitBtn = document.getElementById('submitBtn');
const textDisplay = document.getElementById('textDisplay');

let letters = [];
let selectedLetters = new Set();
let draggedLetter = null;
let draggedGroup = [];
let offsetX = 0;
let offsetY = 0;
let isSelecting = false;
let selectionStart = { x: 0, y: 0 };
let selectionBox = null;
let dragStartPosition = null;

submitBtn.addEventListener('click', renderText);
textInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') renderText();
});

function renderText() {
  const text = textInput.value.trim();
  if (!text) return;

  textDisplay.innerHTML = '';
  letters = [];
  selectedLetters.clear();

  let x = 20;
  let y = 20;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const letterEl = document.createElement('div');
    letterEl.className = 'letter';
    letterEl.textContent = char;
    letterEl.style.left = x + 'px';
    letterEl.style.top = y + 'px';
    letterEl.dataset.index = i;

    textDisplay.appendChild(letterEl);
    letters.push(letterEl);

    x += 40;
    if (x > textDisplay.clientWidth - 60) {
      x = 20;
      y += 50;
    }
  }

  attachEventListeners();
}

function attachEventListeners() {
  letters.forEach(letter => {
    letter.addEventListener('mousedown', onLetterMouseDown);
    letter.addEventListener('click', onLetterClick);
  });

  textDisplay.addEventListener('mousedown', onDisplayMouseDown);
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
}

function onLetterClick(e) {
  if (e.ctrlKey) {
    e.stopPropagation();
    const letter = e.target;

    if (selectedLetters.has(letter)) {
      selectedLetters.delete(letter);
      letter.classList.remove('selected');
    } else {
      selectedLetters.add(letter);
      letter.classList.add('selected');
    }
  }
}

function onLetterMouseDown(e) {
  if (e.ctrlKey) return;

  e.preventDefault();
  const letter = e.target;

  if (selectedLetters.has(letter)) {
    draggedGroup = Array.from(selectedLetters);
    draggedLetter = letter;

    const rect = letter.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    draggedGroup.forEach(l => l.classList.add('dragging'));
  } else {
    selectedLetters.clear();
    letters.forEach(l => l.classList.remove('selected'));

    draggedLetter = letter;
    draggedGroup = [letter];

    dragStartPosition = {
      left: letter.style.left,
      top: letter.style.top,
    };

    const rect = letter.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    letter.classList.add('dragging');
  }
}

function onDisplayMouseDown(e) {
  if (e.target === textDisplay && !e.ctrlKey) {
    isSelecting = true;
    const rect = textDisplay.getBoundingClientRect();
    selectionStart = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    selectedLetters.clear();
    letters.forEach(l => l.classList.remove('selected'));

    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    textDisplay.appendChild(selectionBox);
  }
}

function onDocumentMouseMove(e) {
  if (draggedLetter && draggedGroup.length > 0) {
    const displayRect = textDisplay.getBoundingClientRect();
    const newX = e.clientX - displayRect.left - offsetX;
    const newY = e.clientY - displayRect.top - offsetY;

    if (draggedGroup.length === 1) {
      draggedLetter.style.left = newX + 'px';
      draggedLetter.style.top = newY + 'px';
    } else {
      const deltaX = newX - parseFloat(draggedLetter.style.left);
      const deltaY = newY - parseFloat(draggedLetter.style.top);

      draggedGroup.forEach(letter => {
        const currentX = parseFloat(letter.style.left);
        const currentY = parseFloat(letter.style.top);
        letter.style.left = currentX + deltaX + 'px';
        letter.style.top = currentY + deltaY + 'px';
      });
    }
  }

  if (isSelecting && selectionBox) {
    const rect = textDisplay.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const left = Math.min(selectionStart.x, currentX);
    const top = Math.min(selectionStart.y, currentY);
    const width = Math.abs(currentX - selectionStart.x);
    const height = Math.abs(currentY - selectionStart.y);

    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';

    updateSelection(left, top, width, height);
  }
}

function onDocumentMouseUp(e) {
  if (draggedLetter && draggedGroup.length === 1 && dragStartPosition) {
    let swapped = false;

    for (let letter of letters) {
      if (letter === draggedLetter) continue;

      const draggedLeft = parseFloat(draggedLetter.style.left);
      const draggedTop = parseFloat(draggedLetter.style.top);
      const letterLeft = parseFloat(letter.style.left);
      const letterTop = parseFloat(letter.style.top);

      const distance = Math.sqrt(
        Math.pow(draggedLeft - letterLeft, 2) +
          Math.pow(draggedTop - letterTop, 2)
      );

      if (distance < 50) {
        letter.style.left = dragStartPosition.left;
        letter.style.top = dragStartPosition.top;
        swapped = true;
        break;
      }
    }
  }

  if (draggedGroup.length > 0) {
    draggedGroup.forEach(l => l.classList.remove('dragging'));
  }

  draggedLetter = null;
  draggedGroup = [];
  dragStartPosition = null;

  if (isSelecting && selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }
  isSelecting = false;
}

function updateSelection(left, top, width, height) {
  letters.forEach(letter => {
    const rect = letter.getBoundingClientRect();
    const displayRect = textDisplay.getBoundingClientRect();

    const letterLeft = rect.left - displayRect.left;
    const letterTop = rect.top - displayRect.top;
    const letterRight = letterLeft + rect.width;
    const letterBottom = letterTop + rect.height;

    const selectionRight = left + width;
    const selectionBottom = top + height;

    if (
      letterRight > left &&
      letterLeft < selectionRight &&
      letterBottom > top &&
      letterTop < selectionBottom
    ) {
      if (!selectedLetters.has(letter)) {
        selectedLetters.add(letter);
        letter.classList.add('selected');
      }
    } else {
      if (selectedLetters.has(letter)) {
        selectedLetters.delete(letter);
        letter.classList.remove('selected');
      }
    }
  });
}
