import { MobileActionMenu } from '@root/.shared/classes/MobileActionMenu'
import { dmgTypes, healTypes, conditionTypes } from '@root/.shared/constants/gametypes'

const SHEETS = {
    'edit': [
        {icon: 'mdi-alarm-plus', text: 'Add an alarm', value:'addalarm',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'memberAlertDialog', attrs: [false,
                    {
                        cid: item.id,
                        remove: 1,
                        round: -1,
                        title: '',
                        description: ''
                    }]
                })
            }
        }},
        {icon: 'mdi-sort', text: 'Change initiative', value:'initiative',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'combatInitiativeDialog', attrs: [true, {...item, id: item.id}]})
            }
        }},
        {icon: 'mdi-palette', text: 'Change color', value:'color',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'npcStyleDialog', attrs: [true, {...item}, {combat: true}]})
            }
        }},
        {icon: 'mdi-form-textbox', text: 'Rename character', value:'rename', type: 'npc',
        function: (item) => {
            if (!!item) {
                const nameTemplate = !!item.name ? item.name : MENU.$rsd.bestiary.getName(item.bid)
                MENU.$rsd.dialog.open({name: 'npcNameDialog', attrs: [true, {...item, name: nameTemplate}, {combat: true}]})
            }
        }},
        {icon: 'mdi-trash-can', text: 'Delete from combat', value:'delete', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })

                MENU.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Remove Combatant', 
                    `Are you sure you want to remove the combatant${MENU.getMembersCount(items) > 1 ? 's' : ''}?`,
                    () => {MENU.doDelete()}
                ]})
            }
        }},
    ],
    'action': [
        {icon: 'mdi-sword', text: 'Deal damage', value:'damage', multiple: true, subitems: dmgTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                let immune = false
                let resistant = false
                let vulnerable = false
                items.forEach(selected => {
                    if (!!selected) {
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.immunities && selected.object.hpinfo.immunities.length > 0) {
                            selected.object.hpinfo.immunities.forEach(im => {
                                if (!!im && !!im.type) {
                                    immune = !!immune || im.type == type
                                }
                            })
                        }
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.resistances && selected.object.hpinfo.resistances.length > 0) {
                            selected.object.hpinfo.resistances.forEach(im => {
                                if (!!im && !!im.type) {
                                    resistant = !!resistant || im.type == type
                                }
                            })
                        }
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.weaknesses && selected.object.hpinfo.weaknesses.length > 0) {
                            selected.object.hpinfo.weaknesses.forEach(im => {
                                if (!!im && !!im.type) {
                                    vulnerable = !!vulnerable || im.type == type
                                }
                            })
                        }
                    }
                })

                MENU.$rsd.dialog.open({name: 'damageDialog', attrs: [true, 
                    {value:1, affected: items, dmg: type}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
            }
        }},
        {icon: 'mdi-heart-plus', text: 'Perform healing', value:'heal', multiple: true, subitems: healTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                if (type == 'regular') {
                    MENU.$rsd.dialog.open({name: 'healDialog', attrs: [true, {value:1, affected: items}]})
                } else if (type == 'temporary') {
                    MENU.$rsd.dialog.open({name: 'temporaryHPDialog', attrs: [true, {value: 1, duration:0, affected: items}]})
                }
            }
        }},
        {icon: 'mdi-virus-outline', text: 'Add a condition', value:'condition', multiple: true, subitems: conditionTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                const duration = MENU.$rsd.conditions.hasDuration(type)
                const value = MENU.$rsd.conditions.hasValue(type)

                let immune = false
                items.forEach(selected => {
                    if (!!selected) {
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.immunities && selected.object.hpinfo.immunities.length > 0) {
                            selected.object.hpinfo.immunities.forEach(im => {
                                if (!!im && !!im.type) {
                                    immune = !!immune || im.type == type
                                }
                            })
                        }
                    }
                })
                
                if (!!duration && !!value) {
                    MENU.$rsd.dialog.open({name: 'addConditionBothDialog', attrs: [false, {type: type, duration:0, value:1, floor: false, reduce: false, affected: items}, {immune: immune}]})
                } else if (!!duration) {
                    MENU.$rsd.dialog.open({name: 'addConditionDurationDialog', attrs: [false, {type: type, duration:0, affected: items}, {immune: immune}]})
                } else if (!!value) {
                    MENU.$rsd.dialog.open({name: 'addConditionValueDialog', attrs: [false, {type: type, value:1, floor: false, reduce: false, affected: items}, {immune: immune}]})
                } else {
                    items.forEach(a => {
                        if (!!a && !!a.id) {
                            MENU.$rsd.combat.addCondition(a.id, {type: type})
                        }
                    })
                }
            }
        }},
        {icon: 'fire', text: 'Add peristent damage', value:'pdamage', multiple: true, subitems: dmgTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                let immune = false
                let resistant = false
                let vulnerable = false

                items.forEach(selected => {
                    if (!!selected) {
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.immunities && selected.object.hpinfo.immunities.length > 0) {
                            selected.object.hpinfo.immunities.forEach(im => {
                                if (!!im && !!im.type) {
                                    immune = !!immune || im.type == type
                                }
                            })
                        }
                
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.resistances && selected.object.hpinfo.resistances.length > 0) {
                            selected.object.hpinfo.resistances.forEach(im => {
                                if (!!im && !!im.type) {
                                    resistant = !!resistant || im.type == type
                                }
                            })
                        }
                
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.weaknesses && selected.object.hpinfo.weaknesses.length > 0) {
                            selected.object.hpinfo.weaknesses.forEach(im => {
                                if (!!im && !!im.type) {
                                    vulnerable = !!vulnerable || im.type == type
                                }
                            })
                        }
                    }
                })
  
                MENU.$rsd.dialog.open({name: 'addPersistentDamageDialog', attrs: [false, 
                    {type:'persistent damage', value: 1, dmg: type, affected: items}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
            }
        }},
    ]
}

class CombatActionMenu extends MobileActionMenu {
    constructor() {
        super()
    }

    getBottomSheet(name) {
        return !!name && !!SHEETS[name] ? SHEETS[name] : null
    }

    getDailMenu() {
        return {
            top: true,
            buttons: [
                {icon: 'mdi-pencil', function: () => { this.$rsd.bottomsheet.open('edit') }},
                {icon: 'mdi-sword', function: () => { this.$rsd.bottomsheet.open('action') }},
                {icon: 'mdi-account-group', function: () => { this.doAddParty() }, show: () => {return !!this.getMissingMembers() && this.getMissingMembers().length > 0}},
                {icon: 'mdi-plus', function: () => { this.doAdd() }},
                {icon: 'mdi-arrow-down-bold', function: () => { this.doNextInitiative() }},
            ],
        }
    }

    getMissingMembers() {
        const missing = []
        const selectedMembers = this.$store.getters['remotedb/selectedMembers']
        const members = this.$rsd.members.getMembersArray()
        const campaignActiveBench = this.$store.getters['remotedb/campaignActiveBench']
        if (!!selectedMembers && selectedMembers.length > 0) {
            members.forEach(m => {
                const index = selectedMembers.findIndex(sm => sm.id == m.id)
                if (index == -1) {
                    let benched = false

                    if (m.type.toLowerCase() == 'gmc' && !!m.id) {
                        benched =  campaignActiveBench.includes('GMC/' + m.id)
                    } else if (m.type.toLowerCase() == 'pc' && !!m.uid && !!m.id) {
                        benched = campaignActiveBench.includes(m.uid + '/' + m.id)
                    }

                    if (!benched) {
                        const perception = this.$rsd.members.getPerceptionMod(m)
                        const initiative = !!m.initiative ? m.initiative : this.$rsd.random.getInitiativeRoll(perception)
                        missing.push({
                            id: m.id,
                            initiative: initiative,
                            name: m.name,
                            type: m.type,
                        })
                    }
                }
            })
        } else {
            members.forEach(m => {
                let benched = false

                if (m.type.toLowerCase() == 'gmc' && !!m.id) {
                    benched =  campaignActiveBench.includes('GMC/' + m.id)
                } else if (m.type.toLowerCase() == 'pc' && !!m.uid && !!m.id) {
                    benched = campaignActiveBench.includes(m.uid + '/' + m.id)
                }

                if (!benched) {
                    const perception = this.$rsd.members.getPerceptionMod(m)
                    const initiative = !!m.initiative ? m.initiative : this.$rsd.random.getInitiativeRoll(perception)
                    missing.push({
                        id: m.id,
                        initiative: initiative,
                        name: m.name,
                        type: m.type,
                    })
                }
            })
        }

        return missing
    }

    doAdd() {
        setTimeout(() => {
            this.$store.dispatch('rsd/setMobileView', {
                ...this.getMobileView(),
                campaignSelected: true,
                encounterSelected: true,
                addCombatantSelected: true,
                targetSelected: false,
            })
        }, 100)
    }
    doAddParty() {
        if (!!this.getMissingMembers() && this.getMissingMembers().length > 0) {
            this.$rsd.combat.addPartyMembers(this.getMissingMembers())
        }
    }

    doDelete(){
        if (!this.getMobileView() || !this.getMobileView().editOption) { return }

        const keys = this.getMobileView().editOption

        if (!!keys && keys.length > 0) {
            this.doRecursiveRemove(keys, 0)
        }
    }

    doNextInitiative() {
        const dyingListener = (event) => { this.doDyingCheckDialog(this, event) }
        this.$rsd.combat.removeListener('DyingCheck', dyingListener)
        this.$rsd.combat.on('DyingCheck', dyingListener)

        const persistentDamageListener = (event) => { this.doPersistentDamageCheckDialog(this, event) }
        this.$rsd.combat.removeListener('PersistentDamageCheck', persistentDamageListener)
        this.$rsd.combat.on('PersistentDamageCheck', persistentDamageListener)

        this.$rsd.combat.next()
    }

    doDyingCheckDialog(parent, data) {
        if (!!data && !!data.valid) {
            
            const combatant = parent.getCombatantsArray()[data.index]
            console.log('combatant', combatant)
            const dying = combatant.conditions.find(c => c.type.toLowerCase() == 'dying')

            if (!!dying && !!dying.value) {
                let options = {
                    dc: 10 + dying.value,
                    check: 1,
                    receiver: {
                        id: combatant.id,
                        name: combatant.name,
                        index: data.index,
                    }
                }

                parent.$rsd.dialog.open({name: 'recoveryCheckDialog', attrs: [true, options]})
            }
        }

        const dyingListener = (event) => { parent.doDyingCheckDialog(parent, event) }
        parent.$rsd.combat.removeListener('DyingCheck', dyingListener)
    }

    doPersistentDamageCheckDialog(parent, data) {
        if (!!data && !!data.valid && !!parent.getCombatantsArray && (!!data.index || data.index == 0)) {
            const combatant = parent.getCombatantsArray()[data.index]

            if (!!combatant) {
                parent.$rsd.dialog.open({name: 'persistentDamageDialog', attrs: [true, 
                    {name: combatant.name, id: combatant.id, index: data.index}, 
                    {conditions: combatant.conditions}]
                })
            }
        }

        const persistentDamageListener = (event) => { parent.doPersistentDamageCheckDialog(parent, event) }
        parent.$rsd.combat.removeListener('PersistentDamageCheck', persistentDamageListener)
    }

    doRecursiveRemove(keys, i) {
        if (!!keys && !!keys[i]) {
            this.$rsd.combat.removeMember(keys[i], (success) => {
                if (!!success) {
                    this.doRecursiveRemove(keys, i+1)
                }
            })
        }
    }
}

const MENU = new CombatActionMenu()

export default MENU