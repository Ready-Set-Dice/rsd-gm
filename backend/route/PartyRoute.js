const express = require('express');
const { ProfileService, PartyService } = require('../services')
const router = express.Router();
const { UserVerify } = require('../userverify')

router.use(UserVerify)

router.post('/new', (req, res) => {
  const origin = req.get('origin')

  const useruid = req.body.useruid
  const partyname = req.body.partyname
  const profile = ProfileService.getProfile(origin, useruid)
  
  const result = PartyService.newParty(origin, useruid, partyname, profile.restricted)

  res.send(result)
});

router.post('/delete', (req, res) => {
  const origin = req.get('origin')

  const useruid = req.body.useruid
  const partyid = req.body.partyid

  const result = PartyService.deleteParty(origin, useruid, partyid)

  res.send(result)
})

router.post('/kick', (req, res) => {
  const origin = req.get('origin')

  const memberid = req.body.memberid
  const partyid = req.body.partyid
  const pcid = req.body.pcid
  const gmid = req.body.useruid

  const result = PartyService.leaveParty(origin, memberid, pcid, gmid, partyid)

  res.send(result)
})

router.post('/initiative', (req, res) => {
  const origin = req.get('origin')

  const useruid = req.body.useruid
  const partyid = req.body.partyid

  const result = PartyService.rollInitiative(origin, useruid, partyid)

  res.send(result)
})

module.exports = router;