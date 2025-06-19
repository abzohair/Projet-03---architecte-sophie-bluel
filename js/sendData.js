import { fetchWorks } from './main.js';
import { warningMsg } from './docModals.js';

// ----- créer les options categories dynamiquement dans le formulaire ---------
export function displayCatOptions(categories) {
    const select = document.querySelector('.category');
    select.innerText = '';
    const firstOption = document.createElement('option');
    firstOption.value = '';
    firstOption.innerText = '-- Choisir --';
    select.appendChild(firstOption);
    console.log(select);


    // ajouter les boutons filtres dynamiquement
    categories?.forEach(cat => {
        const options = document.createElement('option');
        options.innerText = cat.name;
        options.setAttribute('value', cat.id.toString());
        select.appendChild(options);
        console.log(typeof options, options);
    })

}

// ------------- ENVOI DU FORMULAIRE ------------------------
const form = document.getElementById('uploadForm');

const fileInput = form.querySelector('input[type=file]');
const textInput = form.querySelector('input[type=text]');
const optionsInput = form.querySelector('.category');
export const submitBtn = form.querySelector('button');
const previewContainer = document.querySelector('.preview-container');

// Fonction de vérification des champs du form pour activer le bg buton submit
function checkFormCompletion() {
    const file = fileInput.files[0];
    const text = textInput.value.trim();
    const category = optionsInput.value;

    const isFileValid = file && file.type.startsWith('image/');
    const isTextValid = text.length > 0;
    const isCategoryValid = category !== '' && category !== '-- Choisir --';

    // Vérifie que tous les champs sont remplis correctement
    if (isFileValid && isTextValid && isCategoryValid) {
        submitBtn.style.background = '#3d9457';
        warningMsg.textContent = '';

    }
}

// Ajout d'événements de changement sur chaque input
fileInput.addEventListener('change', checkFormCompletion);
textInput.addEventListener('input', checkFormCompletion);
optionsInput.addEventListener('change', checkFormCompletion);

// select les éléments pour init l'input de type file
const listToDisplayNone = [
    document.querySelector('.preview-container i'),
    document.querySelector('.preview-container label'),
    document.querySelector('.preview-container p')
];

// afficher la photo à ajouter dans l'inputFile comme bg
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {

            previewContainer.style.cssText = `
            background: url(${e.target.result}) center/40% 100% no-repeat;
            background-color: rgba(0, 0, 255, 0.212);
            `
            listToDisplayNone.forEach(item => item.style.display = 'none');

            console.log(file);
        }
        reader.readAsDataURL(file);
    }

})

export function displayPreviewContainer() {

    fileInput.value = '';
    previewContainer.style.cssText = ``;
    listToDisplayNone.forEach(item => item.style.display = 'block');

}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formDataAddModal = new FormData(form);

    const image = formDataAddModal.get('image');
    const title = formDataAddModal.get('title').trim();
    const category = formDataAddModal.get('category');
    console.log(category);

    // Affichage du message d'erreur si un ou tout les champs sont vide
    if (!image || !image.name || !title || !category) {

        warningMsg.textContent = 'Les champs sont obligatoires';
        warningMsg.style.cssText = `
        color: red;
        margin-left: 61px;
        `;
        document.querySelector('.add-modal-content').appendChild(warningMsg);
        return;
    }

    console.log(typeof category);

    // Récuperer le token du localStorage
    const token = localStorage.getItem('token');
    console.log(token);

    // Envoie des données du formulaire avec "POST"
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Ne pas ajouter 'Content-Type', sinon FormData échoue
            },
            body: formDataAddModal
        });

        if (!response.ok) {
            throw new Error("Échec de l'envoi. Vérifiez votre token ou vos données.");
        }

        //L'envoie des données du formulaire c'est en même temps une création d'un nouveau projet
        const newProject = await response.json();
        console.log('Projet ajouté:', newProject);

        // Recharge de la galerie avec "await fetchWorks()"
        await fetchWorks()

        // Fermeture de la modale et réinitialisation du formulaire dynamiquement
        addModal.classList.remove('show');
        // form.reset();
        formReset()

        // init l'input file 
        displayPreviewContainer();

        // init bg bouton submit
        submitBtn.style.background = '#b6b6b6';

    } catch (error) {
        console.error(`Erreur lors de l'envoi: ${error}`);
        alert(`Erreur :   ${error.message}`);
    }

})

export function formReset() {
    return form.reset();
}