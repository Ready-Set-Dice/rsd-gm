<template>
    <div v-show="settingsState.page == 'general'" v-if="!settingsState.account">
        <span>General settings are set here.</span>
        <div class="d-flex align-center py-2" >
            <span class="mr-1">Proficiency without level</span>
            <v-simple-checkbox
                :value="profnolevelValue"
                dense
                outlined
                hide-details
                :ripple="false"
                @click="profnolevelChange"
            ></v-simple-checkbox>
        </div>
        <v-btn color="primary" class="inverse--text" @click="saveSettings">Save</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profnolevelValue: false,
        }
    },
    computed: {
        settingsState: {
            get() {
                return this.rsd.gamestate.view.settings
            }
        },
    },
    methods: {
        setValues() {
            this.profnolevelValue = this.setPROFNOLEVEL()
        },
        setPROFNOLEVEL() {
            let sIndex = !!this.settingsState.account ? this.settings.account.profnolevel : (
                !!this.settingsState.campaign && !!this.settings[this.settingsState.campaign] && this.settings[this.settingsState.campaign].profnolevel
                ? this.settings[this.settingsState.campaign].profnolevel
                : false
            )

            console.log('setPROFNOLEVEL', this.settingsState.account, this.settings[this.settingsState.campaign], sIndex)

            return sIndex
        },
        profnolevelChange(value) {
            this.profnolevelValue = !this.profnolevelValue
        },
        saveSettings() {
            let profnolevel = this.profnolevelValue

            this.$rsd.settings.saveData({account: this.settingsState.account, campaign: this.settingsState.campaign}, this.settingsState.page, {profnolevel: profnolevel})
        }
    }
}
</script>

<style>

</style>