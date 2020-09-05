// these are intended to be the variety needed of calls to access local services,
// especially files, but also any needed items like dialogs and windows, for Hardocs

// the wisdom of Habitat managing them was shown in the accommodation effort for
// the recent version change of Electron. It's filesystem access is one of the portiongs
// that is most unstable across releases, and recent plans show this is going to become
// much more serious soon.

// we handle all such changes here, so that our Hardocs calls will remain stable and the same.

import fs from 'fs'
import path from 'path'
import electron from 'electron'

const { dialog, getCurrentWindow } = electron.remote
const rendWin = getCurrentWindow()


const getHtmlFromFile = () => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showOpenDialog(rendWin, {
          filters: [
            {name: 'Html Files', extensions: ['html']}
          ],
          properties: [
            'openFile',
            // 'openDirectory', // for later, implementing result
          ]
        })
        .then(file => {
          if (!file.canceled) {
            const fileName = file.filePaths[0]

            // n.b. error handling is funky here, within readFileSync()
            // errors will be returned as strings, just as content
            // *todo* thus we show them on screen, but should split out view as normal
            const content = fs.readFileSync(fileName, 'utf8')
            resolve({ path: fileName, content: content })
          } else {
            resolve({ path: '(Cancelled...)', content: '' })
          }
        })
    } else {
      reject('getHtmlFromFile:error: Not allowed to get file from browser')
    }
  })
}

const getHtmlFromPath = (filePath) => {
  return new Promise ((resolve) => {
    // n.b. error handling is funky here, within readFileSync()
    // errors will be returned as strings, just as content
    // *todo* thus we show them on screen, but should split out view as normal
    const content = fs.readFileSync(filePath, 'utf8')
    resolve({ path: filePath, content: content })
  })
}

const getFilesFromDir = (fileExt) => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showOpenDialog(rendWin, {
          filters: [],
          properties: [
            'openDirectory', // for later, implementing result
          ]
        })
        .then(dir => {
          if (!dir.canceled) {
            const dirPath = dir.filePaths[0]

            console.log ('dir: ' + JSON.stringify(dir))
            // n.b. error handling is funky here, a readFileSync()
            // errors will be returned as strings, just as content
            // *todo* thus we show them on screen, but should split out view as normal
            const files = fs.readdirSync(dirPath)
            let extFiles = []
            files.forEach(file => {
              console.log ('extname: ' + path.extname(file))
              if (path.extname(file) === fileExt) {
                console.log ('pushing ' + dirPath + '\\' + file)
                extFiles.push (dirPath + '\\' + file)
              }
            })
            resolve({ dirPath: dirPath, files: extFiles})
          } else {
            resolve({files: '(Cancelled...)'})
          }
        })
    } else {
      reject('getFilesFromDir:error: Not allowed to get file from browser')
    }
  })
}

const putHtmlToFile = (htmlData) => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showSaveDialog(rendWin, {
          message: 'Save your Html file here: ',
          properties: [
            'createDirectory ',
            'showOverwriteConfirmation ',
          ],
          filters: [
            {name: 'Html Files', extensions: ['html']}
          ],
        })
        .then(file => {
          if (!file.canceled) {
            const accomplished = fs.writeFileSync(file.filePath, htmlData, {
              encoding: 'utf8',
            });
            resolve({ path: file.filePath, success: accomplished })
          } else {
            resolve({ path: '(Cancelled...)', content: '' })
          }
        })
    } else {
      reject('putHtmlToFile:error: Not allowed to put file from browser')
    }
  })
}

const getJsonFromFile = () => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showOpenDialog(rendWin, {
          filters: [
            {name: 'JSON Files', extensions: ['json']}
          ],
          properties: [
            'openFile',
            // 'openDirectory', // for later, implementing result
          ]
        })
        .then(file => {
          if (!file.canceled) {
            const fileName = file.filePaths[0]

            // n.b. error handling is funky here, within readFileSync()
            // errors will be returned as strings, just as content
            // *todo* thus we show them on screen, but should split out view as normal
            const content = fs.readFileSync(fileName, 'utf8')
            resolve({ path: fileName, content: content })
          } else {
            resolve({ path: '(Cancelled...)', content: '' })
          }
        })
    } else {
      reject('findJsonFromFile:error: Not allowed to get file from browser')
    }
  })
}

const putJsonToFile = (jsonData) => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showSaveDialog(rendWin, {
          message: 'Save your Json file here: ',
          properties: [
            'createDirectory ',
            'showOverwriteConfirmation ',
          ],
          filters: [
            {name: 'JSON Files', extensions: ['json']}
          ],
        })
        .then(file => {
          if (!file.canceled) {
            const accomplished = fs.writeFileSync(file.filePath, jsonData, {
              encoding: 'utf8',
            });
            resolve({ path: file.filePath, success: accomplished })
          } else {
            resolve({ path: '(Cancelled...)', content: '' })
          }
        })
    } else {
      reject('putJsonToFile:error: Not allowed to put file from browser')
    }
  })
}

export {
  getFilesFromDir,
  getHtmlFromFile,
  getHtmlFromPath,
  putHtmlToFile,
  getJsonFromFile,
  putJsonToFile,
}
