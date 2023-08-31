<template>
    <div class="fill-height">
        <div class="d-flex flex-column fill-height">
            <div class="flex-row fill-height d-flex">
                <v-list
                    dense
                    class="d-flex flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :style="`width:${topics.width}px;`"
                >
                    <v-list-item 
                        v-for="(topic, index) in topicsArray"
                        :key="'topic-'+index"
                        link 
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="topic.toLowerCase() == helpState.topic ? 'accent-selected' : ''"
                        @click="topics.select(topic.toLowerCase())"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>{{topic}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
                <v-list
                    dense
                    class="d-flex flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :style="`width:${pages.width}px;`"
                >
                    <v-list-item
                        v-for="(page, index) in topics[helpState.topic].pages" :key="'page-'+index"
                        link 
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="page.toLowerCase() == helpState.page ? 'accent-selected' : ''"
                        @click="!!page ? pages.select(page.toLowerCase()) : null"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{page}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
    },
    components: {
    },
    data() {
        return {
            topics: {
                width: 150,
                general: {
                    pages: ['Welcome', 'Interface', 'Shortcuts']
                },
                setup: {
                    pages: ['Campaign', 'Inviting Players', 'GM Characters', 'Encounter', 'Combat']
                },
                combat: {
                    pages: ['Alerts', 'Conditions', 'Loading Encounters', 'Members', 'Health', 'Damage', 'Spells']
                },
                campaign: {
                    pages: ['Rename Campaign', 'Edit Style', 'Inviting Players', 'GM Characters', 'Removing Members']
                },
                gmc: {
                    pages: ['Creating', 'Renaming', 'Edit Stats', 'Edit Skills', 'Removing Members', 'Deleting']
                },
                encounter: {
                    pages: ['Creating', 'Renaming', 'Edit Style', 'Load Into Combat', 'Deleting']
                },
                custom: {
                    pages: ['Creatures']
                },
                search: {
                    pages: ['Bestiary','Spells']
                },
                select: (topic) => {
                    let newTopic = !!topic ? topic : 'general'
                    let newPage = this.topics[topic].pages[0].toLowerCase()

                    this.$store.dispatch('rsd/setHelpPage', {topic: newTopic, page: newPage})
                },
            },
            pages: {
                width: 150,
                select: (page) => {
                    let newPage = !!page ? page : ''

                    this.$store.dispatch('rsd/setHelpPage', {page: newPage})
                },
            },
            topicsArray: ['General','Setup','Combat', 'Campaign', 'GMC', 'Encounter', 'Custom', 'Search'],
            
        }
    },
    computed: {
        helpState: {
            get() {
                return this.rsd.gamestate.view.help
            }
        },
    },
    methods: {
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
    height: calc(~"100vh - 82px");
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