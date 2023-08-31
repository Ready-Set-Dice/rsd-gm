import { MobileActionMenu } from '@root/.shared/classes/MobileActionMenu'

const SHEETS = {
    'edit': [
        {icon: 'mdi-form-textbox', text: 'Rename campaign', value:'rename',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'campaignDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-palette', text: 'Change style', value:'style',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'campaignStyleDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-arrow-up-bold-hexagon-outline', text: 'Set party level', value:'level',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'campaignLevelDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-link', text: 'Copy invite link', value:'copy',
        function: (item) => {
            if (!!item) {
                navigator.clipboard.writeText(MENU.$rsd.campaigns.getInviteLink(item.id)).then((result) => {
                    MENU.$rsd.dialog.open({name: 'snackbarManager', attrs: [
                        'Copied',
                        'Link was copied to your clipboard.'
                    ]})
                }, (error) => {
                    console.log(error)
                })
            }
        }},
        {icon: 'mdi-trash-can', text: 'Remove campaign', value:'delete', multiple: true,
        function: (items) => {
            if (!!items && items.length > 0) {
                MENU.$store.dispatch('rsd/setMobileView', {
                    ...MENU.getMobileView(),
                    editOption: items,
                })
                MENU.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Remove Campaign', 
                    `Are you sure you want to remove the campaign${MENU.getMembersCount(items) > 1 ? 's' : ''}?`,
                    () => {MENU.doDelete()}
                ]})
            }
        }},
    ]
}

class CampaignOverviewMenu extends MobileActionMenu {
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

    doAdd() {
        this.$rsd.dialog.open({name: 'campaignDialog', attrs: [false, {}]})
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
            this.$rsd.campaigns.removeParty(keys[i].id, (success) => {
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

const MENU = new CampaignOverviewMenu()

export default MENU