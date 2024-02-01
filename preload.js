const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openURL: (url) => ipcRenderer.send("open-url", url),
  processURLs: (urls, cssSelector) =>
    ipcRenderer.send("process-urls", { urls, cssSelector }),
  openLoginURL: (loginUrl) => ipcRenderer.send("open-login-url", loginUrl),
});
