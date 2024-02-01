const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("process-urls", async (event, { urls, cssSelector }) => {
  for (const url of urls) {
    try {
      let win = new BrowserWindow({
        webPreferences: {
          contextIsolation: true,
          devTools: true,
        },
      });
      await win.loadURL(url);
      await win.webContents.executeJavaScript(
        // `alert('Hello from the browser!');`
        // `${cssSelector} && document.querySelector('${cssSelector}').click();`
        `
          function waitForElementToDisplay(selector, time) {
            if(document.querySelector(selector) !== null) {
              document.querySelector(selector).click();
            } else {
              setTimeout(function() {
                waitForElementToDisplay(selector, time);
              }, time);
            }
          }

          waitForElementToDisplay("${cssSelector}", 100); // 100ms 간격으로 버튼 존재 여부 확인
        `
      );
      win.close();
    } catch (error) {
      console.error("An error occurred:", error);
      // 필요한 경우 오류 처리 로직 추가
    }
  }
});

ipcMain.on("open-login-url", (event, loginUrl) => {
  let loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loginWindow.loadURL(loginUrl);
});
