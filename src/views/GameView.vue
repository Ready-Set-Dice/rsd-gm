<template>
    <v-container
        fill-height
        fluid
        class="ma-0 pa-0 align-start d-flex flex-grow-1 flex-column"
    >
        <!-- Secondary toolbar -->
        <v-app-bar
            height="32"
            style="width: 100%; max-height:32px"
            class="navblend"
            :class="!!rsd.darkmode ? '' : 'darken-1'"
            elevation="2"
        >
            <div class="d-flex justify-start" :style="'width: 100%;'">
                <EventHistory :hidden="!views.combatInitiative.visible()" />
                <span 
                    class="justify-space-between px-2 ml-9"
                    :class="!!encounterActiveKey && !!views.encounter.visible() ? (!!rsd.darkmode ? 'd-flex theme--dark' : 'd-flex') : 'd-none'"
                >
                    <v-switch
                        :input-value="rsd.gamestate.view.encounter.partyAppropriate"
                        hide-details
                        :label="`Search around party level (${getSearchPartyLevel})`"
                        @change="toggleSearchPartyAppropriate"
                    >
                    </v-switch>
                </span>
                
                <span 
                    :style="'position: absolute; top: 3px; right: 5px;'"
                >
                    <!-- <span
                        v-show="views.combatInitiative.visible()"
                        class="mx-1"
                    >
                        <v-btn 
                            small
                            icon 
                            tile
                        >
                            <v-icon>mdi-heart-plus</v-icon>
                        </v-btn>
                        <v-btn 
                            small
                            icon 
                            tile
                        >
                            <v-icon>mdi-sword</v-icon>
                        </v-btn>
                        <v-btn 
                            small
                            icon 
                            tile
                        >
                            <v-icon>mdi-virus-outline</v-icon>
                        </v-btn>
                    </span>
                    <span
                        class="mr-1"
                        :style="'height:19px;'"
                    >
                        <v-divider vertical></v-divider>
                    </span> -->

                    <span
                        v-show="views.combatInitiative.visible() && rsd.gamestate.view.combat.viewmode == 'overlap'"
                        class="mx-1"
                    >
                        <span class="mr-1">{{!!rsd.gamestate.view.combat.overlapShowTarget ? 'Target' : 'Current'}}</span>
                        <v-btn
                            small
                            icon
                            tile
                            v-shortkey.once="['alt', 'q']"
                            @shortkey="toggleShowOverlapTarget()"
                            @click="toggleShowOverlapTarget()"
                        >
                            <v-icon>{{!!rsd.gamestate.view.combat.overlapShowTarget ? 'mdi-vector-difference-ab' : 'mdi-vector-difference-ba'}}</v-icon>
                        </v-btn>
                    </span>
                    <span
                        v-show="views.encounter.visible() && rsd.gamestate.view.encounter.viewmode == 'overlap'"
                        class="mx-1"
                    >
                        <span class="mr-1">{{!!rsd.gamestate.view.encounter.overlapShowTarget ? 'Target' : 'Current'}}</span>
                        <v-btn
                            small
                            icon
                            tile
                            v-shortkey.once="['alt', 'q']"
                            @shortkey="toggleShowOverlapTarget()"
                            @click="toggleShowOverlapTarget()"
                        >
                            <v-icon>{{!!rsd.gamestate.view.encounter.overlapShowTarget ? 'mdi-vector-difference-ab' : 'mdi-vector-difference-ba'}}</v-icon>
                        </v-btn>
                    </span>
                    <v-menu
                        v-model="toolbar.viewmodeMenu"
                        :nudge-width="200"
                        offset-x
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn 
                                small
                                icon 
                                tile
                                v-show="views.combatInitiative.visible()"
                                class="mr-1" 
                                v-bind="attrs"
                                v-on="on"
                                v-shortkey.once="{column: ['alt','1'], row: ['alt','2'], tactical: ['alt','3'], overlap: ['alt','4']}"
                                @shortkey="switchView"
                            >
                                <v-icon v-if="rsd.gamestate.view.combat.viewmode == 'column'">mdi-view-stream</v-icon>
                                <v-icon v-else-if="rsd.gamestate.view.combat.viewmode == 'row'">mdi-view-column</v-icon>
                                <v-icon v-else-if="rsd.gamestate.view.combat.viewmode == 'tactical'">mdi-view-day</v-icon>
                                <v-icon v-else-if="rsd.gamestate.view.combat.viewmode == 'overlap'">mdi-vector-selection</v-icon>
                            </v-btn>
                            <v-btn 
                                small
                                icon 
                                tile
                                v-show="views.encounter.visible()"
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                v-shortkey.once="{column: ['alt','1'], row: ['alt','2'], tactical: ['alt','3'], overlap: ['alt','4']}"
                                @shortkey="switchView"
                            >
                                <v-icon v-if="rsd.gamestate.view.encounter.viewmode == 'column'">mdi-view-stream</v-icon>
                                <v-icon v-else-if="rsd.gamestate.view.encounter.viewmode == 'row'">mdi-view-column</v-icon>
                                <v-icon v-else-if="rsd.gamestate.view.encounter.viewmode == 'overlap'">mdi-vector-selection</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-list dense>
                                <v-list-item link @click="toolbar.viewmodeClick('column')">
                                    <v-list-item-icon><v-icon>mdi-view-stream</v-icon></v-list-item-icon>
                                    <v-list-item-title>Switch to row view</v-list-item-title>
                                </v-list-item>
                                <v-list-item link @click="toolbar.viewmodeClick('row')">
                                    <v-list-item-icon><v-icon>mdi-view-column</v-icon></v-list-item-icon>
                                    <v-list-item-title>Switch to column view</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-show="!!views.combatInitiative.visible()" link @click="toolbar.viewmodeClick('tactical')">
                                    <v-list-item-icon><v-icon>mdi-view-day</v-icon></v-list-item-icon>
                                    <v-list-item-title>Switch to tactical view</v-list-item-title>
                                </v-list-item>
                                <v-list-item link @click="toolbar.viewmodeClick('overlap')">
                                    <v-list-item-icon><v-icon>mdi-vector-selection</v-icon></v-list-item-icon>
                                    <v-list-item-title>Switch to side-by-side view</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>
                </span>
            </div>
        </v-app-bar>

        <!-- Main view -->
        <div class="d-flex flex-grow-1 flex-row width-100">
            <!-- Main menu -->
            <div
                class="navblend"
                style="
                height: 100%; 
                top: 0px; 
                width: 48px;
                border-right-color: rgba(0, 0, 0, 0.12) !important;
                border-right-style: solid;
                border-right-width: 1px;
                "
                :class="!!rsd.darkmode ? '' : 'darken-1'"
            >
                <template v-for="(submenu, index) in menu.submenus">
                    <v-list
                        :key="'submenu-'+index"
                        nav
                        dense
                        class="navblend pa-0 ma-0"
                        :class="!!rsd.darkmode ? '' : 'darken-1'"
                    >
                        <v-list-item 
                            v-for="item in submenu"
                            :key="item.name"
                            link
                            color="primary"
                            class="pa-auto ma-0 page-button"
                            :class="!!menu.selected(item.name) ? 'page-current' : ''"
                            :ripple="false"
                            style="height: 48px; width: 48px; border-radius:0px !important;"
                            @click="!menu.select(item.name)"
                            v-shortkey.once="['alt',item.shortkey]"
                            @shortkey="!!item.shortkey ? menu.select(item.name) : ''"
                        >
                            <v-tooltip right :open-delay="1000" content-class="no-transparancy">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        class="pt-2" 
                                        :class="!!menu.selected(item.name) ? 'ml-0' : 'ml-1'"
                                    >
                                        <v-icon :class="menu.selected(item.name) ? 'primary--text' : ''">{{item.icon}}</v-icon>
                                    </v-list-item-icon>
                                </template>
                                <span>{{item.name}}</span>
                            </v-tooltip>
                        </v-list-item>
                    </v-list>
                    <v-divider v-if="index != 'switch'" :key="'divider-'+index"></v-divider>
                </template>
            </div>
            
            <CampaignsMenu :menu="menu" v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Campaign'" />
            <PartyMenu v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Party'" />
            <SearchMenu v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Search'" />
            <SettingsMenu v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Settings'" />
            <HelpMenu v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Help'" />
            
            <!-- Combat view -->
            <div class="fill-height flex-grow-1" :class="views.combatInitiative.class()" v-show="!!views.combatInitiative.visible()" >
                <CombatantSheet
                    :visible="!!views.combatInitiative.visible() && !!views.combatInitiative.currentVisible(true) && !views.combatInitiative.selecting()"
                    :containerClass="getContainerClass(true, rsd.gamestate.view.combat.viewmode, 'Campaign')"
                    :index="cindex"
                    :instanceArray="'combatantsArray'"
                />
                <v-divider :vertical="getDividerVertical(rsd.gamestate.view.combat.viewmode)"></v-divider>
                <CombatantSheet
                    :visible="!!views.combatInitiative.visible() && !!views.combatInitiative.currentVisible(false)  && !views.combatInitiative.selecting()"
                    :containerClass="getContainerClass(false, rsd.gamestate.view.combat.viewmode, 'Campaign')"
                    :compact="rsd.gamestate.view.combat.viewmode == 'tactical'"
                    :index="!!tindex && (!!tindex._key || tindex._key == 0) ? tindex._key : null"
                    :instanceArray="'combatantsArray'"
                />
                <EncounterMenu
                    :visible="!!views.combatInitiative.visible() && !!views.combatInitiative.currentVisible(true) && !!views.combatInitiative.selecting()"
                    :containerClass="getContainerClass(true, rsd.gamestate.view.combat.viewmode, 'Campaign', '')"
                    :currentCombat="true" 
                />
                <!-- <v-divider :vertical="getDividerVertical(rsd.gamestate.view.combat.viewmode)"></v-divider> -->
                <BestiarySheet
                    :visible="!!views.combatInitiative.visible() && !!views.combatInitiative.currentVisible(true) && !!views.combatInitiative.selecting()"
                    :containerClass="!!tindex ? getContainerClass(!tindex.member, rsd.gamestate.view.combat.viewmode, 'Campaign') : ''"
                    :bestiary="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.encounter
                    && !!rsd.gamestate.view.encounter.target ? $rsd.bestiary.getObject(rsd.gamestate.view.encounter.target._id) : null"
                />
            </div>

            <!-- Encounter view -->
            <div class="fill-height flex-grow-1" :class="views.encounter.class()" v-show="!!views.encounter.visible()">
                <EncounterMenu
                    v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Campaign'"
                    :visible="!!views.encounter.visible() && !!views.encounter.currentVisible(true)"
                    :containerClass="getContainerClass(true, rsd.gamestate.view.encounter.viewmode, 'Campaign', '')"
                    :currentCombat="false" 
                />
                <!-- <v-divider :vertical="getDividerVertical(rsd.gamestate.view.combat.viewmode)"></v-divider> -->
                <BestiarySheet
                    :visible="!!views.encounter.visible() && !!views.encounter.currentVisible(false)"
                    :containerClass="!!tindex ? getContainerClass(!tindex.member, rsd.gamestate.view.encounter.viewmode, 'Campaign') : ''"
                    :bestiary="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.encounter
                    && !!rsd.gamestate.view.encounter.target ? $rsd.bestiary.getObject(rsd.gamestate.view.encounter.target._id) : null"
                />
            </div>

            <!-- Party view -->
            <div class="fill-height flex-grow-1 width-100" :class="views.party.class()" v-show="!!views.party.visible()">
                <CombatantSheet
                    :visible="!!views.party.visible()"
                    :containerClass="simpleContainerClass('Party')"
                    :index="!!tindex && (!!tindex._key || tindex._key == 0) ? tindex._key : null"
                    :nonCombat="true"
                    :instanceArray="'membersArray'"
                />
                <PartyView :visible="!tindex" />
            </div>

            <!-- Search view -->
            <div class="fill-height flex-grow-1 width-100" :class="views.search.class()" v-show="!!views.search.visible()">
                <SpellSheet
                    :spell="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.search 
                    && !!rsd.gamestate.view.search.selected ? rsd.gamestate.view.search.selected : null"
                    :visible="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Spells'"
                    :containerClass="simpleContainerClass('Search')"
                />
                <BestiarySheet
                    :containerClass="simpleContainerClass('Search')"
                    :visible="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Bestiary'"
                    :bestiary="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.search 
                    && !!rsd.gamestate.view.search.selected ? $rsd.bestiary.getObject(rsd.gamestate.view.search.selected._id) : null"
                />
                <!-- <span>{{rsd.gamestate.view.search.selected}}</span> -->
            </div>

            <!-- Help view -->
            <div class="fill-height flex-grow-1 width-100" :class="views.help.class()" v-show="!!views.help.visible()">
                <HelpView />
            </div>

            <!-- Settings view -->
            <div class="fill-height flex-grow-1 width-100" :class="views.settings.class()" v-show="!!views.settings.visible()">
                <SettingsView />
            </div>
        </div>
    </v-container>
</template>

<script>
import CampaignsMenu from '@/components/CampaignsMenu/CampaignsMenu'
import PartyMenu from '@/components/PartyMenu/PartyMenu'
import SearchMenu from '@/components/SearchMenu/SearchMenu'
import EncounterMenu from '@/components/EncounterMenu/EncounterMenu'
import SettingsMenu from '@/components/SettingsMenu/SettingsMenu'
import HelpMenu from '@/components/HelpMenu/HelpMenu'

import BestiarySheet from '@root/.shared/components/CombatantSheet/BestiarySheet'
import CombatantSheet from '@root/.shared/components/CombatantSheet/CombatantSheet'
import EventHistory from '@root/.shared/components/EventHistory'
import HelpView from '@/components/HelpView/HelpView'
import PartyView from '@root/.shared/components/PartyView/PartyView'
import SettingsView from '@/components/SettingsView/SettingsView'
import SpellSheet from '@root/.shared/components/SpellSheet/SpellSheet'

export default {
    components: {
        BestiarySheet,
        CampaignsMenu,
        CombatantSheet,
        EncounterMenu,
        HelpMenu,
        HelpView,
        EventHistory,
        PartyMenu,
        PartyView,
        SearchMenu,
        SpellSheet,
        SettingsMenu,
        SettingsView,
    },
    computed: {
        getSearchPartyLevel() {
            return !!this.encounterActive ? `[${Math.max(-1,this.encounterActive.level-4)}..${Math.min(25,this.encounterActive.level+4)}]` : ''
        },
    },
    data() {
        return {
            ecombatant: null,

            toolbar: {
                viewmodeMenu: false,
                viewmodeClick: (mode) => {
                    if (!!this.views.combatInitiative.visible()) {
                        this.$store.dispatch('rsd/setCombatViewmode', mode)
                    } else if (!!this.views.encounter.visible()) {
                        this.$store.dispatch('rsd/setEncounterViewmode', mode)
                    }
                },
            },

            menu: {
                selected: (name) => {
                    return this.rsd.gamestate.current == name
                },
                submenus: {
                    main: [
                        {name: 'Campaign', icon: 'mdi-view-dashboard', shortkey: 'c'},
                        {name: 'Party', icon: 'mdi-account-group', shortkey: 'p'},
                        {name: 'Search', icon: 'mdi-magnify', shortkey: 's'},
                    ],
                    extra: [
                        {name: 'Settings', icon: 'mdi-cog'},
                        {name: 'Help', icon: 'mdi-help-circle'},
                    ],
                    switch: [
                        {name: 'Home', icon: 'mdi-home'},
                        {name: 'Player', icon: 'mdi-controller-classic'},
                    ],
                },
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

                party: {
                    members: () => {
                        return this.Party.Members().get.this()
                    }
                },
            },

            views: {
                full: (view) => {
                    return this.rsd.gamestate.current == null && this.rsd.gamestate.previous == view
                },
                combatInitiative: {
                    visible: () => {
                        return (
                            !!this.rsd.gamestate.menu.campaign.combat && (
                                this.rsd.gamestate.current == 'Campaign' 
                                || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Campaign')
                            )
                        )
                    },
                    currentVisible: (isCurrent) => {
                        return this.rsd.gamestate.view.combat.viewmode != 'overlap' 
                        || (this.rsd.gamestate.view.combat.viewmode == 'overlap' 
                            && (
                                !this.rsd.gamestate.view.combat.overlapShowTarget && !!isCurrent
                            ) || (
                                !!this.rsd.gamestate.view.combat.overlapShowTarget && !isCurrent
                            )
                        )
                    },
                    class: () => {
                        if (this.views.combatInitiative.visible()) {
                            let viewmode = ''
                            if (this.rsd.gamestate.view.combat.viewmode == 'row') {
                                viewmode = 'flex-row'
                            } else if (this.rsd.gamestate.view.combat.viewmode == 'column' || this.rsd.gamestate.view.combat.viewmode == 'tactical') {
                                viewmode = 'flex-column'
                            }

                            return 'd-flex ' + viewmode
                        } else {
                            return 'd-none'
                        }
                    },
                    selecting: () => {
                        return this.rsd.gamestate.view.combat.selecting
                    }
                },
                encounter: {
                    visible: () => {
                        return (
                            !this.rsd.gamestate.menu.campaign.combat && (
                                this.rsd.gamestate.current == 'Campaign' 
                                || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Campaign')
                            )
                        )
                    },
                    currentVisible: (isCurrent) => {
                        return this.rsd.gamestate.view.encounter.viewmode != 'overlap' 
                        || (this.rsd.gamestate.view.encounter.viewmode == 'overlap' 
                            && (
                                !this.rsd.gamestate.view.encounter.overlapShowTarget && !!isCurrent
                            ) || (
                                !!this.rsd.gamestate.view.encounter.overlapShowTarget && !isCurrent
                            )
                        )
                    },
                    class: () => {
                        if (this.views.encounter.visible()) {
                            let viewmode = ''
                            if (this.rsd.gamestate.view.encounter.viewmode == 'row') {
                                viewmode = 'flex-row'
                            } else if (this.rsd.gamestate.view.encounter.viewmode == 'column') {
                                viewmode = 'flex-column'
                            }

                            return 'd-flex ' + viewmode
                        } else {
                            return 'd-none'
                        }
                    },
                },
                party: {
                    visible: () => {
                        return (this.rsd.gamestate.current == 'Party' 
                            || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Party')
                        )
                    },
                    class: () => {
                        if (this.views.party.visible()) {
                            return 'd-flex '
                        } else {
                            return 'd-none'
                        }
                    },
                },
                search: {
                    visible: () => {
                        return (this.rsd.gamestate.current == 'Search' 
                            || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Search')
                        )
                    },
                    class: () => {
                        if (this.views.search.visible()) {
                            return 'd-flex '
                        } else {
                            return 'd-none'
                        }
                    },
                },
                help: {
                    visible: () => {
                        return (this.rsd.gamestate.current == 'Help' 
                            || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Help')
                        )
                    },
                    class: () => {
                        if (this.views.help.visible()) {
                            return 'd-flex '
                        } else {
                            return 'd-none'
                        }
                    },
                },
                settings: {
                    visible: () => {
                        return (this.rsd.gamestate.current == 'Settings' 
                            || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Settings')
                        )
                    },
                    class: () => {
                        if (this.views.settings.visible()) {
                            return 'd-flex '
                        } else {
                            return 'd-none'
                        }
                    },
                }
            },
        }
    },
    methods: {
        simpleContainerClass(view) {
            if (!!this.views.full(view)) {
                return 'full-overlap-view'
            } else {
                return 'overlap-view'
            }   
        },
        getContainerClass(isCurrent, viewmode, view, containerClass = 'accent-item ') {
            containerClass += !!containerClass ? (!!isCurrent ? ' accent-current ' : ' accent-selected ') : ''
            if (!!this.views.full(view)) {
                if (viewmode == 'column') {
                    return containerClass + 'full-column-view'
                } else if (viewmode == 'row') {
                    return containerClass + 'full-row-view'
                } else if (viewmode == 'overlap') {
                    return containerClass + 'full-overlap-view'
                } else if (viewmode == 'tactical') {
                    return containerClass + (!!isCurrent ? 'full-tactical-current-view' : 'full-tactical-target-view')
                }
            } else {
                    if (viewmode == 'column') {
                    return containerClass + 'column-view'
                } else if (viewmode == 'row') {
                    return containerClass + 'row-view'
                } else if (viewmode == 'overlap') {
                    return containerClass + 'overlap-view'
                } else if (viewmode == 'tactical') {
                    return containerClass + (!!isCurrent ? 'tactical-current-view' : 'tactical-target-view')
                }
            }   
        },
        getDividerVertical(viewmode) {
            if (viewmode == 'row') {
                return true
            }
            return false
        },
        toggleShowOverlapTarget() {
            if (!!this.views.combatInitiative.visible()) {
                this.$store.dispatch('rsd/setCombatViewShowTarget', !this.rsd.gamestate.view.combat.overlapShowTarget)
            } else if (!!this.views.encounter.visible()) {
                this.$store.dispatch('rsd/setEncounterViewShowTarget', !this.rsd.gamestate.view.encounter.overlapShowTarget)
            }
        },
        toggleSearchPartyAppropriate() {
            this.$store.dispatch('rsd/toggleEncounterPartyAppropriate')
        },
        switchView(event) {
            switch(event.srcKey) {
                case 'column':
                    this.toolbar.viewmodeClick('column')
                    break;
                case 'row':
                    this.toolbar.viewmodeClick('row')
                    break;
                case 'tactical':
                    this.toolbar.viewmodeClick('tactical')
                    break;
                case 'overlap':
                    this.toolbar.viewmodeClick('overlap')
                    break;
            }
        },

        getObject(combatant) {
            if (combatant.type == 'npc' || combatant.type == 'hazard') {
                return !!combatant.bid ? this.$rsd.bestiary.getObject(combatant.bid) : null
            } else {
                return !!combatant ? this.$rsd.members.getObject(combatant) : null
            }
        },
        
    },
    watch: {
        activeSettings: {
            handler: function (newVal, oldVal) {
                if (!!newVal && !!newVal.gitowner && !!newVal.gitname && ((!!oldVal && (newVal.gitowner != oldVal.gitowner || newVal.gitname != oldVal.gitname))) || !oldVal) {
                    this.$rsd.bestiary.loadCustom(newVal.gitowner, newVal.gitname)
                } else if (!newVal || !newVal.gitowner || !newVal.gitname) {
                    this.$rsd.bestiary.flushCustom()
                }
            }
        }
    },
    created() {
    },
    destroyed() {
    },
    mounted() {
        this.$route.meta.customTitle = this.rsd.gamestate.current

        setTimeout(() => {
            if (!!this.activeSettings && !!this.activeSettings.gitowner && !!this.activeSettings.gitname) {
                this.$rsd.bestiary.loadCustom(this.activeSettings.gitowner, this.activeSettings.gitname)
            } else {
                this.$rsd.bestiary.flushCustom()
            }
            this.$forceUpdate()
        }, 500)
    },
}

</script>

<style lang="less" scoped>
.page-current {
    --pageButtonBorder: #064444;
    border-left-color: var(--pageButtonBorder) !important;
    border-left-style: solid;
    border-left-width: 4px;
}

.page-button,
.page-button::before {
    border-radius: 0px !important;
}

.page-button:hover::before {
    opacity: 0.1;
}

.page-current::before {
    opacity: 0.1;
}

.page-current:hover::before {
    opacity: 0.2;
}

.page-current.theme--dark {
    --pageButtonBorder: #f5daab;
}
</style>