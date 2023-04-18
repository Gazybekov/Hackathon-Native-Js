let form1 = document.querySelector("#form1");
let inp1 = document.querySelector("#inp1");
let inp2 = document.querySelector("#inp2");
let inp3 = document.querySelector("#inp3");
let btn1 = document.querySelector("#btn1");
let btnCreate = document.querySelector("#btnCreate");
let inpSearch = document.querySelector("#inpSearch");
let filterValue = "Все";
let cardsContainer = document.querySelector(".cards-container");
let API = "http://localhost:8000/shop";
let currentPage = 1;
let pageLength = 1;
btnCreate.addEventListener("click", () => {
  form1.style.display = "block";
  form1.addEventListener("submit", (e) => {
    e.preventDefault();
    form1.style.display = "none";
    if (!inp1.value.trim() || !inp2.value.trim() || !inp3.value.trim()) {
      alert("Заполните все поля!");
      return;
    }

    // todo Создаём новый объект и туда добавляем значения наших инпутов

    let newProfile = {
      image: inp1.value,
      description: inp2.value,
      price: inp3.value,
    };
    createProfile(newProfile);
  });
});

// ! ========== CREATE ==========

async function createProfile(objProf) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objProf),
  });
  readProfile();
  let inputs = document.querySelectorAll("form input");
  inputs.forEach((elem) => {
    elem.value = "";
  });
}

// ! ========== READ ==========
async function readProfile(search = "") {
  let res =
    filterValue !== "Все"
      ? await fetch(
          `${API}?q=${search}&_page=${currentPage}&_limit=3&category=${filterValue}`
        )
      : await fetch(`${API}?q=${search}&_page=${currentPage}&_limit=3`);
  let data = await res.json();
  cardsContainer.innerHTML = "";
  data.forEach((elem) => {
    cardsContainer.innerHTML += `
    <div class="card-profile">
    <img src="${elem.image}"alt="картинка"/>
    <h4>${elem.description}</h4>
    <span>$${elem.price}</span>
    <button class="btn23" onclick="deleteProfile(${elem.id})">delete</button>
    <button class="btn23" onclick="showModalEdit(${elem.id})">edit</button>
  </div>
    `;
  });
  countPages();
}
readProfile();

//! ========== DELETE ==========
async function deleteProfile(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  readProfile();
}

//! ========== EDIT ==========

let form2 = document.querySelector("#form2");
let inpEdit1 = document.querySelector("#inpEdit1");
let inpEdit2 = document.querySelector("#inpEdit2");
let inpEdit3 = document.querySelector("#inpEdit3");
let btnEdit = document.querySelector("#btnEdit");
let closeBtn = document.querySelector("#closeEditModal");
let btnSave = document.querySelector("#btnSave");

async function showModalEdit(id) {
  form2.style.display = "block";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  inpEdit1.value = data.image;
  inpEdit2.value = data.description;
  inpEdit3.value = data.price;
  btnSave.setAttribute("id", data.id);
}
form2.addEventListener("submit", (e) => {
  e.preventDefault();
  let editProfile = {
    image: inpEdit1.value,
    description: inpEdit2.value,
    price: inpEdit3.value,
  };
  editProfileFunc(editProfile, btnSave.id);
});
async function editProfileFunc(editProfile, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editProfile),
    });
    form2.style.display = "none";
    readProfile();
  } catch (error) {
    console.error(error);
  }
}
closeBtn.addEventListener("click", () => {
  form2.style.display = "none";
});

//! ========== SEARCH ==========

inpSearch.addEventListener("input", (e) => {
  readProfile(e.target.value);
});

// ! ========== Pagination ==========
async function countPages() {
  let res = await fetch(API);
  let data = await res.json();
  pageLength = Math.ceil(data.length / 3);
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProfile();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= pageLength) return;
  currentPage++;
  readProfile();
});
