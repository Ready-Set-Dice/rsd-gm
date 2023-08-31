<template>
    <v-container
        fill-height
        fluid
        class="ma-0 pa-0 align-start d-flex flex-grow-1 flex-column"
    >
        <v-app-bar
            height="32"
            style="width: 100%; max-height:32px"
            class="navblend"
            :class="!!rsd.darkmode ? '' : 'darken-1'"
            elevation="2"
            :style="'top:-32px;'"
            app
            absolute
        >
            <div class="d-flex justify-start align-center" :style="'width: 100%;'">
                <div :style="'position: absolute; left: 0;'">
                    <v-btn icon small tile class="primary--text" 
                        @click="menu.back()"
                        v-show="!!hasBackButton"
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                </div>
            </div>
            <MobileSpeedDial />

        </v-app-bar>
        <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Campaign' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Campaign'">
            <CampaignsMenuMobile />
        </div>
        <!-- Party View -->
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Party' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Party'">
                <PartyMenuMobile v-show="!mobileView.partySelected" />
                <PartyViewMobile v-show="!!mobileView.partySelected" />
            </div>
        </v-slide-x-reverse-transition>
        <!-- Search View -->
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Search' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Search'">
                <SearchMenuMobile v-show="!mobileView.searchSelected" />
                <div class="fill-height flex-grow-1 width-100" v-show="!!mobileView.searchSelected">
                    <SpellSheet
                        :spell="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.search 
                        && !!rsd.gamestate.view.search.selected ? rsd.gamestate.view.search.selected : null"
                        :visible="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Spells'"
                        :containerClass="'mobile-view'"
                    />
                    <BestiarySheet
                        :visible="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Bestiary'"
                        :bestiary="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.search 
                        && !!rsd.gamestate.view.search.selected ? $rsd.bestiary.getObject(rsd.gamestate.view.search.selected._id) : null"
                        :containerClass="'mobile-view'"
                    />
                    <!-- <span>{{rsd.gamestate.view.search.selected}}</span> -->
                </div>
            </div>
        </v-slide-x-reverse-transition>
        <!-- Settings View -->
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Settings' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Settings'">
                <SettingsMenuMobile v-show="!mobileView.settingDetailsSelected" />
                <SettingsView v-show="!!mobileView.settingDetailsSelected" />
            </div>
        </v-slide-x-reverse-transition>
        <div
            class="d-flex width-100 button-footer flex-column"
        >
            <div class="d-flex flex-row">            
                <template v-for="(submenu, index) in menu.submenus">
                    <div class="d-flex flex-grow-1" :key="'submenu-'+index" :style="'flex-basis: 0;'">
                        <v-btn 
                            tile 
                            class="d-flex flex-grow-1"
                            :class="mobileView.navigation == submenu.name ? 'primary--text' : 'grey--text'"
                            :disabled="!mobileView.campaignSelected && submenu.name == 'Party'"
                            height="64" 
                            @click="navigation.click(submenu.name)"
                        >
                            <div class="d-flex flex-column">
                                <v-icon>{{submenu.icon}}</v-icon>
                                <span class="text-caption">{{submenu.name}}</span>
                            </div>
                        </v-btn>
                    </div>
                </template>
            </div>
        </div>
        
    </v-container>
</template>

<script>
import CampaignsMenuMobile from '@/components/CampaignsMenu/CampaignsMenuMobile'
import PartyMenuMobile from '@/components/PartyMenu/PartyMenuMobile'
import PartyViewMobile from '@root/.shared/components/PartyView/PartyViewMobile'
import SearchMenuMobile from '@/components/SearchMenu/SearchMenuMobile'
import SettingsMenuMobile from '@/components/SettingsMenu/SettingsMenuMobile'
import SettingsView from '@/components/SettingsView/SettingsView'

import MobileSpeedDial from '@/components/MobileSpeedDial/MobileSpeedDial'

import BestiarySheet from '@root/.shared/components/CombatantSheet/BestiarySheet'
import SpellSheet from '@root/.shared/components/SpellSheet/SpellSheet'

import BaseBottomSheetMenu from '@root/.shared/components/base/BaseBottomSheetMenu'
import BaseSpeedDial from '@root/.shared/components/base/BaseSpeedDial'

export default {
    components: {
        CampaignsMenuMobile,
        PartyMenuMobile,
        PartyViewMobile,
        SearchMenuMobile,
        SettingsMenuMobile,
        SettingsView,

        MobileSpeedDial,

        BestiarySheet,
        SpellSheet,

        BaseBottomSheetMenu,
        BaseSpeedDial,
    },
    watch: {
    },
    data() {
        return {
            combatAction: {name: 'addalarm', icon: 'mdi-alarm-plus', text: 'Add an alarm', value:'addalarm'},
            combatActionSelected: [],
            sheet: false,

            campaignDrag: false,
            encounterDrag: false,

            showArray: false,

            dyingQueue: [],
            
            menu: {
                selected: (name) => {
                    return this.rsd.gamestate.current == name
                },
                submenus: [
                    {name: 'Campaign', icon: 'mdi-view-dashboard'},
                    {name: 'Party', icon: 'mdi-account-group'},
                    {name: 'Search', icon: 'mdi-magnify'},
                ],
                
                select: (name) => {
                    if (name == 'Home') {
                        window.location.href = "https://readysetdice.com";
                    } else if (name == 'Player') {
                        window.location.href = "https://pc.readysetdice.com";
                    } else {
                        this.$route.meta.customTitle = name

                        if (this.rsd.gamestate.current != name) {
                            this.$store.dispatch('rsd/setGamePage', name)
                        } else {
                            this.$store.dispatch('rsd/setGamePage', null)
                        }
                    }
                },

                back: () => {
                    this.$store.dispatch('rsd/setMobileView', {
                        ...this.mobileView,
                        sortMode: false
                    })

                    if (this.mobileView.navigation == 'Campaign') {
                        if (!!this.mobileView.combatantSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                campaignSelected: true,
                                encounterSelected: true,
                                combatantSelected: false,
                                addCombatantSelected: false,
                                targetSelected: false,
                            })
                        } else if (!!this.mobileView.targetSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                campaignSelected: true,
                                encounterSelected: true,
                                combatantSelected: false,
                                addCombatantSelected: true,
                                targetSelected: false,
                            })
                        } else if (!!this.mobileView.addCombatantSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                campaignSelected: true,
                                encounterSelected: true,
                                combatantSelected: false,
                                addCombatantSelected: false,
                                targetSelected: false,
                            })
                        } else if (!!this.mobileView.encounterSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                campaignSelected: true,
                                encounterSelected: false,
                                combatantSelected: false,
                                addCombatantSelected: false,
                                targetSelected: false,
                            })
                        } else if (!!this.mobileView.campaignSelected) {
                            this.$route.meta.customTitle = 'GM Mobile Dashboard'

                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                campaignSelected: false,
                                encounterSelected: false,
                                combatantSelected: false,
                                addCombatantSelected: false,
                                targetSelected: false,
                            })
                        }
                    } else if (this.mobileView.navigation == 'Party') {
                        if (!!this.mobileView.partySelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                partySelected: false,
                            })
                        }
                    } else if (this.mobileView.navigation == 'Search') {
                        if (!!this.mobileView.searchSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                searchSelected: false,
                            })
                        }
                    } else if (this.mobileView.navigation == 'Settings') {
                        if (!!this.mobileView.settingDetailsSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                settingTypeSelected: true,
                                settingDetailsSelected: false,
                            })
                        } else if (!!this.mobileView.settingTypeSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                settingTypeSelected: false,
                                settingDetailsSelected: false,
                            })
                        }
                    }
                },
            },

            navigation: {
                click: (name) => {
                    if (!!name) {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            sortMode: false,
                            navigation: name
                        })

                        this.$store.dispatch('rsd/setGamePage', name)
                    }
                },
                current: (name) => {
                    if (name == 'Campaigns') {
                        return !this.mobileView.navigation || this.mobileView.navigation == name
                    } else {
                        return !!this.mobileView.navigation && this.mobileView.navigation == name
                    }
                },
            },
        }
    },
    computed: {
        campaignSelected() {          
            return !!this.navigation.current('Campaign') && !!this.mobileView.campaignSelected && !this.mobileView.encounterSelected 
        },
        encounterSelected() {          
            return !!this.navigation.current('Campaign') && !!this.mobileView.campaignSelected && !!this.mobileView.encounterSelected 
        },
        hasBackButton() {
            if (!!this.mobileView) {
                if (this.mobileView.navigation == 'Campaign') {
                    return !!this.mobileView.campaignSelected || !!this.mobileView.encounterSelected
                } else if (this.mobileView.navigation == 'Party') {
                    return !!this.mobileView.partySelected
                } else if (this.mobileView.navigation == 'Search') {
                    return !!this.mobileView.searchSelected
                } else if (this.mobileView.navigation == 'Settings') {
                    return !!this.mobileView.settingTypeSelected
                }
            }

            return false
        },
    },
    mounted() {
        if (!!this.mobileView.campaignSelected) {
            this.$route.meta.customTitle = this.campaignActive.name
        }
    },
}
</script>

<style lang="less" scoped>
.no-flex {
    flex: none;
}

.button-footer {
    position: fixed;
    bottom: 0px;
}

.content-list {
    height: calc(~"100vh - 144px");
    overflow-y: auto;
}

.fade-x-width-transition {
    &-leave-active {
        transition: all .2s ease;
    }
    
    &-enter-active {
        transition: all .3s ease;
    }

    &-enter, &-leave-to {
        opacity: 0;
        width: 1px;
    }
}

.show-checkbox {
    width: 32px;
    opacity: 1;
}

.hide-checkbox {
    width: 0px;
    opacity: 0;
}

</style>