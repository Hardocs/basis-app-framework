// this begins the module for all data requests (and any saves), which abstracts
// and simplifies any interaction with the underlying filesystem or database

import {
  createOrOpenDb,
  getStatusFromDb,
  createIndexOnDb,
  upsertJsonToDb,
  getJsonFromDb
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
            resolve({ fileName: fileName, content: content })
          } else {
            resolve({ fileName: 'Cancelled...', content: 'Cancelled...' })
          }
        })
    } else {
      reject('getJsonFromFile:error: Not allowed to get file from browser')
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
    selectorx: {
      title: 'Roma'
    }})
}

const upsertJsonToDatabase = (db, key, data) => {
  return upsertJsonToDb(db, key, data)
}

export {
  getJsonFromFile,
  createOrOpenDatabase,
  getStatusOfDatabase,
  upsertJsonToDatabase,
  createIndexOnDatabase,
  getJsonFromDatabase
}
