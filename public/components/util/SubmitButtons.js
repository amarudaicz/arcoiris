export function enableSubmitButton(button) {
    button.disabled = false;
    button.children[0].classList.add('d-none');
}

export function disableSubmitButton(button) {
    button.disabled = true;
    button.children[0].classList.remove('d-none');
}

export function enableEntryButton(button) {
    button.disabled = false;
    button.children[0].classList.remove('d-none');
    button.children[1].classList.add('d-none');
}

export function disableEntryButton(button) {
    button.disabled = true;
    button.children[0].classList.add('d-none');
    button.children[1].classList.remove('d-none');
}