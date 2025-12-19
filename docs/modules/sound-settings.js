import { soundModal, } from "./dom-manager.js";
import { selectSound } from "./sound-loader.js";

/* Логика модалки */

soundModal.addEventListener('click', (e) => {
    const clickedElement = e.target;

    /* const selectBtn = clickedElement.closest('.sound-select-btn'); */

    if (clickedElement.closest('.sound-select-btn')) {
        openSoundDropdown(e);
    } else if (!clickedElement.matches('.sound-select-btn, .dropdown-item')) {
        closeAllDropdown();
    } else if (clickedElement.closest('.dropdown-item')) {
        const dropdownItem = clickedElement.closest('.dropdown-item');
        selectSound(dropdownItem);
    }
})

export function openSoundDropdown(event) {
    const button = event.target.closest('.sound-select-btn')
    const mode = button.dataset.mode;

    closeAllDropdown();
    const dropdown = document.querySelector(`.sound-dropdown[data-mode="${mode}"]`)
    console.log(dropdown);
    dropdown.classList.add('sound-dropdown--active');
}

export function closeAllDropdown() {
    const dropdowns = document.querySelectorAll('.sound-dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('sound-dropdown--active');
    })
}

export function toggleSoundModal() {
    const closed = !soundModal.classList.contains('sound-modal--active')

    soundModal.classList.toggle('sound-modal--active');

    if (closed) {
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                toggleSoundModal();
            }
        })
    } else {
        document.removeEventListener('click', handleOutsideClick)
        soundModal.classList.remove('sound-modal--active');
    }
    /*  */

}

function handleOutsideClick(e) {
    const soundButton = document.querySelector('.sidebar__button--sound-settings');

    if (!soundModal.contains(e.target) && e.target !== soundButton) {
        toggleSoundModal();
        console.log('dsdsa')
    }
}

/* Выбор мелодий */

let soundConfig = {
    sounds: {
        'bell': { name: 'bell', file: 'sounds/achivementBell.wav' },
        'arcade': { name: 'arcade', file: '' },
        'final fantasy': { name: 'final fantasy', file: '' },
    },
    defaultMelodies: {
        work: 'bell',
        break: 'arcade',
    },
    current: {}
}