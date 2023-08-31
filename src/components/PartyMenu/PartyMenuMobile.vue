<template>
    <div class="fill-height width-100">
        <div class="d-flex flex-column fill-height">
            <div class="flex-row fill-height d-flex content-list alt-scrollbar">
                <v-list
                    dense
                    class="d-flex flex-grow-1 py-0 flex-column"
                    :style="`width:${members.width}px`"
                >
                    <v-list-item
                        link 
                        class="pl-2 pr-4 py-1 no-flex"
                        @click="members.selectOverview()"
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
                        @click="members.click($event, member, index)"
                    >
                        <v-list-item-icon class="mr-2">
                            <v-btn
                                icon 
                                class="icon-offset"
                                :class="members.isBenched(member) ? '' : 'white--text primary'"
                                elevation="5"
                                small
                            >
                                <v-icon>{{member.type == 'gmc' ? 'mdi-robot' : 'mdi-account'}}</v-icon>
                            </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{member.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

import FloatingMenu from '@root/.shared/components/FloatingMenu'

export default {
    props: {
        menu: Object,
    },
    components: {
        draggable,
        FloatingMenu,
    },
    data() {
        return {

            members: {
                width: 452,
                prevWidth: 452,
                startX: null,
                selected: [],
                click: (event, member, index) => {
                    const basestats = this.$rsd.members.getStats(member)
                    const object = this.$rsd.members.getObject(member)
                    const stats = this.$rsd.conditions.getStatsObject(member, basestats, member.conditions, object)

                    const memberObject = {
                        ...member,
                        basestats: basestats,
                        name: member.name,
                        identifier: this.$rsd.combat.getIdentifier(member, object),
                        object: this.$rsd.members.getObject(member),
                        stats: stats,
                        _key: index,
                    }

                    this.$rsd.members.target = {...memberObject}
                    this.members.selected = [{...memberObject}]

                    setTimeout(() => {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            partySelected: true,
                        })
                    }, 100)
                },
                selectOverview: () => {
                    this.$rsd.members.target = null
                    this.members.selected = []

                    setTimeout(() => {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            partySelected: true,
                        })
                    }, 100)
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
}
</script>

<style lang="less" scoped>
.no-flex {
    flex: none;
}

.icon-offset {
    top: -2px;
}

.content-list {
    height: calc(~"100vh - 144px");
    overflow-y: auto;
}

.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
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