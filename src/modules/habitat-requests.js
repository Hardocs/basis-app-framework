// this begins the module for all data requests (and any saves), which abstracts
// and simplifies any interaction with the underlying filesystem or database.
// This in turn allows different habutat-database drivers to be used in future,
// employing for example CombatCovid or other security motifs, without changes
// to Hardocs application code

import {
  createOrOpenDb,
  getStatusFromDb,
  createIndexOnDb,
  upsertJsonToDb,
  getJsonFromDb,
  removeJsonFromDb
} from '@/modules/habitat-database'

import fs from 'fs'
import app from 'electron'

const dialog = app.remote.dialog;
const rendWin = app.remote.getCurrentWindow()

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
      reject('getJsonFromFile:error: Not allowed to get file from browser')
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
      // lint, huh... break
  }
  return db
}

const getStatusOfDatabase = (db) => {
  return getStatusFromDb (db)
}

const createIndexOnDatabase = (db, index) => {
  return createIndexOnDb(db, index)
}

const getJsonFromDatabase = (db, query) => {
  console.log(query)

  return getJsonFromDb (db, {
    selector: {
      title: 'Roma'
    }})
}

const upsertJsonToDatabase = (db, key, data) => {
  return upsertJsonToDb(db, key, data)
}

const removeJsonFromDatabase = (db, record) => {
  return removeJsonFromDb(db, record)
}

export {
  getJsonFromFile,
  putJsonToFile,
  createOrOpenDatabase,
  getStatusOfDatabase,
  upsertJsonToDatabase,
  createIndexOnDatabase,
  getJsonFromDatabase,
  removeJsonFromDatabase
}
