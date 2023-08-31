<template>
    <div v-if="!!helpState" class="pa-4 flex-grow-1">
        <div class="alt-scrollbar help-view" v-html="topics[helpState.topic].pages[helpState.page]"></div>
    </div>
</template>

<script>

import GeneralWelcome from './pages/general/welcome'
import GeneralInterface from './pages/general/interface'
import GeneralShortcuts from './pages/general/shortcuts'

import SetupCampaign from './pages/setup/campaign'
import SetupInvite from './pages/setup/invite'
import SetupGMC from './pages/setup/gmc'
import SetupEncounter from './pages/setup/encounter'
import SetupCombat from './pages/setup/combat'

import CampaignRenaming from './pages/campaign/renaming'
import CampaignStyle from './pages/campaign/style'
import CampaignRemove from './pages/campaign/remove'

import CombatAlerts from './pages/combat/alerts'
import CombatConditions from './pages/combat/conditions'
import CombatDamage from './pages/combat/damage'

import Placeholder from './pages/placeholder'

export default {
    props: {
    },
    components: {
    },
    data() {
        return {
            topics: {
                general: {
                    pages: {
                        welcome: GeneralWelcome,
                        interface: GeneralInterface,
                        shortcuts: GeneralShortcuts,
                    },
                },
                setup: {
                    pages: {
                        campaign: SetupCampaign,
                        'inviting players': SetupInvite,
                        'gm characters': SetupGMC,
                        encounter: SetupEncounter,
                        combat: SetupCombat,
                    },
                },
                combat: {
                    pages: {
                        alerts: CombatAlerts,
                        conditions: CombatConditions,
                        damage: CombatDamage,
                        health: Placeholder,
                        'loading encounters': Placeholder,
                        members: Placeholder,
                        spells: Placeholder,
                    },
                },
                campaign: {
                    pages: {
                        'rename campaign': CampaignRenaming,
                        'edit style': CampaignStyle,
                        'inviting players': SetupInvite,
                        'gm characters': SetupGMC,
                        'removing members': CampaignRemove,
                        'deleting': Placeholder,
                    }
                },
                gmc: {
                    pages: {
                        creating: SetupGMC,
                        renaming: Placeholder,
                        'edit skills': Placeholder,
                        'edit stats': Placeholder,
                        'removing members': Placeholder,
                    } 
                },
                encounter: {
                    pages: {
                        creating: SetupEncounter,
                        renaming: Placeholder,
                        'edit style': Placeholder,
                        'load into combat': Placeholder,
                        'removing members': Placeholder,
                    }
                },
                custom: {
                    pages: {
                        creatures: Placeholder,
                    },
                },
                search: {
                    pages: {
                        bestiary: Placeholder,
                        spells: Placeholder,
                    },
                },
                select: (topic) => {
                    let newTopic = !!topic ? topic : 'general'
                    let newPage = this.topics[topic].pages[0].toLowerCase()

                    this.$store.dispatch('rsd/setHelpPage', {topic: newTopic, page: newPage})
                },
            },
        }
    },
    computed: {
        helpState: {
            get() {
                return this.rsd.gamestate.view.help
            }
        },
    },
    methods: {
    },
}
</script>

<style lang="less" scoped>
.help-view {
    height: calc(~"100vh - 128px");
    overflow-y: auto;
}
</style>