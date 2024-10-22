(function() {
    let originalAssign = window.location.assign;
    let originalReplace = window.location.replace;
    let originalHrefSet = Object.getOwnPropertyDescriptor(Location.prototype, 'href').set;
  
    function reportRedirect(method, url) {
      chrome.runtime.sendMessage({
        message: "potentialClientRedirect",
        method: method,
        url: url,
        timeStamp: Date.now()
      });
    }
  
    window.location.assign = function(url) {
      reportRedirect('assign', url);
      return originalAssign.apply(this, arguments);
    };
  
    window.location.replace = function(url) {
      reportRedirect('replace', url);
      return originalReplace.apply(this, arguments);
    };
  
    Object.defineProperty(window.location, 'href', {
      set: function(url) {
        reportRedirect('href', url);
        return originalHrefSet.call(this, url);
      }
    });
  
    let originalSetItem = Storage.prototype.setItem;
    let originalRemoveItem = Storage.prototype.removeItem;
    let originalClear = Storage.prototype.clear;
  
    Storage.prototype.setItem = function(key, value) {
      chrome.runtime.sendMessage({
        message: "localStorageSet",
        key: key,
        value: value,
        url: window.location.href,
        timeStamp: Date.now()
      });
      return originalSetItem.apply(this, arguments);
    };
  
    Storage.prototype.removeItem = function(key) {
      chrome.runtime.sendMessage({
        message: "localStorageRemove",
        key: key,
        url: window.location.href,
        timeStamp: Date.now()
      });
      return originalRemoveItem.apply(this, arguments);
    };
  
    Storage.prototype.clear = function() {
      chrome.runtime.sendMessage({
        message: "localStorageClear",
        url: window.location.href,
        timeStamp: Date.now()
      });
      return originalClear.apply(this, arguments);
    };
  
    let originalSet = Object.getOwnPropertyDescriptor(Storage.prototype, 'setItem');
    if (originalSet && originalSet.writable) {
      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: Storage.prototype.setItem
      });
    }
  
    function interceptCanvasMethods() {
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function() {
        chrome.runtime.sendMessage({
          message: "canvasFingerprintDetected",
          method: "toDataURL",
          url: window.location.href,
          timeStamp: Date.now()
        });
        return originalToDataURL.apply(this, arguments);
      };
  
      const originalToBlob = HTMLCanvasElement.prototype.toBlob;
      HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
        chrome.runtime.sendMessage({
          message: "canvasFingerprintDetected",
          method: "toBlob",
          url: window.location.href,
          timeStamp: Date.now()
        });
        return originalToBlob.apply(this, arguments);
      };
  
      // Intercepta CanvasRenderingContext2D.prototype.getImageData
      const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
        chrome.runtime.sendMessage({
          message: "canvasFingerprintDetected",
          method: "getImageData",
          url: window.location.href,
          timeStamp: Date.now()
        });
        return originalGetImageData.apply(this, arguments);
      };
    }
  
    interceptCanvasMethods();
  
  })();
  