var xlsx2json = require('xlsx2json')
var produceData = require('./download/index')

xlsx2json(
  'excel/data.xlsx',{
    mapping: {
      'name': 'A',
      'url': 'I'
    }
  }
).then(jsonArray => {
  const array = jsonArray[0].filter(item => item.name)
  produceData(array)
})