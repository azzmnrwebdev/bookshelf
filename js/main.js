const books = [];
const RENDER_EVENTS = "render-book";
const STORAGE_KEY = "BOOKS_APPS";

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("inputBookTitle");
  const author = document.getElementById("inputBookAuthor");
  const year = document.getElementById("inputBookYear");
  const bookSubmitBook = document.getElementById("bookSubmit");

  document.getElementById("inputBook").addEventListener("input", () => {
    if (title.value !== "" && author.value !== "" && year.value !== "") {
      bookSubmitBook.removeAttribute("disabled");
      bookSubmitBook.style.backgroundColor = "cornflowerblue";
    } else {
      bookSubmitBook.setAttribute("disabled", "");
      bookSubmitBook.style.backgroundColor = `#aeaeae`;
    }
  });

  document.getElementById("inputBook").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookID = document.getElementById("bookId").value;
    if (bookID) {
      updateBook();
    } else {
      createBook();
    }

    bookSubmitBook.setAttribute("disabled", "");
    bookSubmitBook.style.backgroundColor = `#aeaeae`;
    e.target.reset();
  });

  document.getElementById("searchBookTitle").addEventListener("keyup", (e) => {
    const list = e.target.value.toLowerCase();
    let keyword = document.querySelectorAll(".book_item");
    keyword.forEach((book) => {
      const buku = book.firstChild.textContent.toLocaleLowerCase();
      if (buku.indexOf(list) != -1) {
        book.setAttribute("style", "display: block;");
      } else {
        book.setAttribute("style", "display: none !important;");
      }
    });
  });

  document.getElementById("searchBook").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

/**
 * CUSTOM EVENT - RENDER_EVENTS:
 *
 * - digunakan untuk ...
 */
document.addEventListener(RENDER_EVENTS, () => {
  const inCompleted = document.getElementById("incompleteBookshelfList");
  inCompleted.innerHTML = "";

  const completed = document.getElementById("completeBookshelfList");
  completed.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isCompleted) {
      completed.append(bookElement);
    } else {
      inCompleted.append(bookElement);
    }
  }

  saveData();
});

/**
 * CRUD OPERATION:
 *
 * - createBook() function untuk membuat data buku baru ke dalam array books
 * - editBook() function untuk memunculkan data lama ke formBook sesuai id
 * - updateBook() function berisi logika untuk mengubah data lama menjadi data ter-update
 * - destroyBook() function untuk menghapus data book
 * - toggleBook()  function untuk berpindah-pindah dari isCompleted nya false ke true dan sebaliknya
 */
const createBook = () => {
  const formBook = getValueInputBook();
  const book = {
    id: generateId(),
    title: formBook.title,
    author: formBook.author,
    year: formBook.year,
    isCompleted: formBook.isCompleted,
  };

  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENTS));
};

const editBook = (id) => {
  const book = books.find((book) => book.id === id);
  document.getElementById("bookId").value = book.id;
  document.getElementById("inputBookTitle").value = book.title;
  document.getElementById("inputBookAuthor").value = book.author;
  document.getElementById("inputBookYear").value = book.year;
  document.getElementById("inputBookIsComplete").checked = book.isCompleted;
  document.getElementById("bookSubmit").innerText = "Edit Book";
  document.getElementById("bookSubmit").removeAttribute("disabled");
  document.getElementById("bookSubmit").style.backgroundColor = `#6495ED`;
};

const updateBook = () => {
  const formBook = getValueInputBook();

  const index = books.findIndex((book) => book.id === parseInt(formBook.id));
  books[index] = {
    ...books[index],
    title: formBook.title,
    author: formBook.author,
    year: formBook.year,
    isCompleted: formBook.isCompleted,
  };

  document.dispatchEvent(new Event(RENDER_EVENTS));
  formBook.button.innerHTML =
    "Masukkan Buku ke rak <strong>Belum selesai dibaca</strong>";
};

const destroyBook = (id) => {
  if (confirm("Are you sure to delete this data?")) {
    const bookTarget = books.findIndex((book) => book.id === id);
    books.splice(bookTarget, 1);
  }
  document.dispatchEvent(new Event(RENDER_EVENTS));
};

const toggleBook = (id) => {
  const book = books.find((book) => book.id === id);
  book.isCompleted = !book.isCompleted;
  document.dispatchEvent(new Event(RENDER_EVENTS));
};

/**
 * UTILITY FUNCTION:
 *
 * - generateId() function untuk menghasilkan identitas / id yang unik pada setiap item buku
 * - getValueInputBook() function untuk mendapatkan value yang diinputkan dari user
 */
const generateId = () => {
  return +new Date();
};

const getValueInputBook = () => {
  const formBook = {};
  formBook["id"] = document.getElementById("bookId").value;
  formBook["title"] = document.getElementById("inputBookTitle").value;
  formBook["author"] = document.getElementById("inputBookAuthor").value;
  formBook["year"] = document.getElementById("inputBookYear").value;
  formBook["isCompleted"] = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  formBook["button"] = document.getElementById("bookSubmit");

  return formBook;
};

/**
 * RENDER ELEMEN HTML ITEM BOOK:
 *
 * - makeBook(param) function untuk membuat item book dengan createElement HTML lalu ditampilkan ke browser,
 * dengan cara menggunakan method 'append()'
 *
 * var 'boxItem' membuat article sebagai pembungkus data buku, seperti title, author, year dan button action
 * var 'title' menampilkan judul buku yang data nya diambil dari param bernama 'book'
 * var 'author' menampilkan nama penulis yang data nya diambil dari param bernama 'book'
 * var 'year' menampilkan tahun buku yang data nya diambil dari param bernama 'book'
 * var 'divButton' membuat div sebagai pembungkus button aksi dengan class 'action'
 * var 'editButton' button untuk edit data dengan nama class 'btn btn-warning'
 * var 'deleteButton' button untuk hapus data dengan nama class 'btn btn-danger'
 *
 * ada pengkondisian jika isCompleted = true, maka var 'unreadButton' bertulisan 'Belum selesai dibaca,
 * sedangkan jika isCompleted = false, maka var 'readButton' bertulisan 'Selesai dibaca'
 *
 * @param {Object} book
 * @returns var 'bookItem'
 */
const makeBook = (book) => {
  const title = document.createElement("h3");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${book.year}`;

  const divButton = document.createElement("div");
  divButton.classList.add("action");

  const editButton = document.createElement("button");
  editButton.classList.add("btn-warning");
  editButton.innerHTML = "Edit Buku";

  editButton.addEventListener("click", () => {
    editBook(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn-danger");
  deleteButton.innerText = "Hapus Buku";

  deleteButton.addEventListener("click", () => {
    destroyBook(book.id);
  });

  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");

  if (book.isCompleted) {
    title.style.textDecoration = "line-through";
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("btn-success");
    unreadButton.innerText = "Belum selesai dibaca";

    unreadButton.addEventListener("click", () => {
      toggleBook(book.id);
    });

    divButton.append(unreadButton);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("btn-success");
    readButton.innerHTML = "Selesai Dibaca";

    readButton.addEventListener("click", () => {
      toggleBook(book.id);
    });

    divButton.append(readButton);
  }

  divButton.append(editButton, deleteButton);
  bookItem.append(title, author, year, divButton);

  return bookItem;
};

/**
 * WEB STORAGE:
 *
 * - saveData() function untuk save data ke localStorage dalam bentuk tipe data string yang sudah di parsed
 * - isStorageExist() function untuk mengecek apakah browser yang digunakan mendukung 'Web Storage' atau tidak
 * - loadDataFromStorage() function ...
 */
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENTS));
};
