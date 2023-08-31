<template>
    <div v-if="!!settingsState" class="pa-4 flex-grow-1">
        <span v-show="!!settingsState.account"><span class="font-weight-bold">Note</span> that these settings apply to all campaigns, unless otherwise defined in their respective panels.<br/></span>
        <GeneralSettings ref="generalSettings" />
        <CombatSettings ref="combatSettings" />
        <CustomSettings ref="customSettings" />
    </div>
</template>

<script>
import CombatSettings from './components/CombatSettings'
import CustomSettings from './components/CustomSettings'
import GeneralSettings from './components/GeneralSettings'

export default {
    components: {
        CombatSettings,
        CustomSettings,
        GeneralSettings,
    },
    computed: {
        settingsState: {
            get() {
                return this.rsd.gamestate.view.settings
            }
        },
    },
    watch: {
        settingsState: {
            handler: function (newVal, oldVal) {
                this.refreshSettings()
            }
        }
    },
    methods: {
        refreshSettings() {
            if (!!this.$refs && !!this.$refs['generalSettings']) {
                this.$refs['generalSettings'].setValues()
            }
            if (!!this.$refs && !!this.$refs['combatSettings']) {
                this.$refs['combatSettings'].setValues()
            }
            if (!!this.$refs && !!this.$refs['customSettings']) {
                this.$refs['customSettings'].setValues()
            }
        }  
    },
    mounted() {
        this.refreshSettings()
    }
}
</script>

<style>

</style>