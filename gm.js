const express = require('express');
const bodyParser = require('body-parser')
const { prodDB, devDB, selectDB } = require('./backend/firebase')

const port = 8081;
const cors = require('cors');
const uuid = require('uuid');

const { ServiceManager, ProfileService, subdomain } = require('./backend/services')
ServiceManager.init(prodDB, devDB, selectDB)

const corsOptions = {
  origin: 'https://'+subdomain+'-dev.readysetdice.com',
  optionsSuccessStatus: 200
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.post('/account-setup', (req,res) => {
  const origin = req.get('origin')

  const useruid = req.body.useruid
  const useremail = req.body.email

  const profile = ProfileService.getProfile(origin, useruid)

  if (profile === null) {
    let db = selectDB(origin, prodDB, devDB)
    if (db !== null) {
      const dbRef = db.ref('profile/' + useruid)

      dbRef.set({restricted: true, secret: uuid.v4(), email: useremail}, (error) => {
        if (error) {
          console.log('error',error)
          res.send('ERROR')
        } else {
          console.log('OK')
          res.send('OK')
        }
      })
    }
  }
})


const PartyRoute = require('./backend/route/PartyRoute');
app.use('/party', PartyRoute);

const VueStatic = express.static('dist')

app.use(VueStatic);
app.use('/combat-tracker', VueStatic)
app.use('/encounter-builder', VueStatic)
app.use('/settings', VueStatic)
app.use('/forgot', VueStatic)
app.use('/home', VueStatic)
app.use('/hp', VueStatic)
app.use('/license', VueStatic)
app.use('/login', VueStatic)
app.use('/logout', VueStatic)
app.use('/party-manager', VueStatic)
app.use('/pc', VueStatic)
app.use('/pwreset', VueStatic)
app.use('/signup', VueStatic)
app.use('/tutorial', VueStatic)

app.all('*', (req, res) => {
  res.redirect('/');
});

// start server
app.listen(port, () => {
    console.log("Listening on port ",port);
});