const { ProfileService } = require('../services')

module.exports.UserVerify = (req, res, next) => {
  const origin = req.get('origin')
  
  const useruid = req.body.useruid
  const usersecret = req.body.secret

  const profile = ProfileService.getProfile(origin, useruid)

  // console.log(profile, usersecret)

  if (profile !== null && profile.secret === usersecret) {
    next()
  } else {
    res.send("INVALID_SECRET")
  }
}