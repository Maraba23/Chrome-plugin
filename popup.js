document.addEventListener('DOMContentLoaded', function () {
    browser.storage.local.get('connections', function (data) {
      let connections = data.connections || [];
      let ul = document.getElementById('connections');
      connections.forEach((conn) => {
        let li = document.createElement('li');
        li.textContent = conn;
        ul.appendChild(li);
      });
    });
  });
  