import { fetchWorks } from './main.js';
import { displayPreviewContainer, formReset, submitBtn } from './sendData.js';

// ------------------------------ close modal actions ---------------------------
const deleteModal = document.getElementById('deleteModal');
const addModal = document.getElementById('addModal');

const closeModalFirst = document.querySelector('.delete-modal');
const closeModalSecond = document.querySelector('.delete-modal-close');
const closeModalThird = document.querySelector('.add-modal');
const closeModalFourth = document.querySelector('.add-modal-close');

// init warning msg si le formlair n'est pas rempli pendant une relance
export const warningMsg = document.createElement('p');

const closeModalList = [closeModalFirst, closeModalSecond, closeModalThird, closeModalFourth];

closeModalList.forEach(close => {
    if (!close) return;

    close.onclick = () => {

        if (close === closeModalFirst || close === closeModalSecond) {
            deleteModal.classList.remove('show');
            warningMsg.textContent = '';
            displayPreviewContainer();
            formReset();
            submitBtn.style.background = '#b6b6b6';
        }

        if (close === closeModalThird || close === closeModalFourth) {
            addModal.classList.remove('show');
            warningMsg.textContent = '';
            displayPreviewContainer();
            formReset();
            submitBtn.style.background = '#b6b6b6';
        }
    }
}
)

const stopPropag = [
    document.querySelector('.delete-modal-content'),
    document.querySelector('.add-modal-content')
]
stopPropag.forEach(stop => {
    if (stop) {
        stop.onclick = (e) => e.stopPropagation();
    }
}

)

// aller à la modale d'ajout de projets 
document.querySelector('.add-button').addEventListener('click', () => {
    addModal.classList.add('show');
    deleteModal.classList.remove('show');

})
// revenir à la modale de suppréssion de projet 
document.querySelector('.add-modal-return').addEventListener('click', () => {
    addModal.classList.remove('show');
    deleteModal.classList.add('show');
    warningMsg.textContent = '';
    displayPreviewContainer();
    formReset();
    submitBtn.style.background = '#b6b6b6';
})

// // ------------------------------ delete modal ---------------------------
export function showDeleteModal(projects) {
    const picsToDelete = document.querySelector('.pics-to-delete');
    const openModal = [document.getElementById('openModal'), document.getElementById('openModalTwo')];

    openModal?.forEach(open => {
        open.addEventListener('click', () => {
            deleteModal.classList.add('show');
            // init avant d'afficher' 
            picsToDelete.innerText = '';

            projects?.forEach(pic => {
                const container = document.createElement('div');
                container.classList.add('img-container');

                const img = document.createElement('img');
                img.src = pic.imageUrl;
                img.alt = pic.title;

                const btn = document.createElement('button');
                // btn.innerText = 'X'
                btn.innerText = '🗑';
                btn.className = 'delete-btn';
                btn.onclick = () => {
                    if (confirm('La suppression est définitive. Etes-vous sur !')) {
                        deletePhoto(pic.id, container)
                    }

                };

                container.appendChild(img);
                container.appendChild(btn);
                picsToDelete.appendChild(container);


            })

        })
    })

}

async function deletePhoto(id, element) {
    //  Ajouter un appel à l’API (fetch  DELETE)
    try {
        const token = localStorage.getItem('token');

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

        console.log('Suppression de la photo ID:', id);
        element.remove();

        // Recharge de la galerie avec "await fetchWorks()"
        await fetchWorks();


    } catch (error) {
        console.log(error);

    }

}