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
import {spawn} from 'child_process'
// const child_process = require('child_process')
// // const spawn = child_process.spawn

const { dialog, getCurrentWindow } = electron.remote
const rendWin = getCurrentWindow()

const servicesLogging = true // *todo* for now - later false thus optional

const servicesLog = (msg, force = false) => {
  if (servicesLogging || force) {
    console.log('services: ' + msg)
  }
}

const SelectContentFromFolder = (fileExts = 'html', typeName = 'NONE') => {
  return new Promise((resolve, reject) => {
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
            resolve({path: fileName, content: content})
          } else {
            reject({path: '(Cancelled...)', content: ''})
          }
        })
        .catch(e => {
          reject('SelectContentFromFolder: ' + e.toString())
        })
    } else {
      reject('SelectContentFromFile:error: Not allowed.')
    }
  })
}

// n.b. you can get one or more types of files - fileExts is a Regex expression
// since we are looking only at extensions, simple naming of them will work

const loadFilesFromFolder = (folderPath, fileExts = 'html|htm') => {
  return new Promise((resolve, reject) => {
    servicesLog('loadFilesFromFolder: ' + JSON.stringify(folderPath))
    try {
      const files = fs.readdirSync(folderPath)
      const extsMatch = new RegExp(fileExts, "g")
      let extFiles = []

      files.forEach(file => {
        if (path.extname(file).match(extsMatch)) {
          // servicesLog ('pushing ' + folderPath + '\\' + file)
          extFiles.push(folderPath + '\\' + file)
        }
      })
      resolve({ folderPath: folderPath, files: extFiles })
    } catch (e) {
      reject({ loadFilesFromFolder: 'error: ' + e.toString() })
    }
  })
}

const getFilesFromFolder = (fileExts = 'html|htm') => {
  return new Promise((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showOpenDialog(rendWin, {
          properties: [
            'openDirectory', // for later, implementing result
          ]
        })
        .then(folder => {
          if (!folder.canceled) {
            const folderPath = folder.filePaths[0]
            servicesLog('getFilesFromFolder: ' + JSON.stringify(folderPath))
            loadFilesFromFolder(folderPath, fileExts)
              .then (result => {
                resolve(result)
              })
              .catch(e => {
                reject('getFilesFRomFolder: ' + e)
              })
          } else {
            reject({getFilesFromFolder: '(Cancelled...)'})
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
  return new Promise((resolve, reject) => {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== null) {
      dialog.showSaveDialog(rendWin, {
          defaultPath: proposedFilename,
          message: 'Save your file here: ',
          properties: [
            'createDirectory ',
            'showOverwriteConfirmation ',
          ],
          filters: [
            {name: fileDescription, extensions: [fileExt]}
          ],
        })
        .then(file => {
          if (!file.canceled) {
            const accomplished = fs.writeFileSync(file.filePath, content, {
              encoding: 'utf8',
            });
            resolve({path: file.filePath, success: accomplished})
          } else {
            reject({path: '(Cancelled...)', content: ''})
          }
        })
        .catch(e => {
          reject('putContentToFolder: ' + e.toString())
        })

    } else {
      reject('putHtmlToFile:error: Not allowed.')
    }
  })
}

const getContentFromFilePath = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      resolve({path: filePath, content: content})
    } catch (e) {
      reject('getContentFromFilePath: ' + e.toString())
    }
  })
}

const putContentToFilePath = (filePath, content) => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(filePath, content, 'utf8')
      resolve({ok: true})
    } catch (e) {
      reject('putContentToFilePath: ' + e.toString())
    }
  })
}

const shellProcess = (childPath, args = [], options = {}) => {

  return new Promise((resolve, reject) => {
    let shellErrs = ''

    try {
      // console.log('dirname: ' + __dirname)
      // console.log('childPath: ' + childPath)
      let shellChild = spawn(childPath, args, options)
      // note that we could have own options, if we want own control
      options = Object.assign(options, {
          // things we control from and for here
          stdio: ['pipe', 'pipe', 'pipe', 'ipc']
        },
      )
      shellChild.on('message', (ret) => {
        console.log('shellChild message: ' + ret)
      })
      shellChild.stdout.on('data', (ret) => {
        servicesLog('shellChild stdout: ' + ret)
      })
      shellChild.stderr.on('data', (ret) => {
        shellErrs += ret
        servicesLog('shellChild stderr: ' + ret)
      })

      // *todo* still in discovery here, if it all does work well.
      // Appears a while that the close event may not reliable if there are errors.
      // However, it looks now that this was just a dev hot updates problem.
      // The next step is then buffering up stderr and stdout, deciding in the end
      // to reject also if stderr, as Pandoc prints useful warnings. Or resolve with them?
      shellChild.on('close', ret => {
        // console.log ('shellChild close: ' + ret)
        if (ret === 0) {
          resolve('succeeded')
        } else {
          reject('failed: ' + shellErrs)
        }
      })
    } catch (e) {
      reject('shellProcess: ' + e.toString())
    }
  })
}

export {
  getFilesFromFolder,
  loadFilesFromFolder,
  SelectContentFromFolder,
  putContentToFolder,
  getContentFromFilePath,
  putContentToFilePath,
  shellProcess
}
