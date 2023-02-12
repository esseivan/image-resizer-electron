const path = require('path');
const os = require('os');
const fs = require('fs');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const ResizeImg = require('resize-img');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

function createAboutWindow() {
  // Create the about window.
  const aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
  });

  // and load the index.html of the app.
  aboutWindow.loadFile(path.join(__dirname, 'renderer/about.html'));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  // Implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Remove mainWindow from memory on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
});

// Custom Menu template
const menu = [
  {
    //role: 'fileMenu', // Default File menu and submenus
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        click: app.quit,
        accelerator: 'CmdOrCtrl+W',
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: createAboutWindow,

      }
    ]
  },
]

// Respond to ipcRenderer image:resize
ipcMain.on('image:resize', (event, options) => {
  options.dest = path.join(os.homedir(), 'imageResizer');
  resizeImage(options);
})

// Resize the image
async function resizeImage({ imagePath, width, height, dest }) {
  try {
    const newPath = await ResizeImg(fs.readFileSync(imagePath),
      {
        width: +width, // +width to convert string to int
        height: +height,
      });

    // Create filename
    const filename = path.basename(imagePath);

    // Create dest folder if not exists
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Write file to dest
    fs.writeFileSync(path.join(dest, filename), newPath);

    // Send success to renderer
    mainWindow.webContents.send('image:done');

    // Open destination folder
    shell.openPath(dest);

  } catch (error) {
    console.log(error);
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
