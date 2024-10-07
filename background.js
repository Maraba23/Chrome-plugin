const firstPartyDomains = new Set();

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      const url = new URL(details.url);
      const currentDomain = details.originUrl ? new URL(details.originUrl).hostname : url.hostname;

      if (!firstPartyDomains.has(currentDomain)) {
        console.log(`Conexão de Terceira Parte Detectada: ${url.hostname}`);
        browser.notifications.create({
          "type": "basic",
          "iconUrl": browser.runtime.getURL("icons/icon.png"),
          "title": "Conexão de Terceiros",
          "message": `Conexão detectada com domínio: ${url.hostname}`
        });
      }
    } catch (error) {
      console.error(`Erro ao processar requisição: ${error.message}`);
    }
  },
  { urls: ["<all_urls>"] },
  []
);
