<template>
    <div class="fill-height">
        <div class="d-flex flex-column fill-height">
            <v-list
                dense
                class="d-flex flex-grow-1 py-0 right-border"
            >
                <v-list-item
                    link 
                    class="pl-2 pr-4 py-1" 
                    @click="toggleSelection(true)"
                    @contextmenu="campaigns.contextmenu($event, $rsd.campaigns.active, campaignActiveKey)"
                    v-if="!selecting && !!$rsd.campaigns.active"
                >
                    <v-list-item-icon class="mr-2">
                        <v-btn
                            icon 
                            class="white--text icon-offset"
                            elevation="5"
                            small
                            :style="GameIcons.get.color($rsd.campaigns.active.color)"
                        >
                            <span 
                                v-if="!!$rsd.campaigns.active.icon" 
                                class="gi-icon white"
                                :style="GameIcons.get.style(this.$rsd.campaigns.active.icon)"    
                            ></span>
                            <v-icon v-else>mdi-ship-wheel</v-icon>
                        </v-btn>
                    </v-list-item-icon>
                    <v-list-item-title>{{$rsd.campaigns.active.name}}</v-list-item-title>
                    <v-list-item-icon>
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-list-item-icon>
                </v-list-item>
                <v-list-item link class="pl-2 pr-4 py-1" @click="toggleSelection(false)" v-show="!!selecting">
                    <v-list-item-icon class="mr-1">
                        <v-icon>mdi-notebook-edit</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Campaigns</v-list-item-title>
                    <v-list-item-icon>
                        <v-icon>mdi-chevron-up</v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-slide-y-transition hide-on-leave>
                <div class="flex-row fill-height" :class="!!selecting ? 'd-flex' : ''" v-show="!!selecting">
                    <v-list
                        dense
                        class="d-flex flex-grow-1 py-0 flex-column right-border alt-scrollbar content-list"
                        :style="`width:${campaigns.width()}px`"
                    >
                        <draggable 
                            v-model='campaignArray'
                            v-bind="dragOptions"
                            @start="campaignDrag = true"
                            @end="campaignDrag = false"
                        >
                            <transition-group type="transition" :name="!campaignDrag ? 'flip-list' : null">
                                <v-list-item
                                    v-for="(campaign, index) in campaignArray"
                                    :key="'party-'+index"
                                    link 
                                    class="pl-2 pr-4 py-1 no-flex"
                                    @click="campaigns.selectCampaign(campaign, index)"
                                    @contextmenu="campaigns.contextmenu($event, campaign, campaign._key)"
                                >
                                    <v-list-item-icon class="mr-2">
                                        <v-btn
                                            icon 
                                            class="white--text icon-offset"
                                            elevation="5"
                                            small
                                            :class="!!campaignActiveKey && campaignActiveKey == campaign._key ? (!!campaign.color ? '' : 'primary') : 'grey'"
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
                                    <v-list-item-title>{{campaign.name}}</v-list-item-title>
                                </v-list-item>
                            </transition-group>
                        </draggable>
                        <v-list-item link class="pl-2 pr-4 py-1 no-flex" @click="openAddCampaignDialog">
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon 
                                    class="white--text icon-offset grey lighten-2"
                                    elevation="5"
                                    small
                                >
                                    <v-icon>mdi-notebook-plus</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-title>Add campaign</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </div>
            </v-slide-y-transition>
            <div class="flex-row fill-height" :class="!selecting ? 'd-flex' : ''" v-show="!selecting">
                <transition type="transition" name="quick-fade" @after-leave="onEncountersTransitionAfterLeave">
                    <v-list
                        dense
                        class="d-flex flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                        v-show="!!showArray"
                        :style="`width:${encounters.width}px; ${!!showArray ? '' : 'opacity: 0;'}'`"
                    >
                        <v-list-item
                            link 
                            class="pl-2 pr-4 py-1 no-flex"
                            @click="encounters.selectCombat()"
                            @contextmenu="current.contextmenu($event)"
                        >
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon
                                    class="white--text icon-offset"
                                    :class="!!rsd.gamestate.menu.campaign.combat ? 'primary' : 'grey'"
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
                            @start="encountersDrag = true"
                            @end="encountersDrag = false"
                        >
                            <transition-group type="transition" :name="!encountersDrag ? 'flip-list' : null">
                                <v-list-item 
                                    v-for="(encounter, index) in encounterArray"
                                    :key="'encounter-'+index"
                                    link 
                                    class="pl-2 pr-4 py-1 no-flex"
                                    :class="!isTouchDevice ? 'handle' : ''"
                                    @click="encounters.selectEncounter(encounter)"
                                    @contextmenu="encounters.contextmenu($event, encounter, encounter._key)"
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
                                </v-list-item>
                            </transition-group>
                        </draggable>
                        <v-list-item link class="pl-2 pr-4 py-1 no-flex" @click="openAddEncounterDialog">
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon 
                                    class="white--text icon-offset grey lighten-2"
                                    elevation="5"
                                    small
                                >
                                    <v-icon>mdi-toy-brick-plus</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-title>Add encounter</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </transition>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
                <!-- List of combatants in current combat -->
                <transition type="transition" name="quick-fade" @after-leave="onMembersTransitionAfterLeave">
                    <v-list
                        dense
                        v-if="!!rsd.gamestate.menu.campaign.combat"
                        class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                        :class="!!rsd.gamestate.menu.campaign.combat ? 'd-flex' : ''"
                        :style="`width:${initiative.width}px; ${!!showMembers ? '' : 'opacity: 0;'}'`"
                        v-show="!!showMembers"
                    >
                        <v-list-item
                            class="pl-2 pr-4 py-1 no-flex accent-item list_odd list-header"
                            @contextmenu="current.contextmenu($event)"
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
                                            @click.right="(event) => {event.preventDefault(); !!roundAlerts && roundAlerts.length == 1 ? openEditRoundAlertDialog(0, roundAlerts[0]) : null}"
                                            @click.right.stop=""
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
                                <v-tooltip bottom :open-delay="500" content-class="no-transparancy">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            v-bind="attrs"
                                            v-on="on"
                                            icon
                                            tile
                                            outlined
                                            small
                                            @click="doNextInitiative()"
                                        >
                                            <v-icon>mdi-arrow-down-bold</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Next combatant</span>
                                </v-tooltip>
                            </v-list-item-action>
                        </v-list-item>

                        <draggable 
                            v-model='combatantsArray'
                            v-bind="dragOptions" 
                            handle=".handle"
                            @start="current.dragStart($event)"
                            @end="current.dragEnd($event)"
                        >
                            <transition-group type="transition" :name="!current.Drag ? 'flip-list' : null">
                                <div v-for="(member, index) in combatantsArray" :key="'member-'+index">
                                    <CombatListItem :member="member" :index="index" :initiative="initiative" />
                                    <!-- <v-list-item
                                        link 
                                        class="pl-2 pr-4 py-1 no-flex accent-item"
                                        @click="initiative.click($event, member, index)"
                                        :class="initiative.class(member, index)"
                                        @contextmenu="initiative.contextmenu($event, member, index)"
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
                        </draggable>
                    </v-list>
                    <!-- List of combatants in selected encounter -->
                    <v-list
                        dense
                        v-if="!rsd.gamestate.menu.campaign.combat"
                        class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                        :class="!rsd.gamestate.menu.campaign.combat ? 'd-flex' : ''"
                        :style="`width:${initiative.width}px; ${!!showMembers ? '' : 'opacity: 0;'}'`"
                        v-show="!!showMembers"
                    >
                        <div v-show="!isInitiated">
                            <v-list-item
                                class="pl-2 pr-4 py-1 no-flex accent-item list_odd list-header"
                            >
                                <v-list-item-content class="py-0">
                                    <v-list-item-title>
                                        <span class="d-flex">Encounter: 
                                            <v-skeleton-loader
                                                width="75"
                                                max-width="75"
                                                max-height="15"
                                                type="text"
                                                class="ml-1"
                                            ></v-skeleton-loader>
                                        </span>
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="d-flex">
                                        <span class="d-flex mr-2">Level:
                                            <v-skeleton-loader
                                                width="10"
                                                max-width="10"
                                                max-height="15"
                                                type="text"
                                                class="ml-1"
                                            ></v-skeleton-loader>
                                        </span>
                                        <v-divider vertical></v-divider>
                                        <span class="d-flex mx-2">Party size:
                                            <v-skeleton-loader
                                                width="10"
                                                max-width="10"
                                                max-height="15"
                                                type="text"
                                                class="ml-1"
                                            ></v-skeleton-loader>
                                        </span>
                                    </v-list-item-subtitle>
                                    <v-progress-linear
                                        color="grey"
                                        height="15"
                                        indeterminate
                                    >
                                    </v-progress-linear>
                                </v-list-item-content>
                            </v-list-item>
                        </div>
                        <div v-show="!!isInitiated">
                            <v-list-item
                                class="pl-2 pr-4 py-1 no-flex accent-item list_odd list-header"
                                v-if="!!encounterActive"
                                @contextmenu="encounters.contextmenu($event, encounterActive, encounterActiveKey)"
                            >
                                <v-list-item-content class="py-0">
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
                        </div>

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
                                    @contextmenu="encmember.contextmenu($event, member, index)"
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
                                            <span v-show="!isInitiated">
                                                <v-skeleton-loader
                                                max-width="200"
                                                max-height="15"
                                                type="text"
                                                ></v-skeleton-loader>
                                            </span>
                                            <v-fade-transition>
                                                <span v-show="!!isInitiated">
                                                    {{!!member.name ? member.name : $rsd.bestiary.getName(member.bid)}}
                                                </span>
                                            </v-fade-transition>
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-capitalize">
                                            <span v-show="!isInitiated">
                                                <v-skeleton-loader
                                                max-width="40"
                                                max-height="16"
                                                type="text"
                                                ></v-skeleton-loader>
                                            </span>
                                            <v-fade-transition>
                                                <span v-show="!!isInitiated">
                                                    <span v-show="member.adj == 'weak' || member.adj == 'elite'">{{member.adj}} </span>
                                                    {{member.type == 'npc' ? $rsd.bestiary.getType(member.bid) : member.type}}
                                                </span>
                                            </v-fade-transition>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </transition-group>
                        </draggable>
                    </v-list>
                </transition>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
            </div>
        </div>
        <CombatContextMenu ref="combatContextMenu" />

        <FloatingMenu ref="currentContextMenu" :menu="currentContextMenu" />
        <FloatingMenu ref="multiInitiativeMenu" :menu="multiInitiativeMenu" />
        <FloatingMenu ref="campaignContextMenu" :menu="campaignContextMenu" />
        <FloatingMenu ref="encounterContextMenu" :menu="encounterContextMenu" />
        <FloatingMenu ref="encMemberContextMenu" :menu="encMemberContextMenu" />
    </div>
</template>

<script>
import draggable from 'vuedraggable'

import CombatContextMenu from './components/CombatContextMenu'
import CombatListItem from '@root/.shared/components/CombatListItem/CombatListItem'

import ConditionIndicator from '@root/.shared/components/ConditionIndicator'
import FloatingMenu from '@root/.shared/components/FloatingMenu'

export default {
    props: {
        menu: Object,
    },
    components: {
        ConditionIndicator,
        CombatContextMenu,
        CombatListItem,
        draggable,
        FloatingMenu,
    },
    data() {
        return {
            eventSet: false,
            selecting: false,

            campaigns: {
                width: () => {
                    return this.encounters.width + this.initiative.width + 2
                },
                selectCampaign: (campaign, id) => {
                    if (!!campaign._key && this.campaignActiveKey != campaign._key) {
                        this.showArray = false
                        this.showMembers = false
                        this.$rsd.campaigns.activeKey = campaign._key
                    }
                    this.toggleSelection(false)
                },
                contextSelected: null,
                contextmenu: (event, campaign, index, longpress = false) => {
                    event.preventDefault()

                    // if (!this.isTouchDevice && !!longpress) { return }

                    this.closeContextMenus()

                    this.campaigns.contextSelected = {...campaign, _key: index}

                    const clickX = event.clientX
                    const clickY = event.clientY
    
                    this.getDialog('campaignContextMenu').show(clickX, clickY, {width: 200});
                },
                longpress: (event) => {
                    console.log('event', event)
                }
            },

            current: {
                contextmenu: (event) => {
                    event.preventDefault()

                    this.closeContextMenus()

                    // if (!!this.isTouchDevice) {

                    // } else {
                        const clickX = event.clientX
                        const clickY = event.clientY
        
                        this.getDialog('currentContextMenu').show(clickX, clickY, {width: 200});
                    // }
                },
                dragOldIndex: -1,
                dragStart(event) {
                    this.currentMembersDrag = true
                    this.dragOldIndex = event.oldIndex
                },
                dragEnd(event) {
                    this.currentMembersDrag = false
                }
            },

            encounters: {
                width: 150,
                prevWidth: 150,
                startX: null,
                class: (encounter) => {
                    let classes = ''
                    if (this.encounterActiveKey == encounter._key && !this.rsd.gamestate.menu.campaign.combat) {
                        classes += !!encounter.color ? '' : 'primary '
                    } else {
                        classes += 'grey '
                    }

                    return classes
                },
                selectCombat: () => {
                    this.$store.dispatch('rsd/setCombatViewSelecting', false)
                    if (!this.$store.getters['rsd/gamestate'].menu.campaign.combat) {
                        this.showMembers = false
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
                        
                        this.showMembers = false
                        setTimeout(() => {
                            this.$store.dispatch('rsd/setCombatState', false)
                        }, 75)
                    }
                },
                contextSelected: null,
                contextmenu: (event, encounter, index, touch = false) => {
                    if (!this.isTouchDevice && !!touch) {
                        this.encounters.selectEncounter(encounter)
                        return
                    }

                    if (!!event && !!event.preventDefault) {
                        event.preventDefault()
                    }

                    this.closeContextMenus()

                    this.encounters.contextSelected = {...encounter, _key: index}

                    const clickX = event.clientX
                    const clickY = event.clientY
    
                    this.getDialog('encounterContextMenu').show(clickX, clickY, {width: 200});
                },
            },

            encmember: {
                selected: [],
                click: (event, member, index) => {
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
                },
                checkSelected: (member, index) => {
                    return this.encmember.selected.includes(member.id)
                },
                class: (member, index) => {
                    return !!this.encmember.checkSelected(member, index) ? 'accent-selected' : ''
                },
                contextSelected: null,
                contextmenu: (event, member, index) => {
                    event.preventDefault()

                    this.closeContextMenus()

                    this.encmember.contextSelected = {...member, _key: index}

                    const clickX = event.clientX
                    const clickY = event.clientY
    
                    this.getDialog('encMemberContextMenu').show(clickX, clickY, {width: 200});
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

            initiative: {
                width: 300,
                prevWidth: 300,
                startX: null,
                selected: [],
                contextSelected: null,
                contextmenu: (event, member, index) => {
                    event.preventDefault()
                    this.$store.dispatch('rsd/setCombatViewSelecting', false)

                    if (!this.initiative.selected || this.initiative.selected.length <= 1 || this.initiative.selected.findIndex(s => s._key == index) == -1) {
                        this.$rsd.combat.target = {...member, _key: index}
                        this.initiative.selected = [{...member, _key: index}]
                    }

                    this.closeContextMenus()

                    
                    const clickX = event.clientX
                    const clickY = event.clientY
    
                    if (this.initiative.selected.length == 1) {
                        this.getDialog('combatContextMenu').show(clickX, clickY, {width: 225, isNPC: member.type == 'npc', selected: this.initiative.selected[0]});
                    } else if (this.initiative.selected.length > 1) {
                        // this.getDialog('multiInitiativeMenu').show(clickX, clickY, {width: 200});
                    }
                },
                click: (event, member, index) => {
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

            currentContextMenu: {
                items: [
                    { 
                        title: 'Add Party',
                        icon: 'mdi-account-group',
                        func: () => {
                            if (!!this.missingMembers && this.missingMembers.length > 0) {
                                this.$rsd.combat.addPartyMembers(this.missingMembers)
                            }
                        }
                    },
                    {
                        type: 'divider'
                    },
                    { 
                        title: 'Clear Combat',
                        icon: 'mdi-broom',
                        func: () => {
                            this.$rsd.combat.clear()
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'New Encounter',
                        icon: 'mdi-toy-brick-plus',
                        func: () => {
                            this.openAddEncounterDialog()
                        }
                    },
                        { 
                        title: 'Add Combatant',
                        icon: 'imp-laugh',
                        func: () => {
                            this.$store.dispatch('rsd/setCombatViewSelecting', true)
                        }
                    },
                ],
            },
            multiInitiativeMenu: {
                items: [
                    { 
                        title: 'Add Conditions',
                        icon: 'mdi-virus-outline',
                        func: () => {
                        }
                    },
                    { 
                        title: 'Delete Combatants',
                        icon: 'mdi-delete',
                        func: () => { 
                        }, 
                        danger: true
                    },
                    {
                        type: 'divider'
                    },
                    { 
                        title: 'Add Round Alert',
                        icon: 'mdi-alarm-plus',
                        func: () => {
                        }
                    },
                    { 
                        title: 'Add Combatant',
                        icon: 'mdi-alarm-plus',
                        func: () => {
                        }
                    },
                ],
            },
            campaignContextMenu: {
                items: [
                    {
                        title: 'Rename Campaign',
                        icon: 'mdi-form-textbox',
                        func: () => {
                            this.openEditCampaignDialog()
                        }
                    },
                    {
                        title: 'Change Icon & Color',
                        icon: 'mdi-palette',
                        func: () => {
                            this.openEditCampaignStyleDialog()
                        }
                    },
                    {
                        title: 'Set Party Level',
                        icon: 'mdi-arrow-up-bold-hexagon-outline',
                        func: () => {
                            this.openEditCampaignLevelDialog()
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Copy Invite Link',
                        icon: 'mdi-link',
                        func: () => {
                            if (!!this.campaigns.contextSelected && !!this.campaigns.contextSelected._key) {
                                navigator.clipboard.writeText(this.$rsd.campaigns.getInviteLink(this.campaigns.contextSelected._key)).then((result) => {
                                }, (error) => {
                                    console.log(error)
                                })
                            }
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'New Campaign',
                        icon: 'mdi-notebook-plus',
                        func: () => {
                            this.openAddCampaignDialog()
                        }
                    },
                    {
                        title: 'Delete Campaign',
                        icon: 'mdi-notebook-remove',
                        danger: true,
                        func: () => {
                            if (!!this.campaigns.contextSelected && !!this.campaigns.contextSelected._key) {
                                this.toggleSelection(true)
                                // this.$rsd.campaigns.removeParty(this.campaigns.contextSelected._key)
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Switch to Remove Campaign', 
                                    `Are you sure you want to remove the campaign ${this.campaigns.contextSelected.name}?`,
                                    () => {this.$rsd.campaigns.removeParty(this.campaigns.contextSelected._key)}
                                ]})
                            }
                        }
                    }
                ]
            },
            encounterContextMenu: {
                items: [
                    {
                        title: 'Rename Encounter',
                        icon: 'mdi-form-textbox',
                        func: () => {
                            this.openEditEncounterDialog()
                        }
                    },
                    {
                        title: 'Change Icon & Color',
                        icon: 'mdi-palette',
                        func: () => {
                            this.openEditEncounterStyleDialog()
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Load Into Combat',
                        icon: 'mdi-sword-cross',
                        func: () => {
                            if (!!this.encounters.contextSelected && !!this.encounters.contextSelected._key) {
                                this.encounters.selectEncounter(this.encounters.contextSelected)
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Use Encounter', 
                                    `Are you sure you want to use the encounter ${this.encounters.contextSelected.name}?`,
                                    () => {this.$rsd.combat.useEncounter(this.$rsd.encounters.members)}
                                ]})
                            }
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'New Encounter',
                        icon: 'mdi-toy-brick-plus',
                        func: () => {
                            this.openAddEncounterDialog()
                        }
                    },
                    {
                        title: 'Delete Encounter',
                        icon: 'mdi-toy-brick-remove',
                        danger: true,
                        func: () => {
                            if (!!this.encounters.contextSelected && !!this.encounters.contextSelected._key) {
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Remove Encounter', 
                                    `Are you sure you want to remove the encounter ${this.encounters.contextSelected.name}?`,
                                    () => {this.$rsd.encounters.removeEncounter(this.encounters.contextSelected._key)}
                                ]})
                            }
                        }
                    }
                ]
            },
            encMemberContextMenu: {
                items: [
                    {
                        title: 'Rename NPC',
                        icon: 'mdi-form-textbox',
                        func: () => {
                            if (!!this.encmember.contextSelected && (!!this.encmember.contextSelected._key || this.encmember.contextSelected._key == 0)) {
                                this.openNPCNameDialog()
                            }
                        }
                    },
                    {
                        title: 'Change Color',
                        icon: 'mdi-palette',
                        func: () => {
                            if (!!this.encmember.contextSelected && (!!this.encmember.contextSelected._key || this.encmember.contextSelected._key == 0)) {
                                this.openNPCStyleDialog()
                            }
                        }
                    },
                    {
                        title: 'Edit Initiative',
                        icon: 'mdi-sort',
                        func: () => {
                            if (!!this.encmember.contextSelected && (!!this.encmember.contextSelected._key || this.encmember.contextSelected._key == 0)) {
                                this.openNPCInitiativeDialog(this.encmember.contextSelected, this.encmember.contextSelected._key)
                            }
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Change to Weak',
                        icon: 'mdi-wifi-strength-outline',
                        hidden: () => {
                            return !!this.encmember && !!this.encmember.contextSelected && !!this.encmember.contextSelected.adj && this.encmember.contextSelected.adj != 'weak'
                        },
                        func: () => {
                            if (!!this.encmember.contextSelected && (!!this.encmember.contextSelected._key || this.encmember.contextSelected._key == 0)) {
                                const newlevel = 2
                                console.log('this.encmember.contextSelected', this.encmember.contextSelected)
                                this.$rsd.encounters.updateMember(this.encmember.contextSelected._key, {adj: 'weak'})
                            }
                        }
                    },
                    {
                        title: 'Change to Normal',
                        icon: 'mdi-wifi-strength-2',
                        hidden: () => {
                            return !!this.encmember && !!this.encmember.contextSelected && !!this.encmember.contextSelected.adj && this.encmember.contextSelected.adj != 'normal'
                        },
                        func: () => {
                            if (!!this.encmember.contextSelected && (!!this.encmember.contextSelected._key || this.encmember.contextSelected._key == 0)) {
                                this.$rsd.encounters.updateMember(this.encmember.contextSelected._key, {adj: 'normal'})
                            }
                        }
                    },
                    {
                        title: 'Change to Elite',
                        icon: 'mdi-wifi-strength-4',
                        hidden: () => {
                            return !!this.encmember && !!this.encmember.contextSelected && !!this.encmember.contextSelected.adj && this.encmember.contextSelected.adj != 'elite'
                        },
                        func: () => {
                            if (!!this.encmember.contextSelected && (!!this.encmember.contextSelected._key || this.encmember.contextSelected._key == 0)) {
                                this.$rsd.encounters.updateMember(this.encmember.contextSelected._key, {adj: 'elite'})
                            }
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Delete NPC',
                        icon: 'mdi-account-remove',
                        danger: true,
                        func: () => {
                            if (!!this.encmember.contextSelected && (!!this.encmember.contextSelected._key || this.encmember.contextSelected._key == 0)) {
                                this.$rsd.encounters.removeMember(this.encmember.contextSelected._key)
                            }
                        }
                    }
                ]
            },
            target: -1,
            // encounterArray: [],
            
            encountersDrag: false,

            showArray: false,
            showMembers: false,

            // campaignArray: [],
            campaignDrag: false,
            // combatantsArray: [],

            initiated: false,
            refreshEncounterKey: 0,
            encounterTimer: null,
            maxEncounterTimer: 10,
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
        isInitiated() {
            return !!this.initiated && !this.refresh
        },
        selectedMembers() {
            return this.$store.getters['remotedb/selectedMembers']
        },
        missingMembers() {
            const missing = []
            if (!!this.selectedMembers && this.selectedMembers.length > 0) {
                this.membersArray.forEach(m => {
                    const index = this.selectedMembers.findIndex(sm => sm.id == m.id)
                    if (index == -1) {
                        let benched = false

                        if (m.type.toLowerCase() == 'gmc' && !!m.id) {
                            benched =  this.campaignActiveBench.includes('GMC/' + m.id)
                        } else if (m.type.toLowerCase() == 'pc' && !!m.uid && !!m.id) {
                            benched = this.campaignActiveBench.includes(m.uid + '/' + m.id)
                        }

                        if (!benched) {
                            const perception = this.$rsd.members.getPerceptionMod(m)
                            const initiative = !!m.initiative ? m.initiative : this.$rsd.random.getInitiativeRoll(perception)
                            missing.push({
                                id: m.id,
                                initiative: initiative,
                                name: m.name,
                                type: m.type,
                            })
                        }
                    }
                })
            } else {
                this.membersArray.forEach(m => {
                    let benched = false

                    if (m.type.toLowerCase() == 'gmc' && !!m.id) {
                        benched =  this.campaignActiveBench.includes('GMC/' + m.id)
                    } else if (m.type.toLowerCase() == 'pc' && !!m.uid && !!m.id) {
                        benched = this.campaignActiveBench.includes(m.uid + '/' + m.id)
                    }

                    if (!benched) {
                        const perception = this.$rsd.members.getPerceptionMod(m)
                        const initiative = !!m.initiative ? m.initiative : this.$rsd.random.getInitiativeRoll(perception)
                        missing.push({
                            id: m.id,
                            initiative: initiative,
                            name: m.name,
                            type: m.type,
                        })
                    }
                })
            }

            return missing
        },
    },
    methods: {
        toggleSelection(value) {
            if (!!this.campaignActiveKey) {
                this.selecting = value
            }
        },

        /* Set visible functions */

        /* Listeners */
        onEncountersTransitionAfterLeave() {
            setTimeout(() => {
                this.showArray = true
            }, 75)
        },
        onMembersTransitionAfterLeave() {
            setTimeout(() => {
                this.showMembers = true
            }, 75)
        },

        /* Handlers */

        /* Dialogs and Context menus */
        openAddCampaignDialog() {
            this.toggleSelection(false)
            this.$rsd.dialog.open({name: 'campaignDialog', attrs: [false, {}]})
        },
        openEditCampaignDialog() {
            this.$rsd.dialog.open({name: 'campaignDialog', attrs: [true, {...this.campaigns.contextSelected}]})
        },
        openEditCampaignStyleDialog() {
            this.$rsd.dialog.open({name: 'campaignStyleDialog', attrs: [true, {...this.campaigns.contextSelected}]})
        },
        openEditCampaignLevelDialog() {
            this.$rsd.dialog.open({name: 'campaignLevelDialog', attrs: [true, {...this.campaigns.contextSelected}]})
        },

        openCombatantHealthDialog(member, index) {
            this.$rsd.dialog.open({name: 'combatantHealthDialog', attrs: [true, {...member.health, name: member.name, _key: index}, {maxhp: member.health.maxhp}]})
        },

        openCombatInitiativeDialog(member, index) {
            this.$rsd.dialog.open({name: 'combatInitiativeDialog', attrs: [true, {...member, id: member.id}]})
        },

        openAddEncounterDialog() {
            const partylevel = !!this.$rsd.campaigns.active && !!this.$rsd.campaigns.active.level ? this.$rsd.campaigns.active.level : 1
            const partysize = !!this.$rsd && !!this.$rsd.members && !!this.$rsd.members.all && !!this.$rsd.members.all.length ? this.$rsd.members.all.length : 1
            this.$rsd.dialog.open({name: 'encounterDialog', attrs: [false, {level: partylevel, partysize: partysize}]})
        },
        openEditEncounterDialog() {
            this.$rsd.dialog.open({name: 'encounterDialog', attrs: [true, {...this.encounters.contextSelected}]})
        },
        openEditEncounterStyleDialog() {
            this.$rsd.dialog.open({name: 'encounterStyleDialog', attrs: [true, {...this.encounters.contextSelected}]})
        },

        openNPCNameDialog() {
            const nameTemplate = !!this.encmember.contextSelected.name ? this.encmember.contextSelected.name : this.$rsd.bestiary.getName(this.encmember.contextSelected.bid)
            this.$rsd.dialog.open({name: 'npcNameDialog', attrs: [true, {...this.encmember.contextSelected, name: nameTemplate}, {combat: false}]})
        },
        openNPCStyleDialog() {
            this.$rsd.dialog.open({name: 'npcStyleDialog', attrs: [true, {...this.encmember.contextSelected}, {combat: false}]})
        },
        openNPCInitiativeDialog(member, index) {
            this.$rsd.dialog.open({name: 'npcInitiativeDialog', attrs: [true, {...member, _key: index}]})
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

        closeContextMenus() {
            this.getDialog('combatContextMenu').close()
            this.getDialog('multiInitiativeMenu').close()
            this.getDialog('campaignContextMenu').close()
            this.getDialog('encounterContextMenu').close()
            this.getDialog('encMemberContextMenu').close()
            this.getDialog('currentContextMenu').close()
        },

        removeDyingCheckListener() {
            this.$rsd.combat.removeListener('DyingCheck', this.openDyingCheckDialog)
            this.eventSet = false
        },
        removePersistentDamageCheckListener() {
            this.$rsd.combat.removeListener('PersistentDamageCheck', this.openPersistentDamageCheckDialog)
        },
        doNextInitiative() {
            this.$rsd.combat.removeListener('DyingCheck', this.openDyingCheckDialog)
            this.$rsd.combat.on('DyingCheck', this.openDyingCheckDialog)

            this.$rsd.combat.removeListener('PersistentDamageCheck', this.openPersistentDamageCheckDialog)
            this.$rsd.combat.on('PersistentDamageCheck', this.openPersistentDamageCheckDialog)

            this.$rsd.combat.next()
        },
        openDyingCheckDialog(data) {
            if (!!data && !!data.valid) {
                
                const combatant = this.combatantsArray[data.index]
                const dying = combatant.conditions.find(c => c.type.toLowerCase() == 'dying')

                if (!!dying && !!dying.value) {
                    let options = {
                        dc: 10 + dying.value,
                        check: 1,
                        receiver: {
                            id: combatant.id,
                            name: combatant.name,
                            index: data.index,
                        }
                    }
    
                    this.$rsd.dialog.open({name: 'recoveryCheckDialog', attrs: [true, options]})
                }
            }
            this.removeDyingCheckListener()
        },
        openPersistentDamageCheckDialog(data) {
            if (!!data && !!data.valid && !!this.combatantsArray && (!!data.index || data.index == 0)) {
                const combatant = this.combatantsArray[data.index]

                if (!!combatant) {
                    this.$rsd.dialog.open({name: 'persistentDamageDialog', attrs: [true, 
                        {name: combatant.name, id: combatant.id, index: data.index,}, 
                        {conditions: combatant.conditions}]
                    })
                }
            }
            this.removePersistentDamageCheckListener()
        },

        // getMemberStats(type, key) {
        //     if (!!this.membersArray) {
        //         const member = this.membersArray.find(m => m._key == key)

        //         if (!!member) {
        //             console.log(member)
        //         }
        //     }
        // },

        foo(event) {
            console.log('foo', event)
        },
        bar(event) {
            console.log('bar', event)
        },
    },
    created() {
    },
    destroyed() {
    },
    mounted() {
        setTimeout(() => {
            if (!!this.viewCombatMenu && !!this.tindex && !!this.tindex.id) {
                this.initiative.selected.push(this.tindex)
            } else if (!this.viewCombatMenu && !!this.tindex && !!this.tindex.id) {
                this.encmember.selected.push(this.tindex.id)
            }

            this.showArray = true
            this.showMembers = true

            if (!this.campaignActiveKey) {
                this.selecting = true
            }
        }, 50)

        this.encounterTimer = setInterval(() => {
            this.refreshEncounterKey++;

            let nullCheck = true;
            if (!!this.encounterMembersArray) {
                this.encounterMembersArray.forEach((c) => {
                    if (!c.bid || !this.$rsd.bestiary.getName(c.bid)) {
                        nullCheck = false;
                    }
                });
            } else {
                nullCheck = false;
            }

            if (this.refreshEncounterKey == this.maxEncounterTimer || !!nullCheck) {
                clearInterval(this.encounterTimer);
                this.initiated = true;
            }
        }, 500);
        
    },
}
</script>

<style lang="less" scoped>
.right-border {
    border-right-color: rgba(0, 0, 0, 0.12) !important;
    border-right-style: solid;
    border-right-width: 1px;
}

.no-flex {
    flex: none;
}

.icon-offset {
    top: -2px;
}

.content-list {
    height: calc(~"100vh - 128px");
    overflow-y: auto;
}

.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}

.quick-fade-enter-active {
    transition: all 0.1s ease;
}
.quick-fade-leave-active {
    transition: all 0.1s ease;
}
.quick-fade-enter, .quick-fade-leave-to {
    opacity: 0;
}

.list-header {
    position: sticky;
    z-index: 1;
    top: 0;
}
</style>