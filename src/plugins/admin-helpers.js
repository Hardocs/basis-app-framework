import prettyJson from 'prettyprintjs';

const AdminHelpers = new Object()

AdminHelpers.install = function (Vue) {
  Vue.prototype.$htmlJson = htmlJson
  Vue.prototype.$htmlJsonText = htmlJsonText
  Vue.prototype.$jsonResult = jsonResult
}

const htmlJson = function (json) {
  console.log('htmlJson:json: ' + JSON.stringify(json))
  return prettyJson(json, 4, 'html')
}

const htmlJsonText = function (jsonText) {
  let json = jsonText
  console.log('htmlJson:jsonText: ' + jsonText)
  try {
    json = JSON.parse(jsonText)
  } catch (e) {
    json = 'htmlJsonText: ' + e
  }

  return prettyJson(json, 4, 'html')
}

const jsonResult = function (result) {
  let screenText
  console.log ('jsonResult:result: ' + JSON.stringify(result))
  // *todo* look into this, may be actual format problem
  // if (result.ok) {
  screenText = ': (ok: ' + result.ok + '):<br>' + htmlJsonText (result.msg)
  // } else {
  //   screenText = result.msg
  // }
  return screenText
}

export { AdminHelpers }
