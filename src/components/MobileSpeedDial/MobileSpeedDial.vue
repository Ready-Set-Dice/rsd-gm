<template>
    <div>
        <BaseSpeedDial ref="speedDial" :menu="!!currentContent ? currentContent.getDailMenu() : null" />
        <BaseBottomSheetMenu ref="bottomSheet" :members="bottomSheetMembers" />
    </div>
</template>

<script>
import BaseBottomSheetMenu from '@root/.shared/components/base/BaseBottomSheetMenu'
import BaseSpeedDial from '@root/.shared/components/base/BaseSpeedDial'

import CampaignOverviewMenu from './CampaignOverviewMenu'
import CombatActionMenu from './CombatActionMenu'
import EncounterMenu from './EncounterMenu'
import EncounterOverviewMenu from './EncounterOverviewMenu'
import PartyOverviewMenu from './PartyOverviewMenu'

export default {
    components: {
        BaseBottomSheetMenu,
        BaseSpeedDial,
    },
    computed: {
        bottomSheetMembers() {
            if (!!this.isCurrentCombat) {
                return this.combatantsArray
            } else if (!!this.isSelectedEncounter) {
                return this.encounterMembersArrayReadOnly
            } else if (!!this.isEncounterOverview) {
                return this.encounterArray
            } else if (!!this.isCampaignOverview) {
                return this.campaignArray
            } else if (!!this.isPartyOverview) {
                return this.membersArray
            } else {
                return null
            }
        },

        currentContent() {
            if (!!this.isCurrentCombat) {
                return CombatActionMenu
            } else if (!!this.isSelectedEncounter) {
                return EncounterMenu
            } else if (!!this.isEncounterOverview) {
                return EncounterOverviewMenu
            } else if (!!this.isCampaignOverview) {
                return CampaignOverviewMenu
            }  else if (!!this.isPartyOverview) {
                return PartyOverviewMenu
            } else {
                return null
            }
        }
    },
    data() {
        return {
        }
    },
    methods: {
        openBottomSheet(data) {
            if (!!data && !!data.name) {
                this.getDialog('bottomSheet').open(this.currentContent.getBottomSheet(data.name))
            }
        },
    },
    watch: {
        bottomsheetUID (newVal, oldVal) {
            if (newVal != oldVal) {
                
                if (!!this.bottomsheet && !!this.bottomsheet.name) {
                    this.openBottomSheet(this.bottomsheet)
                }
            }
        },
    },
}
</script>