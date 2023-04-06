const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);

Element.prototype.on = function (event, handler) {
  this.addEventListener(event, handler);
  return this;
}

NodeList.prototype.on = function (event, handler) {
  this.forEach(n => n.addEventListener(event, handler));
  return this;
}

const createElementString = str => {
  const node = document.createElement('div');
  node.innerHTML = str;
  return node.children[0];
}

const renderBoard = boardId => `
    <div class="board" draggable="true">
        <div class="board-title">
            <h3>${boardId}</h3>
        </div>
        <div class="list"></div>
        <div class="board-action">
            <div class="add-card-btn">+ 카드 추가하기</div>
        </div>
    </div>`;

class BoardStore {
  constructor(container) {
    this.container = container;
    this.dump = localStorage.getItem('canban-html') || ['To Do', 'in progress', 'Done'].map(renderBoard).join('');
    this.uiMode = localStorage.getItem('ui-mode') || 'default'
    this.container.innerHTML = this.dump;
  }

  saveHTML() {
    const dump = this.container.innerHTML.toString();
    localStorage.setItem('canban-html', dump);
  }

  setUIMode(mode) {
    localStorage.setItem('ui-mode', mode);
  }
}

const container = $('.container');
const boardStore = new BoardStore(container);
const [ENTER, ESC] = [13, 27];
const trash = $('.trash');
const closeBtn = $('.close');

let dragCard = null;
let dragBoard = null;
let cardTitle = null;

//modal Event
closeBtn.on('click', onModalClose)

// Container Event
container.on('dragover', onContainerDragover)
container.on('mousewheel', onWheelScroll)

// Card Event
$$('.card')
  .on('dragstart', onCardDragstart)
  .on('dragend', onCardDragend)
  .on('click', onModalOpen);

$$('.list').on('dragover', onCardListDragover);

$$('.add-card-btn').on('click', onAddCardBtnClick);

$$('.add-card-btn').on('click', onAddCardBtnClick);

// Trash Can Event
trash
  .on('dragover', e => e.preventDefault())
  .on('dragenter', () => trash.style.border = '3px dashed white')
  .on('dragleave', () => trash.style.border = 'none')
  .on('drop', (e) => (dragCard || dragBoard).remove());

function resizeTextarea() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
}

function onModalClose(){
  $('.modalOverlay').style.display = 'none';
  localStorage.setItem(cardTitle, $('.card-text').value);
}

function onAddCardBtnClick(e) {
  const colors = `hsl(${parseInt(Math.random() * 24, 10) * 15}, 42%, 57%)`;
  const card = createElementString(`
        <div class="card" draggable="true" style="--my-color: ${colors}">
            <textarea rows="1" placeholder="내용 입력 후 엔터"></textarea>
        </div>`);
  card.on('dragstart', onCardDragstart).on('dragend', onCardDragend);

  const removeCard = () => card.remove();

  const textarea = card.querySelector('textarea');
  textarea
    .on('input', resizeTextarea)
    .on('blur', removeCard)
    .on('keydown', ({
      keyCode
    }) => {
      if (keyCode === ESC) textarea.blur();
      if (keyCode !== ENTER || !textarea.value) return;
      if (textarea.value === '\n') return textarea.value = '';

      textarea.removeEventListener('blur', removeCard);
      card.innerHTML = `<div class="card-title">${textarea.value}</div>`;
      boardStore.saveHTML();
      location.reload();
    })

  const cardList = this.parentNode.parentNode.querySelector('.list');
  cardList.appendChild(card);
  setTimeout(() => textarea.focus());
}

function onCardDragstart(e) {
  dragCard = this;
  setTimeout(() => {
    this.classList.add('shadow');
    trash.style.display = 'block';
  });
}

function onModalOpen(e){
  $('.modalOverlay').style.display = 'flex';
  $('.card-title').innerText = cardTitle = e.target.innerText;
  $('.card-text').value = localStorage.getItem(cardTitle);
}

function onCardDragend(e) {
  dragCard = null;
  this.classList.remove('shadow');
  trash.style.display = 'none';
  boardStore.saveHTML();
}

function onCardListDragover(e) {
  e.preventDefault();

  if (!dragCard || e.target === dragCard) return;

  if (e.target.classList.contains('card')) {
    this.insertBefore(dragCard, e.target)
  } else if (e.target === this) {
    this.appendChild(dragCard);
  }
}

function onContainerDragover(e) {
  e.preventDefault();

  if (dragCard || !dragBoard) return;

  if (e.target.classList.contains('board-title')) {
    const sibling = [...this.children];
    const targetBoard = e.target.parentNode;
    const index = sibling.indexOf(dragBoard);
    const targetIndex = sibling.indexOf(targetBoard);

    const front = index > targetIndex ? dragBoard : targetBoard;
    const back = index > targetIndex ? targetBoard : dragBoard;

    this.insertBefore(front, back);
  }
}

function onWheelScroll(e) {
  const delta = Math.max(-1, Math.min(1, e.deltaY));
  if (e.target === container) {
    this.scrollLeft += delta * 50;
    e.preventDefault();
  }
}