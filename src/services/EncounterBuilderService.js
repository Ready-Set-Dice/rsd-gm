const EventEmitter = require('events')

class EncounterBuilderService extends EventEmitter {
    constructor() {
        super()
    }

    init(funcObj, store) {
        this.f = funcObj
        this.$store = store

        this.reset()
        // console.log("GMManagerService init")
    }

    unload() {
        this.reset()
    }

    load() {
        const auth = this.f.getAuth()
        const curuser = auth.currentUser
        if (curuser) {
            // console.log(curuser)
            this.useruid = curuser.uid

            this._dbEncounterList = null
            this._dbEncounterData = null
            this._dbEncounterMembers = null
        }
    }

    reset() {
        this._partyid = null
        this._encounterId = null

        this._encounterList = {}
        this._encounterData = {}
        this._encounterMembers = {}

        this._resetDBListener(this._dbEncounterList)
        this._dbEncounterList = null

        this._resetDBListener(this._dbEncounterData)
        this._dbEncounterData = null

        this._resetDBListener(this._dbEncounterMembers)
        this._dbEncounterMembers = null
    }

    setEncounterID(encounterid) {
        this._encounterId = encounterid
    }

    loadCurrentEncounterList(partyid) {
        this._resetEncounterListeners()
        
        this._partyid = partyid
        this._dbEncounterList = this.f.ref(this.f.database, 'encounterlist/' + this.useruid + '/' + this._partyid)
        this._dbEncounterData = this.f.ref(this.f.database, 'encounterdata/' + this.useruid + '/' + this._partyid)

        this.f.onValue(this._dbEncounterList, (snapshot) => {this.getEncounterListOnValue(snapshot)})
        this.f.onValue(this._dbEncounterData, (snapshot) => {this.getEncounterDataOnValue(snapshot)})
        // parent.loadEncounters()
    }

    loadEncounterMembers() {
        this._resetEncounterMembersListeners()

        this._dbEncounterMembers = this.f.ref(this.f.database, 'encountermembers/' + this.useruid + '/' + this._partyid + '/' + this._encounterId)
        this.f.onValue(this._dbEncounterMembers, (snapshot) => {this.getEncounterMembersOnValue(snapshot)})
    }

    /* Data reference functions */

    getEncounterListRef() {
        return this._dbEncounterList
    }

    getEncounterDataRef() {
        return this._dbEncounterData
    }

    getEncounterMembersRef() {
        return this._dbEncounterMembers
    }

    /* Data functions */

    getEncounterList() {
        return this._encounterList
    }

    getEncounterData() {
        return this._encounterData
    }

    getEncounterMembers() {
        return this._encounterMembers
    }

    getEncounterTotalXP() {
        return this._encounterTotalXP
    }

    /* Encounter functions */

    getEncounterListOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._encounterList = data
        } else {
            this._encounterList = {}
        }

        this.$store.dispatch('remotedb/setEncounterList', {content: this._encounterList})
        this.emit('EncounterList', this._encounterList)
        this.loadMembers()
    }

    getEncounterDataOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._encounterData = data
            // parent.receiveEncounterData(data)
        } else {
            this._encounterData = {}
        }
        
        this.$store.dispatch('remotedb/setEncounterData', {content: this._encounterData})
        this.emit('EncounterData', this._encounterData)
        this.loadMembers()
    }

    loadMembers() {
        if (this._encounterList && this._encounterList.active) {
            const active = this._encounterList.active

            if (active && this._encounterData && this._encounterData[active]) {
                this.setEncounterID(active)
                this.loadEncounterMembers(active)
            }
        }
    }

    getEncounterMembersOnValue(snapshot) {
        const data = snapshot.val()
        if (data != null) {
            // parent.receiveEncounterMembers(data)
            this._encounterMembers = data

            // This changes the TotalXP stat in the encounterData table.
            // Started as a dirty fix but this works perfectly fine and automagically updates it so...
            let totalxp = 0
            if (!!this._encounterMembers && !!this._encounterMembers.ids) {
                Object.values(this._encounterMembers.ids).forEach(em => {
                    if (!!em.xp) {
                        totalxp += em.xp
                    }
                })

                if (this._encounterData[this._encounterList.active].totalxp != totalxp) {
                    let encounter = {
                        ...this._encounterData[this._encounterList.active],
                        id: this._encounterList.active,
                        totalxp: totalxp,
                    }

                    if (!!encounter && !!encounter.totalxp && !!encounter.id) {
                        this.updateEncounter(encounter)
                    }
                }
            }
        } else {
            this._encounterMembers = {}
        }

        this.$store.dispatch('remotedb/setEncounterMembers', {content: this._encounterMembers})
        this.emit('EncounterMembers', this._encounterMembers)
    }

    addEncounter(newEncounter) {
        let encounterCount = 0
        if (!!this._encounterList && !!this._encounterList.ids && this._encounterList.ids.length > 0) {
            encounterCount += this._encounterList.ids.length
        }

        if (encounterCount < 20 && !!this._encounterList) {
            const newEncounterID = this.f.push(this._dbEncounterList)
            const newEncounterIDKey = newEncounterID.key

            let newEncounterList = null
            if (!!this._encounterList.ids && this._encounterList.ids.length > 0) {
                newEncounterList = {...this._encounterList}
                newEncounterList.ids.push({[newEncounterIDKey]: true})
            } else {
                newEncounterList = {ids: []}
                newEncounterList.ids.push({[newEncounterIDKey]: true})
            }

            this.f.retrySet("addEncounter", this._dbEncounterList, newEncounterList, () => {
                if (!newEncounterList.active) {
                    newEncounterList.active = newEncounterIDKey
                    this.f.retrySet("setEncounterActive", this._dbEncounterList, newEncounterList)
                }

                this.f.retrySet("addEncounterData", this.f.child(this._dbEncounterData, newEncounterIDKey), {...newEncounter})
            })
        }
    }

    removeEncounter(encounterId, callback = null) {
        if (!!this._encounterList && !!this._encounterList.ids && this._encounterList.ids.length > 0) {
            let index = this._encounterList.ids.findIndex((el) => {
                let keys = Object.keys(el)
                return !!keys && keys.length > 0 && keys[0] == encounterId
            })

            if (index != -1) {
                let newEncounterList = {...this._encounterList}
                let activeEncounter = false

                newEncounterList.ids.splice(index, 1)
                if (!!newEncounterList.active && newEncounterList.active == encounterId) {
                    activeEncounter = true
                    delete newEncounterList.active
                }

                if (activeEncounter) {
                    // Remove EncounterMembers
                    this.f.retryRemove("removeEncounterMembers", this._dbEncounterMembers, () => {
                        this._resetDBListener(this._dbEncounterMembers)
                    })
                    this._dbEncounterMembers = null
                    this._encounterMembers = {}

                    // Remove EncounterData
                    this.f.retryRemove("removeEncounterData", this.f.child(this._dbEncounterData, encounterId), () => {
                        this.f.retrySet("removeEncounter", this._dbEncounterList, newEncounterList, callback)
                    })
                } else {
                    let tempEncounterMembers = this.f.ref(this.f.database, 'encountermembers/' + this.useruid + '/' + this._partyid + '/' + encounterId)
                    this.f.retryRemove("removeEncounterMembers", tempEncounterMembers)

                    this.f.retryRemove("removeEncounterData", this.f.child(this._dbEncounterData, encounterId), () => {
                        this.f.retrySet("removeEncounter", this._dbEncounterList, newEncounterList, callback)
                    })
                }
            }
        }
    }

    removeEncountersForParty(partyid) {
        if (!!partyid) {
            if (partyid == this._partyid) {
                if (!!this._dbEncounterList && !!this._dbEncounterData && !!this._dbEncounterMembers) {
                    this.f.off(this._dbEncounterMembers)
        
                    this._dbEncounterMembers = this.f.ref(this.f.database, 'encountermembers/' + this.useruid + '/' + this._partyid)
                    this._partyid = null
        
                    this.f.retryRemove("removeEncounterMembers", this._dbEncounterMembers)
        
                    this.f.retryRemove("removeEncounterData", this._dbEncounterData, () => {
                        this._resetDBListener(this._dbEncounterData)
                    })
                    this.f.retryRemove("removeEncounter", this._dbEncounterList, () => {
                        this._resetDBListener(this._dbEncounterList)
                    })
                }
            } else {
                let tempEncounterMembers = this.f.ref(this.f.database, 'encountermembers/' + this.useruid + '/' + partyid)
                this.f.retryRemove("removeEncounterMembers", tempEncounterMembers)
        
                let tempEncounterData = this.f.ref(this.f.database, 'encounterdata/' + this.useruid + '/' + partyid)
                this.f.retryRemove("removeEncounterData", tempEncounterData)

                let tempEncounterList = this.f.ref(this.f.database, 'encounterlist/' + this.useruid + '/' + partyid)
                this.f.retryRemove("removeEncounter", tempEncounterList)
            }
        }

        
    }

    updateEncounter(encounter) {
        if (encounter && encounter.id && encounter.id != '') {
            const encounterId = encounter.id
            encounter.id = null
            encounter.reset = null
            this.f.retrySet("updateEncounter", this.f.child(this._dbEncounterData, encounterId), encounter)
        }
    }

    /* Update functions */

    updateEncounterActive(data) {
        this.f.retrySet("updateEncounterActive", this.f.child(this._dbEncounterList, 'active'), data)
    }

    updateEncounterIDs(data) {
        this.f.retrySet("updateEncounterIDs", this.f.child(this._dbEncounterList, 'ids'), data)
    }

    updateEncounterList(data) {
        this.f.retrySet("updateEncounterList", this._dbEncounterList, data)
    }

    updateEncounterData(data) {
        this.f.retrySet("updateEncounterData", this._dbEncounterData, data)
    }

    updateEncounterDataByID(encounterid, data) {
        this.f.retrySet("updateEncounterData", this.f.child(this._dbEncounterData, encounterid), data)
    }

    updateEncounterMembers(data) {
        this.f.retrySet("updateEncounterMembers", this._dbEncounterMembers, data)
    }

    updateEncounterMembersIDs(data, callback = null) {
        this.f.retrySet("updateEncounterMembersIDs", this.f.child(this._dbEncounterMembers, 'ids'), data, callback)
    }

    updateEncounterMemberByIndex(index, data, callback = null) {
        this.f.retrySet("updateEncounterMemberByIndex", this.f.child(this.f.child(this._dbEncounterMembers, 'ids'), index.toString()), data, callback)
    }

    /* Internal function */

    _resetEncounterListeners() {
        this._encounterList = {}
        this._encounterData = {}
        this._encounterMembers = {}

        this._resetDBListener(this._dbEncounterList)
        this._resetDBListener(this._dbEncounterData)
        this._resetDBListener(this._dbEncounterMembers)
        this._dbEncounterList = null
        this._dbEncounterData = null
        this._dbEncounterMembers = null

        this.$store.dispatch('remotedb/setEncounterList', {content: null})
        this.emit('EncounterList', {})
        this.$store.dispatch('remotedb/setEncounterData', {content: null})
        this.emit('EncounterData', {})
        this.$store.dispatch('remotedb/setEncounterMembers', {content: null})
        this.emit('EncounterMembers', {})
    }

    _resetEncounterMembersListeners() {
        this._encounterMembers = {}

        this._resetDBListener(this._dbEncounterMembers)
        this._dbEncounterMembers = null

        this.$store.dispatch('remotedb/setEncounterMembers', {content: null})
        this.emit('EncounterMembers', {})
    }

    _resetDBListener(name) {
        if (!!name && Object.keys(name).length > 0) {
            try { this.f.off(name) } catch(e) { console.error(e) }
        }
    }
}

export default new EncounterBuilderService();