const barra = document.getElementById('url');
const botonIr = document.querySelector('button:last-of-type');
const barraInicio = document.getElementById('inputInicio'); // ID del input de la página de inicio
const botonBuscarInicio = document.getElementById('btnBuscar'); // ID del botón de buscar en la página de inicio

console.log('Bara', barraInicio);
console.log('Boton', botonBuscarInicio);

function procesarEntrada(entrada) {
    if (!entrada) return;

    entrada = entrada.trim();
    const esURL = /^https?:\/\/|\.|localhost/.test(entrada) && !/\s/.test(entrada);

    let urlFinal;

    if (esURL) {
        urlFinal = entrada.startsWith("http") ? entrada : "https://" + entrada;
    } else {
        urlFinal = `https://www.google.com/search?q=${encodeURIComponent(entrada)}`;
    }

    window.electronAPI.navegarA(urlFinal);
}

// Evento para botón "Ir" en barra principal
if (botonIr && barra) {
    botonIr.addEventListener('click', () => procesarEntrada(barra.value));
    barra.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') procesarEntrada(barra.value);
    });
}

// Evento para botón "Buscar" en página de inicio
if (botonBuscarInicio && barraInicio) {
    botonBuscarInicio.addEventListener('click', () => procesarEntrada(barraInicio.value));
    barraInicio.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') procesarEntrada(barraInicio.value);
    });
}

// Mostrar en la barra principal la URL actual
window.electronAPI.onUrlCambiada((url) => {
    console.log('URL CAMBIADA:', url);
    if (barra) barra.value = url;
});
