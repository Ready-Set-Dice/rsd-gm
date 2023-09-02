<template>
    <div>
        <div style="display:none">
            <v-menu
                v-model="displayMenu"
                :position-x="xpos"
                :position-y="ypos"
                :content-class="hidden ? 'hidden' : ''"
                bottom
                transition="none"
            >
            <v-list :width="!!width && width != -1 ? width : ''" dense class="py-0">
                <v-expand-transition>
                    <div
                        v-if="expand"
                    >
                        <template v-for="(item, i) in initiativeMenu">
                            <v-list-item
                                :key="'item-'+i"
                                v-if="!item.type && ((!isGMC && !item.gmcOnly) || (!!isGMC))"
                                class="v-list-item--extra-dense"
                                @click="item.func"
                                @click.right="preventDefault($event)"
                            >
                                <v-list-item-icon v-if="item.icon" class="mr-3 my-1">
                                    <v-icon v-if="checkMDIIcon(item.icon)">{{item.icon}}</v-icon>
                                    <span 
                                        v-else 
                                        class="gi-icon icon_color"
                                        :style="GameIcons.get.icon(item.icon)"  
                                    ></span>
                                </v-list-item-icon>
                                <v-list-item-title >{{ item.title }}</v-list-item-title>
                            </v-list-item>
                            <v-divider :key="'divider-'+i" v-if="item.type == 'divider' && ((!isGMC && !item.gmcOnly) || (!!isGMC))"></v-divider>
                            <v-menu
                                :key="'conditions-'+i"
                                offset-x
                                :close-on-content-click="false"
                                v-if="item.type == 'conditions'"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item
                                        v-on="on"
                                        v-bind="attrs"
                                        class="v-list-item--extra-dense"
                                        @click="{}"
                                        @click.right="preventDefault($event)"
                                    >
                                        <v-list-item-icon v-if="item.icon" class="mr-3 my-1">
                                            <v-icon v-if="checkMDIIcon(item.icon)">{{item.icon}}</v-icon>
                                            <span 
                                                v-else 
                                                class="gi-icon icon_color"
                                                :style="GameIcons.get.icon(item.icon)"  
                                            ></span>
                                        </v-list-item-icon>
                                        <v-list-item-title >{{ item.title }}</v-list-item-title>
                                        <v-list-item-icon class="my-1">
                                            <v-icon right>mdi-chevron-right</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </template>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="py-0">
                                    <template v-for="(cond, j) in recentCondition">
                                        <v-list-item
                                            :key="'recent-condition-'+j"
                                            class="v-list-item--extra-dense"
                                            @click="addRecentCondition(cond)"
                                            @click.right="preventDefault($event)"
                                        >
                                            <v-list-item-icon class="mr-3 my-1">
                                                <span
                                                    class="gi-icon icon_color"
                                                    :style="getIconStyle(cond)"  
                                                ></span>
                                            </v-list-item-icon>
                                            <v-list-item-title>
                                                <span>{{ $rsd.format.capitalize(cond.type) }}</span>
                                                <span class="float-right">
                                                    <v-icon small>mdi-clock-outline</v-icon>
                                                    <span v-if="!!cond.duration" class="ml-1" :style="'margin-right: 5px !important;'">{{cond.duration}}</span>
                                                    <v-icon v-else small>mdi-infinity</v-icon>
                                                </span>
                                                <span v-show="!!cond.value">
                                                    <span class="float-right mx-1">|</span>
                                                    <span class="float-right">{{cond.value}}</span>
                                                    <span class="float-right" v-show="!!cond.reduce"><v-icon small>mdi-arrow-down-bold</v-icon></span>
                                                </span>
                                            </v-list-item-title>
                                        </v-list-item>
                                    </template>
                                    <v-divider :key="'cond-divider-1'"></v-divider>
                                </v-list>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="condition-list alt-scrollbar py-0">
                                    <template v-for="(cond, j) in regularConditions">
                                        <v-list-item
                                            :key="'regular-condition-'+j"
                                            class="v-list-item--extra-dense"
                                            @click="openConditionDialog(cond.type)"
                                            @click.right="preventDefault($event)"
                                        >
                                            <v-list-item-icon class="mr-3 my-1">
                                                <span
                                                    class="gi-icon icon_color"
                                                    :style="getIconStyle(cond)"  
                                                ></span>
                                            </v-list-item-icon>
                                            <v-list-item-title >{{ $rsd.format.capitalize(cond.type) }}</v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="py-0">
                                    <v-divider :key="'cond-divider-2'"></v-divider>
                                    <v-menu
                                        :key="'more-'+i"
                                        offset-x
                                        :close-on-content-click="false"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-list-item
                                                v-on="on"
                                                v-bind="attrs"
                                                class="v-list-item--extra-dense"
                                                @click="{}"
                                                @click.right="preventDefault($event)"
                                            >
                                                <v-list-item-icon class="mr-3 my-1">
                                                    <v-icon v-if="checkMDIIcon(item.icon)">{{item.icon}}</v-icon>
                                                    <span 
                                                        v-else 
                                                        class="gi-icon icon_color"
                                                        :style="GameIcons.get.icon(item.icon)"  
                                                    ></span>
                                                </v-list-item-icon>
                                                <v-list-item-title >More</v-list-item-title>
                                                <v-list-item-icon class="my-1">
                                                    <v-icon right>mdi-chevron-right</v-icon>
                                                </v-list-item-icon>
                                            </v-list-item>
                                        </template>
                                        <v-list :width="!!width && width != -1 ? width : ''" dense class="condition-list alt-scrollbar py-0">
                                            <template v-for="(cond, j) in otherConditions">
                                                <v-list-item
                                                    :key="'other-condition-'+j"
                                                    class="v-list-item--extra-dense"
                                                    @click="openConditionDialog(cond.type)"
                                                    @click.right="preventDefault($event)"
                                                >
                                                    <v-list-item-icon class="mr-3 my-1">
                                                        <span
                                                            class="gi-icon icon_color"
                                                            :style="getIconStyle(cond)"  
                                                        ></span>
                                                    </v-list-item-icon>
                                                    <v-list-item-title >{{ $rsd.format.capitalize(cond.type) }}</v-list-item-title>
                                                </v-list-item>
                                            </template>
                                        </v-list>
                                    </v-menu>
                                </v-list>
                            </v-menu>
                            <v-menu
                                :key="'dmg-'+i"
                                offset-x
                                :close-on-content-click="false"
                                v-if="item.type == 'dmgtypes'"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item
                                        v-on="on"
                                        v-bind="attrs"
                                        class="v-list-item--extra-dense"
                                        @click="{}"
                                        @click.right="preventDefault($event)"
                                    >
                                        <v-list-item-icon v-if="item.icon" class="mr-3 my-1">
                                            <v-icon v-if="checkMDIIcon(item.icon)">{{item.icon}}</v-icon>
                                            <span 
                                                v-else 
                                                class="gi-icon icon_color"
                                                :style="GameIcons.get.icon(item.icon)"  
                                            ></span>
                                        </v-list-item-icon>
                                        <v-list-item-title >{{ item.title }}</v-list-item-title>
                                        <v-list-item-icon class="my-1">
                                            <v-icon right>mdi-chevron-right</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </template>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="py-0">
                                    <template v-for="(dmg, j) in recentDamage">
                                        <v-list-item
                                            :key="'recent-dmg-'+j"
                                            class="v-list-item--extra-dense"
                                            @click="addRecentDamge(dmg)"
                                            @click.right="preventDefault($event)"
                                        >
                                            <v-list-item-icon class="mr-3 my-1">
                                                <span
                                                    class="gi-icon icon_color"
                                                    :style="getIconStyle(dmg)"  
                                                ></span>
                                            </v-list-item-icon>
                                            <v-list-item-title>
                                                <span>{{ $rsd.format.capitalize(dmg.type) }}</span>
                                                <span class="float-right" v-show="!!dmg.value">{{dmg.value}}</span>
                                            </v-list-item-title>
                                        </v-list-item>
                                    </template>
                                    <v-divider :key="'cond-divider-1'"></v-divider>
                                </v-list>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="condition-list alt-scrollbar py-0">
                                    <template v-for="(dmg, j) in dmgTypes">
                                        <v-list-item
                                            :key="'regular-dmg-'+j"
                                            class="v-list-item--extra-dense"
                                            @click="openDamageDialog(dmg.type)"
                                            @click.right="preventDefault($event)"
                                        >
                                            <v-list-item-icon class="mr-3 my-1">
                                                <span
                                                    class="gi-icon icon_color"
                                                    :style="getIconStyle(dmg)"  
                                                ></span>
                                            </v-list-item-icon>
                                            <v-list-item-title >{{ $rsd.format.capitalize(dmg.type) }}</v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-menu>
                            <v-menu
                                :key="'pdmg-'+i"
                                offset-x
                                :close-on-content-click="false"
                                v-if="item.type == 'pdmgtypes'"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item
                                        v-on="on"
                                        v-bind="attrs"
                                        class="v-list-item--extra-dense"
                                        @click="{}"
                                        @click.right="preventDefault($event)"
                                    >
                                        <v-list-item-icon v-if="item.icon" class="mr-3 my-1">
                                            <v-icon v-if="checkMDIIcon(item.icon)">{{item.icon}}</v-icon>
                                            <span 
                                                v-else 
                                                class="gi-icon icon_color"
                                                :style="GameIcons.get.icon(item.icon)"  
                                            ></span>
                                        </v-list-item-icon>
                                        <v-list-item-title >{{ item.title }}</v-list-item-title>
                                        <v-list-item-icon class="my-1">
                                            <v-icon right>mdi-chevron-right</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </template>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="py-0">
                                    <template v-for="(pdmg, j) in recentPDamage">
                                        <v-list-item
                                            :key="'recent-pdmg-'+j"
                                            class="v-list-item--extra-dense"
                                            @click="addRecentPersistentDamge(pdmg)"
                                            @click.right="preventDefault($event)"
                                        >
                                            <v-list-item-icon class="mr-3 my-1">
                                                <span
                                                    class="gi-icon icon_color"
                                                    :style="getIconStyle(pdmg)"  
                                                ></span>
                                            </v-list-item-icon>
                                            <v-list-item-title>
                                                <span>{{ $rsd.format.capitalize(pdmg.type) }}</span>
                                                <span class="float-right" v-show="!!pdmg.value">{{pdmg.value}}</span>
                                            </v-list-item-title>
                                        </v-list-item>
                                    </template>
                                    <v-divider :key="'cond-divider-1'"></v-divider>
                                </v-list>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="condition-list alt-scrollbar py-0">
                                    <template v-for="(pdmg, j) in dmgTypes">
                                        <v-list-item
                                            :key="'regular-pdmg-'+j"
                                            class="v-list-item--extra-dense"
                                            @click="openPersistentDamageDialog(pdmg.type)"
                                            @click.right="preventDefault($event)"
                                        >
                                            <v-list-item-icon class="mr-3 my-1">
                                                <span
                                                    class="gi-icon icon_color"
                                                    :style="getIconStyle(pdmg)"  
                                                ></span>
                                            </v-list-item-icon>
                                            <v-list-item-title >{{ $rsd.format.capitalize(pdmg.type) }}</v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-menu>
                            <v-menu
                                :key="'heal-'+i"
                                offset-x
                                :close-on-content-click="false"
                                v-if="item.type == 'heal'"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item
                                        v-on="on"
                                        v-bind="attrs"
                                        class="v-list-item--extra-dense"
                                        @click="{}"
                                        @click.right="preventDefault($event)"
                                    >
                                        <v-list-item-icon v-if="item.icon" class="mr-3 my-1">
                                            <v-icon v-if="checkMDIIcon(item.icon)">{{item.icon}}</v-icon>
                                            <span 
                                                v-else 
                                                class="gi-icon icon_color"
                                                :style="GameIcons.get.icon(item.icon)"  
                                            ></span>
                                        </v-list-item-icon>
                                        <v-list-item-title >{{ item.title }}</v-list-item-title>
                                        <v-list-item-icon class="my-1">
                                            <v-icon right>mdi-chevron-right</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </template>
                                <v-list :width="!!width && width != -1 ? width : ''" dense class="py-0">
                                    <v-list-item
                                        class="v-list-item--extra-dense"
                                        @click="openHealDialog()"
                                        @click.right="preventDefault($event)"
                                    >
                                        <v-list-item-icon class="mr-3 my-1">
                                            <span
                                                class="gi-icon icon_color"
                                                :style="getIconStyle({icon:'heal', type: 'heal', name: 'heal'})"
                                            ></span>
                                        </v-list-item-icon>
                                        <v-list-item-title>Regular Heal</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                        class="v-list-item--extra-dense"
                                        @click="openTemporaryHPDialog()"
                                        @click.right="preventDefault($event)"
                                    >
                                        <v-list-item-icon class="mr-3 my-1">
                                            <span
                                                class="gi-icon icon_color"
                                                :style="getIconStyle({icon:'temporary', type: 'temporary', name: 'temporary'})"
                                            ></span>
                                        </v-list-item-icon>
                                        <v-list-item-title >Set Temporary HP</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                    </div>
                </v-expand-transition>
            </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>
import GameIcons from '@root/.shared/plugins/IconMixin'
import { mapGetters } from 'vuex'

export default {
    mixins: [
        GameIcons
    ],
    data() {
        return {
            displayMenu: false,
            testMenu: false,
            expand: false,
            hidden: false,
            xpos: 50,
            ypos: 50,
            items: [],
            width: -1,
            isGMC: false,
            selected: null,
            crit: false,

            dyingQueue: [],
            // recentConditions: [
            //     {type: 'frightened', reduce: true, value: 1},
            //     {type: 'sickened', value: 1, duration: 5},
            //     {type: 'off-guard'}
            // ],
            // recentDmgTypes: [
            //     {type: 'slashing', value: 5},
            //     {type: 'piercing', value: 5},
            //     {type: 'bludgeoning', value: 5},
            // ],
            // recentPDmgTypes: [
            //     {type: 'fire', value: 1},
            //     {type: 'bleed', value: 1},
            //     {type: 'electricity', value: 1},
            // ],
            
            initiativeMenu: [
                {
                    title: 'Rename',
                    icon: 'mdi-form-textbox',
                    func: () => {
                        if (!!this.selected) {
                            this.openEditGMCDialog(this.selected)
                        }
                    },
                    gmcOnly: true
                },
                {
                    title: 'Edit Stats',
                    icon: 'mdi-arm-flex',
                    func: () => {
                        if (!!this.selected) {
                            this.openEditGMCStatsDialog(this.selected)
                        }
                    },
                    gmcOnly: true
                },
                {
                    title: 'Edit Skills',
                    icon: 'mdi-playlist-edit',
                    func: () => {
                        if (!!this.selected) {
                            this.openEditGMCSkillsDialog(this.selected)
                        }
                    },
                    gmcOnly: true
                },
                {
                    type: 'divider',
                    gmcOnly: true
                },
                {
                    type: 'dmgtypes',
                    title: 'Damage Combatant',
                    icon: 'mdi-sword',
                    func: () => {
                    }
                },
                {
                    type: 'heal',
                    title: 'Heal Combatant',
                    icon: 'mdi-heart-plus',
                    func: () => {
                    }
                },
                {
                    type: 'conditions',
                    title: 'Add Condition',
                    icon: 'mdi-virus-outline',
                    func: () => {
                    },
                },
                {
                    type: 'pdmgtypes',
                    title: 'Persistent Damage',
                    icon: 'fire',
                    func: () => {
                    },
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
                    title: 'Toggle Benched',
                    icon: 'mdi-ghost',
                    func: () => {
                        if (!!this.selected && (!!this.selected._key || this.selected._key == 0)) {
                            this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                'Toggle Bench', 
                                `Are you sure you want to toggle the bench on ${this.selected.name}?`,
                                () => {this.$rsd.campaigns.updateMemberBench(this.campaignActiveKey, this.selected)},
                            ]})
                        }
                    }
                },
                { 
                    title: 'Remove Member',
                    icon: 'mdi-account-remove',
                    func: () => {
                        if (!!this.selected && (!!this.selected._key || this.selected._key == 0)) {
                            if (!!this.isGMC) {
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Remove GMC', 
                                    `Are you sure you want to remove the GMC ${this.selected.name}?`,
                                    () => {this.$rsd.members.removeMember(this.selected)},
                                ]})
                            } else {
                                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                                    'Remove PC', 
                                    `Are you sure you want to remove the PC ${this.selected.name}?`,
                                    () => {this.$rsd.members.removeMember(this.selected)},
                                ]})
                            }
                        }
                    }
                },
            ],
        }
    },
    computed: {
        calculateHeight() {
            return 374 // Based on actual menu + a margin of 12
        },
        regularConditions() {
            return !!this.isGMC ? this.npcConditions.regular : this.playerConditions.regular
        },
        otherConditions() {
            return !!this.isGMC ? this.npcConditions.other : this.playerConditions.other
        },
        ...mapGetters({
            recentCondition: 'rsd/recentCondition',
            recentDamage: 'rsd/recentDamage',
            recentPDamage: 'rsd/recentPDamage',
        }),
    },
    watch: {
        displayMenu: {
            handler: function (newVal, oldVal) {
                if (!!oldVal && !newVal) {
                    this.$emit('Close')
                }
            }
        }
    },
    methods: {
        show(xpos, ypos, attrs = {}) {
            this.xpos = xpos;
            this.ypos = Math.min(ypos, window.innerHeight - this.calculateHeight);

            if (!!attrs.items && attrs.items.length > 0) {
                this.items = attrs.items
            } else {
                this.items = []
            }

            if (!!attrs.width) {
                this.width = attrs.width
            }

            if (!!attrs.isGMC) {
                this.isGMC = true
            } else {
                this.isGMC = false
            }

            if (!!attrs.selected) {
                this.selected = attrs.selected
            }

            this.hidden = true
            this.displayMenu = false
            this.expand = false
            setTimeout(() => {
                this.delayedShow()
            }, 10)
        },

        close() {
            this.hidden = true
            this.displayMenu = false
            this.expand = false
        },

        delayedShow() {
            this.hidden = false
            this.displayMenu = true

            setTimeout(() => {
                this.expand = true
            }, 200)
        },

        preventDefault(event) {
            event.preventDefault();
        },

        checkMDIIcon(icon) {
            return icon.includes('mdi-')
        },

        getIconStyle(condition) {
            if (!!condition) {
                if (condition.type != "Persistent Damage") {
                    let name = !!condition.icon ? condition.icon.toLowerCase() : condition.type.toLowerCase()
                    if (name == 'temporary hp') { name = 'temporary' }
                    let style = `
                    -webkit-mask: url("../icons/${name}.svg") no-repeat center;
                    mask: url("../icons/${name}.svg") no-repeat center;
                    `
                    
                    return style
                } else {
                    let style = `
                    -webkit-mask: url("../icons/${condition.dmg.toLowerCase()}.svg") no-repeat center;
                    mask: url("../icons/${condition.dmg.toLowerCase()}.svg") no-repeat center;
                    `
                    return style
                }
            }
        },

        openDamageDialog(type) {
            if (!!type && !!this.selected && !!this.selected.id) {
                let immune = false
                if (!!this.selected.object && !!this.selected.object.hpinfo && !!this.selected.object.hpinfo.immunities && this.selected.object.hpinfo.immunities.length > 0) {
                    this.selected.object.hpinfo.immunities.forEach(im => {
                        if (!!im && !!im.type) {
                            immune = !!immune || im.type == type
                        }
                    })
                }
                let resistant = false
                if (!!this.selected.object && !!this.selected.object.hpinfo && !!this.selected.object.hpinfo.resistances && this.selected.object.hpinfo.resistances.length > 0) {
                    this.selected.object.hpinfo.resistances.forEach(im => {
                        if (!!im && !!im.type) {
                            resistant = !!resistant || im.type == type
                        }
                    })
                }
                let vulnerable = false
                if (!!this.selected.object && !!this.selected.object.hpinfo && !!this.selected.object.hpinfo.weaknesses && this.selected.object.hpinfo.weaknesses.length > 0) {
                    this.selected.object.hpinfo.weaknesses.forEach(im => {
                        if (!!im && !!im.type) {
                            vulnerable = !!vulnerable || im.type == type
                        }
                    })
                }

                this.$rsd.dialog.open({name: 'damageDialog', attrs: [true, 
                    {value:1, local: true, affected: [this.selected], dmg: type}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
                this.close()
            }
        },
        addRecentDamge(dmg) {
            if (!!dmg && !!dmg.type && !!dmg.value && dmg.value > 0 && !!this.selected && !!this.selected.id) {
                this.$rsd.members.doDamage(this.selected.id, {dmg: dmg.type, value: dmg.value, memberType: this.selected.type})
                this.close()
            }
        },
        openHealDialog() {
            if (!!this.selected && !!this.selected.id) {
                this.$rsd.dialog.open({name: 'healDialog', attrs: [true, {value:1, local: true, affected: [this.selected]}]})
                this.close()
            }
        },
        openTemporaryHPDialog() {
            if (!!this.selected && !!this.selected.id) {
                this.$rsd.dialog.open({name: 'temporaryHPDialog', attrs: [true, {value: 1, local: true, duration:0, affected: [this.selected]}]})
                this.close()
            }
        },
        openConditionDialog(type) {
            if (!!type && !!this.selected && !!this.selected.id) {
                const duration = this.$rsd.conditions.hasDuration(type)
                const value = this.$rsd.conditions.hasValue(type)

                let immune = false
                if (!!this.selected.object && !!this.selected.object.hpinfo && !!this.selected.object.hpinfo.immunities && this.selected.object.hpinfo.immunities.length > 0) {
                    this.selected.object.hpinfo.immunities.forEach(im => {
                        if (!!im && !!im.type) {
                            immune = !!immune || im.type == type
                        }
                    })
                }
                
                if (!!duration && !!value) {
                    this.$rsd.dialog.open({name: 'addConditionBothDialog', attrs: [false, {local: true, type: type, duration:0, value:1, floor: false, reduce: false, affected: [this.selected]}, {immune: immune}]})
                } else if (!!duration) {
                    this.$rsd.dialog.open({name: 'addConditionDurationDialog', attrs: [false, {local: true, type: type, duration:0, affected: [this.selected]}, {immune: immune}]})
                } else if (!!value) {
                    this.$rsd.dialog.open({name: 'addConditionValueDialog', attrs: [false, {local: true, type: type, value:1, floor: false, reduce: false, affected: [this.selected]}, {immune: immune}]})
                } else {
                    this.$rsd.members.addCondition(this.selected._key, this.selected.type, {type: type})
                }
                this.close()
            }
        },
        addRecentCondition(cond) {
            if (!!this.selected && !!this.selected.id) {
                if (!!cond && !!cond.type) {
                    this.$rsd.members.addCondition(this.selected._key, this.selected.type, {...cond})
                }
                this.close()
            }
        },
        openPersistentDamageDialog(dmg) {
            if (!!dmg && !!this.selected && !!this.selected.id) {
                let immune = false
                if (!!this.selected.object && !!this.selected.object.hpinfo && !!this.selected.object.hpinfo.immunities && this.selected.object.hpinfo.immunities.length > 0) {
                    this.selected.object.hpinfo.immunities.forEach(im => {
                        if (!!im && !!im.type) {
                            immune = !!immune || im.type == dmg
                        }
                    })
                }
                let resistant = false
                if (!!this.selected.object && !!this.selected.object.hpinfo && !!this.selected.object.hpinfo.resistances && this.selected.object.hpinfo.resistances.length > 0) {
                    this.selected.object.hpinfo.resistances.forEach(im => {
                        if (!!im && !!im.type) {
                            resistant = !!resistant || im.type == dmg
                        }
                    })
                }
                let vulnerable = false
                if (!!this.selected.object && !!this.selected.object.hpinfo && !!this.selected.object.hpinfo.weaknesses && this.selected.object.hpinfo.weaknesses.length > 0) {
                    this.selected.object.hpinfo.weaknesses.forEach(im => {
                        if (!!im && !!im.type) {
                            vulnerable = !!vulnerable || im.type == dmg
                        }
                    })
                }

                this.$rsd.dialog.open({name: 'addPersistentDamageDialog', attrs: [false, 
                    {type:'persistent damage', local: true, value: 1, dmg: dmg, affected: [this.selected]}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
                this.close()
            }
        },
        addRecentPersistentDamge(dmg) {
            if (!!dmg && !!dmg.type && !!dmg.value && dmg.value > 0 && !!this.selected && !!this.selected.id) {
                this.$rsd.members.addCondition(this.selected._key, this.selected.type, {type: 'persistent damage', dmg: dmg.type, value: dmg.value})
                this.close()
            }
        },

        openAddGMCDialog() {
            if (!this.membersArray || !!this.membersArray && this.membersArray.length < 10) {
                this.$rsd.dialog.open({name: 'gmcDialog', attrs: [false, {}]})
            }
        },
        openEditGMCDialog(member) {
            console.log('member', member)
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

        addConditionMenuHandler(on) {
            delete on.mouseleave
            console.log(on)
            return on
        },
        moreConditionsMenuHandler(on) {
            delete on.mouseleave
            console.log(on)
            return on
        }
    },
}
</script>

<style scoped>
.no-shadow {
    box-shadow: none !important;
}
.full-width {
    width: 95%;
}
.v-btn-toggle.flex-column.rounded {
    border-top-right-radius: 12px !important;
    border-top-left-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
}
.v-btn-toggle.flex-column.rounded .v-btn:first-child {
    border-top-right-radius: 12px !important;
    border-top-left-radius: 12px !important;
    border-bottom-right-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}
.v-btn-toggle.flex-column.rounded .v-btn:last-child {
    border-top-right-radius: 0px !important;
    border-top-left-radius: 0px !important;
    border-bottom-right-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
}
.v-btn-toggle.flex-column.rounded .v-btn {
    border-radius: 0px;
}
.v-btn.rounded, button.v-btn.rounded {
    border-top-right-radius: 12px !important;
    border-top-left-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
}

.v-list-item--extra-dense {
    min-height: 30px;
}

.condition-list {
    height: 250px;
    overflow-y: scroll;
}
@media (min-height: 450px) {
    .condition-list {
        height: 100%;
        overflow-y: auto;
    }
}
</style>