<template>
    <div 
        class="d-flex flex-column encounter-sheet alt-scrollbar ma-2"
        v-if="!!visible"
        :class="containerClass + (!!rsd.darkmode ? ' theme--dark' : '')"
    >
        <div>
            <v-menu
                v-model="encounterSearch.autofill.show"
                offset-y
                :open-on-click="false"
                :close-on-click="false"
                :close-on-content-click="false"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-on="on"
                        v-bind="attrs"
                        @input="searchFieldInput"
                        @focus="autofillMenuShow(true)"
                        @blur="autofillMenuShow(false)"
                        v-on:keydown.enter="autofillKeypress"
                        :value="rsd.gamestate.view.encounter.query"
                        :placeholder="'Start typing to search combatants...'"
                        dense
                        outlined
                        hide-details
                    ></v-text-field>
                </template>
                <v-list dense ref="autofillList" v-show="!!filteredItems && filteredItems.length > 0">
                    <v-list-item
                        v-for="(item,index) in filteredItems"
                        :key="'searchitem-'+index"
                        @mousedown="autofillClick(item)"
                        @click="() => {}"
                        class="search-menu-items"
                    >
                        <v-list-item-content v-if="!details" v-html="$sanitize(getHighlighted(item))"></v-list-item-content>
                        <v-list-item-content v-else><span class="autofill-content">{{item}}</span></v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <v-divider></v-divider>
        <v-virtual-scroll
            class="search-results alt-scrollbar"
            :class="!!rsd.darkmode ? 'theme--dark' : ''"
            item-height="48"
            :bench="encounterSearch.benched"
            :items="encounterSearch.results"
        >
            <template v-slot:default="{ item }">
                <v-list-item 
                    :key="item.name" 
                    @click="selectSearchResult(item)" 
                    :style="'min-height:48px;'"
                    class="accent-item pl-0 pr-1 ml-n1"
                    :class="searchItemClass(item)"
                    :ripple="false"
                >
                    <v-list-item-action class="my-0 mx-2">
                        <v-btn icon tile small @click="addToEncounter(item)" @click.stop="">
                            <v-icon color="primary lighten-1">mdi-plus</v-icon>
                        </v-btn>
                    </v-list-item-action>
                    <v-list-item-title>
                        <span>{{item.name}}</span>
                        <span class="float-right">{{item.level}}</span>
                    </v-list-item-title>
                </v-list-item>
            </template>
        </v-virtual-scroll>

        <SnackbarManager ref="snackbarManager" />
    </div>
</template>

<script>
import DefaultSearchMixin from '@root/.shared/mixin/DefaultSearchMixin'
import SnackbarManager from '@root/.shared/components/SnackbarManager'

export default {
    components: {
        SnackbarManager,
    },
    mixins: [
        DefaultSearchMixin,
    ],
    data() {
        return {
            details: false,
            activeEncounter: null,
            encounterSearch: {
                autofill: {
                    show: false,
                },
                value: '',
                query: '',
                results: [],
                benched: 50,
            },
            items: {
                bestiary: {
                    fields: ['and', 'ability', 'alignment', 'amphibious', 'aquatic', 'caster', 'description', 'immunity', 'item', 'level', 'name', 'rarity', 'resistance', 'size', 'source', 'spell', 'trait', 'type', 'weakness'], //'party-level',
                    ability: ['ability:"*claws*"','ability:"*scent*"','ability:"*curse*"','ability:"*vision*"','ability:"*spells*"'],
                    alignment: ['alignment:ng', 'alignment:[ng,n,ce,le,cg,lg,ln,ne,cn]'],
                    amphibious: ['amphibious:true','amphibious:false'],
                    aquatic: ['aquatic:true','aquatic:false'],
                    caster: ['caster:true', 'caster:false'],
                    description: ['description:"*goblin*"', 'description:"*acid damage*"'],
                    immunity: ['immunity:"bleed"','immunity:"*death*"','immunity:"poison"','immunity:"*magic*"'],
                    item: ['item:"shortsword"','item:"*bolts*"','item:"*crossbow*"'],
                    level: ['level:-1','level=-1','level>-1','level>=-1','level<25','level<=25','levels:[-1..25]','levels:(-1..25]','levels:[-1..25)','levels:(-1..25)'],
                    name: ['name:"acid splash"','name:"*magic*"'],
                    // 'party-level': ['party-level:true','party-level:false'],
                    rarity: ['rarity:common','rarity:[common,uncommon,rare,unique]'],
                    resistance: ['resistance:"mental"','resistance:"*pysical*"','resistance:"*except*"'],
                    size: ['size:med','size:[tiny,sm,med,lg,huge,grg]'],
                    source: ['source:"pathfinder bestiary"','source:"*bestiary*"', 'source:"*society*"', 'source:"*157*"'],
                    spell: ['spell:"produce flame"','spell:"*magic*"'],
                    trait: ['trait:animal','trait:[swarm,mindless,undead,golem,grioth]'],
                    type: ['type:humanoid','type:[construct,elemental,abberation,animal]','type:[monitor,plant,fiend,celestial],','type:[spirit,beast,ooze,giant]','type:[undead,fungus,fey,astral]','type:[dream,time,positive,petitioner]','type:[negative,ethereal,mindless,leshy]','type:[earth,npc,hazard]'],
                    weakness: ['weakness:"coldiron"', 'weakness:"evil"', 'weakness:"*cold*"'],
                },
            },

            bestiary: [],
        }
    },
    props: {
        visible: Boolean,
        containerClass: String,
        currentCombat: Boolean,
    },
    computed: {
        filteredItems() {
            if (!!this.encounterSearch.query) {
                const toplevel = this.items['bestiary'].fields.filter(item => {
                    return item.includes(this.encounterSearch.query)
                })
                if (!!toplevel && toplevel.length > 0) {
                    return toplevel
                } else {
                    const command = this.encounterSearch.query.replace(/([a-zA-Z]+)[\:\=\<\>]{1}.{0,}/g, "$1")
                    return !!command && !!this.items['bestiary'][command] 
                    ? this.items['bestiary'][command] : null
                }
            } else {
                return this.items['bestiary'].fields
            }
        },
    },
    watch: {
        'rsd.gamestate.view.encounter.partyAppropriate': {
            handler: function (newVal, oldVal) {
                if (!!newVal != oldVal) {
                    this.refreshSearch()
                }
            }
        },
        'rsd.gamestate.view.encounter.refresh': {
            handler: function (newVal, oldVal) {
                if (!!newVal) {
                    this.refreshSearch()
                    this.$store.dispatch('rsd/refreshEncounter', false)
                }
            }
        }
    },
    methods: {
        refreshSearch() {
            this.searchFieldInput(this.encounterSearch.query)
            this.encounterSearch.autofill.show = false
        },

        selectSearchResult(result) {
            this.$rsd.encounters.target = result

            this.$store.dispatch('rsd/setMobileView', {
                ...this.mobileView,
                campaignSelected: true,
                encounterSelected: true,
                addCombatantSelected: true,
                targetSelected: true,
            })
        },
        searchItemClass(item) {
            let classes = !!this.rsd.gamestate.view.encounter.target && item._id == this.rsd.gamestate.view.encounter.target._id && !this.rsd.gamestate.view.encounter.target.member
            ? 'accent-current ' : ''
            classes += !!this.rsd.darkmode ? 'theme--dark' : ''
            
            return classes
        },
        autofillMenuShow(show) {
            this.encounterSearch.autofill.show = show
        },
        autofillClick(item) {
            const newInput = !!this.encounterSearch.query ? this.encounterSearch.value.substring(0,this.encounterSearch.value.length - this.encounterSearch.query.length) + item : this.encounterSearch.value + item
            this.searchFieldInput(newInput)
            
            this.encounterSearch.autofill.show = false
        },
        autofillKeypress(event) {
            if (!!this.$refs && !!this.$refs['autofillList']) {
                //v-list-item--highlighted
                const parent = this.$refs['autofillList'].$el
                if (!!parent) {
                    const highlighted = parent.getElementsByClassName('v-list-item--highlighted')
                    if (!!highlighted && highlighted.length > 0) {
                        const content = highlighted[0].getElementsByClassName('autofill-content')
                        if (!!content && content.length > 0) {
                            let text = content[0].innerText
                            if (text == 'and') { text+= ' ' }
                            this.autofillClick(text)
                        }
                    }
                }
            }
        },
        searchFieldInput(input) {
            this.$store.dispatch('rsd/setEncounterQuery', input)

            let commandSplit = input.replaceAll(/(:"[a-zA-Z0-9\,\.\-\(\)\'\*]{0,})(\ )([a-zA-Z0-9\,\.\-\(\)\'\*]{0,}")/g,'$1%_%$3').split(' ')
            commandSplit.forEach((cs,index) => {
                if (cs.includes('%_%')) {
                    commandSplit[index] = cs.replaceAll('%_%',' ')
                }
            })

            if (commandSplit.length > 1) {
                this.encounterSearch.query = commandSplit[commandSplit.length-1]
                if (!this.encounterSearch.autofill.show && this.encounterSearch.query.length > 0) { this.autofillMenuShow(true) }
            } else {
                if (!this.encounterSearch.autofill.show) { this.autofillMenuShow(true) }
                this.encounterSearch.query = input
            }
            this.encounterSearch.value = input

            if (commandSplit.length >= 1) {
                const filteredCommands = commandSplit.filter(c => c != 'and')
                this.getBestiaryFiltered(filteredCommands)
            }

        },
        getHighlighted(item) {
            if (!this.encounterSearch.query) {
                return `<span class="autofill-content">${item}</span>`
            }

            const searchIndex = item.indexOf(this.encounterSearch.query)
            if (searchIndex != -1) {
                let result = '<span class="autofill-content">';

                if (searchIndex != 0) { result += item.substring(0, searchIndex) }

                const style = !this.rsd.darkmode ? 'background-color: rgba(0,0,0,0.12);' : 'background-color: rgba(255,255,255,0.12);'

                result += '<span style="'+style+'">' 
                + item.substring(searchIndex, searchIndex+this.encounterSearch.query.length)
                + '</span>'

                if (searchIndex+this.encounterSearch.query.length < item.length) { result += item.substring(searchIndex+this.encounterSearch.query.length, item.length) }

                result += '</span>';

                return result
            }
            return null;
        },

        getBestiaryFiltered(filteredCommands) {
            let bestiaryFilter = this.bestiary
            this.details = false

            const allBestiaryCount = Number(bestiaryFilter.length)

            if (!!filteredCommands && filteredCommands.length > 0) {

                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'ability', ['ab'], {isTextArray: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'alignment', ['alignment'], {isExact: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'amphibious', ['am'], {isBoolean: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'aquatic', ['aq'], {isBoolean: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'caster', ['cs'], {isBoolean: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'description', ['ds'], {isText: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'immunity', ['im'], {isTextArray: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'item', ['it'], {isTextArray: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'level', ['level'], {
                    isNumber: true, check: (field) => { return field == 0}
                })
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'name', ['name'], {isText: true})

                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'rarity', ['rarity'], {isExact: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'resistance', ['rs'], {isTextArray: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'size', ['size'], {isExact: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'source', ['source'], {isText: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'spell', ['sp'], {isTextArray: true})
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'trait', ['traits'])
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'type', ['type'])
                bestiaryFilter = this.doFilterCommand(filteredCommands, bestiaryFilter, 'weakness', ['wk'], {isTextArray: true})

                if (!!bestiaryFilter && allBestiaryCount ==  Number(bestiaryFilter.length) && !this.details) {
                    const lastCommand = filteredCommands[filteredCommands.length-1].toLowerCase()
                    bestiaryFilter = bestiaryFilter.filter(fs => {
                        return !!fs && !!fs.name && fs.name.toLowerCase().includes(lastCommand)
                    })
                }
            }

            bestiaryFilter = this.getPartyAppropriateFilter(bestiaryFilter)

            this.$set(this.encounterSearch, 'results', bestiaryFilter)
            let ids = new Array(bestiaryFilter.length)
            bestiaryFilter.forEach((fs, index) => {
                ids[index] = fs._id
            })

            this.$store.dispatch('rsd/setEncounterResuts', ids)
        },

        compareByLevel(a, b) {
            if (a.level < b.level) {
                return -1
            } else if (a.level > b.level) {
                return 1
            } else if (a.level == b.level) {
                return a.name.toUpperCase() <= b.name.toUpperCase() ? -1 : 1
            }
        },

        handleBestiaryUpdate() {
            this.bestiary = this.$rsd.bestiary.names()
        },
        restoreSearchResults() {
            let restoredResults = this.bestiary

            if (this.rsd.gamestate.view.encounter.results.length > 0) {
                restoredResults = this.bestiary.filter(fs => {
                    return this.rsd.gamestate.view.encounter.results.includes(fs._id)
                })
            }

            restoredResults = this.getPartyAppropriateFilter(restoredResults)

            this.$set(this.encounterSearch, 'results', restoredResults)
        },

        getPartyAppropriateFilter(bestiaryFilter) {
            if (!!this.activeEncounter && !!this.rsd.gamestate.view.encounter.partyAppropriate) {
                const lowest = Math.max(-1, this.activeEncounter.level-4)
                const highest = Math.min(25, this.activeEncounter.level+4)
                bestiaryFilter = bestiaryFilter.filter(bf => bf.level >= lowest && bf.level <= highest )
            }
            bestiaryFilter = bestiaryFilter.sort(this.compareByLevel)
            return bestiaryFilter
        },

        addToEncounter(item) {
            if (!!item && !item.member) {
                if (!this.currentCombat) {
                    this.$rsd.encounters.addMember(item._id)
                    this.$rsd.dialog.open({name: 'snackbarManager', attrs: [
                        'Added',
                        `${item.name} added to the encounter.`
                    ]})
                } else {
                    this.$rsd.combat.addCombatant(item._id)
                    this.$rsd.dialog.open({name: 'snackbarManager', attrs: [
                        'Added',
                        `${item.name} added to current combat.`
                    ]})
                }
            }
        },
    },
    created() {
        this.$rsd.bestiary.on('Update',  this.handleBestiaryUpdate)
    },
    destroyed() {
        this.$rsd.bestiary.removeListener('Update',  this.handleBestiaryUpdate)
    },
    mounted() {
        this.handleBestiaryUpdate()
        this.restoreSearchResults()

    },
}
</script>

<style lang="less" scoped>
.encounter-sheet {
    overflow-y: scroll;
    overflow-x: clip;
}
.mobile-view {
    width: calc(~"100vw");
    max-width: calc(~"100vw");
    height: calc(~"100vh - 138px");
    max-height: calc(~"100vh - 138px");
}
.full-column-view {
    width: calc(~"100vw - 48px");
    max-width: calc(~"100vw - 48px");
    height: calc(~"50vh - 40px");
    max-height: calc(~"50vh - 40px");
}
.full-row-view {
    width: calc(~"50vw - 24px");
    max-width: calc(~"50vw - 24px");
    height: calc(~"100vh - 80px");
    max-height: calc(~"100vh - 80px");
}
.full-overlap-view {
    width: calc(~"100vw - 48px");
    max-width: calc(~"100vw - 48px");
    height: calc(~"100vh - 80px");
    max-height: calc(~"100vh - 80px");
}
.full-tactical-current-view {
    width: calc(~"100vw - 48px");
    max-width: calc(~"100vw - 48px");
    height: calc(~"75vh - 40px");
    max-height: calc(~"75vh - 40px");
}
.full-tactical-target-view {
    width: calc(~"100vw - 48px");
    max-width: calc(~"100vw - 48px");
    height: calc(~"25vh - 40px");
    max-height: calc(~"25vh - 40px");
}

.column-view {
    width: calc(~"100vw - 500px");
    max-width: calc(~"100vw - 500px");
    height: calc(~"50vh - 40px");
    max-height: calc(~"50vh - 40px");
}
.row-view {
    width: calc(~"50vw - 250px");
    max-width: calc(~"50vw - 250px");
    height: calc(~"100vh - 80px");
    max-height: calc(~"100vh - 80px");
}
.overlap-view {
    width: calc(~"100vw - 500px");
    max-width: calc(~"100vw - 500px");
    height: calc(~"100vh - 80px");
    max-height: calc(~"100vh - 80px");
}
.tactical-current-view {
    width: calc(~"100vw - 500px");
    max-width: calc(~"100vw - 500px");
    height: calc(~"75vh - 40px");
    max-height: calc(~"75vh - 40px");
}
.tactical-target-view {
    width: calc(~"100vw - 500px");
    max-width: calc(~"100vw - 500px");
    height: calc(~"25vh - 40px");
    max-height: calc(~"25vh - 40px");
}

.search-menu-items {
    min-height: 48px;
}
.search-menu-items .v-list-item__content{
    padding-top: 0;
    padding-bottom: 0;
}

</style>