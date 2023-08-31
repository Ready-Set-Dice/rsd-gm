const admin = require("firebase-admin");
const { subdomain } = require('../services')

const prodServiceAccount = require("../../../pf2tools-51ff5-firebase-adminsdk-zmnj0-cf6fdf2855.json")

const _prodDB = admin.initializeApp({
  credential: admin.credential.cert(prodServiceAccount),
  databaseURL: "https://pf2tools-51ff5-default-rtdb.europe-west1.firebasedatabase.app",
  databaseAuthVariableOverride: {
    uid: "readysettools-service-worker"
  }
}, 'prod')

const devServiceAccount = require("../../../pf2tools-dev-firebase-adminsdk-4sr20-056a61d51a.json")

const _devDB = admin.initializeApp({
  credential: admin.credential.cert(devServiceAccount),
  databaseURL: "https://pf2tools-dev-default-rtdb.europe-west1.firebasedatabase.app",
  databaseAuthVariableOverride: {
    uid: "readysettools-service-worker"
  }
}, 'dev');

module.exports = {
  prodDB: _prodDB,
  devDB: _devDB
}

module.exports.selectDB = (origin, pDB, dDB) => {
  if (origin === 'https://'+subdomain+'.readysetdice.com') {
    return pDB.database()
  } else if (origin === 'https://'+subdomain+'-dev.readysetdice.com') {
    return dDB.database()
  } else {
    return null
  }
}