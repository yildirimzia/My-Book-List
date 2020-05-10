const bookList = document.querySelector('#book-list');
const titleInput = document.querySelector('#title');
const authorInput =  document.querySelector('#author');
const isbnInput =  document.querySelector('#isbn');
const form = document.querySelector('#book-form');


class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
};

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book)) 
  }

  static addBookToList(book) {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger delete">X</a></td>
    `;
    bookList.appendChild(row)
  }

  static clearFields() {
    titleInput.value = '';
    authorInput.value = '';
    isbnInput.value = '';
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    const container = document.querySelector('.container');
    
    div.innerHTML = `<div class="alert alert-${className}">${message}</div>`
    container.insertBefore(div, form)
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }

  static deleteBook(e) {
    if(e.classList.contains('delete')) {
      e.parentElement.parentElement.remove();
    }
  }
};


class Store {
  static getBooks() {
    let books;
    localStorage.getItem('books') === null  ? books = [] : books = JSON.parse(localStorage.getItem('books'));
    return books;
  }


  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) =>book.isbn === isbn  ? books.splice(index, 1) : '');
    localStorage.setItem('books',JSON.stringify(books))
  }
};


document.addEventListener('DOMContentLoaded', UI.displayBooks);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const isbn = isbnInput.value.trim();

  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger')
  }else {
    const book  = new Book(title, author, isbn)
    UI.addBookToList(book);

    Store.addBook(book)

    UI.showAlert('Book Added', 'success')

    UI.clearFields() 
  } 
});

bookList.addEventListener('click',(e) => {
  UI.deleteBook(e.target)
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
  UI.showAlert('Book Removed', 'success')
});