const request = require('request')
const { exec } = require('child_process')
const path = require('path')

module.exports.request = (url, options) => {
  return new Promise((resolve, reject) => {
    request.get(url, options, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        reject(err || new Error(body))
        return
      }
      resolve(body)
    })
  })
}

module.exports.exec = (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout
        err.stderr = stderr
        reject(err)
        return
      }
      resolve({ stdout, stderr })
    })
  })
}

module.exports.withOutputPath = (profile, filePath) => {
  return filePath
    ? path.join(process.cwd(), `${profile.mediumUsername}-blog`, filePath)
    : path.join(process.cwd(), `${profile.mediumUsername}-blog`)
}
