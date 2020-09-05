// this is the module for all data requests (and any saves) for Hardocs apps.
//
// It abstracts and simplifies any interaction with the filesystem or database.

// Lots of important n.b. follow...

// Ths layer enables different habutat-database drivers to be used in future,
// employing for example CombatCovid or other security motifs, without changes
// to Hardocs application code, a primary reason to use it.

// We must always be Promises in here -- because the UX will need that.
// Data is never returned at the time called; it is always by callbacks,
// in event time, not clock time. Thus we reflect this back, and the promise
// eventual results are put right into the UX data, to be immediately displayed.

// we never use async/await, because we want the UX to respond. That its
// fresh data comes later after action to prepare for it, is natural, is expected.

import {
  createOrOpenDb, getStatusFromDb,
  getJsonFromDb, putJsonToDb,
  destroyDb // *todo* out later
} from '@/modules/habitat-database'

import fs from 'fs'
import path from 'path'
import electron from 'electron'

const { dialog, getCurrentWindow } = electron.remote
const rendWin = getCurrentWindow()

const loadFromDatabase =  (owner = 'hardOwner', project = 'firstProject',
                           dbName = 'hardocs-projects', ) => {
  return new Promise ((resolve, reject) => {
    const db = createOrOpenDatabase(dbName)
    getStatusOfDatabase(db)
      .then (result => {
        console.log ('loadFromDatabase:status: ' + JSON.stringify(result))
        return result
      })
      .then (() => {
        return getJsonFromDatabase(db, keyFromParts(owner, project))
      })
      .then (result => {
        console.log('loadFromDatabase:result: ' + JSON.stringify(result))
        resolve (result)
      })
      .catch (err => {
        console.log ('loadFromDatabase:error: ' + JSON.stringify(err))
        reject (err)
      })
  })
}

const storeToDatabase = (owner, project,
                        data = {}, dbName = 'hardocs-projects') => {

  return new Promise ((resolve, reject) => {
    const db = createOrOpenDatabase(dbName)
    getStatusOfDatabase(db)
      .then (result => {
        console.log ('storeToDatabase:status: ' + JSON.stringify(result))
        // console.log ('storeToDatabase:data: ' + JSON.stringify(data))
        return upsertProjectToDatabase(db, owner, project, data)
      })
      .then(result => {
        // console.log ('storeToDatabase:upsert ' + JSON.stringify(result))
        if (!result.ok) { // errors won't throw of themselves, thus we test
          reject (result)
        }
        resolve (result)
      })
      .catch (err => {
        console.log ('storeToDatabase:error: ' + err)
        reject (err)
      })
  })
}

// *todo* n.b. this will not be a user-available call in the real Hardoces!!
// it is dangerous, and we are providing temporarily only to make development modeling experiments easy
// *todo* it will be removed soon, finding a place on the protected cloud side only
const clearDatabase = (dbName = 'hardocs-projects') => {
  return new Promise ((resolve, reject) => {

    if (dbName.includes('http')) {
      reject ('no clearing of remote databases, ever!! Only local, for development testing')
    }

    const db = createOrOpenDatabase(dbName)
    getStatusOfDatabase(db)
      .then (result => {
        console.log ('clearDatabase:status: ' + JSON.stringify(result))
        // console.log ('clearDatabase:data: ' + JSON.stringify(data))
        return destroyDb(db)
      })
      .then(result => {
        // console.log ('clearDatabase:upsert ' + JSON.stringify(result))
        // if (!result.ok) { // errors won't throw of themselves, thus we test
        //   reject (result)
        // }
        resolve (result)
      })
      .catch (err => {
        console.log ('clearDatabase:error: ' + err)
        reject (err)
      })
  })
}

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

const createOrOpenDatabase = (dbName, locale = 'electron-browser') => {
  let db = null
  switch(locale) {
    case 'electron-browser':
      db = createOrOpenDb(dbName)
      break

    case 'lab-local':
    case 'cloud-reach':
    default:
      throw new Error ('only electron-browser-local database at present...')
      // lint, huh...
      // break
  }
  return db
}

const upsertProjectToDatabase = (db, owner, name, data) => {
  // *todo* seems to work as expected, but is a little different from lib - check
  return new Promise ((resolve, reject) => {
    const id = keyFromParts(owner, name)
    let projectData = {
      _id: id,
      owner: owner,
      name: name,
      data: data
    }
    // first, see if we have the project already
    getJsonFromDatabase(db, id)
      .then(result => {
        // console.log('upsertProjectToDatabase:getJsonFromDatabase: ' + JSON.stringify(result))
        if (result) {
          // console.log('assigning: data: ' + JSON.stringify(data))
          const assigned = Object.assign(result, { data: data })
          // console.log('assigned: data: ' + JSON.stringify(data))
          return assigned
        } else {
          return projectData
        }
      })
      .catch (err => {
        console.log('upsertProjectToDatabase:missing: ' + JSON.stringify(err))
        return projectData
        })
      .then(result => {
        console.log('upsertProjectToDatabase:tostore: ' + JSON.stringify(result))
        return putJsonToDatabase(db, result)
      })
      .then (result => {
        // console.log ('putJsonToDatabase: ' + JSON.stringify(result))
        resolve(result)
      })
      .catch(err => {
        console.log('upsert:err: ' + err)
        reject(err)
      })
  })
}

const getJsonFromDatabase = (db, id, options = {}) => {
  return getJsonFromDb (db, id, options)
}

const putJsonToDatabase = (db, data) => {
  return putJsonToDb(db, data)
}

const getStatusOfDatabase = (db) => {
  return getStatusFromDb (db)
}

const keyFromParts = (owner, project) => {
  return owner + ':' + project
}

export {
  createOrOpenDatabase,
  loadFromDatabase,
  storeToDatabase,
  clearDatabase,

  getFilesFromDir,
  getHtmlFromFile,
  getHtmlFromPath,
  putHtmlToFile,
  getJsonFromFile,
  putJsonToFile,

  getJsonFromDatabase,
  keyFromParts
}
