// DE FÖRSTA ANVÄNDARNA

fetchUsers();

function fetchUsers() {
  fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(data => console.log(data))
}

// SKAPA ELEMENT
let logInBtn = document.createElement("button");
let logOutBtn = document.createElement("button");
let signUpBtn = document.createElement("button");
let logInForm = document.createElement("form");
let signUpForm = document.createElement("form");
let welcomeDiv = document.createElement("div");

document.querySelector("header").appendChild(welcomeDiv);

// GE KNAPPARNA TEXT
logInBtn.textContent = "Log In";
logOutBtn.textContent = "Log Out";
signUpBtn.textContent = "Sign Up";

// EVENT LISTENERS
logInBtn.addEventListener("click", logIn);
logOutBtn.addEventListener("click", logOut);
signUpBtn.addEventListener("click", signUp);

// KOLLA OM DET FINNS EN INLOGGAD ANVÄNDARE
if (localStorage.getItem("loggedIn") != undefined) {
  let currentUser = parseInt(localStorage.getItem("loggedIn"));
  // console.log(currentUser);
  console.log("typeof currentUser", typeof (currentUser));
  fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => {
      let users = data;
      console.log(data);

      let foundUser = users.find(el => el.userId == currentUser);
      let foundUserId = foundUser.userId;


      let userName = foundUser.userFirstName;

      // console.log(users[i].userId);
      // console.log(currentUser);
      if (foundUserId === currentUser) {
        welcomeDiv.innerHTML = `<p>Välkommen tillbaka ${userName}!</p>`;
      } else {
        document.querySelector("header").insertAdjacentElement("beforeend", logInBtn);
        document.querySelector("header").insertAdjacentElement("beforeend", signUpBtn);
        welcomeDiv.innerHTML = `<p>Hej! Vad vill du göra idag?</p>`;
      }


      document.querySelector("header").insertAdjacentElement("beforeend", logOutBtn);

    });
}

// LOGGA IN ANVÄNDARE
function logIn() {
  logOutBtn.remove();
  signUpBtn.remove();
  logInBtn.remove();
  console.log("nu ska användaren logga in");
  welcomeDiv.innerHTML = "";
  welcomeDiv.insertAdjacentHTML("afterbegin", `<input id = "userName" type="text" placeholder = "Användarnamn"><input id = "userPassword" type = "text" placeholder = "Lösenord"><button id = "submit">Skicka</button>`)

  let logInSubmitBtn = document.getElementById("submit");

  logInSubmitBtn.addEventListener("click", function () {

    let userNameInput = document.getElementById("userName").value;
    let userPasswordInput = document.getElementById("userPassword").value;

    // sessionStorage.setItem("currentloggedin", userNameInput);
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => {
        let storedUsers = data;
        console.log(data);


        for (let i = 0; i < storedUsers.length; i++) {
          if (userNameInput == storedUsers[i].userFirstName && userPasswordInput == storedUsers[i].userPassword) {
            console.log(storedUsers[i].userId);
            localStorage.setItem("loggedIn", JSON.stringify(storedUsers[i].userId));
            welcomeDiv.innerHTML = `<p>Välkommen tillbaka ${userNameInput}!`;
            console.log("Du är nu inloggad");
            document.querySelector("header").insertAdjacentElement("beforeend", logOutBtn)
            logOutBtn.addEventListener("click", logOut);
            return;
          }
        }
        welcomeDiv.insertAdjacentHTML("beforeend", `<p>Fel användarnamn eller lösenord!`);
        document.getElementById("userName").value = "";
        document.getElementById("userPassword").value = "";
        console.log("Fel användarnamn eller lösenord");
      })


  });

};

// LOGGA UT ANVÄNDARE
function logOut() {
  signUpBtn.remove();

  console.log("nu ska användaren logga ut");
  sessionStorage.removeItem("currentloggedin");
  console.log("Nu är du utloggad");
  welcomeDiv.innerHTML = `<p>Du är nu utloggad! Välkommen tillbaka!</p>`;
  logOutBtn.remove();
  document.querySelector("header").insertAdjacentElement("beforeend", logInBtn);
  document.querySelector("header").insertAdjacentElement("beforeend", signUpBtn);

};

// REGISTRERA NY ANVÄNDARE
function signUp() {
  logInBtn.remove();
  logOutBtn.remove();
  signUpBtn.remove();

  console.log("nu ska användaren registrera sig");
  welcomeDiv.innerHTML = "";
  welcomeDiv.insertAdjacentHTML("afterbegin", `<form id = "signUpForm"><input id = "userName" type="text" placeholder = "Användarnamn"><input id = "userPassword" type = "text" placeholder = "Lösenord"><button type = "submit">Skicka</button></form>`);

  let signUpForm = document.getElementById("signUpForm");

  signUpForm.addEventListener("submit", function (e) {

    e.preventDefault();
    let userName = document.getElementById("userName").value;
    let userPassword = document.getElementById("userPassword").value;

    let newUser = {
      userFirstName: userName,
      userPassword: userPassword,
      userId: Math.floor(Math.random() * 999999)
    };
    console.log(newUser);

    fetch("http://localhost:3000/users/new", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser, null, 2)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })

    // let getUsers = JSON.parse(localStorage.getItem("user"));
    // getUsers.push(newUser);
    // console.log(getUsers);

    // localStorage.setItem("user", JSON.stringify(getUsers));
    // sessionStorage.setItem("currentloggedin", userName);

    // console.log("users:", getUsers);
    document.getElementById("userName").value = "";
    document.getElementById("userPassword").value = "";
    welcomeDiv.innerHTML = `<p>Välkommen ${newUser.userFirstName}, du är nu registrerad och inloggad</p>`
    document.querySelector("header").insertAdjacentElement("beforeend", logOutBtn);
  });

};