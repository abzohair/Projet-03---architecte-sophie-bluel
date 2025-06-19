// -------------------------------- login avec le localStorage ------------------------
// const form = document.getElementById('loginForm');
// const errorMsg = document.querySelector('.login-error');


// form.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const email = form.email.value.trim();
//     const password = form.password.value.trim();

//     console.log('e-mail:', email);
//     console.log('password:', password);


//     // if (email === "zohair@mail.com" && password === "moimeme") {
//     //     localStorage.setItem("token", "fake-token");
//     //     alert("Connexion réussie !");
//     //     window.location.href = "/index.html";
//     // } else {
//     //     errorMsg.textContent = "Identifiants invalides";
//     // }
// });

// -------------------------------- login avec le backend ------------------------

const loginForm = document.getElementById('loginForm');
const errorMsg = document.querySelector('.login-error');

// changer le style du menu login cliqué
document.addEventListener('DOMContentLoaded', () => {
    const loginMenu = document.getElementById('loginMenu');
    if (loginMenu) {
        loginMenu.classList.add('active-login');
    }
});

// Afficher le mot de passe 
document.querySelector('.show-psw input').addEventListener('change', (e) => {
    const password = loginForm.password;

    e.target.checked ? password.type = 'text' :
        password.type = 'password';


})

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            localStorage.setItem('token', data.token)
            window.location.href = '/index.html'
        } else {
            errorMsg.textContent = "Erreur dans l'identifiant ou le mot de passe"

        }

    } catch (error) {
        console.error(error);
        errorMsg.textContent = 'Erreur dans le serveur'
    }

});
