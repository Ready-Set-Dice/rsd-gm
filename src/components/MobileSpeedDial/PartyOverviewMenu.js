import { MobileActionMenu } from '@root/.shared/classes/MobileActionMenu'
import { dmgTypes, healTypes, conditionTypes } from '@root/.shared/constants/gametypes'

const SHEETS = {
    'edit': [
        {icon: 'mdi-form-textbox', text: 'Rename GMC', value:'rename', type: 'gmc',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'gmcDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-arm-flex', text: 'Edit stats', value:'stats', type: 'gmc',
        function: (item) => {
            if (!!item) {
                const stats = MENU.$rsd.members.getStats(item, true)

                MENU.$rsd.dialog.open({name: 'gmcStatsDialog', attrs: [true, {name: item.name, id:item.id, _key: item._key, ...stats}]})
            }
        }},
        {icon: 'mdi-playlist-edit', text: 'Edit skills', value:'skills', type: 'gmc',
        function: (item) => {
            if (!!item) {
                const stats = MENU.$rsd.members.getStats(item, true)

                MENU.$rsd.dialog.open({name: 'gmcSkillsDialog', attrs: [true, {name: item.name, id:item.id, _key: item._key, ...stats}]})
            }
        }},
        {icon: 'mdi-ghost', text: 'Toggle benched', value:'bench', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })
                MENU.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Toggle Bench', 
                    `Are you sure you want to toggle the bench status for the member${MENU.getMembersCount(items) > 1 ? 's' : ''}?`,
                    () => {MENU.doBenchToggle()},
                ]})
                // MENU.$rsd.dialog.open({name: 'encounterStyleDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-trash-can', text: 'Remove member', value:'delete', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })
                MENU.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Remove Member', 
                    `Are you sure you want to remove the member${MENU.getMembersCount(items) > 1 ? 's' : ''}?`,
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
                    {local: true, value:1, affected: items, dmg: type}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
            }
        }},
        {icon: 'mdi-heart-plus', text: 'Perform healing', value:'heal', multiple: true, subitems: healTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                if (type == 'regular') {
                    MENU.$rsd.dialog.open({name: 'healDialog', attrs: [true, {local: true, value:1, affected: items}]})
                } else if (type == 'temporary') {
                    MENU.$rsd.dialog.open({name: 'temporaryHPDialog', attrs: [true, {local: true, value: 1, duration:0, affected: items}]})
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
                    MENU.$rsd.dialog.open({name: 'addConditionBothDialog', attrs: [false, {local: true, type: type, duration:0, value:1, floor: false, reduce: false, affected: items}, {immune: immune}]})
                } else if (!!duration) {
                    MENU.$rsd.dialog.open({name: 'addConditionDurationDialog', attrs: [false, {local: true, type: type, duration:0, affected: items}, {immune: immune}]})
                } else if (!!value) {
                    MENU.$rsd.dialog.open({name: 'addConditionValueDialog', attrs: [false, {local: true, type: type, value:1, floor: false, reduce: false, affected: items}, {immune: immune}]})
                } else {
                    items.forEach(a => {
                        if (!!a && !!a.id) {
                            MENU.$rsd.members.addCondition(a.id, a.type, {type: type})
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
                    {local: true, type:'persistent damage', value: 1, dmg: type, affected: items}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
            }
        }},
    ]
}

class EncounterOverviewMenu extends MobileActionMenu {
    constructor() {
        super()
    }

    getBottomSheet(name) {
        return !!name && !!SHEETS[name] ? SHEETS[name] : null
    }

    getCampaignActiveKey() {
        return this.$store.getters['remotedb/campaignActiveKey']
    }

    getDailMenu() {
        return {
            top: true,
            buttons: [
                {icon: 'mdi-pencil', function: () => { this.$rsd.bottomsheet.open('edit') }},
                {icon: 'mdi-sword', function: () => { this.$rsd.bottomsheet.open('action') }},
                {icon: 'mdi-link', function: () => { this.doCopyLink() }},
                {icon: 'mdi-plus', function: () => { this.doAdd() }, show: () => { return !!this.getPartyNotFull() }},
            ],
        }
    }

    getPartyNotFull() {
        const membersArray = this.$rsd.members.getMembersArray()
        return !membersArray || !!membersArray && membersArray.length < 10
    }

    doAdd() {
        if (!!this.getPartyNotFull()) {
            this.$rsd.dialog.open({name: 'gmcDialog', attrs: [false, {}]})
        }
    }
    
    doBenchToggle() {
        if (!this.getMobileView() || !this.getMobileView().editOption) { return }

        const keys = this.getMobileView().editOption
        
        if (!!keys && keys.length > 0) {
            this.doRecursiveBenchToggle(this.getCampaignActiveKey(), keys, 0)
        }
    }

    doCopyLink() {
        navigator.clipboard.writeText(MENU.$rsd.campaigns.getInviteLink()).then((result) => {
            MENU.$rsd.dialog.open({name: 'snackbarManager', attrs: [
                'Copied',
                'Link was copied to your clipboard.'
            ]})
        }, (error) => {
            console.log(error)
        })
    }

    doDelete(){
        if (!this.getMobileView() || !this.getMobileView().editOption) { return }

        const keys = this.getMobileView().editOption

        if (!!keys && keys.length > 0) {
            this.doRecursiveRemove(keys, 0)
        }
    }

    doRecursiveBenchToggle(campaignKey, keys, i) {
        if (!!keys && !!keys[i]) {
            this.$rsd.campaigns.updateMemberBench(campaignKey, keys[i], (success) => {
                if (!!success) {
                    this.doRecursiveBenchToggle(campaignKey, keys, i+1)
                }
            })
        }
    }

    doRecursiveRemove(keys, i) {
        if (!!keys && !!keys[i]) {
            this.$rsd.members.removeMember(keys[i], (success) => {
                if (!!success) {
                    this.doRecursiveRemove(keys, i+1)
                }
            })
        }
    }
}

const MENU = new EncounterOverviewMenu()

export default MENU