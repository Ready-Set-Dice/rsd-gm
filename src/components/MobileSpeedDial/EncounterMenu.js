import { MobileActionMenu } from '@root/.shared/classes/MobileActionMenu'
import { dmgTypes, healTypes, conditionTypes } from '@root/.shared/constants/gametypes'

const SHEETS = {
    'edit': [
        {icon: 'mdi-form-textbox', text: 'Rename NPC', value:'rename',
        function: (item) => {
            if (!!item) {
                const nameTemplate = !!item.name ? item.name : this.$rsd.bestiary.getName(item.bid)
                MENU.$rsd.dialog.open({name: 'npcNameDialog', attrs: [true, {...item, name: nameTemplate}, {combat: false}]})
            }
        }},
        {icon: 'mdi-palette', text: 'Change color', value:'color',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'npcStyleDialog', attrs: [true, {...item}, {combat: false}]})
            }
        }},
        {icon: 'mdi-sort', text: 'Change initiative', value:'initiative',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'npcInitiativeDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-trash-can', text: 'Delete from encounter', value:'delete', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })

                MENU.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Remove Encounter Member', 
                    `Are you sure you want to remove the encounter member${MENU.getMembersCount(items) > 1 ? 's' : ''}?`,
                    () => {MENU.doDelete()}
                ]})
            }
        }},
    ],
    'adjustment': [
        {icon: 'mdi-wifi-strength-outline', text: 'Change to weak', value:'weak', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })

                MENU.doChangeStrength('weak')
            }
        }},
        {icon: 'mdi-wifi-strength-2', text: 'Change to normal', value:'normal', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })

                MENU.doChangeStrength('normal')
            }
        }},
        {icon: 'mdi-wifi-strength-4', text: 'Change to elite', value:'elite', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })

                MENU.doChangeStrength('elite')
            }
        }},

    ]
}

class EncounterMenu extends MobileActionMenu {
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
                {icon: 'mdi-wifi', function: () => { this.$rsd.bottomsheet.open('adjustment') }},
                {icon: 'mdi-sort', function: () => { this.doSortMode() }},
                {icon: 'mdi-plus', function: () => { this.doAdd() }},
            ],
        }
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

    doChangeStrength(adj) {
        if (!this.getMobileView() || !this.getMobileView().editOption) { return }

        const keys = this.getMobileView().editOption

        if (!!keys && keys.length > 0) {
            this.doRecursiveChangeStrength(adj, keys, 0)
        }
    }

    doDelete(){
        if (!this.getMobileView() || !this.getMobileView().editOption) { return }

        const keys = this.getMobileView().editOption

        if (!!keys && keys.length > 0) {
            this.doRecursiveRemove(keys, 0)
        }
    }

    doRecursiveChangeStrength(adj, keys, i) {
        if (!!keys && !!keys[i]) {
            this.$rsd.encounters.updateMember(keys[i].id, {adj: adj}, (success) => {
                if (!!success) {
                    this.doRecursiveChangeStrength(adj, keys, i+1)
                }
            })
        }
    }

    doRecursiveRemove(keys, i) {
        if (!!keys && !!keys[i]) {
            this.$rsd.encounters.removeMember(keys[i].id, (success) => {
                if (!!success) {
                    this.doRecursiveRemove(keys, i+1)
                }
            })
        }
    }

    doSortMode() {
        this.$store.dispatch('rsd/setMobileView', {
            ...this.getMobileView(),
            sortMode: true
        })
    }
}

const MENU = new EncounterMenu()

export default MENU