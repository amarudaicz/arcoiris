export const SwtQuestion = Sweetalert2.mixin({
    icon: "question",
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: 'custom-sweetalert2'
});

export const SwtSuccess = Sweetalert2.mixin({
    icon: "success",
    showConfirmButton: false,
    toast: true,
    position: "bottom-right",
    timer: 5000,
    timerProgressBar: true,
    customClass: 'custom-sweetalert2'
});

export const SwtCartSuccess = Sweetalert2.mixin({
    icon: "success",
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    customClass: 'custom-sweetalert2',
    title: 'Solicitud enviada',
    text: 'Recibimos tu solicitud. Nos pondemos en contacto contigo a la brevedad. Gracias!'
});

export const SwtInfo = Sweetalert2.mixin({
    icon: "info",
    showConfirmButton: false,
    timer: 5000,
    toast: true,
    position: "bottom-right",
    timerProgressBar: true,
    customClass: 'custom-sweetalert2'
});

export const SwtError = Sweetalert2.mixin({
    icon: "error",
    showConfirmButton: false,
    toast: true,
    position: "bottom-right",
    timer: 5000,
    timerProgressBar: true,
    customClass: 'custom-sweetalert2'
});

