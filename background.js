let thirdPartyDomains = {};
let potentialThreats = {};
let localStorageOperations = {};
let cookieData = {};
let canvasFingerprintDetections = {};

function isThirdParty(requestDomain, tabDomain) {
  return (
    requestDomain !== tabDomain &&
    !requestDomain.endsWith('.' + tabDomain) &&
    !tabDomain.endsWith('.' + requestDomain)
  );
}

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    let tabId = details.tabId;
    if (tabId < 0) return; // Ignora se não for uma aba

    let responseHeaders = details.responseHeaders;
    let setCookieHeaders = responseHeaders.filter(
      header => header.name.toLowerCase() === 'set-cookie'
    );

    if (setCookieHeaders.length > 0) {
      if (!cookieData[tabId]) {
        cookieData[tabId] = [];
      }

      let requestUrl = new URL(details.url);
      let requestDomain = requestUrl.hostname;

      chrome.tabs.get(tabId, function(tab) {
        if (chrome.runtime.lastError || !tab) return;

        let tabUrl = new URL(tab.url);
        let tabDomain = tabUrl.hostname;

        setCookieHeaders.forEach(header => {
          let cookieString = header.value;
          let cookie = parseSetCookieHeader(cookieString);

          let isThirdPartyCookie = isThirdParty(requestDomain, tabDomain);
          let isSessionCookie = !cookie.expires && !cookie['max-age'];

          cookieData[tabId].push({
            name: cookie.name,
            domain: cookie.domain || requestDomain,
            path: cookie.path || '/',
            isThirdParty: isThirdPartyCookie,
            isSessionCookie: isSessionCookie,
            url: details.url
          });
        });
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

function parseSetCookieHeader(cookieString) {
  let cookie = {};
  let parts = cookieString.split(';');
  parts.forEach((part, index) => {
    let [key, value] = part.split('=');
    key = key.trim();
    if (index === 0) {
      cookie.name = key;
      cookie.value = value;
    } else {
      cookie[key.toLowerCase()] = value ? value.trim() : true;
    }
  });
  return cookie;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    let requestUrl = new URL(details.url);
    let requestDomain = requestUrl.hostname;
    let tabId = details.tabId;

    chrome.tabs.get(tabId, function(tab) {
      if (chrome.runtime.lastError || !tab) return;

      let tabUrl = new URL(tab.url);
      let tabDomain = tabUrl.hostname;

      if (isThirdParty(requestDomain, tabDomain)) {
        if (!thirdPartyDomains[tabId]) {
          thirdPartyDomains[tabId] = new Set();
        }
        thirdPartyDomains[tabId].add(requestDomain);
      }
    });
  },
  { urls: ["<all_urls>"] },
  []
);

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    let tabId = details.tabId;
    if (tabId < 0) return;

    if (details.statusLine.startsWith("HTTP/1.1 3") || details.statusLine.startsWith("HTTP/2 3")) {
      if (!potentialThreats[tabId]) {
        potentialThreats[tabId] = [];
      }
      potentialThreats[tabId].push({
        type: 'server',
        url: details.url,
        statusLine: details.statusLine,
        timeStamp: details.timeStamp
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let tabId = sender.tab ? sender.tab.id : null;

  if (request.message === "potentialClientRedirect") {
    if (!potentialThreats[tabId]) {
      potentialThreats[tabId] = [];
    }
    potentialThreats[tabId].push({
      type: 'client',
      method: request.method,
      url: request.url,
      timeStamp: request.timeStamp
    });
  } else if (request.message === "getThirdPartyDomains") {
    let domains = thirdPartyDomains[request.tabId] ? Array.from(thirdPartyDomains[request.tabId]) : [];
    sendResponse(domains);
    thirdPartyDomains[request.tabId] = new Set(); // Limpa após enviar
  } else if (request.message === "getPotentialThreats") {
    let threats = potentialThreats[request.tabId] ? potentialThreats[request.tabId] : [];
    sendResponse(threats);
    potentialThreats[request.tabId] = []; // Limpa após enviar
  } else if (request.message.startsWith("localStorage")) {
    if (!localStorageOperations[tabId]) {
      localStorageOperations[tabId] = [];
    }
    localStorageOperations[tabId].push({
      action: request.message,
      key: request.key || null,
      value: request.value || null,
      url: request.url,
      timeStamp: request.timeStamp
    });
  } else if (request.message === "getLocalStorageOperations") {
    let operations = localStorageOperations[request.tabId] ? localStorageOperations[request.tabId] : [];
    sendResponse(operations);
    localStorageOperations[request.tabId] = []; // Limpa após enviar
  } else if (request.message === "getCookieData") {
    let cookies = cookieData[request.tabId] ? cookieData[request.tabId] : [];
    sendResponse(cookies);
    cookieData[request.tabId] = []; // Limpa após enviar
  } else if (request.message === "canvasFingerprintDetected") {
    if (!canvasFingerprintDetections[tabId]) {
      canvasFingerprintDetections[tabId] = [];
    }
    canvasFingerprintDetections[tabId].push({
      method: request.method,
      url: request.url,
      timeStamp: request.timeStamp
    });
  } else if (request.message === "getCanvasFingerprintDetections") {
    let detections = canvasFingerprintDetections[request.tabId] ? canvasFingerprintDetections[request.tabId] : [];
    sendResponse(detections);
    canvasFingerprintDetections[request.tabId] = []; // Limpa após enviar
  }
});
