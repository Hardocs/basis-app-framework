// localservices are intended to be the variety needed of calls to access
// local abilities through Electro nor Hardocs, like files in various direct or by dialog
// ways, but later also any further items if needed, such as app dialogs and windows.
// These last are not implemented yet, but will be according to need.

// You should always access local services through this Habitat interface module.
// The wisdom of Habitat managing them was already shown in the accommodation effort for
// the recent version change of Electron. Its filesystem access is one of the portions
// that is most unstable across releases, and recent plans show this is going to become
// much more serious in the near future.

// We'll take care of it here, when it's time, and Hardocs apps will then
// need no changes, remain stable as you've written them.

// n.b. note the simple pathed file calls are last; calls with selection dialogs come first

import fs from 'fs'
import path from 'path'
import electron from 'electron'

const { dialog, getCurrentWindow } = electron.remote
const rendWin = getCurrentWindow()

const servicesLogging = true // *todo* for now - later false thus optional
const servicesLog = (msg) => {
  if (servicesLogging) {
    console.log('services: ' + msg)
  }
}

const SelectContentFromFolder = (fileExts = 'html', typeName = 'NONE') => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showOpenDialog(rendWin, {
          filters: [
            {name: typeName, extensions: [fileExts]}
          ],
          properties: [
            'openFile',
            // 'openDirectory', // for later, implementing result
          ]
        })
        .then(file => {
          if (!file.canceled) {
            // only a single file -- use the folder version to get many
            const fileName = file.filePaths[0]

            // n.b. error handling is funky here, within readFileSync()
            // errors will be returned as strings, just as content
            // *todo* thus we show them on screen, but should split out view as normal
            const content = fs.readFileSync(fileName, 'utf8')
            resolve({ path: fileName, content: content })
          } else {
            reject({ path: '(Cancelled...)', content: '' })
          }
        })
        .catch (e => {
          reject ('SelectContentFromFolder: ' + e.toString())
        })
    } else {
      reject('SelectContentFromFile:error: Not allowed.')
    }
  })
}

// n.b. you can get one or more types of files - fileExts is a Regex expression
// since we are looking only at extensions, simple naming of them will work
const getFilesFromFolder = (fileExts = 'html|htm') => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showOpenDialog(rendWin, {
          properties: [
            'openDirectory', // for later, implementing result
          ]
        })
        .then(folder => {
          if (!folder.canceled) {
            const folderPath = folder.filePaths[0]
            servicesLog ('getFilesFromFolder: ' + JSON.stringify(folderPath))
            try {
              const files = fs.readdirSync(folderPath)
              const extsMatch = new RegExp(fileExts,"g")
              let extFiles = []

              files.forEach(file => {
                if (path.extname(file).match(extsMatch)) {
                  // servicesLog ('pushing ' + folderPath + '\\' + file)
                  extFiles.push (folderPath + '\\' + file)
                }
              })
              resolve({ folderPath: folderPath, files: extFiles})
            } catch (e) {
              reject ('getFilesFromFolder: ' + e.toString())
            }
          } else {
            reject ({getFilesFromFolder: '(Cancelled...)'})
          }
        })
    } else {
      reject('getFilesFromFolder:error: Not allowed')
    }
  })
}

const putContentToFolder = (content,
                            proposedFilename = 'edited',
                            fileExt = 'html',
                            fileDescription = 'Html Files') => {
  return new Promise ((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showSaveDialog(rendWin, {
          defaultPath: proposedFilename,
          message: 'Save your file here: ',
          properties: [
            'createDirectory ',
            'showOverwriteConfirmation ',
          ],
          filters: [
            { name: fileDescription, extensions: [fileExt]}
          ],
        })
        .then(file => {
          if (!file.canceled) {
            const accomplished = fs.writeFileSync(file.filePath, content, {
              encoding: 'utf8',
            });
            resolve({ path: file.filePath, success: accomplished })
          } else {
            reject ({ path: '(Cancelled...)', content: '' })
          }
        })
        .catch (e => {
          reject ('putContentToFolder: ' + e.toString())
        })

    } else {
      reject('putHtmlToFile:error: Not allowed.')
    }
  })
}

const getContentFromFilePath = (filePath) => {
  return new Promise ((resolve, reject) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      resolve({ path: filePath, content: content })
    } catch (e) {
      reject ('getContentFromFilePath: ' + e.toString())
    }
  })
}

const putContentToFilePath = (filePath, content) => {
  return new Promise ((resolve, reject) => {
    try {
      fs.writeFileSync(filePath, content,'utf8')
      resolve({ ok: true })
    } catch (e) {
      reject('putContentToFilePath: ' + e.toString())
    }
  })
}

export {
  getFilesFromFolder,
  SelectContentFromFolder,
  putContentToFolder,
  getContentFromFilePath,
  putContentToFilePath
}
