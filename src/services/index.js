import rtdb from "../rtdb"
import { getAuth } from 'firebase/auth'
import { ref, set, push, remove, child, onValue, off } from 'firebase/database'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const dev = process.env.NODE_ENV !== "development" ? false : true
const subdomain = !!dev ? 'localhost:9091' : 'gm'

const isGM = true

import ProfileManagerService from "@root/.shared/services/ProfileManagerService"
import APIService from "@root/.shared/services/APIService"
import CampaignService from "@root/.shared/services/CampaignService"
import CombatService from "@root/.shared/services/CombatService"
import EncounterBuilderService from "./EncounterBuilderService"
import BestiaryService from "@root/.shared/db/BestiaryService/BestiaryService"
import SpellService from "@root/.shared/db/SpellService/SpellService"
import StaticService from "@root/.shared/db/StaticService"

// Related to PC's 
import AncestryService from "@root/.shared/db/AncestryService/AncestryService"
import BackgroundService from "@root/.shared/db/BackgroundService"
import ClassService from "@root/.shared/db/ClassService/ClassService"
import DeityService from "@root/.shared/db/DeityService"
import FeatService from "@root/.shared/db/FeatService"
import HeritageService from "@root/.shared/db/HeritageService"


const ServiceManager = {
    constructor() {
        this._initialized = false
        this._loaded = false
    },

    
    init(store) {
        let funcObj = {
            database: rtdb, 
            getAuth: getAuth, 
            child: child, 
            ref: ref, 
            set: set, 
            push: push, 
            remove: remove, 
            off: off, 
            onValue: onValue, 
            uuidv4: uuidv4, 
            subdomain: subdomain, 
            axios: axios,
            logError: (e) => { console.error(e) },
            retrySet: (name, db, data, callback = null, tries = 0) => {
                if (!!db && tries < 3) {
                    set(db, data)
                    .then(() => {
                        if (!!callback) {
                            callback(true)
                        }
                    })
                    .catch((e) => {
                        console.log(`Failed to update ${name}, retry attempt [${tries}]`, data)
                        if (!!dev) {
                            console.error(e)
                        }
                        tries+=1
                        setTimeout(() => { funcObj.retrySet(name, db, data, callback, tries) }, 100)
                    })
                } else {
                    console.log(`Failed to do ${name}, maximum retries reached.`)
                    if (!!callback) {
                        callback(false)
                    }
                }
            },
            retryRemove: (name, db, callback = null, tries = 0) => {
                if (!!db && tries < 10) {
                    remove(db)
                    .then(() => {
                        if (!!callback) {
                            callback(true)
                        }
                    })
                    .catch((e) => {
                        console.log(`Failed to update ${name}, retry attempt [${tries}]`)
                        if (!!dev) {
                            console.error(e)
                        }
                        tries+=1
                        setTimeout(() => { funcObj.retryRemove(name, db, callback, tries) }, 100)
                    })
                } else {
                    console.log(`Failed to do ${name}, maximum retries reached.`)
                    if (!!callback) {
                        callback(false)
                    }
                }
            },
        }

        APIService.init(axios, store, dev)
        ProfileManagerService.init(funcObj)
        CampaignService.init(funcObj, isGM, store)
        CombatService.init(funcObj, isGM, store)
        EncounterBuilderService.init(funcObj, store)

        SpellService.init(store, StaticService)

        AncestryService.init(store)
        ClassService.init(store)

        APIService.on("BestiarySet", () => {
            BestiaryService.init(store, SpellService, StaticService)
        })

        APIService.on("SpellSet", () => {
            SpellService.loadSpells()
        })

        APIService.on("SpellEffectSet", () => {
            SpellService.loadEffects()
        })

        APIService.on("StaticSet", () => {
            StaticService.load()
        })

        APIService.on("AncestrySet", () => {
            AncestryService.loadAncestries()
        })

        APIService.on("AncestryFeatureSet", () => {
            AncestryService.loadAncestryFeatures()
        })

        APIService.on("BackgroundSet", () => {
            BackgroundService.init(store)
        })

        APIService.on("ClassSet", () => {
            ClassService.loadClasses()
        })

        APIService.on("ClassExtenedSet", () => {
            ClassService.loadClassesExtended()
        })

        APIService.on("ClassFeatureSet", () => {
            ClassService.loadClassFeatures()
        })

        APIService.on("DeitySet", () => {
            DeityService.init(store)
        })

        APIService.on("FeatSet", () => {
            FeatService.init(store)
        })

        APIService.on("HeritageSet", () => {
            HeritageService.init(store)
        })

        CampaignService.on('SetParty', (party) => {
            if (!!party && !!party.gmid) {
                EncounterBuilderService.loadCurrentEncounterList(party.partyid)
                CombatService.loadCurrentCombat(party.partyid, party.gmid)
            }
        })

        this._initialized = true

        if (!!dev) {
            console.log('Services initialized')
        }
    },

    load() {
        ProfileManagerService.load()
        CampaignService.load()
        CombatService.load()
        EncounterBuilderService.load()

        this._loaded = true

        if (!!dev) {
            console.log('Services loaded')
        }
    },

    unload() {
        ProfileManagerService.unload()
        CampaignService.unload()
        CombatService.unload()
        EncounterBuilderService.unload()

        this._loaded = false

        if (!!dev) {
            console.log('Services unloaded')
        }
    },

    initialized() {
        return this._initialized
    },

    loaded() {
        return this._loaded
    },
}

export default ServiceManager
export {ServiceManager as ServiceManager}

export {ProfileManagerService as ProfileManagerService}
export {CampaignService as PartyService}
export {CampaignService as CampaignService}
export {isGM as isGM}

export {CombatService as CombatService}
export {EncounterBuilderService as EncounterBuilderService}
export {APIService as APIService}
export {BestiaryService as BestiaryService}
export {SpellService as SpellService}
export {subdomain as subdomain}
export {StaticService as StaticService}

export {AncestryService as AncestryService}
export {BackgroundService as BackgroundService}
export {ClassService as ClassService}
export {DeityService as DeityService}
export {FeatService as FeatService}
export {HeritageService as HeritageService}