<template>
    <div class="flex-grow-1 width-100">
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="!(campaignSelected || encounterSelected) ? 'd-flex' : 'd-none'" v-show="!(campaignSelected || encounterSelected)">
                <v-list
                    dense
                    class="flex-grow-1 flex-column"
                >
                    <draggable 
                        v-model='campaignArray'
                        v-bind="dragOptions"
                        handle=".handle"
                        @start="campaignDrag = true"
                        @end="campaignDrag = false"
                    >
                        <transition-group type="transition" :name="!campaignDrag ? 'flip-list' : null">
                            <v-list-item
                                v-for="(campaign, index) in campaignArray"
                                :key="'party-'+index"
                                link
                                class="pl-2 pr-4 py-1 no-flex"
                                @click="navigation.campaigns.click(campaign, index)"
                                :ripple="false"
                            >
                                <v-list-item-icon class="mr-2">
                                    <v-btn
                                        icon 
                                        class="white--text icon-offset"
                                        elevation="5"
                                        small
                                        :class="(!!campaign.color ? '' : 'primary')"
                                        :style="!!campaign.color ? GameIcons.get.color(campaign.color) : ''"
                                    >
                                        <span 
                                            v-if="!!campaign.icon" 
                                            class="gi-icon white"
                                            :style="GameIcons.get.style(campaign.icon)"    
                                        ></span>
                                        <v-icon v-else>mdi-ship-wheel</v-icon>
                                    </v-btn>
                                </v-list-item-icon>
                                <v-list-item-content class="py-0">
                                    <v-list-item-title>{{campaign.name}}</v-list-item-title>
                                </v-list-item-content>
                                <fade-x-width-transition>
                                    <v-list-item-icon
                                        v-show="!!mobileView.sortMode"
                                        class="handle"
                                        @click.stop=""
                                        @mousedown.stop=""
                                        @touchstart.stop=""
                                    >
                                        <v-icon>mdi-reorder-horizontal</v-icon>
                                    </v-list-item-icon>
                                </fade-x-width-transition>
                            </v-list-item>
                        </transition-group>
                    </draggable>
                </v-list>
            </div>
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="!!campaignSelected && !encounterSelected ? 'd-flex' : 'd-none'" v-show="!!campaignSelected && !encounterSelected">
                <v-list
                    dense
                    class="flex-grow-1 flex-column"
                >
                    <v-list-item
                        link 
                        class="pl-2 pr-4 py-1 no-flex"
                        @click="navigation.encounters.selectCombat()"
                        :ripple="false"
                    >
                        <v-list-item-icon class="mr-2">
                            <v-btn
                                icon
                                class="white--text icon-offset"
                                :class="'primary'"
                                elevation="5"
                                small
                            >
                                <v-icon>mdi-sword-cross</v-icon>
                            </v-btn>
                        </v-list-item-icon>
                        <v-list-item-title>Current combat</v-list-item-title>
                    </v-list-item>
                    <draggable 
                        v-model='encounterArray'
                        v-bind="dragOptions"
                        handle=".handle"
                        @start="encounterDrag = true"
                        @end="encounterDrag = false"
                    >
                        <transition-group type="transition" :name="!campaignDrag ? 'flip-list' : null">
                            <v-list-item 
                                v-for="(encounter, index) in encounterArray"
                                :key="'encounter-'+index"
                                link 
                                class="pl-2 pr-4 py-1 no-flex"
                                @click="navigation.encounters.selectEncounter(encounter, index)"
                                :ripple="false"
                            >
                                <v-list-item-icon class="mr-2">
                                    <v-btn
                                        icon 
                                        class="white--text icon-offset"
                                        elevation="5"
                                        small
                                        :class="encounters.class(encounter)"
                                        :style="!!encounter.color ? GameIcons.get.color(encounter.color) : ''"
                                    >
                                        <span 
                                            v-if="!!encounter.icon" 
                                            class="gi-icon white"
                                            :style="GameIcons.get.style(encounter.icon)" 
                                        ></span>
                                        <v-icon v-else>mdi-ship-wheel</v-icon>
                                    </v-btn>
                                </v-list-item-icon>
                                <v-list-item-content class="py-0">
                                    <v-list-item-title>{{encounter.name}}</v-list-item-title>
                                    <v-list-item-subtitle class="d-flex">
                                        <span class="mr-2">
                                            <v-icon x-small>mdi-chevron-double-up</v-icon>{{encounter.level}}
                                        </span>
                                        <v-divider vertical></v-divider>
                                        <span class="ml-2">
                                            <v-icon x-small>mdi-account-group</v-icon> {{encounter.partysize}}
                                        </span>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <fade-x-width-transition>
                                    <v-list-item-icon
                                        v-show="!!mobileView.sortMode"
                                        class="handle"
                                        @click.stop=""
                                        @mousedown.stop=""
                                        @touchstart.stop=""
                                    >
                                        <v-icon>mdi-reorder-horizontal</v-icon>
                                    </v-list-item-icon>
                                </fade-x-width-transition>
                            </v-list-item>
                        </transition-group>
                    </draggable>
                </v-list>
            </div>
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="!!encounterSelected ? 'd-flex' : 'd-none'" v-show="!!encounterSelected">
                <!-- Current combat -->
                <v-list
                    dense
                    v-if="!!rsd.gamestate.menu.campaign.combat && !addCombatantSelected && !combatantSelected"
                    class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :class="!!rsd.gamestate.menu.campaign.combat ? 'd-flex' : ''"
                >
                    <v-list-item
                        class="pl-2 pr-4 py-1 no-flex accent-item list_odd"
                        :ripple="false"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>
                                <span>Current combat</span>
                            </v-list-item-title>
                            <v-list-item-subtitle class="d-flex">
                                <span class="mr-2">Round: {{cround}}</span>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="d-flex flex-row align-centerimage.png">
                            <v-tooltip bottom :open-delay="500" >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        v-show="!!roundAlerts && roundAlerts.length == 1"
                                        v-bind="attrs"
                                        v-on="on"
                                        class="mr-1"
                                        icon
                                        tile
                                        small
                                        outlined
                                        @click="!!roundAlerts && roundAlerts.length == 1 ? openEditRoundAlertDialog(0, roundAlerts[0]) : null"
                                        @click.stop=""
                                    >
                                        <v-icon>mdi-alarm</v-icon>
                                    </v-btn>
                                </template>
                                <span v-if="!!roundAlerts && roundAlerts.length == 1">
                                    <span>{{roundAlerts[0].title}}</span><br/>
                                    <span v-if="roundAlerts[0].round == -1">Trigger every round</span>
                                    <span v-else>Trigger on round: {{roundAlerts[0].round}}</span>
                                </span>
                            </v-tooltip>
                            <v-menu>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        v-show="!!roundAlerts && roundAlerts.length > 1"
                                        v-bind="attrs"
                                        v-on="on"
                                        class="mr-1"
                                        icon
                                        tile
                                        small
                                        outlined
                                    >
                                        <v-icon>mdi-alarm-multiple</v-icon>
                                    </v-btn>
                                </template>
                                <v-list dense class="py-0">
                                    <template v-for="(ralert, rindex) in roundAlerts">
                                        <v-list-item
                                            :key="'round-alert-'+rindex"
                                            @click="openEditRoundAlertDialog(rindex, ralert)"
                                            @click.stop=""
                                            @click.right="(event) => {event.preventDefault(); openEditRoundAlertDialog(rindex, ralert)}"
                                            @click.right.stop=""
                                            :ripple="false"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title>{{ralert.title}}</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    <span v-if="ralert.round == -1">Trigger every round</span>
                                                    <span v-else>Trigger on round: {{ralert.round}}</span>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-menu>
                        </v-list-item-action>
                    </v-list-item>

                    <transition-group type="transition" :name="'flip-list'">
                        <div v-for="(member, index) in combatantsArray" :key="'member-'+index">
                            <CombatListItem :member="member" :index="index" :initiative="initiative" />
                            <!-- <v-list-item
                                link 
                                class="pl-2 pr-4 py-1 no-flex accent-item"
                                @click="initiative.click($event, member, index)"
                                :class="initiative.class(member, index)"
                                :ripple="false"
                            >
                                <v-list-item-icon class="mr-2">
                                    <v-chip
                                        label
                                        class="px-0 justify-center grabbable handle"
                                        style="width:32px;"
                                        :style="!!member.color ? GameIcons.get.color(member.color) + 'bottom:1px;' : ''"
                                        :ripple="false"
                                        @click="openCombatInitiativeDialog(member, index)"
                                        @click.stop=""
                                    >
                                        <span
                                            :style="!!member.color ? $rsd.format.getContrastColor(member.color, rsd.darkmode) : ''"
                                        >{{member.initiative}}</span>
                                    </v-chip>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{member.name}}</v-list-item-title>
                                    <v-list-item-subtitle>{{member.identifier}}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action class="py-0 d-flex flex-row align-center">
                                    <v-tooltip bottom :open-delay="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                                v-show="!!member.alerts && member.alerts.length == 1"
                                                v-bind="attrs"
                                                v-on="on"
                                                class="my-n1"
                                                icon
                                                tile
                                                small
                                                outlined
                                                @click="!!member.alerts && member.alerts.length == 1 ? openEditMemberAlertDialog(member.id, 0, member.alerts[0]) : null"
                                                @click.stop=""
                                                @click.right="(event) => {event.preventDefault(); !!member.alerts && member.alerts.length == 1 ? openEditMemberAlertDialog(member.id, 0, member.alerts[0]) : null}"
                                                @click.right.stop=""
                                            >
                                                <v-icon>mdi-alarm</v-icon>
                                            </v-btn>
                                        </template>
                                        <span v-if="!!member.alerts && member.alerts.length == 1">
                                            <span>{{member.alerts[0].title}}</span><br/>
                                            <span v-if="member.alerts[0].round == -1">Trigger every round</span>
                                            <span v-else>Trigger on round: {{member.alerts[0].round}}</span>
                                        </span>
                                    </v-tooltip>
                                    <v-menu>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                                v-show="!!member.alerts && member.alerts.length > 1"
                                                v-bind="attrs"
                                                v-on="on"
                                                class="my-n1"
                                                icon
                                                tile
                                                small
                                                outlined
                                            >
                                                <v-icon>mdi-alarm-multiple</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list dense class="py-0">
                                            <template v-for="(malert, mindex) in member.alerts">
                                                <v-list-item
                                                    :key="'member-alert-'+mindex"
                                                    @click="openEditMemberAlertDialog(member.id, mindex, malert)"
                                                    @click.stop=""
                                                    @click.right="(event) => {event.preventDefault(); openEditMemberAlertDialog(member.id, mindex, malert)}"
                                                    @click.right.stop=""
                                                    :ripple="false"
                                                >
                                                    <v-list-item-content>
                                                        <v-list-item-title>{{malert.title}}</v-list-item-title>
                                                        <v-list-item-subtitle>
                                                            <span v-if="malert.round == -1">Trigger every round</span>
                                                            <span v-else>Trigger on round: {{malert.round}}</span>
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </template>
                                        </v-list>
                                    </v-menu>
                                    <v-btn
                                        class="my-n1 ml-1"
                                        icon
                                        tile
                                        small
                                        outlined
                                        @click="openCombatantHealthDialog(member, index)"
                                        @click.stop=""
                                    >
                                        <v-icon
                                            class="icon_color--text text--lighten-3"
                                            :style="'position: absolute; top:-1px; left: 1px; font-size:2.6em;'"
                                        >mdi-heart</v-icon>
                                        <span
                                            :style="'position:relative; top:0px'"
                                            class="text-body-2"
                                            :class="!!rsd.darkmode ? 'inverse--text' : 'icon_color--text'"
                                        >{{!!member.health ? member.health.hp + member.health.temphp : 'x'}}</span>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item> -->
                            <div v-show="!!member.conditions">
                                <v-list-item
                                    :key="'cm-conditions-'+member.id"
                                    class="list_odd"
                                    :ripple="false"
                                >
                                    <transition-group name="condition" class="row my-1">
                                        <template v-for="(cvalue, cindex) in member.conditions">
                                            <v-col :key="'cindex-'+cindex" class="py-0 px-0 flex-grow-0">
                                                <v-card outlined
                                                    @click="openEditConditionDialog(index, cvalue)"
                                                >
                                                    <ConditionIndicator :condition="cvalue" :label="false" />
                                                </v-card>
                                            </v-col>
                                        </template>
                                    </transition-group>
                                </v-list-item>
                            </div>
                        </div>
                    </transition-group>
                </v-list>
                <!-- Encounter -->
                <v-list
                    dense
                    v-if="!rsd.gamestate.menu.campaign.combat && !addCombatantSelected"
                    class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :class="!rsd.gamestate.menu.campaign.combat ? 'd-flex' : ''"
                >
                    <v-list-item
                        class="pl-2 pr-4 py-1 no-flex accent-item list_odd"
                        :ripple="false"
                    >
                        <v-list-item-content class="py-0" v-if="!!encounterActive">
                                <v-list-item-title>
                                    <span>Encounter: {{encounterActive.name}}</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2">Level: {{encounterActive.level}}</span>
                                    <v-divider vertical></v-divider>
                                    <span class="mx-2">Party size: {{encounterActive.partysize}}</span>
                                </v-list-item-subtitle>
                                <v-progress-linear
                                    :color="$rsd.encounters.getDifficultyColor(encounterActive)"
                                    height="15"
                                    :value="100/($rsd.encounters.getDifficultyScale(encounterActive)['extreme']/encounterActive.totalxp)"
                                    id="creature-picker-encounter-difficulty"
                                >
                                    <span class="black--text text-caption" v-text="`Difficulty (${encounterActive.totalxp || 0} xp): ${Format.capitalize($rsd.encounters.getDifficulty(encounterActive))}`"></span>
                                </v-progress-linear>
                            </v-list-item-content>
                    </v-list-item>

                    <draggable 
                        v-model='encounterMembersArray'
                        v-bind="dragOptions"
                        handle=".handle"
                        @start="encmember.dragStart($event)"
                        @end="encmember.dragEnd($event)"
                    >
                        <transition-group type="transition" :name="!encmember.Drag ? 'flip-list' : null">
                            <v-list-item 
                                v-for="(member, index) in encounterMembersArray"
                                :key="'encounter-'+index"
                                link 
                                class="pl-2 pr-4 py-1 no-flex accent-item"
                                @click="encmember.click($event, member, index)"
                                :class="encmember.class(member, index)"
                                :ripple="false"
                            >
                                <v-list-item-icon class="mr-2 handle">
                                    <v-chip
                                        label
                                        class="px-0 justify-center grabbable"
                                        style="width:32px;"
                                        :style="!!member.color ? GameIcons.get.color(member.color) + 'bottom:1px;' : ''"
                                        :ripple="false"
                                        @click="openNPCInitiativeDialog(member, index)"
                                        @mousedown.stop=""
                                        @touchstart.stop=""
                                    >
                                        <span 
                                            :style="!!member.color ? $rsd.format.getContrastColor(member.color, rsd.darkmode) : ''"
                                        >{{member.initiative}}</span>
                                    </v-chip>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <span v-show="!$rsd.bestiary.getName(member.bid)">
                                            <v-skeleton-loader
                                            max-width="200"
                                            max-height="15"
                                            type="text"
                                            ></v-skeleton-loader>
                                        </span>
                                        <v-fade-transition>
                                            <span v-show="!!$rsd.bestiary.getName(member.bid)">
                                                {{!!member.name ? member.name : $rsd.bestiary.getName(member.bid)}}
                                            </span>
                                        </v-fade-transition>
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="text-capitalize">
                                        <span v-show="!$rsd.bestiary.getName(member.bid)">
                                            <v-skeleton-loader
                                            max-width="40"
                                            max-height="16"
                                            type="text"
                                            ></v-skeleton-loader>
                                        </span>
                                        <v-fade-transition>
                                            <span v-show="!!$rsd.bestiary.getName(member.bid)">
                                                <span v-show="member.adj == 'weak' || member.adj == 'elite'">{{member.adj}} </span>
                                                {{member.type == 'npc' ? $rsd.bestiary.getType(member.bid) : member.type}}
                                            </span>
                                        </v-fade-transition>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <fade-x-width-transition>
                                    <v-list-item-icon
                                        v-show="!!mobileView.sortMode"
                                        class="handle"
                                        @click.stop=""
                                        @mousedown.stop=""
                                        @touchstart.stop=""
                                    >
                                        <v-icon>mdi-reorder-horizontal</v-icon>
                                    </v-list-item-icon>
                                </fade-x-width-transition>
                            </v-list-item>
                        </transition-group>
                    </draggable>
                </v-list>

                <EncounterMenuMobile
                    :visible="!!addCombatantSelected && !targetSelected"
                    :containerClass="'mobile-view'"
                    :currentCombat="!!rsd.gamestate.menu.campaign.combat"
                ></EncounterMenuMobile>
                <BestiarySheet
                    :visible="!!targetSelected"
                    :containerClass="'mobile-view'"
                    :bestiary="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.encounter
                    && !!rsd.gamestate.view.encounter.target ? $rsd.bestiary.getObject(rsd.gamestate.view.encounter.target._id) : null"
                />
                <CombatantSheet
                    :visible="!!combatantSelected"
                    :containerClass="'mobile-view'"
                    :index="!!tindex && (!!tindex._key || tindex._key == 0) ? tindex._key : null"
                    :instanceArray="'combatantsArray'"
                />
            </div>
        </v-slide-x-reverse-transition>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

import ConditionIndicator from '@root/.shared/components/ConditionIndicator'
import CombatListItem from '@root/.shared/components/CombatListItem/CombatListItem'

import BestiarySheet from '@root/.shared/components/CombatantSheet/BestiarySheet'
import CombatantSheet from '@root/.shared/components/CombatantSheet/CombatantSheet'
import EncounterMenuMobile from '@/components/EncounterMenu/EncounterMenuMobile'

export default {
    components: {
        draggable,

        ConditionIndicator,
        CombatListItem,

        BestiarySheet,
        CombatantSheet,
        EncounterMenuMobile,
    },
    data() {
        return {
            campaignDrag: false,
            encounterDrag: false,

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
                campaigns: {
                    click: (campaign, index) => {
                        if (!this.mobileView.sortMode) {                       
                            this.campaigns.selectCampaign(campaign)

                            this.$route.meta.customTitle = campaign.name

                            setTimeout(() => {
                                this.$store.dispatch('rsd/setMobileView', {
                                    ...this.mobileView,
                                    campaignSelected: true,
                                    encounterSelected: false,
                                    addCombatantSelected: false,
                                })
                            }, 100)
                        }
                    }
                },
                encounters: {
                    selectCombat: () => {
                        if (!this.mobileView.sortMode) {
                            this.encounters.selectCombat()

                            setTimeout(() => {
                                this.$store.dispatch('rsd/setMobileView', {
                                    ...this.mobileView,
                                    campaignSelected: true,
                                    encounterSelected: true,
                                    addCombatantSelected: false,
                                    targetSelected: false,
                                })
                            }, 100)
                        }
                    },
                    selectEncounter: (encounter, index) => {
                        if (!this.mobileView.sortMode) {
                            this.encounters.selectEncounter(encounter)

                            setTimeout(() => {
                                this.$store.dispatch('rsd/setMobileView', {
                                    ...this.mobileView,
                                    campaignSelected: true,
                                    encounterSelected: true,
                                    addCombatantSelected: false,
                                    targetSelected: false,
                                })
                            }, 100)
                        }
                    }
                }
            },

            campaigns: {
                selectCampaign: (campaign) => {
                    if (!!campaign._key && this.campaignActiveKey != campaign._key) {
                        this.$rsd.campaigns.activeKey = campaign._key

                        setTimeout(() => {
                            this.$store.dispatch('rsd/setGamePage', 'Campaign')
                        }, 50)
                    }
                },
            },

            encounters: {
                class: (encounter) => {
                    let classes = !!encounter.color ? '' : 'primary '

                    return classes
                },
                selectCombat: () => {
                    this.$store.dispatch('rsd/setCombatViewSelecting', false)
                    if (!this.$store.getters['rsd/gamestate'].menu.campaign.combat) {
                        setTimeout(() => {
                            this.$store.dispatch('rsd/setCombatState', true)
                        }, 75)
                    }
                },
                selectEncounter: (encounter) => {
                    if (!!this.$store.getters['rsd/gamestate'].menu.campaign.combat || (!!encounter._key && this.encounterActiveKey != encounter._key)) {
                        if (!!encounter._key && this.encounterActiveKey != encounter._key) {
                            this.$rsd.encounters.activeKey = encounter._key
                        }
                        
                        setTimeout(() => {
                            this.$store.dispatch('rsd/setCombatState', false)
                        }, 75)
                    }
                },
            },

            initiative: {
                width: 300,
                prevWidth: 300,
                startX: null,
                selected: [],
                click: (event, member, index) => {
                    if (!this.mobileView.sortMode) {
                        // console.log('test', this.targetSelected)

                        setTimeout(() => {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                campaignSelected: true,
                                encounterSelected: true,
                                combatantSelected: true,
                            })
                        }, 100)

                        this.$store.dispatch('rsd/setCombatViewSelecting', false)
                        if (!this.initiative.selected || this.initiative.selected.length == 0) {
                            this.$rsd.combat.target = {...member, _key: index}
                            this.initiative.selected = [{...member, _key: index}]
                        }

                        if (!!event && !!event.shiftKey) {
                            const startIndex = this.initiative.selected[0]._key
                            const endIndex = index

                            let newSelected = []

                            //combatantsArray
                            if (startIndex <= endIndex) {
                                let i = startIndex
                                while(i <= endIndex) {
                                    newSelected.push({...this.combatantsArray[i], _key: i})
                                    i+=1
                                }
                            } else {
                                let i = startIndex
                                while(i >= endIndex) {
                                    newSelected.push({...this.combatantsArray[i], _key: i})
                                    i-=1
                                }
                            }
                            this.initiative.selected = newSelected
                        } else if (!!event && !!event.ctrlKey) {
                            const initIndex = this.initiative.selected.findIndex(s => s._key == index)
                            if (initIndex != -1) {
                                this.initiative.selected.splice(initIndex, 1)
                            } else {
                                this.initiative.selected.push({...member, _key: index})
                            }
                        } else if (!!event) {
                            this.$rsd.combat.target = {...member, _key: index}
                            this.initiative.selected = [{...member, _key: index}]
                        }
                    }
                },
                checkSelected: (member, index) => {
                    return this.initiative.selected.findIndex(s => s._key == index) != -1
                },
                class: (member, index) => {
                    if (index == this.cindex) {
                        return 'accent-current'
                    } else {
                        return !!this.initiative.checkSelected(member, index) ? 'accent-selected' : ''
                    }
                },
            },

            encmember: {
                selected: [],
                click: (event, member, index) => {
                    if (!this.mobileView.sortMode) {
                        if (!!event && !!event.shiftKey) {
                            if (this.encmember.selected.includes(member.id)) {
                                const initIndex = this.encmember.selected.indexOf(member.id)
                                if (initIndex > -1) {
                                    this.encmember.selected.splice(initIndex, 1)
                                }
                            } else {
                                this.encmember.selected.push(member.id)
                            }
                        } else if (!!event) {
                            this.encmember.selected = [member.id]
                            const data = {...member, _id: member.bid, member: true}
                            this.$rsd.encounters.target = data
                        }
                    }
                },
                checkSelected: (member, index) => {
                    return this.encmember.selected.includes(member.id)
                },
                class: (member, index) => {
                    return !!this.encmember.checkSelected(member, index) ? 'accent-selected' : ''
                },
                dragOldIndex: -1,
                dragStart(event) {
                    this.drag = true
                    this.dragOldIndex = event.oldIndex
                },
                dragEnd(event) {
                    this.drag = false
                }
            },
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            }
        },
        campaignSelected() {          
            return !!this.navigation.current('Campaign') && !!this.mobileView.campaignSelected && !this.mobileView.encounterSelected 
        },
        encounterSelected() {          
            return !!this.navigation.current('Campaign') && !!this.mobileView.campaignSelected && !!this.mobileView.encounterSelected 
        },
        addCombatantSelected() {          
            return !!this.navigation.current('Campaign') && !!this.mobileView.campaignSelected && !!this.mobileView.encounterSelected && !!this.mobileView.addCombatantSelected
        },
        targetSelected() {
            return !!this.navigation.current('Campaign') && !!this.mobileView.campaignSelected && !!this.mobileView.encounterSelected && !!this.mobileView.addCombatantSelected && !!this.mobileView.targetSelected
        },
        combatantSelected() {
            return !!this.navigation.current('Campaign') && !!this.mobileView.campaignSelected && !!this.mobileView.encounterSelected && !!this.mobileView.combatantSelected
        }
    },
    methods: {

        /* Dialogs */

        openCombatantHealthDialog(member, index) {
            this.$rsd.dialog.open({name: 'combatantHealthDialog', attrs: [true, {...member.health, name: member.name, _key: index}, {maxhp: member.health.maxhp}]})
        },

        openCombatInitiativeDialog(member, index) {
            this.$rsd.dialog.open({name: 'combatInitiativeDialog', attrs: [true, {...member, id: member.id}]})
        },

        openNPCInitiativeDialog(member, index) {
            this.$rsd.dialog.open({name: 'npcInitiativeDialog', attrs: [true, {...member, _key: index}]})
        },

        openEditConditionDialog(mkey, condition) {
            if (!!condition.type && (!!mkey || mkey == 0)) {
                const duration = this.$rsd.conditions.hasDuration(condition.type)
                const value = this.$rsd.conditions.hasValue(condition.type)
                
                if (!!duration && !!value) {
                    this.$rsd.dialog.open({name: 'addConditionBothDialog', attrs: [true, {...condition, _key: mkey}]})
                } else if (!!duration) {
                    this.$rsd.dialog.open({name: 'addConditionDurationDialog', attrs: [true, {...condition, _key: mkey}]})
                } else if (!!value) {
                    this.$rsd.dialog.open({name: 'addConditionValueDialog', attrs: [true, {...condition, _key: mkey}]})
                } else {
                    this.$rsd.dialog.open({name: 'addConditionDialog', attrs: [true, {...condition, _key: mkey}]})
                }
            }
        },

        openEditMemberAlertDialog(cid, alertIndex, alert) {
            if (!!alert && !!cid && (!!alertIndex || alertIndex == 0)) {
                this.$rsd.dialog.open({name: 'memberAlertDialog', attrs: [true, {...alert, cid: cid, _key: alertIndex}]})
            }
        },
        openEditRoundAlertDialog(alertIndex, alert) {
            if (!!alert && (!!alertIndex || alertIndex == 0)) {
                this.$rsd.dialog.open({name: 'roundAlertDialog', attrs: [true, {...alert, _key: alertIndex}]})
            }
        },

        checkMDIIcon(icon) {
            return icon.includes('mdi-')
        },

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