const books = [];
const RENDER_EVENTS = "render-book";
const SEARCH_EVENTS = "search-book";
const STORAGE_KEY = "BOOKS_APPS";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("inputBook").addEventListener("submit", (e) => {
    e.preventDefault();
    createBook();
  });

  document.getElementById("searchBook").addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENTS, () => {
  const belumDibaca = document.getElementById("belumSelesaiDibaca");
  belumDibaca.innerHTML = "";

  const selesaiDibaca = document.getElementById("selesaiDibaca");
  selesaiDibaca.innerHTML = "";

  // books.forEach((book) => {
  //   const bookElement = makeBook(book);
  //   book.isBookCompleted
  //     ? selesaiDibaca.append(bookElement)
  //     : belumDibaca.append(bookElement);
  // })

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isBookCompleted) {
      selesaiDibaca.append(bookElement);
    } else {
      belumDibaca.append(bookElement);
    }
  }
});

document.addEventListener(SEARCH_EVENTS, () => {
  const belumDibaca = document.getElementById("belumSelesaiDibaca");
  belumDibaca.innerHTML = "";

  const selesaiDibaca = document.getElementById("selesaiDibaca");
  selesaiDibaca.innerHTML = "";

  //
});

/**
 * CRUD Operations
 * - createBook() untuk membuat data buku baru ke dalam array books
 * - editBook() untuk ...
 * -
 * - destroyBook() untuk ...
 */
const createBook = () => {
  const { title, author, year, isBookCompleted } = getValueInputBook();

  const book = {
    id: generateId(),
    title,
    author,
    year,
    isBookCompleted,
  };

  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENTS));
};

const editBook = () => {
  //
};

const destroyBook = () => {
  //
};

const toggleBook = (id) => {
  const book = books.find((book) => book.id === id);
  book.isBookCompleted = !book.isBookCompleted;
  document.dispatchEvent(new Event(RENDER_EVENTS));
};

// function untuk menghasilkan identitas unik pada setiap item buku
const generateId = () => +new Date();

// utility function untuk mendapatkan value yang dihasilkan oleh user
const getValueInputBook = () => {
  const form = document.getElementById("inputBook");
  const id = document.getElementById("bookId").value;
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isBookCompleted = document.getElementById("bookIsCompleted").checked;
  const button = document.getElementById("bookSubmit");

  return {
    form,
    id,
    title,
    author,
    year,
    isBookCompleted,
    button,
  };
};

// function untuk membuat tampilan informasi buku
const makeBook = (book) => {
  // membuat element untuk judul, penulis, dan tahun
  const title = document.createElement("h3");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${book.year}`;

  // membuat elemen button aksi di dalam div
  const divButton = document.createElement("div");
  divButton.classList.add("action");

  const editButton = document.createElement("button");
  editButton.classList.add("btn", "btn_warning");
  editButton.innerHTML = "Edit Buku";

  editButton.addEventListener("click", () => {
    editBook(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn_danger");
  deleteButton.innerText = "Hapus Buku";

  deleteButton.addEventListener("click", () => {
    destroyBook(book.id);
  });

  // membuat elemen book item
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");

  if (book.isBookCompleted) {
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("btn", "btn_success");
    unreadButton.innerText = "Belum selesai dibaca";

    unreadButton.addEventListener("click", () => {
      toggleBook(book.id);
    });

    divButton.append(unreadButton);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("btn", "btn_success");
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

// function untuk mengecek apakah browser yang digunakan mendukung 'Web Storage' atau tidak
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

const loadDataFromStorage = () => {
  // 
};
