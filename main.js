// Storage key
const STORAGE_KEY = 'BOOKSHELF_APP';

// Array untuk menyimpan data buku
let books = [];

// Ambil data dari localStorage
function loadBooksFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }
}

// Simpan data ke localStorage
function saveBooksToStorage() {
  const serializedData = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, serializedData);
}

// Buat elemen buku baru
function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.classList.add('book-item');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
      </button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
    </div>
  `;

  const isCompleteButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
  const editButton = bookItem.querySelector('[data-testid="bookItemEditButton"]');
  const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');

  // Ubah status buku selesai dibaca atau belum
  isCompleteButton.addEventListener('click', function () {
    toggleBookCompleteStatus(book.id);
  });

  // Edit buku
  editButton.addEventListener('click', function () {
    editBook(book.id);
  });

  // Hapus buku
  deleteButton.addEventListener('click', function () {
    deleteBook(book.id);
  });

  return bookItem;
}

// Tampilkan buku-buku di rak yang sesuai
function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  // Kosongkan daftar buku sebelum ditampilkan ulang
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Tambah buku baru
function addBook(title, author, year, isComplete) {
  const newBook = {
    id: +new Date(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();
  renderBooks();
}


// Ubah status buku selesai dibaca atau belum
function toggleBookCompleteStatus(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

// Hapus buku
function deleteBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveBooksToStorage();
    renderBooks();
  }
}

// Edit buku
function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    const newTitle = prompt('Masukkan judul baru:', book.title);
    const newAuthor = prompt('Masukkan penulis baru:', book.author);
    const newYear = prompt('Masukkan tahun baru:', book.year);

    if (newTitle && newAuthor && newYear) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = newYear;
      saveBooksToStorage();
      renderBooks();
    }
  }
}

// Cari buku berdasarkan judul
function searchBook(title) {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );

  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Event listener untuk form tambah buku
document.getElementById('bookForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  addBook(title, author, year, isComplete);

  // Reset form setelah buku ditambahkan
  document.getElementById('bookForm').reset();
});

// Event listener untuk form pencarian buku
document.getElementById('searchBook').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchTitle = document.getElementById('searchBookTitle').value;
  searchBook(searchTitle);
});

// Load buku dari storage saat halaman di-load
window.addEventListener('load', function () {
  loadBooksFromStorage();
  renderBooks();
});

// Toggle dark mode
const toggleDarkModeButton = document.getElementById('toggleDarkMode');
toggleDarkModeButton.addEventListener('click', function () {
  // Tambahkan atau hapus class dark-mode ke elemen body
  document.body.classList.toggle('dark-mode');
  
  // Tambahkan atau hapus class dark-mode ke tombol Dark Mode
  toggleDarkModeButton.classList.toggle('dark-mode');
  
  // Tambahkan atau hapus class dark-mode ke setiap elemen buku
  const bookItems = document.querySelectorAll('.book-item');
  bookItems.forEach((item) => {
    item.classList.toggle('dark-mode');
  });
});

