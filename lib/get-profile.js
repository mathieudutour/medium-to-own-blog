const { JSDOM } = require('jsdom')
const fs = require('fs-extra')
const path = require('path')
const Jimp = require('jimp');
const { request, withOutputPath } = require('./utils')

module.exports.getProfile = async zip => {
  const profile = {}

  const profileContent = await zip.file('profile/profile.html').async('text')

  const profileDom = new JSDOM(profileContent).window.document
  profileDom.querySelectorAll('li').forEach(l => {
    const { textContent } = l
    if (textContent.startsWith('Profile: @')) {
      profile.mediumUsername = textContent.replace('Profile: @', '')
    }
    if (textContent.startsWith('Display name: ')) {
      profile.authorName = textContent.replace('Display name: ', '')
    }
    if (textContent.startsWith('Email address: ')) {
      profile.authorEmail = textContent.replace('Email address: ', '')
    }
    if (textContent.startsWith('Twitter: @')) {
      profile.twitterUsername = textContent.replace('Twitter: @', '')
    }
    if (textContent.startsWith('Facebook: ')) {
      profile.facebookUsername = textContent.replace('Facebook: ', '')
    }
  })

  if (!profile.mediumUsername) {
    throw new Error(`Could not parse the Medium profile: \n${profileContent}`)
  }

  await fs.mkdirp(withOutputPath(profile, './content'))
  await fs.mkdirp(withOutputPath(profile, './src/images'))

  let avatarBuffer

  if (profileDom.querySelector('img.u-photo')) {
    const avatarUrl = profileDom
      .querySelector('img.u-photo')
      .attributes.getNamedItem('src').value

    avatarBuffer = await request(avatarUrl, { encoding: null }).catch(() => {})
  }

  if (!avatarBuffer) {
    avatarBuffer = await fs.readFile(path.join(__dirname, './default-icon.png'))
  }

  await fs.writeFile(
    withOutputPath(profile, './src/images/icon.png'),
    avatarBuffer
  )

  Jimp.read(avatarBuffer, (err, avatar) => {
    if (err) throw err;
    avatar
        .resize(150, 150) // resize
        .quality(60) // set JPEG quality
        .write(withOutputPath(profile, './src/images/avatar.png')); // save
  });
  const profileRemoteContent = await request(
    `https://medium.com/@${profile.mediumUsername}`
  ).catch(() => {})

  if (!profileRemoteContent) {
    profile.bio = ''
  } else {
    const profileRemoteDom = new JSDOM(profileRemoteContent).window.document
    profile.bio = profileRemoteDom
      .querySelector("meta[name='description']")
      .attributes.getNamedItem('content')
      .value.replace(`Read writing from ${profile.authorName} on Medium. `, '')
      .replace(
        ` Every day, ${
          profile.authorName
        } and thousands of other voices read, write, and share important stories on Medium.`,
        ''
      )
  }

  return profile
}
