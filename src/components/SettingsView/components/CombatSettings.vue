<template>
    <div v-show="settingsState.page == 'combat'">
        <span>Settings related to combat are set here.</span>
        <div class="d-flex align-center py-2">
            <v-select
                :value="npcnameValue"
                :items="npcnameItems"
                dense
                outlined
                hide-details
                label="NPC name info"
                @change="npcnameChange"
            >
            </v-select>
            <v-menu
                :close-on-content-click="false"
                offset-x
                :nudge-left="525"
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
                    width="525"
                >
                    <v-card-title>NPC name info</v-card-title>
                    <v-card-text>
                        <b>Level of info</b> revealed to <b>players</b> in regards to <b>NPC identifier</b> and <b>unique id</b>.<br/>
                        <b>None:</b> no info besides an undescriptive id.<br/>
                        <b>Full:</b> show the unique id or creature name & identifier.<br/>
                        <b>Identifier and unique id:</b> show the identifier and unique id if available.<br/>
                        <b>Unique id:</b> show the unique id if available.
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>
        <div class="d-flex align-center py-2">
            <v-select
                :value="pchpValue"
                :items="pchpItems"
                dense
                outlined
                hide-details
                label="Party health info"
                @change="pchpChange"
            >
            </v-select>
            <v-menu
                :close-on-content-click="false"
                offset-x
                :nudge-left="450"
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
                    width="450"
                >
                    <v-card-title>Party health info</v-card-title>
                    <v-card-text>
                        <b>Level of info</b> revealed to <b>players</b> in regards to <b>eachothers health</b>.<br/>
                        <b>None:</b> no info beside death is revealed.<br/>
                        <b>Full:</b> show an accurate number indicator.<br/>
                        <b>Partial:</b> show a sliding scale indicator that somewhat vague.
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
            npcnameValue: 'none',
            pchpValue: 'none',
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
            this.npcnameValue = this.setNPCNAME()
            this.pchpValue = this.setPCHP()
        },
        setNPCNAME() {
            let sIndex = !!this.settingsState.account ? this.settings.account.npcname : (
                !!this.settingsState.campaign && !!this.settings[this.settingsState.campaign] && this.settings[this.settingsState.campaign].npcname
                ? this.settings[this.settingsState.campaign].npcname
                : this.$rsd.settings.values.npcname.length
            )
            return this.npcnameItems[sIndex]
        },
        setPCHP() {
            let sIndex = !!this.settingsState.account ? this.settings.account.pchp : (
                !!this.settingsState.campaign && !!this.settings[this.settingsState.campaign] && this.settings[this.settingsState.campaign].pchp
                ? this.settings[this.settingsState.campaign].pchp
                : this.$rsd.settings.values.pchp.length
            )
            return this.pchpItems[sIndex]
        },
        npcnameChange(value) {
            this.npcnameValue = value
        },
        pchpChange(value) {
            this.pchpValue = value
        },
        saveSettings() {
            let npcname = this.$rsd.settings.getIndex('npcname', this.npcnameValue)
            let pchp = this.$rsd.settings.getIndex('pchp', this.pchpValue)

            this.$rsd.settings.saveData({account: this.settingsState.account, campaign: this.settingsState.campaign}, this.settingsState.page, {npcname: npcname, pchp: pchp})
        }
    }
}
</script>

<style>

</style>