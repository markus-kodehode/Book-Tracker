// Get elements from HTML
const bookForm = document.querySelector("#book-form");
const bookInput = document.querySelector("#book-input");
const authorInput = document.querySelector("#author-input");
const categoryInput = document.querySelector("#category-input");
const ratingInput = document.querySelector("#rating-input");
const listContainer = document.querySelector("#list-container");

// Empty array where book data is to be stored
let books = [];

// Categories list
const categories = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Biography",
  "Science",
  "Other",
];

// Possible ratings
const ratings = ["No rating", "1", "2", "3", "4", "5"];

// Load data from localStorage
const storedBooks = localStorage.getItem("books");

if (storedBooks) {
  books = JSON.parse(storedBooks);
  renderList(books);
}

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookForm);

  // Trigger error if input fields are empty
  if (
    !formData.get("book-input") ||
    !formData.get("author-input") ||
    !formData.get("category-input")
  ) {
    showError("Please fill out all fields before you submit");
    return;
  }

  //Creates new book object and pushes it to books variable
  books.push({
    id: Date.now(),
    name: formData.get("book-input"),
    author: formData.get("author-input"),
    category: formData.get("category-input"),
    review: formData.get("review-input"),
    rating: formData.get("rating-input"),
  });
  renderList(books);
});

function renderList(bookArr) {
  // Clear local storage if task array is empty
  if (bookArr.length === 0) {
    localStorage.removeItem("books");
  }

  buildList(books);
  saveStateToLocalStorage();
}

function buildList(bookArr) {
  // Empty list
  while (listContainer.firstChild) {
    listContainer.firstChild.remove();
  }

  bookArr.forEach((book, i) => {
    // Create the task container
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("book-container");

    // Create the book name element
    const bookNameElem = document.createElement("input");
    bookNameElem.classList.add("book-name");
    bookNameElem.value = book.name;
    bookNameElem.readOnly = true;

    // Create the book author element
    const authorElem = document.createElement("input");
    authorElem.classList.add("book-author");
    authorElem.value = book.author;
    authorElem.readOnly = true;

    // Create the book category element
    const categoryElem = document.createElement("select");
    categoryElem.classList.add("book-category");
    categoryElem.disabled = true;
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      if (category === book.category) {
        option.selected = true;
      }
      categoryElem.appendChild(option);
    });

    // Create the rating score element
    const ratingElem = document.createElement("select");
    ratingElem.classList.add("book-rating");
    ratingElem.disabled = true;
    ratings.forEach((rating) => {
      const option = document.createElement("option");
      option.value = rating;
      option.textContent = rating !== ratings[0] ? rating + "/5" : "Not rated";
      if (rating === book.rating) {
        option.selected = true;
      }
      ratingElem.appendChild(option);
    });

    // Create the review element
    const reviewElem = document.createElement("p");
    reviewElem.classList.add("book-review");
    reviewElem.textContent = book.review;
    reviewElem.readOnly = true;

    // Add delete-button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      books = books.filter((b) => b.id !== book.id);
      bookContainer.remove();
      saveStateToLocalStorage();
    });

    // Add edit-button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      const isEditing = !bookNameElem.readOnly;

      // Save the updated values
      books[i].name = bookNameElem.value;
      books[i].author = authorElem.value;
      books[i].category = categoryElem.value;
      books[i].rating = ratingElem.value;
      books[i].review = reviewElem.textContent;
      saveStateToLocalStorage();

      // Toggle edit
      authorElem.readOnly = isEditing;
      bookNameElem.readOnly = isEditing;
      categoryElem.disabled = isEditing;
      ratingElem.disabled = isEditing;
      editButton.textContent = isEditing ? "Edit" : "Save";
    });

    // Button container inside the book container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Appends
    bookContainer.append(
      bookNameElem,
      authorElem,
      categoryElem,
      reviewElem,
      ratingElem,
      buttonContainer
    );
    buttonContainer.append(editButton, deleteButton);
    listContainer.prepend(bookContainer);
  });
}

function showError(message) {
  const modal = document.createElement("dialog");

  const errorMsg = document.createElement("p");
  errorMsg.textContent = message;
  const closeModal = document.createElement("button");
  closeModal.textContent = "Got it";
  modal.append(errorMsg, closeModal);
  document.body.append(modal);

  modal.showModal();
  window.addEventListener("click", () => {
    modal.close();
    window.removeEventListener("click", arguments.callee);
  });
}

function saveStateToLocalStorage() {
  // Serialize books array to JSON before storing to local storage
  localStorage.setItem("books", JSON.stringify(books));
}

// Delete all button
const deleteAllButton = document.createElement("button");
deleteAllButton.textContent = "Delete all";
deleteAllButton.classList.add("delete-all-button");
deleteAllButton.addEventListener("click", () => {
  books = []; // Clear books array

  // Ensure all containers are removed
  while (listContainer.firstChild) {
    listContainer.firstChild.remove();
  }

  // Save updated state and confirm
  saveStateToLocalStorage();
});

// Append delete all button
document.getElementsByTagName("header")[0].append(deleteAllButton);

// Append categories to category selection
categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categoryInput.appendChild(option);
});

// Append ratings to rating selection
ratings.forEach((rating) => {
  const option = document.createElement("option");
  option.value = rating;
  option.textContent = rating;
  ratingInput.appendChild(option);
});
