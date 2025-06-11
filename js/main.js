// fetch data from API 
let projects;
init()
function init() {
    fetchCat()
    checkAdminMode()
    fetchWorks()
}
async function fetchWorks() {
    try {

        const respons = await fetch('http://localhost:5678/api/works')
        projects = await respons.json()
        displayWorks(projects)
        setFiltredcategory(projects)
        showDeleteModal(projects)
        // deleteLiteralyModal(projects)

    } catch (error) {
        console.log(error);

    }

}

async function fetchCat() {
    try {

        const respons = await fetch('http://localhost:5678/api/categories')
        const categories = await respons.json()
        displayCat(categories)

    } catch (error) {
        console.log(error);

    }

}

function displayCat(categories) {
    // ajouter le boutton "all" avant le foreach
    const btnAll = document.createElement('button')
    btnAll.textContent = 'Tous'
    btnAll.dataset.categoryId = 'all'

    document.getElementById('filters').appendChild(btnAll)
    categories?.forEach(cat => {
        const btn = document.createElement('button')
        btn.innerText = cat.name
        btn.dataset.categoryId = cat.id
        document.getElementById('filters').appendChild(btn)
    })


}


function displayWorks(projects) {

    const gallery = document.querySelector('.gallery')
    // init befor showing 
    gallery.innerText = ''

    projects?.map((project) => {

        const figure = document.createElement('figure')
        const img = document.createElement('img')
        let figcaption = document.createElement('figcaption')
        let picTitle = document.createTextNode(project.title)

        img.src = project.imageUrl
        img.alt = project.title

        figcaption.appendChild(picTitle)
        figure.appendChild(figcaption)
        figure.insertBefore(img, figcaption)

        gallery.appendChild(figure)

    })

}

// set filtering categories
function setFiltredcategory() {

    // active button 
    const buttons = document.querySelectorAll('.filters button')

    buttons.forEach(button => button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active-button'))
        button.classList.add('active-button')

        // filter picturs 
        const category = button.getAttribute('data-category-id')
        const filtredPics = projects.filter(picCategory => category === picCategory.category.id.toString())

        if (category === 'all') {
            console.log('projects');
            displayWorks(projects)
        }
        else {
            console.log(filtredPics);

            displayWorks(filtredPics)
        }


    }))

}

// click sur login pour aller la page login
const loginBtn = document.querySelector('.login-btn')

loginBtn.addEventListener('click', () => {
    window.location.href = '/login.html'

})

// // Gère l'affichage admin si connecté
function checkAdminMode() {

    const token = localStorage.getItem('token');
    if (token) {
        document.querySelector('.logout-btn').style.display = 'block';
        document.querySelector('.login-btn').style.display = 'none';
        document.querySelector('.filters').style.display = 'none';
        document.querySelector('.edit').style.cssText = `
        display: block;
        margin-bottom: 32px;
        border: none;
        cursor: pointer; 
        `
    } else {
        document.querySelector('.login-btn').style.display = 'block';
        document.querySelector('.edit').style.display = 'none';

    }
}

document.querySelector('.logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.href = '/index.html'
})

// ------------------------------ delete modal ---------------------------
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.querySelector('.delete-modal-close');

closeModal.addEventListener('click', () => {
    deleteModal.classList.remove('show')
})

function showDeleteModal(projects) {
    const picsToDelete = document.querySelector('.pics-to-delete');
    const openModal = document.getElementById('openModal');

    openModal.addEventListener('click', () => {
        deleteModal.classList.add('show')
        // init befor showing 
        picsToDelete.innerText = ''

        projects?.forEach((pic) => {
            const container = document.createElement('div')
            container.classList.add('img-container')

            const img = document.createElement('img')
            img.src = pic.imageUrl
            img.alt = pic.title

            const btn = document.createElement('button')
            btn.innerText = 'X'
            btn.className = 'delete-btn';
            btn.onclick = () => deletePhoto(pic.id, container);

            container.appendChild(img)
            container.appendChild(btn)
            picsToDelete.appendChild(container)


        })

    })

}

async function deletePhoto(id, element) {
    //  Ajoute ici ton appel à l’API (fetch ou axios DELETE)
    try {
        const token = localStorage.getItem('token')

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (response.ok) {
            console.log('Suppression réussie');
        } else {
            console.log('Erreur lors de la suppression');
        }

        console.log('Suppression de la photo ID:', id)
        element.remove()
        // await fetch(`/api/photos/${id}`, { method: 'DELETE' })

    } catch (error) {
        console.log(error);

    }

}

// transition to addModal in delete modal 
document.querySelector('.add-button').addEventListener('click', () => {
    document.querySelector('.add-modal').classList.add('show')
    deleteModal.classList.remove('show')

})

document.querySelector('.add-modal-return').addEventListener('click', () => {
    addModal.classList.remove('show')
    deleteModal.classList.add('show')

})

document.querySelector('.add-modal-close').addEventListener('click', () => {
    addModal.classList.remove('show')

})

// ------------------------------ delete modal ---------------------------