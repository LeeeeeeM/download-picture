var fs = require('fs')
var request = require('request')
var Sheduler = require('./scheduler')

var sheduler = new Sheduler(10)

var dir = 'picture'

function downloadFile(uri, filename, callback) {
  sheduler.add(function () {
    return new Promise((resolve, reject) => {
      var stream = fs.createWriteStream(dir + '/' + filename)
      request({
        uri: uri
      }).on('response', function() {
        callback()
        resolve()
      }).on('err', function(err) {
        reject()
      }).pipe(stream)
    })
  })
}

function getFileExtendingName(filename) {
  // 文件扩展名匹配正则
  var reg = /\.[^\.]+$/
  var matches = reg.exec(filename)
  if (matches) {
    return matches[0]
  }
  return ''
}

function produceData(data) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  data.forEach(item => {
    if (!item.url) return
    item.url.split('&#10;').forEach((url, index) => {
      var ext = getFileExtendingName(url)
      if (ext.length > 8) {
        console.log(item.name + '图片上传地址错误，暂停下载')
        return
      }
      downloadFile(url, item.name + '-' + index + ext, function () {
        console.log(`图片地址 ${url}`)
        console.log(`${item.name} 图片下载完毕`)
      })
    })
  })
  sheduler.start()
}

module.exports = produceData