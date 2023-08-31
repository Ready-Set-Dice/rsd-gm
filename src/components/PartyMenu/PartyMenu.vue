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
                    v-show="!selecting"
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
                        class="d-flex flex-grow-1 py-0 flex-column right-border"
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
                                            :class="campaignActiveKey == campaign._key ? (!!campaign.color ? '' : 'primary') : 'grey'"
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
                        <v-list-item link class="pl-2 pr-4 py-1 no-flex">
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
                <v-list
                    dense
                    class="d-flex flex-grow-1 py-0 flex-column right-border"
                    :style="`width:${members.width}px`"
                >
                    <!-- <draggable v-model='membersArray'> -->
                        <v-list-item
                            link 
                            class="pl-2 pr-4 py-1 no-flex"
                            :class="!tindex ? 'accent-selected' : 'accent-item'"
                            @click="members.selectOverview()"
                            @contextmenu="campaigns.contextmenu($event, $rsd.campaigns.active, campaignActiveKey)"
                        >
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon
                                    class="white--text icon-offset primary"
                                    elevation="5"
                                    small
                                >
                                    <v-icon>mdi-sword-cross</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-title>Party Overview</v-list-item-title>
                        </v-list-item>
                        <v-list-item 
                            v-for="(member, index) in membersArray"
                            :key="'member-'+index"
                            link 
                            class="pl-2 pr-4 py-1 no-flex"
                            :class="members.isSelected(member, index) ? 'accent-selected' : 'accent-item'"
                            @click="members.click($event, member, index)"
                            @contextmenu="members.contextmenu($event, member, index)"
                        >
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon 
                                    class="icon-offset"
                                    :class="members.isBenched(member) ? '' : (!!member.color ? 'white--text' : 'white--text primary')"
                                    :style="!!member.color ? GameIcons.get.color(member.color) : null"
                                    elevation="5"
                                    small
                                >
                                    <span 
                                        v-if="!!member.icon" 
                                        class="gi-icon white"
                                        :style="GameIcons.get.style(member.icon)"    
                                    ></span>
                                    <v-icon v-else>{{member.type == 'gmc' ? 'mdi-robot' : 'mdi-account'}}</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{member.name}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    <!-- </draggable> -->
                    <v-list-item link class="pl-2 pr-4 py-1 no-flex" @click="openAddGMCDialog()">
                        <v-list-item-icon class="mr-2">
                            <v-btn
                                icon 
                                class="white--text icon-offset grey lighten-2"
                                elevation="5"
                                small
                            >
                                <v-icon>mdi-robot-love</v-icon>
                            </v-btn>
                        </v-list-item-icon>
                        <v-list-item-title>Add GMC</v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>
        </div>

        <FloatingMenu ref="campaignContextMenu" :menu="campaignContextMenu" />
        <FloatingMenu ref="gmcContextMenu" :menu="gmcContextMenu" />
        <FloatingMenu ref="pcContextMenu" :menu="pcContextMenu" />

        <PartyContextMenu ref="partyContextMenu" />
    </div>
</template>

<script>
import draggable from 'vuedraggable'

import FloatingMenu from '@root/.shared/components/FloatingMenu'

import PartyContextMenu from './components/PartyContextMenu'

export default {
    props: {
        menu: Object,
    },
    components: {
        draggable,
        FloatingMenu,
        PartyContextMenu,
    },
    data() {
        return {
            selecting: false,
            campaignDrag: false,

            campaigns: {
                width: () => {
                    return this.members.width
                },
                selectCampaign: (campaign, id) => {
                    if (!!campaign._key && !this.campaignActiveKey != campaign._key) {
                        this.$rsd.campaigns.activeKey = campaign._key
                    }
                    this.toggleSelection(false)
                },
                contextSelected: null,
                contextmenu: (event, campaign, index) => {
                    event.preventDefault()

                    this.closeContextMenus()

                    this.campaigns.contextSelected = {...campaign, _key: index}

                    if (!!this.isTouchDevice) {

                    } else {
                        const clickX = event.clientX
                        const clickY = event.clientY
        
                        this.getDialog('campaignContextMenu').show(clickX, clickY, {width: 200});
                    }
                },
            },

            members: {
                width: 452,
                prevWidth: 452,
                startX: null,
                selected: [],
                click: (event, member, index) => {
                    const basestats = this.$rsd.members.getStats(member)
                    const object = this.$rsd.members.getObject(member)
                    const stats = this.$rsd.conditions.getStatsObject(member, basestats, member.conditions, object)

                    // console.log('member', member)

                    const memberObject = {
                        ...member,
                        basestats: basestats,
                        name: member.name,
                        identifier: this.$rsd.combat.getIdentifier(member, object),
                        object: object,
                        stats: stats,
                        _key: index,
                    }

                    this.$rsd.members.target = {...memberObject}
                    this.members.selected = [{...memberObject}]
                },
                selectOverview: () => {
                    this.$rsd.members.target = null
                    this.members.selected = []
                },
                contextmenu: (event, member, index) => {
                    event.preventDefault()

                    this.members.click(event, member, index)

                    this.closeContextMenus()

                    if (!!member && !!member.type) {
                        // if (!!this.isTouchDevice) {

                        // } else {
                            const clickX = event.clientX
                            const clickY = event.clientY

                            if (!!this.members && !!this.members.selected && !!this.members.selected[0]) {
                                this.getDialog('partyContextMenu').show(clickX, clickY, {width: 225, isGMC: member.type.toLowerCase() == 'gmc', selected: this.members.selected[0]});
                            }
                            // if (member.type.toLowerCase() == 'gmc') {
                            //     this.getDialog('gmcContextMenu').show(clickX, clickY, {width: 200});
                            // } else if (member.type.toLowerCase() == 'pc') {
                            //     this.getDialog('pcContextMenu').show(clickX, clickY, {width: 200});
                            // }
                        // }
                    }
                },
                isSelected: (member, index) => {
                    return !!member && !!this.tindex && member.id == this.tindex.id
                },
                isBenched: (member) => {
                    if (!!member && !!member.type && !!this.campaignActiveBench) {
                        if (member.type.toLowerCase() == 'gmc' && !!member.id) {
                            return this.campaignActiveBench.includes('GMC/' + member.id)
                        } else if (member.type.toLowerCase() == 'pc' && !!member.uid && !!member.id) {
                            return this.campaignActiveBench.includes(member.uid + '/' + member.id)
                        }
                    } else {
                        return false
                    }
                }
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
                                this.$rsd.campaigns.removeParty(this.campaigns.contextSelected._key)
                            }
                        }
                    }
                ]
            },
            gmcContextMenu: {
                items: [
                    {
                        title: 'Rename',
                        icon: 'mdi-form-textbox',
                        func: () => {
                            if (!!this.tindex) {
                                this.openEditGMCDialog(this.tindex)
                            }
                        }
                    },
                    {
                        title: 'Edit Stats',
                        icon: 'mdi-arm-flex',
                        func: () => {
                            if (!!this.tindex) {
                                this.openEditGMCStatsDialog(this.tindex)
                            }
                        }
                    },
                    {
                        title: 'Edit Skills',
                        icon: 'mdi-playlist-edit',
                        func: () => {
                            if (!!this.tindex) {
                                this.openEditGMCSkillsDialog(this.tindex)
                            }
                        }
                    },
                    {
                        title: 'Toggle Benched',
                        icon: 'mdi-ghost',
                        func: () => {
                            if (!!this.tindex) {
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Toggle Bench', 
                                    `Are you sure you want to toggle the bench on ${this.tindex.name}?`,
                                    () => {this.$rsd.campaigns.updateMemberBench(this.campaignActiveKey, this.tindex)},
                                ]})
                            }
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Add GMC',
                        icon: 'mdi-robot-love',
                        func: () => {
                            this.openAddGMCDialog()
                        }
                    },
                    {
                        title: 'Remove GMC',
                        icon: 'mdi-account-remove',
                        func: () => {
                            if (!!this.tindex && (!!this.tindex._key || this.tindex._key == 0)) {
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Remove GMC', 
                                    `Are you sure you want to remove the GMC ${this.tindex.name}?`,
                                    () => {this.$rsd.members.removeMember(this.tindex)},
                                ]})
                            }
                        }
                    },
                ]
            },
            pcContextMenu: {
                items: [
                    {
                        title: 'Add GMC',
                        icon: 'mdi-robot-love',
                        func: () => {
                            this.openAddGMCDialog()
                        }
                    },
                    {
                        title: 'Toggle Benched',
                        icon: 'mdi-ghost',
                        func: () => {
                            if (!!this.tindex) {
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Toggle Bench', 
                                    `Are you sure you want to toggle the bench on ${this.tindex.name}?`,
                                    () => {this.$rsd.campaigns.updateMemberBench(this.campaignActiveKey, this.tindex)},
                                ]})
                            }
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'Remove PC',
                        icon: 'mdi-account-remove',
                        func: () => {
                            if (!!this.tindex && (!!this.tindex._key || this.tindex._key == 0)) {
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Remove PC', 
                                    `Are you sure you want to remove the PC ${this.tindex.name}?`,
                                    () => {this.$rsd.members.removeMember(this.tindex)},
                                ]})
                            }
                        }
                    },
                ]
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
    },
    methods: {
        toggleSelection(value) {
            if (!!this.campaignActiveKey) {
                this.selecting = value
            }
        },

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

        openAddGMCDialog() {
            if (!this.membersArray || !!this.membersArray && this.membersArray.length < 10) {
                this.$rsd.dialog.open({name: 'gmcDialog', attrs: [false, {}]})
            }
        },
        openEditGMCDialog(member) {
            this.$rsd.dialog.open({name: 'gmcDialog', attrs: [true, {...member}]})
        },
        openEditGMCSkillsDialog(member) {
            const stats = this.$rsd.members.getStats(member, true)

            this.$rsd.dialog.open({name: 'gmcSkillsDialog', attrs: [true, {name: member.name, id:member.id, _key: member._key, ...stats}]})
        },
        openEditGMCStatsDialog(member) {
            const stats = this.$rsd.members.getStats(member, true)

            this.$rsd.dialog.open({name: 'gmcStatsDialog', attrs: [true, {name: member.name, id:member.id, _key: member._key, ...stats}]})
        },

        closeContextMenus() {
            this.getDialog('campaignContextMenu').close()
            this.getDialog('partyContextMenu').close()
        },
        
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
</style>