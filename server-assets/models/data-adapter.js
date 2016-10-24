let uuid = require('node-uuid'),
  JsData = require('js-data'),
  Schemator = require('js-data-schema'),
  NeDbAdapter = require('js-data-nedb'),
  // fbAdapter = require('js-data-firebase'),
  schemator = new Schemator(),
  DS = new JsData.DS();

  function formatQuery(query){
    query=query || ''
  return {
    with: query.split(',').join(' ').split(' ')
  }
}

// let adapter = new fbAdapter({
//   basePath: 'https://firebase.com/whatever'
// })

DS.registerAdapter('nedb', NeDbAdapter, { default: true })

module.exports = {
  DS,
  uuid,
  schemator,
  formatQuery
}