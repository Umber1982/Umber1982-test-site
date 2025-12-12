(() => {
  const books = document.querySelectorAll('.book');
  if (!books.length) return;

  let animationActive = false;
  let activeClone = null;

  const createFloating = (book) => {
    const clone = book.cloneNode(true);
    const rect = book.getBoundingClientRect();
    const pages = document.createElement('div');
    pages.classList.add('book-pages');
    const text = book.dataset.open || book.dataset.openText || '';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    pages.append(paragraph);
    clone.append(pages);
    clone.classList.add('floating-book');
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    document.body.append(clone);
    clone.addEventListener('click', (event) => {
      event.stopPropagation();
      if (clone === activeClone) {
        closeActive();
      }
    });
    return { clone, rect };
  };

  const animate = (clone, rect) => {
    const finalWidth = Math.min(window.innerWidth * 0.55, 420);
    const finalHeight = Math.min(window.innerHeight * 0.45, 320);
    const targetX = window.innerWidth / 2 - finalWidth / 2;
    const targetY = window.innerHeight / 2 - finalHeight / 2 + 20;

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        clone.style.left = `${targetX}px`;
        clone.style.top = `${targetY}px`;
        clone.style.width = `${finalWidth}px`;
        clone.style.height = `${finalHeight}px`;
        clone.classList.add('floating-stage');
        setTimeout(() => {
          clone.classList.add('opened');
          animationActive = false;
          activeClone = clone;
          resolve();
        }, 900);
      });
    });
  };

  const closeActive = () => {
    if (!activeClone) return;
    animationActive = true;
    const clone = activeClone;
    activeClone = null;
    clone.classList.remove('opened', 'floating-stage');
    clone.style.opacity = '0';
    setTimeout(() => {
      clone.remove();
      animationActive = false;
    }, 400);
  };

  books.forEach((book) => {
    book.addEventListener('click', async () => {
      if (animationActive) return;
      if (activeClone) {
        closeActive();
        return;
      }
      animationActive = true;
      const { clone, rect } = createFloating(book);
      await animate(clone, rect);
    });
  });
})();
