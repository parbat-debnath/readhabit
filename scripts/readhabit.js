class book {
  constructor(
    title,
    author,
    totalPages,
    completedPages,
    status,
    startingDate,
    dueDate,
    completionDate
  ) {
    this.title = title;
    this.author = author;
    this.totalPages = totalPages;
    this.completedPages = completedPages;
    this.status = status;
    this.startingDate = startingDate;
    this.dueDate = dueDate;
    this.completionDate = completionDate;
  }
}

// popups

let editingBookId = null;
let deletingBookId = null;
let movingBookId = null;

// edit popup
const editPopup = document.createElement("div");
editPopup.classList.add("edit-popup");

// popup header
const editPopupHeader = document.createElement("h2");
editPopupHeader.classList.add("edit-popup-header");
editPopupHeader.textContent = "Update book info";

// book title heading
const bookTitleHeading = document.createElement("h3");
bookTitleHeading.classList.add("subheading");
bookTitleHeading.textContent = "Title";

// book title input
const editBookTitle = document.createElement("input");
editBookTitle.type = "text";
editBookTitle.classList.add("edit-book-title");

// book author heading
const bookAuthorHeading = document.createElement("h3");
bookAuthorHeading.classList.add("subheading");
bookAuthorHeading.textContent = "Author";

// book author input
const editBookAuthor = document.createElement("input");
editBookAuthor.type = "text";
editBookAuthor.classList.add("edit-book-author");

// book page heading
const bookPageHeading = document.createElement("h3");
bookPageHeading.classList.add("subheading");
bookPageHeading.textContent = "Pages";

// book page number input
const editBookPages = document.createElement("input");
editBookPages.type = "number";
editBookPages.classList.add("edit-book-pages");

// due date heading
const dueDateHeading = document.createElement("h3");
dueDateHeading.textContent = "Due date";

// edit due date

const editDueDate = document.createElement("input");
editDueDate.type = "date";
editDueDate.classList.add("edit-due-date");

// messsage

const editMessage = document.createElement("p");
editMessage.classList.add("edit-message");

// edit cancel button
const editCancelBtn = document.createElement("button");
editCancelBtn.classList.add("edit-cancel-btn");
editCancelBtn.textContent = "Cancel";

// edit confirm button
const editConfirmBtn = document.createElement("button");
editConfirmBtn.classList.add("edit-confirm-btn");
editConfirmBtn.textContent = "Confirm";

editCancelBtn.addEventListener("click", () => {
  editMessage.textContent = "";
  popupHolder.removeChild(editPopup);
  popupHolder.style.display = "none";
});

editPopup.appendChild(editPopupHeader);
editPopup.appendChild(bookTitleHeading);
editPopup.appendChild(editBookTitle);
editPopup.appendChild(bookAuthorHeading);
editPopup.appendChild(editBookAuthor);
editPopup.appendChild(bookPageHeading);
editPopup.appendChild(editBookPages);
editPopup.appendChild(dueDateHeading);
editPopup.appendChild(editDueDate);
editPopup.appendChild(editMessage);
editPopup.appendChild(editCancelBtn);
editPopup.appendChild(editConfirmBtn);

document.getElementById("book-form").style.display = "none";

// Starting Database

let db;
const request = indexedDB.open("books", 1);
request.onsuccess = (event) => {
  console.log("Database opned successfully.");
  db = event.target.result;
  updateCurrentList();
  updateWishlist();
  updateCompletedList();
};
request.onerror = (event) => {
  console.error("Failed to open database : ", event.target.error?.message);
};
request.onupgradeneeded = (event) => {
  db = event.target.result;

  if (!db.objectStoreNames.contains("current")) {
    const currentStore = db.createObjectStore("current", {
      autoIncrement: true,
      keyPath: "bookId",
    });
    console.log("Current object store created successfully.");

    // Creating indexes
    currentStore.createIndex("title", "title", { unique: true });
    currentStore.createIndex("author", "author", { unique: false });
    currentStore.createIndex("totalPages", "totalPages", { unique: false });
    currentStore.createIndex("completedPages", "completedPages", {
      unique: false,
    });
    currentStore.createIndex("status", "status", { unique: false });
    currentStore.createIndex("startingDate", "startingDate", { unique: false });
    currentStore.createIndex("dueDate", "dueDate", { unique: false });

    console.log("All indexes created successfully.");
  }
  if (!db.objectStoreNames.contains("wishlist")) {
    const currentStore = db.createObjectStore("wishlist", {
      autoIncrement: true,
      keyPath: "bookId",
    });
    console.log("wishlist object store created successfully.");

    // Creating indexes
    currentStore.createIndex("title", "title", { unique: true });
    currentStore.createIndex("author", "author", { unique: false });
    currentStore.createIndex("status", "status", { unique: false });

    console.log("All indexes created successfully.");
  }
  if (!db.objectStoreNames.contains("completed")) {
    const currentStore = db.createObjectStore("completed", {
      autoIncrement: true,
      keyPath: "bookId",
    });
    console.log("completed object store created successfully.");

    // Creating indexes
    currentStore.createIndex("title", "title", { unique: true });
    currentStore.createIndex("author", "author", { unique: false });
    currentStore.createIndex("totalPages", "totalPages", { unique: false });
    currentStore.createIndex("status", "status", { unique: false });
    currentStore.createIndex("startingDate", "startingDate", { unique: false });
    currentStore.createIndex("completionDate", "completionDate", {
      unique: false,
    });

    console.log("All indexes created successfully.");
  }
};

// Adding a new book

const bookform = document.getElementById("book-form");
bookform.style.display = "none";
const formMessage = document.getElementById("form-message");
document.getElementById("entry-cancel").addEventListener("click", () => {
  bookform.style.display = "none";
});
document.getElementById("entry-confirm").addEventListener("click", () => {
  addCurrentBook();
});

function addCurrentBook() {
  if (!db) {
    console.error("Database not initialized yet.");
    return;
  }
  formMessage.textContent = "";
  const bookTitle = document.getElementById("bookTitle").value;
  const bookAuthor = document.getElementById("bookAuthor").value;
  const totalPages = Number(document.getElementById("bookPages").value);
  const status = "current";
  const startingDate = new Date();
  const dueDate = new Date(document.getElementById("dueDate").value);

  if (!bookTitle || !bookAuthor || !totalPages || isNaN(dueDate.getTime())) {
    formMessage.style.color = "red";
    formMessage.textContent = "Plese enter all details correctly.";
    setTimeout(() => {
      formMessage.textContent = "";
    }, 4000);
  } else if (dueDate - startingDate < 0) {
    formMessage.style.color = "red";
    formMessage.textContent = "Please enter a valid date.";
    setTimeout(() => {
      formMessage.textContent = "";
    }, 4000);
  } else {
    const newBook = new book(
      bookTitle,
      bookAuthor,
      totalPages,
      0,
      status,
      startingDate,
      dueDate
    );

    const transaction = db.transaction(["current"], "readwrite");
    const currentStore = transaction.objectStore("current");

    const addRequest = currentStore.add(newBook);
    addRequest.onsuccess = () => {
      document.getElementById("bookTitle").value = "";
      document.getElementById("bookAuthor").value = "";
      document.getElementById("bookPages").value = "";
      document.getElementById("dueDate").value = "";

      updateCurrentList();
    };
    addRequest.onerror = (event) => {
      console.error("Transaction error : ", event.target.error?.message);
    };
    bookform.style.display = "none";
    return;
  }
}

// Updating current list

function updateCurrentList() {
  const transaction = db.transaction(["current"], "readwrite");
  const currentStore = transaction.objectStore("current");

  const showAllrequest = currentStore.getAll();

  showAllrequest.onsuccess = () => {
    const books = showAllrequest.result;
    const currentList = document.getElementById("current");
    currentList.innerHTML = "";

    books.forEach((book) => {
      console.log(book.bookId);
      currentList.insertBefore(
        bookElementCreator(
          book.title,
          book.author,
          book.totalPages,
          book.completedPages,
          book.dueDate,
          book.bookId
        ),
        currentList.firstChild
      );
    });
  };
  showAllrequest.onerror = (event) => {
    console.error("Transaction error : ", event.target.error?.message);
  };
}

// Book element creator

function bookElementCreator(
  title,
  author,
  totalPages,
  completedPages,
  dueDate,
  bookId
) {
  const formattedDate = dueDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  const bookElement = document.createElement("div");
  bookElement.classList.add("book-element");

  const bookTitle = document.createElement("h3");
  bookTitle.classList.add("book-title");
  bookTitle.textContent = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("book-author");
  bookAuthor.textContent = author;

  const bookDueDate = document.createElement("p");
  bookDueDate.classList.add("book-due-date");
  if (daysLeft >= 0) {
    bookDueDate.textContent = `Due date : ${formattedDate} (${daysLeft} days left)`;
  } else {
    bookDueDate.textContent = `Target date passed on ${formattedDate} (${-daysLeft} days exceded)`;
  }

  const progress = document.createElement("div");
  progress.classList.add("progress");

  const graphicalProgress = document.createElement("div");
  graphicalProgress.classList.add("progressmeter");

  const progressmeterReading = document.createElement("div");
  progressmeterReading.classList.add("progressmeter-reading");
  progressmeterReading.style.width = `${(completedPages / totalPages) * 100}%`;

  graphicalProgress.appendChild(progressmeterReading);

  const textProgress = document.createElement("div");
  textProgress.classList.add("text-progress");

  const textProgressValue = document.createElement("p");
  textProgressValue.textContent = `( ${completedPages}/${totalPages} )`;

  textProgress.appendChild(textProgressValue);

  progress.appendChild(graphicalProgress);
  progress.appendChild(textProgress);

  const speed = Math.ceil((totalPages - completedPages) / daysLeft);

  const speedElement = document.createElement("p");
  speedElement.classList.add("speed");
  speedElement.textContent = `Recomended speed : ${speed} pages per day`;

  const actionBtn = document.createElement("div");
  actionBtn.classList.add("action-btn");

  const updateBtn = document.createElement("button");
  updateBtn.classList.add("updateBtn");
  updateBtn.textContent = "Update";

  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.textContent = "Edit";

  editBtn.addEventListener("click", () => {
    popupHolder.style.display = "block";
    popupHolder.appendChild(editPopup);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.textContent = "Delete";

  actionBtn.appendChild(updateBtn);
  actionBtn.appendChild(editBtn);
  actionBtn.appendChild(deleteBtn);

  bookElement.appendChild(bookTitle);
  bookElement.appendChild(bookAuthor);
  bookElement.appendChild(progress);
  bookElement.appendChild(bookDueDate);
  bookElement.appendChild(speedElement);
  bookElement.appendChild(actionBtn);

  updateBtn.addEventListener("click", () => {
    updateBookProgress(bookId);
  });
  editBtn.addEventListener("click", () => {
    editCurrentBook(bookId);
  });
  deleteBtn.addEventListener("click", () => {
    deleteCurrentBook(bookId);
  });

  return bookElement;
}

// Progress update page ( popup )

const updatePopup = document.createElement("div");

updatePopup.classList.add("update-popup");
const popupHeader = document.createElement("h2");
popupHeader.textContent = "Enter completed page number";
popupHeader.classList.add("popup-header");
const updateInput = document.createElement("input");
updateInput.classList.add("update-input-field");
const actionMessage = document.createElement("p");
actionMessage.classList.add("update-action-message");
const cancelSubmitBtn = document.createElement("button");
cancelSubmitBtn.id = "cancel-submit-btn";
cancelSubmitBtn.textContent = "Cancel";
const updateSubmitBtn = document.createElement("button");
updateSubmitBtn.id = "update-submit-btn";
updateSubmitBtn.textContent = "Update";
updatePopup.appendChild(popupHeader);
updatePopup.appendChild(updateInput);
updatePopup.appendChild(actionMessage);
updatePopup.appendChild(cancelSubmitBtn);
updatePopup.appendChild(updateSubmitBtn);
const popupHolder = document.getElementById("popupholder");
popupHolder.style.display = "none";
updatePopup.style.display = "none";

// Updating book Progress

function updateBookProgress(bookId) {
  const transaction = db.transaction(["current"], "readonly");
  const currentList = transaction.objectStore("current");

  const request = currentList.get(bookId);
  request.onsuccess = () => {
    const bookItem = request.result;
    console.log(`${bookId} accessed, and the data is`, bookItem);

    popupHolder.style.display = "block";
    popupHolder.appendChild(updatePopup);
    updatePopup.style.display = "block";
    actionMessage.textContent = "";
    updateInput.value = "";

    // Cancel button
    document.getElementById("cancel-submit-btn").onclick = () => {
      popupHolder.removeChild(updatePopup);
      popupHolder.style.display = "none";
    };

    // Update button
    document.getElementById("update-submit-btn").onclick = () => {
      const input = updateInput.value.trim();
      const inputPage = Number(input);

      if (input === "") {
        actionMessage.style.color = "red";
        actionMessage.textContent = "Input field cannot be empty!";
        return;
      } else if (isNaN(inputPage)) {
        actionMessage.style.color = "red";
        actionMessage.textContent = "Not a valid number!";
        return;
      } else if (
        inputPage < bookItem.completedPages ||
        inputPage > bookItem.totalPages
      ) {
        actionMessage.style.color = "red";
        actionMessage.textContent = "Invalid input";
        return;
      }

      // Starting a new transaction
      const newTransaction = db.transaction(
        ["current", "completed"],
        "readwrite"
      );

      if (inputPage === bookItem.totalPages) {
        // Book completed
        const completedStore = newTransaction.objectStore("completed");
        const currentStore = newTransaction.objectStore("current");

        const completedBook = { ...bookItem };
        completedBook.totalPages = inputPage;
        completedBook.completionDate = new Date();

        currentStore.delete(bookId).onsuccess = () => {
          updatePopup.removeChild(cancelSubmitBtn);
          updatePopup.removeChild(updateSubmitBtn);
          actionMessage.style.color = "#2fc02f";
          actionMessage.textContent = `Congratulations! You have completed ${bookItem.title}`;
          completedStore.add(completedBook).onsuccess = () => {
            setTimeout(() => {
              actionMessage.style.color = "white";
              updatePopup.appendChild(cancelSubmitBtn);
              updatePopup.appendChild(updateSubmitBtn);
              popupHolder.removeChild(updatePopup);
              popupHolder.style.display = "none";
              updateCurrentList();
              updateCompletedList();
            }, 2000);
          };
        };
      } else {
        // Update book progress
        const currentStore = newTransaction.objectStore("current");
        bookItem.completedPages = inputPage;

        currentStore.put(bookItem).onsuccess = () => {
          actionMessage.textContent = "Progress updated successfully.";
          updatePopup.removeChild(cancelSubmitBtn);
          updatePopup.removeChild(updateSubmitBtn);
          setTimeout(() => {
            actionMessage.style.color = "white";
            updatePopup.appendChild(cancelSubmitBtn);
            updatePopup.appendChild(updateSubmitBtn);
            popupHolder.removeChild(updatePopup);
            popupHolder.style.display = "none";
            updateCurrentList();
          }, 2000);
        };
      }
    };
  };
}

// Toggling book add page

function toggleBookAddPage() {
  if (document.getElementById("book-form").style.display === "none") {
    document.getElementById("book-form").style.display = "block";
  }
}

// Edit current book

function editCurrentBook(bookId) {
  const transaction = db.transaction(["current"], "readonly");
  const currentList = transaction.objectStore("current");

  const request = currentList.get(bookId);

  request.onsuccess = () => {
    const bookItem = request.result;
    console.log(`${bookId} accessed and the data is `, bookItem);

    // updating data field with previous data

    editBookTitle.value = bookItem.title;
    editBookAuthor.value = bookItem.author;
    editBookPages.value = bookItem.totalPages;
    editDueDate.value = formatDateForInput(new Date(bookItem.dueDate));

    editConfirmBtn.addEventListener("click", () => {
      editConfirm(bookId, bookItem);
    });
  };
}

function editConfirm(bookId, bookItem) {
  const transaction = db.transaction(["current"], "readwrite");
  const currentList = transaction.objectStore("current");

  const request = currentList.get(bookId);

  request.onsuccess = () => {
    bookItem.title = editBookTitle.value;
    bookItem.author = editBookAuthor.value;
    bookItem.totalPages = Number(editBookPages.value);
    bookItem.dueDate = new Date(editDueDate.value);
    if (
      bookItem.title == "" ||
      bookItem.author == "" ||
      bookItem.totalPages == "" ||
      bookItem.dueDate == ""
    ) {
      editMessage.style.color = "red";
      editMessage.textContent = "Please fill every field.";
      return;
    } else if (isNaN(bookItem.totalPages)) {
      editMessage.style.color = "red";
      editMessage.textContent = "Number of pages should be a number.";
      return;
    } else if (
      isNaN(bookItem.dueDate.getTime()) ||
      bookItem.dueDate.getTime() == null
    ) {
      editMessage.style.color = "red";
      editMessage.textContent = "Invalid date";
      return;
    }

    if (
      bookItem.totalPages < bookItem.completedPages ||
      bookItem.totalPages === bookItem.completedPages
    ) {
      bookItem.completedPages = 0;
      console.log("this executed");
    }

    const today = new Date();
    const putRequest = currentList.put(bookItem);

    putRequest.onsuccess = () => {
      if (
        !(Math.ceil((bookItem.dueDate - today) / (1000 * 60 * 60 * 24)) < 0)
      ) {
        console.log(
          `${bookId} updated successfully in list, and the new data is : `,
          bookItem
        );
        editMessage.style.color = "#2fc02f";
        editMessage.textContent = `${bookItem.title} edited successfully.`;
        editPopup.removeChild(editCancelBtn);
        editPopup.removeChild(editConfirmBtn);

        updateCurrentList();
        setTimeout(() => {
          editMessage.textContent = "";
          editPopup.appendChild(editCancelBtn);
          editPopup.appendChild(editConfirmBtn);
          popupHolder.removeChild(editPopup);
          editMessage.style.color = "white";
          popupHolder.style.display = "none";
        }, 1000);
      } else {
        const formattedDateToday = today.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        editMessage.style.color = "red";
        editMessage.textContent = `Due date must be greater than or equal to ${formattedDateToday}.`;
      }
    };
    putRequest.onerror = (event) => {
      console.error("Transaction error : ", event.target.error?.message);
      editMessage.style.color = "red";
      editMessage.textContent = `${bookItem.title} already exists in current reading list.`;
    };
  };
  request.onerror = (event) => {
    console.error("Transaction error : ", event.target.error?.message);
  };
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Returns "yyyy-MM-dd"
}

// delete book

// delete popup

const deletePopup = document.createElement("div");
deletePopup.classList.add("delete-popup");

const deletePopupMessage = document.createElement("h3");
deletePopupMessage.classList.add("delete-popup-message");

const deleteCancelBtn = document.createElement("button");
deleteCancelBtn.classList.add("delete-cancel-btn");
deleteCancelBtn.textContent = "Cancel";

const deleteConfirmBtn = document.createElement("button");
deleteConfirmBtn.classList.add("delete-confirm-btn");
deleteConfirmBtn.textContent = "Confirm";

deletePopup.appendChild(deletePopupMessage);
deletePopup.appendChild(deleteCancelBtn);
deletePopup.appendChild(deleteConfirmBtn);

deleteCancelBtn.addEventListener("click", () => {
  deleteCancel();
});

deleteConfirmBtn.addEventListener("click", () => {
  deleteConfirm(deletingBookId);
});

function deleteCancel() {
  deletePopupMessage.textContent = "";
  popupHolder.removeChild(deletePopup);
  popupHolder.style.display = "none";
}

function deleteConfirm(bookId) {
  const transaction = db.transaction(["current"], "readwrite");
  const currentStore = transaction.objectStore("current");

  const getRequest = currentStore.get(bookId);
  getRequest.onsuccess = () => {
    const bookItem = getRequest.result;

    const deleteRequest = currentStore.delete(bookId);
    deleteRequest.onsuccess = () => {
      deletePopupMessage.textContent = `${bookItem.title} deleted successfully.`;
      setTimeout(() => {
        deletePopupMessage.textContent = "";
        popupHolder.removeChild(deletePopup);
        popupHolder.style.display = "none";
      }, 1000);
      deleteRequest.onerror = (event) => {
        console.error("Transaction error : ", event.target.error?.message);
      };
    };
  };

  updateCurrentList();
}

function deleteCurrentBook(bookId) {
  deletingBookId = bookId;
  const transaction = db.transaction(["current"], "readwrite");
  const currentStore = transaction.objectStore("current");
  const getBookRequest = currentStore.get(bookId);
  getBookRequest.onsuccess = () => {
    const bookItem = getBookRequest.result;

    popupHolder.style.display = "block";
    popupHolder.appendChild(deletePopup);
    deletePopupMessage.textContent = `Delete " ${bookItem.title} " ?`;
  };
  getBookRequest.onerror = (event) => {
    console.error("Transaction error : ", event.target.error?.message);
  };
}

// wishlist

const wishlist = document.getElementById("wishlist");

// wishlist book element creator

function wishlistBookElementCreator(title, author, bookId) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("wishlist-book-element");

  const bookDetails = document.createElement("div");
  bookDetails.classList.add("wishlist-book-details");

  const bookTitle = document.createElement("h3");
  bookTitle.classList.add("wishlist-book-title");
  bookTitle.textContent = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("wishlist-book-author");
  bookAuthor.textContent = author;

  const removeFromWishlistBtn = document.createElement("button");
  removeFromWishlistBtn.classList.add("remove-from-wishlist");
  removeFromWishlistBtn.textContent = "Remove";
  removeFromWishlistBtn.addEventListener("click", () => {
    removeFromWishlist(bookId);
  });

  const moveToCurrentBtn = document.createElement("button");
  moveToCurrentBtn.classList.add("move-to-current");
  moveToCurrentBtn.textContent = "Start Reading";
  moveToCurrentBtn.addEventListener("click", () => {
    if (!db) {
      console.error("Database is not initialized yet.");
      return;
    }

    movingBookId = bookId;

    if (!movingBookId) {
      console.error("No book selected for moving");
      return;
    }

    const transaction = db.transaction(["wishlist"], "readonly");
    const wishlistObjectStore = transaction.objectStore("wishlist");

    const getRequest = wishlistObjectStore.get(movingBookId);
    getRequest.onsuccess = () => {
      popupHolder.style.display = "block";
      popupHolder.appendChild(moveToCurrentPopup);

      const bookItem = getRequest.result;

      moveToCurrentBookTitleInput.value = bookItem.title;
      moveToCurrentBookAuthorInput.value = bookItem.author;
    };
    getRequest.onerror = (event) => {
      console.error(
        "Failed to fetch book item from wishlist : ",
        event.target.error?.message
      );
    };
  });

  const wishlistActionBtn = document.createElement("div");
  wishlistActionBtn.classList.add("wishlist-action-btn");
  wishlistActionBtn.appendChild(removeFromWishlistBtn);
  wishlistActionBtn.appendChild(moveToCurrentBtn);

  bookDetails.appendChild(bookTitle);
  bookDetails.appendChild(bookAuthor);

  bookElement.appendChild(bookDetails);
  bookElement.appendChild(wishlistActionBtn);

  return bookElement;
}

// wishlist popup

const wishlistPopup = document.createElement("div");
wishlistPopup.classList.add("wishlist-popup");

const wishlistPopupHeader = document.createElement("h2");
wishlistPopupHeader.textContent = "Fill book details";

const wishlistTitleInput = document.createElement("input");
wishlistTitleInput.classList.add("wishlist-title-input");
wishlistTitleInput.placeholder = "Title";

const wishlistAuthorInput = document.createElement("input");
wishlistAuthorInput.classList.add("wishlist-author-input");
wishlistAuthorInput.placeholder = "Author (optional)";

const wishlistPopupActionBtn = document.createElement("div");
wishlistPopupActionBtn.classList.add("wishlist-popup-action-btn");

const wishlistPopupCancelBtn = document.createElement("button");
wishlistPopupCancelBtn.classList.add("wishlist-popup-cancel-btn");
wishlistPopupCancelBtn.textContent = "Cancel";
wishlistPopupCancelBtn.addEventListener("click", () => {
  wishlistTitleInput.value = "";
  wishlistAuthorInput.value = "";
  wishlistPopupMessage.textContent = "";
  wishlistPopupMessage.style.color = "white";
  popupHolder.removeChild(wishlistPopup);
  popupHolder.style.display = "none";
});

const wishlistPopupAddBtn = document.createElement("button");
wishlistPopupAddBtn.classList.add("wishlist-popup-add-btn");
wishlistPopupAddBtn.textContent = "Add";
wishlistPopupAddBtn.addEventListener("click", () => {
  addToWishlist();
});

wishlistPopupActionBtn.appendChild(wishlistPopupCancelBtn);
wishlistPopupActionBtn.appendChild(wishlistPopupAddBtn);

const wishlistPopupMessage = document.createElement("p");
wishlistPopupMessage.classList.add("wishlist-popup-message");

wishlistPopup.appendChild(wishlistPopupHeader);
wishlistPopup.appendChild(wishlistTitleInput);
wishlistPopup.appendChild(wishlistAuthorInput);
wishlistPopup.appendChild(wishlistPopupMessage);
wishlistPopup.appendChild(wishlistPopupActionBtn);

function wishlistPopupOpen() {
  popupHolder.style.display = "block";
  popupHolder.appendChild(wishlistPopup);
}

function addToWishlist() {
  if (!db) {
    console.error("Database not initialized yet.");
    return;
  }

  const bookTitle = wishlistTitleInput.value;
  let bookAuthor = "";
  if (!(wishlistAuthorInput.value === null)) {
    bookAuthor = wishlistAuthorInput.value;
  }
  if (!bookTitle) {
    wishlistPopupMessage.style.color = "red";
    wishlistPopupMessage.textContent = "Title cannot be empty!";
  } else {
    const transaction = db.transaction(["wishlist"], "readwrite");
    const objectStore = transaction.objectStore("wishlist");

    const newBook = new book(bookTitle, bookAuthor, "", "", "wishlist", "", "");

    const addRequest = objectStore.add(newBook);
    addRequest.onsuccess = () => {
      wishlistPopupMessage.style.color = "white";
      wishlistPopupMessage.textContent = `${bookTitle} added successfully to wishlist.`;
      // console.log(`New book added to wishlist, and it's data is : ${check.title} ${check.author} ${check.totalPages} ${check.completedPages} ${check.startingDate} ${check.dueDate} ${check.status}`);
      setTimeout(() => {
        wishlistPopupMessage.textContent = "";
        wishlistTitleInput.value = "";
        wishlistAuthorInput.value = "";
        popupHolder.removeChild(wishlistPopup);
        popupHolder.style.display = "none";
        updateWishlist();
      }, 1000);
    };
    addRequest.onerror = (event) => {
      console.error(
        "Failed to add to wishlist : ",
        event.target.errpr?.message
      );
    };
  }
}

function updateWishlist() {
  if (!db) {
    console.error("Database is not initialized yet.");
    return;
  }

  const transaction = db.transaction(["wishlist"], "readonly");
  const wishlistStore = transaction.objectStore("wishlist");

  const getallRequest = wishlistStore.getAll();
  getallRequest.onsuccess = () => {
    const wishlistBooks = getallRequest.result;

    wishlist.innerHTML = "";
    wishlistBooks.forEach((book) => {
      wishlist.insertBefore(
        wishlistBookElementCreator(book.title, book.author, book.bookId),
        wishlist.firstChild
      );
    });
  };
  getallRequest.onerror = (event) => {
    console.error("Failed to fetch wishlist : ", event.target.error?.message);
  };
}

function removeFromWishlist(bookId) {
  if (!db) {
    console.error("Database is not initialized yet.");
    return;
  }
  const transaction = db.transaction(["wishlist"], "readwrite");
  const wishlistStore = transaction.objectStore("wishlist");

  const deleteRequest = wishlistStore.delete(bookId);
  deleteRequest.onsuccess = () => {
    console.log("BookItem successfully deleted.");
    updateWishlist();
  };
  deleteRequest.onerror = (event) => {
    console.error("Failed to delete book : ", event.target.error?.message);
  };
}

// move to current popup

const moveToCurrentPopup = document.createElement("div");
moveToCurrentPopup.classList.add("move-to-current-popup");

const moveToCurrentPopupHeader = document.createElement("h2");
moveToCurrentPopupHeader.classList.add("move-to-current-popup-header");
moveToCurrentPopupHeader.textContent =
  "Fill the given details before proceeding";

const moveToCurrentBookTitleInput = document.createElement("input");
moveToCurrentBookTitleInput.classList.add("move-to-current-book-title-input");
moveToCurrentBookTitleInput.placeholder = "Title";

const moveToCurrentBookAuthorInput = document.createElement("input");
moveToCurrentBookAuthorInput.classList.add("move-to-current-book-author-input");
moveToCurrentBookAuthorInput.placeholder = "Author";

const moveToCurrrentBookTotalPagesInput = document.createElement("input");
moveToCurrrentBookTotalPagesInput.type = "number";
moveToCurrrentBookTotalPagesInput.classList.add(
  "move-to-current-book-totalpages"
);
moveToCurrrentBookTotalPagesInput.placeholder = "Total pages";

const moveToCurrentBookDueDateInput = document.createElement("input");
moveToCurrentBookDueDateInput.classList.add(
  "move-to-current-book-due-date-input"
);
moveToCurrentBookDueDateInput.type = "date";

const moveToCurrentActionBtn = document.createElement("div");
moveToCurrentActionBtn.classList.add("move-to-current-action-btn");

const moveToCurrentPopupMessage = document.createElement("p");
moveToCurrentPopupMessage.classList.add("move-to-current-popup-message");

const moveToCurrentCancelBtn = document.createElement("button");
moveToCurrentCancelBtn.classList.add("move-to-current-cancel-btn");
moveToCurrentCancelBtn.textContent = "Cancel";
moveToCurrentCancelBtn.addEventListener("click", () => {
  moveToCurrentBookTitleInput.value = "";
  moveToCurrentBookAuthorInput.value = "";
  moveToCurrrentBookTotalPagesInput.value = "";
  moveToCurrentBookDueDateInput.value = "";
  moveToCurrentPopupMessage.style.color = "white";
  moveToCurrentPopupMessage.textContent = "";
  popupHolder.removeChild(moveToCurrentPopup);
  popupHolder.style.display = "none";
});

const moveToCurrentStartBtn = document.createElement("button");
moveToCurrentStartBtn.classList.add("move-to-current-start-btn");
moveToCurrentStartBtn.textContent = "Start";
moveToCurrentStartBtn.addEventListener("click", () => {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const wishlistObjectStore = transaction.objectStore("wishlist");

  const getRequest = wishlistObjectStore.get(movingBookId);
  getRequest.onsuccess = () => {
    const bookItem = getRequest.result;
    moveToCurrent(bookItem, movingBookId);
  };
  getRequest.onerror = (event) => {
    console.error("Failed to fetch bookItem : ", event.target.error?.message);
  };
});

moveToCurrentActionBtn.appendChild(moveToCurrentCancelBtn);
moveToCurrentActionBtn.appendChild(moveToCurrentStartBtn);

moveToCurrentPopup.appendChild(moveToCurrentPopupHeader);
moveToCurrentPopup.appendChild(moveToCurrentBookTitleInput);
moveToCurrentPopup.appendChild(moveToCurrentBookAuthorInput);
moveToCurrentPopup.appendChild(moveToCurrrentBookTotalPagesInput);
moveToCurrentPopup.appendChild(moveToCurrentBookDueDateInput);
moveToCurrentPopup.appendChild(moveToCurrentPopupMessage);
moveToCurrentPopup.appendChild(moveToCurrentActionBtn);

function moveToCurrent(bookItem, bookId) {
  const dueDateTest = new Date(moveToCurrentBookDueDateInput.value);

  if (!db) {
    console.error("Database is not initialized yet.");
    return;
  }

  if (
    moveToCurrentBookTitleInput.value == "" ||
    moveToCurrentBookAuthorInput.value == "" ||
    moveToCurrrentBookTotalPagesInput.value == "" ||
    isNaN(dueDateTest.getTime())
  ) {
    moveToCurrentPopupMessage.style.color = "red";
    moveToCurrentPopupMessage.textContent =
      "Please fill all the details correctly.";

    return;
  } else if (Number(moveToCurrrentBookTotalPagesInput.value) <= 0) {
    moveToCurrentPopupMessage.style.color = "red";
    moveToCurrentPopupMessage.textContent =
      "Total pages must be a positive number.";
    console.log(Number(moveToCurrrentBookTotalPagesInput.value));

    return;
  } else if (
    Number(new Date(moveToCurrentBookDueDateInput.value)) <= new Date()
  ) {
    moveToCurrentPopupMessage.style.color = "red";
    moveToCurrentPopupMessage.textContent = "Please select a valid date.";

    return;
  } else if (isNaN(dueDateTest.getTime())) {
    moveToCurrentPopupMessage.style.color = "red";
    moveToCurrentPopupMessage.textContent = "Please select a date.";

    return;
  }

  bookItem.title = moveToCurrentBookTitleInput.value;
  bookItem.author = moveToCurrentBookAuthorInput.value;
  bookItem.totalPages = Number(moveToCurrrentBookTotalPagesInput.value);
  bookItem.completedPages = 0;
  bookItem.status = "current";
  bookItem.startingDate = new Date();
  bookItem.dueDate = new Date(moveToCurrentBookDueDateInput.value);

  const transaction = db.transaction(["current", "wishlist"], "readwrite");
  const currentObjectStore = transaction.objectStore("current");
  const wishlistObjectStore = transaction.objectStore("wishlist");

  const putRequest = currentObjectStore.put(bookItem);
  console.log(bookItem.bookId);
  putRequest.onsuccess = () => {
    moveToCurrentPopupMessage.style.color = "#2fc02f";
    moveToCurrentPopupMessage.textContent = `${bookItem.title} moved to Current Books. Happy reading :)`;
    const deleteRequest = wishlistObjectStore.delete(bookId);
    setTimeout(() => {
      moveToCurrentBookTitleInput.value = "";
      moveToCurrentBookAuthorInput.value = "";
      moveToCurrrentBookTotalPagesInput.value = "";
      moveToCurrentBookDueDateInput.value = "";
      moveToCurrentPopupMessage.style.color = "white";
      moveToCurrentPopupMessage.textContent = "";
      popupHolder.removeChild(moveToCurrentPopup);
      popupHolder.style.display = "none";
      updateWishlist();
      updateCurrentList();
    }, 500);
  };
  putRequest.onerror = (event) => {
    console.error("Transaction error : ", event.target.error?.message);
  };
}

// Completed list

function completedBookElementCreator(
  title,
  author,
  totalPages,
  completionDate,
  bookId
) {
  const completedBook = document.createElement("div");
  completedBook.classList.add("completed-book");

  const completedBookDetails = document.createElement("div");
  completedBookDetails.classList.add("completed-book-details");

  const completedBookTitle = document.createElement("h3");
  completedBookTitle.classList.add("completed-book-title");
  completedBookTitle.textContent = title;

  const completedBookAuthor = document.createElement("p");
  completedBookAuthor.classList.add("completed-book-author");
  completedBookAuthor.textContent = author;

  const completedBookTotalPages = document.createElement("p");
  completedBookTotalPages.classList.add("completed-book-totalpages");
  completedBookTotalPages.textContent = totalPages;

  const completedBookcompletionDate = document.createElement("p");
  completedBookcompletionDate.textContent = `Completed on : ${completionDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${completionDate
    .getMonth()
    .toString()
    .padStart(2, "0")}/${completionDate.getFullYear()}`;
  completedBookcompletionDate.classList.add("completed-book-completion-date");

  const completedBookActionBtn = document.createElement("div");
  completedBookActionBtn.classList.add("completed-book-actionbtn");

  const completedBookReadAgainBtn = document.createElement("button");
  completedBookReadAgainBtn.classList.add("completed-book-readagain-btn");
  completedBookReadAgainBtn.textContent = "Read again";
  completedBookReadAgainBtn.addEventListener("click", () => {
    readAgain(bookId);
  });

  const completedBookRemoveBtn = document.createElement("button");
  completedBookRemoveBtn.classList.add("completed-book-remove-btn");
  completedBookRemoveBtn.textContent = "Remove";
  completedBookRemoveBtn.addEventListener("click", () => {
    completedBookRemove(bookId);
  });

  completedBookActionBtn.appendChild(completedBookRemoveBtn);
  completedBookActionBtn.appendChild(completedBookReadAgainBtn);

  completedBookDetails.appendChild(completedBookTitle);
  completedBookDetails.appendChild(completedBookAuthor);
  completedBookDetails.appendChild(completedBookTotalPages);
  completedBookDetails.appendChild(completedBookcompletionDate);

  completedBook.appendChild(completedBookDetails);
  completedBook.appendChild(completedBookActionBtn);

  return completedBook;
}

const completedList = document.getElementById("completed");

function updateCompletedList() {
  if (!db) {
    console.error("database is not initialized yet.");
    return;
  }

  completedList.innerHTML = "";

  const transaction = db.transaction(["completed"], "readonly");
  const completedObjectStore = transaction.objectStore("completed");

  const getallRequest = completedObjectStore.getAll();
  getallRequest.onsuccess = () => {
    const completedBooks = getallRequest.result;

    completedBooks.forEach((book) => {
      completedList.insertBefore(
        completedBookElementCreator(
          book.title,
          book.author,
          book.totalPages,
          new Date(book.completionDate),
          book.bookId
        ),
        completedList.firstChild
      );
    });
  };
}

function completedBookRemove(bookId) {
  if (!db) {
    console.error("Database is not initialized yet.");
    return;
  }

  const transaction = db.transaction(["completed"], "readwrite");
  const objectStore = transaction.objectStore("completed");

  const deleteRequest = objectStore.delete(bookId);
  deleteRequest.onsuccess = () => {
    console.log(`${bookId} deleted from completed list.`);
    updateCompletedList();
  };
  deleteRequest.onerror = (event) => {
    console.error(`Failed to delete ${bookId} : `, event.target.error?.message);
  };
}

function readAgain(bookId) {
  if (!db) {
    console.error("Database is not initialized yet.");
    return;
  }

  const transaction = db.transaction(["completed"], "readonly");
  const completedObjectStore = transaction.objectStore("completed");

  const getRequest = completedObjectStore.get(bookId);
  getRequest.onsuccess = () => {
    const bookItem = getRequest.result;
    renewalMessage.textContent = "";
    renewalMessage.style.color = "white";
    bookRenewalPopup(bookItem, bookId);
  };
  getRequest.onerror = (event) => {
    console.error("Transaction error : ", event.target.error?.message);
  };
}

// book renewal popup

const renewalPopup = document.createElement("div");
renewalPopup.classList.add("renewal-popup");

const renewalPopupHeading = document.createElement("h2");
renewalPopupHeading.textContent = "Select due date";
renewalPopupHeading.classList.add("renewal-popup-heading");

const renewalNewDueDate = document.createElement("input");
renewalNewDueDate.type = "date";
renewalNewDueDate.classList.add("new-due-date");

const renewalMessage = document.createElement("p");
renewalMessage.classList.add("renewal-message");
renewalMessage.textContent = "";
renewalMessage.style.color = "white";

const renewalActionBtn = document.createElement("div");
renewalActionBtn.classList.add("renewal-action-btn");

const renewalCancelBtn = document.createElement("button");
renewalCancelBtn.classList.add("renewal-cancel-btn");
renewalCancelBtn.textContent = "Cancel";

const renewalConfirmBtn = document.createElement("button");
renewalConfirmBtn.textContent = "Confirm";
renewalConfirmBtn.classList.add("renewal-confirm-btn");

function bookRenewalPopup(bookItem, bookId) {
  renewalCancelBtn.addEventListener("click", () => {
    renewalNewDueDate.value = "";
    popupHolder.removeChild(renewalPopup);
    popupHolder.style.display = "none";
  });

  renewalConfirmBtn.addEventListener("click", () => {
    if (renewalNewDueDate.value === "") {
      renewalMessage.style.color = "red";
      renewalMessage.textContent = "Please select a due date.";
    } else if (new Date(renewalNewDueDate.value) <= new Date()) {
      renewalMessage.style.color = "red";
      renewalMessage.textContent = "Please select a valid date.";
    } else {
      bookItem.dueDate = new Date(renewalNewDueDate.value);
      bookRenewal(bookItem, bookId);
    }
  });

  renewalActionBtn.appendChild(renewalCancelBtn);
  renewalActionBtn.appendChild(renewalConfirmBtn);

  renewalPopup.appendChild(renewalPopupHeading);
  renewalPopup.appendChild(renewalNewDueDate);
  renewalPopup.appendChild(renewalMessage);
  renewalPopup.appendChild(renewalMessage);
  renewalPopup.appendChild(renewalActionBtn);

  popupHolder.style.display = "block";
  popupHolder.appendChild(renewalPopup);
}

function bookRenewal(bookItem, bookId) {
  const transaction = db.transaction(["current", "completed"], "readwrite");
  const currentObjectStore = transaction.objectStore("current");
  const completedObjectStore = transaction.objectStore("completed");

  bookItem.status = "current";

  const putRequest = currentObjectStore.put(bookItem);
  putRequest.onsuccess = () => {
    const deleteRequest = completedObjectStore.delete(bookId);
    deleteRequest.onsuccess = () => {
      renewalNewDueDate.value = "";
      renewalMessage.style.color = "#2fc02f";
      renewalMessage.textContent = "Book moved to current list successfully.";
      setTimeout(() => {
        renewalMessage.style.color = "white";
        renewalMessage.textContent = "";
        popupHolder.removeChild(renewalPopup);
        popupHolder.style.display = "none";
        updateCompletedList();
        updateCurrentList();
      }, 1500);
    };
  };
}
