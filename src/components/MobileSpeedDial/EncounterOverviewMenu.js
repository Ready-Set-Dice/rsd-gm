import { MobileActionMenu } from '@root/.shared/classes/MobileActionMenu'

const SHEETS = {
    'edit': [
        {icon: 'mdi-form-textbox', text: 'Edit encounter', value:'rename',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'encounterDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-palette', text: 'Change style', value:'style',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'encounterStyleDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-sword-cross', text: 'Load into combat', value:'load',
        function: (item) => {
            if (!!item && !!item.id) {
                if (MENU.getEncounterActiveKey() != item.id) {
                    MENU.$rsd.encounters.activeKey = item.id
                }
                MENU.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Use Encounter', 
                    `Are you sure you want to use the encounter ${item.name}?`,
                    () => {MENU.doCombat()}
                ]})
            }
        }},
        {icon: 'mdi-trash-can', text: 'Remove encounter', value:'delete', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })
                MENU.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Remove Encounter', 
                    `Are you sure you want to remove the encounter${MENU.getMembersCount(items) > 1 ? 's' : ''}?`,
                    () => {MENU.doDelete()}
                ]})
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

    getDailMenu() {
        return {
            top: true,
            buttons: [
                {icon: 'mdi-pencil', function: () => { this.$rsd.bottomsheet.open('edit') }},
                {icon: 'mdi-sort', function: () => { this.doSortMode() }},
                {icon: 'mdi-plus', function: () => { this.doAdd() }},
            ],
        }
    }

    getEncounterActiveKey() {
        return this.$store.getters['remotedb/encounterActiveKey']
    }

    doAdd() {
        const partylevel = !!this.$rsd.campaigns.active && !!this.$rsd.campaigns.active.level ? this.$rsd.campaigns.active.level : 1
        const partysize = !!this.$rsd && !!this.$rsd.members && !!this.$rsd.members.all && !!this.$rsd.members.all.length ? this.$rsd.members.all.length : 1
        this.$rsd.dialog.open({name: 'encounterDialog', attrs: [false, {level: partylevel, partysize: partysize}]})
    }

    doCombat() {
        setTimeout(() => {
            this.$rsd.combat.useEncounter(this.$rsd.encounters.members)
            this.$store.dispatch('rsd/setCombatViewSelecting', false)

            if (!this.$store.getters['rsd/gamestate'].menu.campaign.combat) {
                setTimeout(() => {
                    this.$store.dispatch('rsd/setCombatState', true)
                }, 75)
            }

            setTimeout(() => {
                this.$store.dispatch('rsd/setMobileView', {
                    ...this.getMobileView(),
                    campaignSelected: true,
                    encounterSelected: true,
                })
            }, 100)
        }, 50)
    }

    doDelete(){
        if (!this.getMobileView() || !this.getMobileView().editOption) { return }

        const keys = this.getMobileView().editOption

        if (!!keys && keys.length > 0) {
            this.doRecursiveRemove(keys, 0)
        }
    }

    doRecursiveRemove(keys, i) {
        if (!!keys && !!keys[i]) {
            this.$rsd.encounters.removeEncounter(keys[i].id, (success) => {
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

const MENU = new EncounterOverviewMenu()

export default MENU