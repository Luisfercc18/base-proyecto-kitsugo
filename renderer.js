const campoURL = document.getElementById("url");

if (campoURL) {
  campoURL.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const valor = campoURL.value.trim();
      if (!valor) return;

      let urlFinal = valor;

      // Si no empieza con http(s), revisamos si parece una URL
      if (!/^https?:\/\//i.test(valor)) {
        if (/^[\w.-]+\.[a-z]{2,}/i.test(valor)) {
          // Parece un dominio, agregamos https://
          urlFinal = `https://${valor}`;
        } else {
          // Si no parece dominio, lo tratamos como búsqueda
          urlFinal = `https://www.google.com/search?q=${encodeURIComponent(valor)}`;
        }
      }

      window.electronAPI.irA(urlFinal);
    }
  });

  window.electronAPI.onUrlCambiada((nuevaURL) => {
    campoURL.value = nuevaURL;
  });
}
