const books = []; // array kosong untuk menampung data buku
const RENDER_EVENTS = "render-book"; // nama event custom yang disimpan ke var RENDER_EVENTS
const STORAGE_KEY = "BOOKS_APPS"; // nama event custom yang disimpan ke var STORAGE_KEY

// ketika halaman diload maka akan menjalankan code dibawah ini
document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("inputBookTitle");
  const author = document.getElementById("inputBookAuthor");
  const year = document.getElementById("inputBookYear");
  const bookSubmitBook = document.getElementById("bookSubmit");

  /**
   * ketika hasil inputan title, author, year tidak string kosong, maka attribute disabled yang ada di bookSubmit akan hilang,
   * dan backgroundColor nya menjadi 'cornflowerblue'. Jika hasil inputan nya kosong, maka akan di setAttribute 'disabled',
   * dan backgroundColor akan berwarna abu-abu.
   */
  document.getElementById("inputBook").addEventListener("input", () => {
    if (title.value !== "" && author.value !== "" && year.value !== "") {
      bookSubmitBook.removeAttribute("disabled");
      bookSubmitBook.style.backgroundColor = "cornflowerblue";
    } else {
      bookSubmitBook.setAttribute("disabled", "");
      bookSubmitBook.style.backgroundColor = `#aeaeae`;
    }
  });

  /**
   * ketika formBook nya disubmit makan akan melakukan pengkondisian sesuai hasil inputan dari id book,
   * jika hasil inputan id book nya tidak ada maka akan menjalankan function 'createBook()', jika hasil inputan id book nya ada,
   * maka akan menjalankan function 'updateBook()'
   *
   * dan melakukan setAttribute 'disabled' pada button bookSubmit, backgroundColor berubah menjadi warna abu-abu,
   * terakhir form nya akan di reset menjadi kosong.
   */
  document.getElementById("inputBook").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookID = document.getElementById("bookId");
    if (bookID.value !== "") {
      updateBook();
      bookID.removeAttribute('value')
    } else {
      createBook();
    }

    bookSubmitBook.setAttribute("disabled", "");
    bookSubmitBook.style.backgroundColor = `#aeaeae`;
    e.target.reset();
  });

  /**
   * event 'keyup' ini ketika sebuah tombol keyboard dilepas
   * melakukan pencarian data pada class 'book_item'
   */
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

  // ketika formSearchBook disubmit maka tidak terjadi reload
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
 * - digunakan untuk menampilkan book item ke halaman web dengan pengkondisian, jika isCompleted nya true,
 * maka akan masuk ke dalam section 'selesai dibaca', jika isCompleted nya false maka akan masuk ke dalam section 'belum selesai dibaca'
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
  Swal.fire({
    icon: "success",
    title: "Data saved successfully!",
    html: `Buku <strong>${formBook.title}</strong> berhasil ditambahkan dan disimpan ke Local Storage!`,
  });
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

  Swal.fire({
    icon: "success",
    title: "Data updated successfully!",
    html: `Buku <strong>${formBook.title}</strong> berhasil diupdate dan disimpan ke Local Storage!`,
  });
  document.dispatchEvent(new Event(RENDER_EVENTS));
  formBook.button.innerHTML =
    "Masukkan Buku ke rak <strong>Belum selesai dibaca</strong>";
};

const destroyBook = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        "Data deleted successfully!",
        "Your data has been deleted.",
        "success"
      );
      const bookTarget = books.findIndex((book) => book.id === id);
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENTS));
    }
  });

  document.getElementById("inputBook").reset();
  document.getElementById("bookId").removeAttribute("value");
  document.getElementById("bookSubmit").innerHTML =
    "Masukkan Buku ke rak <strong>Belum selesai dibaca</strong>";
  document.getElementById("bookSubmit").setAttribute("disabled", "");
  document.getElementById("bookSubmit").style.backgroundColor = `#aeaeae`;
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
  editButton.classList.add("btn_warning");
  editButton.innerHTML = `<i class="fa-solid fa-pen"></i> Edit`;

  editButton.addEventListener("click", () => {
    editBook(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn_danger");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i> Hapus`;

  deleteButton.addEventListener("click", () => {
    destroyBook(book.id);
  });

  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");

  if (book.isCompleted) {
    title.style.textDecoration = "line-through";
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("btn_success");
    unreadButton.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Unread`;

    unreadButton.addEventListener("click", () => {
      toggleBook(book.id);
    });

    divButton.append(unreadButton);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("btn_success");
    readButton.innerHTML = `<i class="fa-solid fa-circle-check"></i> Read`;

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
 * - saveData() function untuk save data ke localStorage menggunakan method 'setItem() dalam bentuk tipe data string yang sudah di stringify
 * - isStorageExist() function untuk mengecek apakah browser yang digunakan mendukung 'Web Storage' atau tidak
 * - loadDataFromStorage() function load data dari storage dengan method 'getItem()' lalu di parsing dalam bentuk JSON,
 * dan dilakukan pengkondisian, jika data nya tidak null atau ada, maka lakukan loop dengan for of kemudian di push ke dalam array books.
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
