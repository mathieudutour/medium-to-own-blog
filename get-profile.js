const { JSDOM } = require('jsdom')
const fs = require('fs-extra')
const path = require('path')
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

  const avatarUrl = profileDom
    .querySelector('img.u-photo')
    .attributes.getNamedItem('src').value

  const avatarBuffer =
    (await request(avatarUrl, { encoding: null }).catch(() => {})) ||
    (await fs.readFile(path.join(__dirname, './default-icon.png')))

  if (avatarBuffer) {
    await fs.writeFile(
      withOutputPath(profile, './src/images/icon.png'),
      avatarBuffer
    )
    await fs.writeFile(
      withOutputPath(profile, './src/images/avatar.png'),
      avatarBuffer
    )
  }

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
