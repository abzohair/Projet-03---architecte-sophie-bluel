import { showDeleteModal } from './docModals.js';
import { displayCatOptions } from './sendData.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
    checkAdminMode();
    document.querySelector('.login-btn').addEventListener('click', () => {
        window.location.href = '/login.html';

    });
})

// appel des données via l'API 
let projects;
export async function fetchWorks() {
    try {
        const respons = await fetch('http://localhost:5678/api/works');
        projects = await respons.json();
        displayWorks(projects);
        setFiltredcategory(projects);
        showDeleteModal(projects);

    } catch (error) {
        console.log(error);

    }

}

// Afficher dynamiquement les projets appelés via l'api par fetchWorks()
function displayWorks(projects) {

    const gallery = document.querySelector('.gallery');
    // init avant d'afficher
    gallery.innerText = '';

    projects?.map((project) => {

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        let figcaption = document.createElement('figcaption');
        let picTitle = document.createTextNode(project.title);

        img.src = project.imageUrl;
        img.alt = project.title;

        figcaption.appendChild(picTitle);
        figure.appendChild(figcaption);
        figure.insertBefore(img, figcaption);

        gallery.appendChild(figure);

    })


}

async function fetchCat() {
    try {
        const respons = await fetch('http://localhost:5678/api/categories');
        const categories = await respons.json();
        displayCat(categories); //Boutons filtres callback
        displayCatOptions(categories); //tag <select> <option> </select> callback

    } catch (error) {
        console.log(error);

    }

}

function displayCat(categories) {
    // ajouter le boutton "all" avant l'ajout dynamique'
    const btnAll = document.createElement('button');
    btnAll.textContent = 'Tous';
    btnAll.dataset.categoryId = 'all';
    btnAll.classList.add('active-button');
    document.getElementById('filters').appendChild(btnAll);

    // ajouter les boutons filtres dynamiquement
    categories?.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat.name;
        btn.dataset.categoryId = cat.id;
        document.getElementById('filters').appendChild(btn);
    })

}

// Filtrer dynamiquement les projets appelés par l'api avec l'option active bouton
async function setFiltredcategory(projects) {

    try {
        // les boutons pour categories ne sont pas encore créés dans le document, 
        // on les attend ici avant de les manipuler
        await fetchCat();

        // active button 
        const buttons = document.querySelectorAll('.filters button');

        buttons?.forEach(button => button.addEventListener('click', () => {
            buttons?.forEach(btn => btn.classList.remove('active-button'));
            button.classList.add('active-button');

            // filter les photos par catégorie 
            const category = button.getAttribute('data-category-id');
            const filtredPics = projects.filter(picCategory =>
                category === picCategory.category.id.toString()
            );

            if (category === 'all') {
                displayWorks(projects);
            }
            else {
                displayWorks(filtredPics);
            }

        }))
    } catch (error) {
        console.log(error);

    }

}

// Gérer l'affichage admin si connecté
function checkAdminMode() {

    const token = localStorage.getItem('token');
    if (token) {
        document.querySelector('.logout-btn').style.display = 'block';
        document.querySelector('.login-btn').style.display = 'none';
        document.querySelector('.filters').style.display = 'none';
        document.querySelector('.edition-mode').style.display = 'block';
        document.querySelector('.logo-menu').style.marginTop = '30px';
        document.querySelector('#portfolio h2').style.marginRight = '27px';
        document.querySelector('.edit').style.cssText = `
        display: block;
        border: none;
        cursor: pointer; 
        `
    } else {
        document.querySelector('.login-btn').style.display = 'block';
        document.querySelector('.edit').style.display = 'none';
        document.querySelector('#portfolio span').style.display = 'none';
        document.querySelector('.projects-edit').style.marginBottom = '45px';

    }
}

document.querySelector('.logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});