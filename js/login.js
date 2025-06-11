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


const form = document.getElementById('loginForm');
const errorMsg = document.querySelector('.login-error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

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
            console.log('ma kayen walo');
            errorMsg.textContent = 'Erreur dans l’identifiant ou le mot de passe'

        }

    } catch (error) {
        console.log(error);
        errorMsg.textContent = 'Erreur dans le serveur'
    }


});
