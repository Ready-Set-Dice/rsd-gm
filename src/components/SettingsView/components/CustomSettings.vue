<template>
    <div v-show="settingsState.page == 'custom'">
        <span>Settings related to custom content are set here.</span>
        <div class="d-flex align-center py-2">
            <v-text-field
                :value="gitnameValue"
                dense
                outlined
                hide-details
                label="Github repository name"
                :placeholder="!settingsState.account ? 'Leave empty for account setting' : ''"
                @change="gitnameChange"
            >
            </v-text-field>
            <v-menu
                :close-on-content-click="false"
                offset-x
                :nudge-left="500"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-on="on"
                        v-bind="attrs"
                        outlined
                        small
                        icon 
                        class="text-body-1 ml-2"
                    >?</v-btn>
                </template>
                <v-card
                    elevation="5"
                    width="500"
                >
                    <v-card-title>Github repository name</v-card-title>
                    <v-card-text>
                        The <b>github repository name</b> in which the custom creatures are defined.
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>
        <div class="d-flex align-center py-2">
            <v-text-field
                :value="gitownerValue"
                dense
                outlined
                hide-details
                label="Github owner name"
                :placeholder="!settingsState.account ? 'Leave empty for account setting' : ''"
                @change="gitownerChange"
            >
            </v-text-field>
            <v-menu
                :close-on-content-click="false"
                offset-x
                :nudge-left="475"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-on="on"
                        v-bind="attrs"
                        outlined
                        small
                        icon 
                        class="text-body-1 ml-2"
                    >?</v-btn>
                </template>
                <v-card
                    elevation="5"
                    width="475"
                >
                    <v-card-title>Github owner name</v-card-title>
                    <v-card-text>
                        The <b>github owner name</b> in which the custom creatures are defined.
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>
        <v-btn color="primary" class="inverse--text" @click="saveSettings">Save</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            gitnameValue: '',
            gitownerValue: '',
        }
    },
    computed: {
        settingsState: {
            get() {
                return this.rsd.gamestate.view.settings
            }
        },
        npcnameItems: {
            get() {
                if (!!this.settingsState.account) {
                    return this.$rsd.settings.values.npcname
                } else {
                    return this.$rsd.settings.values.npcname.concat('global account setting')
                }
            }
        },
        pchpItems: {
            get() {
                if (!!this.settingsState.account) {
                    return this.$rsd.settings.values.pchp
                } else {
                    return this.$rsd.settings.values.pchp.concat('global account setting')
                }
            }
        },
    },
    methods: {
        setValues() {
            this.gitnameValue = this.setGITNAME()
            this.gitownerValue = this.setGITOWNER()
        },
        setGITNAME() {
            let sIndex = !!this.settingsState.account ? this.settings.account.gitname : (
                !!this.settingsState.campaign && !!this.settings[this.settingsState.campaign] && this.settings[this.settingsState.campaign].gitname
                ? this.settings[this.settingsState.campaign].gitname
                : null
            )
            return sIndex
        },
        setGITOWNER() {
            let sIndex = !!this.settingsState.account ? this.settings.account.gitowner : (
                !!this.settingsState.campaign && !!this.settings[this.settingsState.campaign] && this.settings[this.settingsState.campaign].gitowner
                ? this.settings[this.settingsState.campaign].gitowner
                : null
            )
            return sIndex
        },
        gitnameChange(value) {
            this.gitnameValue = value
        },
        gitownerChange(value) {
            this.gitownerValue = value
        },
        saveSettings() {
            let gitname = this.gitnameValue
            let gitowner = this.gitownerValue

            this.$rsd.settings.saveData({account: this.settingsState.account, campaign: this.settingsState.campaign}, this.settingsState.page, {gitname: gitname, gitowner: gitowner})
        }
    }
}
</script>

<style>

</style>