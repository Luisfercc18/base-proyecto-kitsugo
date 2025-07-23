
const barra = document.getElementById('url');
const botonIr = document.querySelector('button:last-of-type');



botonIr.addEventListener('click', () => {
    let url = barra.value;
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    window.electronAPI.navegarA(url);
});


window.electronAPI.onUrlCambiada((url) => {
    console.log('URL CAMBIADA:', url);
    barra.value = url;
});