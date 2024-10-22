document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let activeTab = tabs[0];
    let tabId = activeTab.id;
    let currentDomain = new URL(activeTab.url).hostname;
    let nodes = [];
    let links = [];

    nodes.push({ id: currentDomain, group: 1 });

    chrome.runtime.sendMessage({ message: "getThirdPartyDomains", tabId: tabId }, function(response) {
      if (response && response.length > 0) {
        response.forEach(function(domain) {
          nodes.push({ id: domain, group: 2 });
          links.push({ source: currentDomain, target: domain });
        });
      }
      generateGraph(nodes, links);
    });

    let summaryList = document.getElementById('summaryList');

    chrome.runtime.sendMessage({ message: "getPotentialThreats", tabId: tabId }, function(response) {
      let summaryList = document.getElementById('summaryList');
      if (response && response.length > 0) {
        response.forEach(function(threat) {
          let li = document.createElement('li');
          if (threat.type === 'server') {
            li.textContent = `Redirecionamento HTTP (${threat.statusLine}) para ${threat.url}`;
          } else if (threat.type === 'client') {
            li.textContent = `Redirecionamento do cliente via ${threat.method} para ${threat.url}`;
          }
          summaryList.appendChild(li);
        });
      } else {
        let li = document.createElement('li');
        li.textContent = "Nenhuma ameaça potencial detectada.";
        summaryList.appendChild(li);
      }
    });

    chrome.runtime.sendMessage({ message: "getLocalStorageOperations", tabId: tabId }, function(response) {
      let storageList = document.getElementById('storageList');
      if (response && response.length > 0) {
        response.forEach(function(operation) {
          let li = document.createElement('li');
          let action = operation.action.replace('localStorage', '');
          if (action === 'Set') {
            li.textContent = `SetItem: ${operation.key} = ${operation.value}`;
          } else if (action === 'Remove') {
            li.textContent = `RemoveItem: ${operation.key}`;
          } else if (action === 'Clear') {
            li.textContent = `Clear localStorage`;
          }
          storageList.appendChild(li);
        });
      } else {
        let li = document.createElement('li');
        li.textContent = "Nenhuma operação de armazenamento local detectada.";
        storageList.appendChild(li);
      }
    });

    chrome.runtime.sendMessage({ message: "getCookieData", tabId: tabId }, function(response) {
      let cookieList = document.getElementById('cookieList');
      if (response && response.length > 0) {
        let firstPartySession = 0;
        let firstPartyPersistent = 0;
        let thirdPartySession = 0;
        let thirdPartyPersistent = 0;

        response.forEach(function(cookie) {
          if (cookie.isThirdParty) {
            if (cookie.isSessionCookie) {
              thirdPartySession++;
            } else {
              thirdPartyPersistent++;
            }
          } else {
            if (cookie.isSessionCookie) {
              firstPartySession++;
            } else {
              firstPartyPersistent++;
            }
          }
        });

        let totalCookies = firstPartySession + firstPartyPersistent + thirdPartySession + thirdPartyPersistent;

        let liTotal = document.createElement('li');
        liTotal.textContent = `Total de Cookies: ${totalCookies}`;
        cookieList.appendChild(liTotal);

        let liFirstPartySession = document.createElement('li');
        liFirstPartySession.textContent = `Cookies de Primeira Parte (Sessão): ${firstPartySession}`;
        cookieList.appendChild(liFirstPartySession);

        let liFirstPartyPersistent = document.createElement('li');
        liFirstPartyPersistent.textContent = `Cookies de Primeira Parte (Persistentes): ${firstPartyPersistent}`;
        cookieList.appendChild(liFirstPartyPersistent);

        let liThirdPartySession = document.createElement('li');
        liThirdPartySession.textContent = `Cookies de Terceira Parte (Sessão): ${thirdPartySession}`;
        cookieList.appendChild(liThirdPartySession);

        let liThirdPartyPersistent = document.createElement('li');
        liThirdPartyPersistent.textContent = `Cookies de Terceira Parte (Persistentes): ${thirdPartyPersistent}`;
        cookieList.appendChild(liThirdPartyPersistent);
      } else {
        let li = document.createElement('li');
        li.textContent = "Nenhum cookie detectado.";
        cookieList.appendChild(li);
      }
    });

    chrome.runtime.sendMessage({ message: "getCanvasFingerprintDetections", tabId: tabId }, function(response) {
      let canvasList = document.getElementById('canvasList');
      if (response && response.length > 0) {
        response.forEach(function(detection) {
          let li = document.createElement('li');
          li.textContent = `Método ${detection.method} chamado em ${detection.url}`;
          canvasList.appendChild(li);
        });
      } else {
        let li = document.createElement('li');
        li.textContent = "Nenhuma tentativa de Canvas fingerprinting detectada.";
        canvasList.appendChild(li);
      }
    });
  });
});

function generateGraph(nodes, links) {
  const width = 600;
  const height = 400;

  const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(150))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", 2);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", 15)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded));

  const text = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("dx", 20)
      .attr("dy", ".35em")
      .text(function(d) { return d.id; });

  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  }

  function dragStarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragEnded(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
