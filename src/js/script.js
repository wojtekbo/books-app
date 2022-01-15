const selectors = {
  templateOf: {
    book: '#template-book',
  },
  filters: {
    section: '.filters',
  },
  booksList: {
    container: '.books-list',
  },
};

const classNames = {
  booksList: {
    bookFavorite: 'favorite',
    bookHidden: 'hidden',
  },
};

const templates = {
  book: Handlebars.compile(document.querySelector(selectors.templateOf.book).innerText),
};

class BooksList {
  constructor() {
    this.favoriteBooks = [];
    this.filters = [];
    this.initData();
    this.rander();
    this.getElements();
    this.initActions();
  }

  initData() {
    this.data = dataSource.books;
  }

  rander() {
    for (let book of this.data) {
      book.ratingBgc = this.determineRatingBgc(book.rating);
      book.ratingWidth = book.rating * 10;
      const bookTemplate = templates.book;
      const bookGeneratedHTML = bookTemplate(book);
      const bookElementDom = utils.createDOMFromHTML(bookGeneratedHTML);
      const booksListContainerDom = document.querySelector(selectors.booksList.container);
      booksListContainerDom.appendChild(bookElementDom);
    }
  }

  getElements() {
    this.dom = {};
    this.dom.booksList = document.querySelector(selectors.booksList.container);
    this.dom.filters = document.querySelector(selectors.filters.section);
  }

  initActions() {
    //Filtrowanie
    const allBooksDom = this.dom.booksList;
    const filtersDom = this.dom.filters;
    filtersDom.addEventListener('click', (event) => {
      console.log(event);
      if (event.target.name === 'filter') {
        if (event.target.checked) {
          this.filters.push(event.target.value);
        } else {
          this.filters.splice(this.filters.indexOf(event.target.value), 1);
        }
        console.log(this.filters);
      }
      this.filterBooks();
    });
    //Dodawanie do ulubionych
    allBooksDom.addEventListener('dblclick', (event) => {
      event.preventDefault();
      if (event.target.offsetParent.classList.contains('book__image')) {
        if (this.favoriteBooks.includes(event.target.offsetParent.getAttribute('data-id'))) {
          event.target.offsetParent.classList.remove(classNames.booksList.bookFavorite);
          this.favoriteBooks.splice(this.favoriteBooks.indexOf(event.target.offsetParent.getAttribute('data-id')), 1);
        } else {
          event.target.offsetParent.classList.add(classNames.booksList.bookFavorite);
          this.favoriteBooks.push(event.target.offsetParent.getAttribute('data-id'));
        }
        console.log(this.favoriteBooks);
      }
    });
  }

  filterBooks() {
    for (let book of dataSource.books) {
      const bookId = `.book__image[data-id="${book.id}"]`;
      const bookDom = document.querySelector(bookId);
      bookDom.classList.remove(classNames.booksList.bookHidden);
      for (let filtr of this.filters) {
        if (!book.details[filtr]) {
          bookDom.classList.add(classNames.booksList.bookHidden);
          break;
        }
      }
    }
  }

  determineRatingBgc(rating) {
    let background = '';
    if (rating < 6) {
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
    return background;
  }
}

const app = new BooksList();
console.log(app);
