<template>
    <div class="fill-height">
        <div class="d-flex flex-column fill-height right-border panel">
            <div class="pa-2">
                <v-select
                    :value="rsd.gamestate.view.search.type"
                    :items="search.types"
                    @change="searchTypeChange"
                    class="mb-2"
                    placeholder="Category"
                    dense
                    outlined
                    hide-details
                ></v-select>
                <v-menu
                    v-model="search.autofill.show"
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
                            :disabled="!rsd.gamestate.view.search.type"
                            :placeholder="!rsd.gamestate.view.search.type ? 'First select a category' : 'Start typing'"
                            :value="rsd.gamestate.view.search.query"
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
                item-height="24"
                :bench="search.benched"
                :items="search.results"
            >
                <template v-slot:default="{ item }">
                    <v-list-item 
                        :key="item.name" 
                        @click="selectSearchResult(item)" 
                        :style="'min-height:24px;'"
                        class="accent-item"
                        :class="searchItemClass(item)"
                    >
                        {{item.name}}
                    </v-list-item>
                </template>
            </v-virtual-scroll>
        </div>
    </div>
</template>

<script>
import DefaultSearchMixin from '@root/.shared/mixin/DefaultSearchMixin'

export default {
    mixins: [
        DefaultSearchMixin,
    ],
    data() {
        return {
            details: false,
            search: {
                autofill: {
                    show: false,
                },
                value: '',
                query: '',
                results: [],
                types: ['Spells','Bestiary'],
                benched: 100,
            },
            items: {
                spells: {
                    fields: ['and ','area-range','area-type','cast-time','category','description','duration','level','name','range','rarity','save','school','tradition','trait','type'],
                    'area-range': ['area-range:5','area-range=5','area-range>5','area-range>=5','area-range<5','area-range<=5'],
                    'area-type': ['area-type:emanation','area:[cone,burst,cube,line,radius,square]'],
                    'cast-time': ['cast-time:"1"','cast-time:"2"','cast-time:"reaction"','cast-time:"free"','cast-time:"*minute*"','cast-time:"*hour*"','cast-time:"*day*"','cast-time:"*week*"'],
                    category: ['category:spell','category:[focus,spell,ritual]'],
                    description: ['description:"*magic*"', 'description:"*acid damage*"'],
                    duration: ['duration:"*round*"','duration:"*minute*"','duration:"*hour*"','duration:"*day*"','duration:"*refocus*"'],
                    level: ['level:1','level=1','level>1','level>=1','level<10','level<=10','levels:[1..10]','levels:(1..10]','levels:[1..10)','levels:(1..10)'],
                    name: ['name:"acid splash"','name:"*magic*"'],
                    range: ['range:"touch"','range:"unlimited"','range:"self"','range:"interplanar"','range:"planetary"','range:"*emanation*"','range:"10 feet"','range:"*feet"','range:"*mile*"'],
                    rarity: ['rarity:common','rarity:[common,uncommon,rare,unique]'],
                    save: ['save:will','save:[fortitude,reflex,will]'],
                    school: ['school:transmutation','school:enchantment','school:[necromancy,evocation,conjuration]','school:[divination,abjuration,illusion]'],
                    tradition: ['tradition:arcane','tradition:[arcane,divine,occult,primal]'],
                    trait: ['trait:mental','trait:[sorcerer,auditory,evil,fire,concentrate]'],
                    type: ['type:utility','type:[utility,save,attack,heal]'],
                },
                bestiary: {
                    fields: ['and', 'ability', 'alignment', 'amphibious', 'aquatic', 'caster', 'description', 'immunity', 'item', 'level', 'name', 'rarity', 'resistance', 'size', 'source', 'spell', 'trait', 'type', 'weakness'],
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

            spells: [],
            bestiary: [],
        }
    },
    computed: {
        filteredItems() {
            if (!!this.search.query) {
                const toplevel = this.items[this.rsd.gamestate.view.search.type.toLowerCase()].fields.filter(item => {
                    return item.includes(this.search.query)
                })
                if (!!toplevel && toplevel.length > 0) {
                    return toplevel
                } else {
                    const command = this.search.query.replace(/([a-zA-Z]+)[\:\=\<\>]{1}.{0,}/g, "$1")
                    return !!command && !!this.items[this.rsd.gamestate.view.search.type.toLowerCase()][command] 
                    ? this.items[this.rsd.gamestate.view.search.type.toLowerCase()][command] : null
                }
            } else {
                return this.items[this.rsd.gamestate.view.search.type.toLowerCase()].fields
            }
        },
    },
    methods: {
        searchTypeChange(type) {
            this.$store.dispatch('rsd/setSearchType', type)
            this.$store.dispatch('rsd/setSearchQuery', "")
            this.$store.dispatch('rsd/setSearchResuts', [])
            this.$store.dispatch('rsd/setSearchSelected', null)


            if (type == 'Spells') {
                this.$set(this.search, 'results', this.spells)
            } else if (type == 'Bestiary') {
                this.$set(this.search, 'results', this.bestiary)
            } else {
                this.$set(this.search, 'results', [])
            }
        },
        selectSearchResult(result) {
            // console.log(result)
            this.$store.dispatch('rsd/setSearchSelected', result)
        },
        searchItemClass(item) {
            let classes = !!this.rsd.gamestate.view.search.selected && item._id == this.rsd.gamestate.view.search.selected._id 
            ? 'accent-selected ' : ''
            classes += !!this.rsd.darkmode ? 'theme--dark' : ''
            
            return classes
        },
        autofillMenuShow(show) {
            this.search.autofill.show = show
        },
        autofillClick(item) {
            const newInput = !!this.search.query ? this.search.value.substring(0,this.search.value.length - this.search.query.length) + item : this.search.value + item
            this.searchFieldInput(newInput)
            
            this.search.autofill.show = false
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
            this.$store.dispatch('rsd/setSearchQuery', input)

            let commandSplit = input.replaceAll(/(:"[a-zA-Z0-9\,\.\-\(\)\'\*]{0,})(\ )([a-zA-Z0-9\,\.\-\(\)\'\*]{0,}")/g,'$1%_%$3').split(' ')
            commandSplit.forEach((cs,index) => {
                if (cs.includes('%_%')) {
                    commandSplit[index] = cs.replaceAll('%_%',' ')
                }
            })

            if (commandSplit.length > 1) {
                this.search.query = commandSplit[commandSplit.length-1]
                if (!this.search.autofill.show && this.search.query.length > 0) { this.autofillMenuShow(true) }
            } else {
                if (!this.search.autofill.show) { this.autofillMenuShow(true) }
                this.search.query = input
            }
            this.search.value = input

            if (commandSplit.length >= 1) {
                const filteredCommands = commandSplit.filter(c => c != 'and')
                if (!!this.rsd.gamestate.view.search.type && this.rsd.gamestate.view.search.type.toLowerCase() == 'spells' && filteredCommands.length > 0) {
                    this.getSpellsFiltered(filteredCommands)
                } else if (!!this.rsd.gamestate.view.search.type && this.rsd.gamestate.view.search.type.toLowerCase() == 'bestiary' && filteredCommands.length > 0) {
                    this.getBestiaryFiltered(filteredCommands)
                }
            }

        },
        getHighlighted(item) {
            if (!this.search.query) {
                return `<span class="autofill-content">${item}</span>`
            }

            const searchIndex = item.indexOf(this.search.query)
            if (searchIndex != -1) {
                let result = '<span class="autofill-content">';

                if (searchIndex != 0) { result += item.substring(0, searchIndex) }

                const style = !this.rsd.darkmode ? 'background-color: rgba(0,0,0,0.12);' : 'background-color: rgba(255,255,255,0.12);'

                result += '<span style="'+style+'">' 
                + item.substring(searchIndex, searchIndex+this.search.query.length)
                + '</span>'

                if (searchIndex+this.search.query.length < item.length) { result += item.substring(searchIndex+this.search.query.length, item.length) }

                result += '</span>';

                return result
            }
            return null;
        },
        getSpellsFiltered(filteredCommands) {
            let filterSpells = this.spells
            this.details = false

            const allSpellsCount = Number(filterSpells.length)

            if (!!filteredCommands && filteredCommands.length > 0) {

                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'area-type', ['system','area','areaType'])
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'area-range', ['system','area','value'], {
                    isNumber: true, check: (field) => { return field == 0}
                })
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'category', ['system','category','value'])
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'cast-time', ['system','time','value'], {isText: true})
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'description', ['system','description','value'], {isText: true})
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'duration', ['system','duration','value'], {isText: true})
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'level', ['system','level','value'], {
                    isNumber: true, check: (field) => { return field == 0}
                })
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'name', ['name'], {isText: true})
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'range', ['system','range','value'], {isText: true})
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'rarity', ['system','traits','rarity'], {isExact: true})
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'save', ['system','save','value'])
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'school', ['system','school','value'])
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'tradition', ['system','traditions'], {
                    isCustomWithValues: true, check: (field) => {
                        return (!!field.custom || (!!field.value && field.value.length > 0))
                    }
                })
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'trait', ['system','traits'], {
                    isCustomWithValues: true, check: (field) => {
                        return (!!field.custom || (!!field.value && field.value.length > 0))
                    }
                })
                filterSpells = this.doFilterCommand(filteredCommands, filterSpells, 'type', ['system','spellType','value'])

                if (!!filterSpells && allSpellsCount ==  Number(filterSpells.length) && !this.details) {
                    const lastCommand = filteredCommands[filteredCommands.length-1].toLowerCase()
                    filterSpells = filterSpells.filter(fs => {
                        return !!fs && !!fs.name && fs.name.toLowerCase().includes(lastCommand)
                    })
                }

                this.$set(this.search, 'results', filterSpells)
                let ids = new Array(filterSpells.length)
                filterSpells.forEach((fs, index) => {
                    ids[index] = fs._id
                })

                this.$store.dispatch('rsd/setSearchResuts', ids)
            }
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

                this.$set(this.search, 'results', bestiaryFilter)
                let ids = new Array(bestiaryFilter.length)
                bestiaryFilter.forEach((fs, index) => {
                    ids[index] = fs._id
                })

                this.$store.dispatch('rsd/setSearchResuts', ids)
            }
        },

        handleSpellsUpdate() {
            this.spells = this.$rsd.spells.all()
        },
        handleBestiaryUpdate() {
            this.bestiary = this.$rsd.bestiary.names()
        },
        restoreSearchResults() {
            if (this.rsd.gamestate.view.search.type.toLowerCase() == 'spells' && this.spells && this.spells.length > 0) {
                if (this.rsd.gamestate.view.search.results.length > 0) {
                    this.search.results = this.spells.filter(fs => {
                        return this.rsd.gamestate.view.search.results.includes(fs._id)
                    })
                } else {
                    this.search.results = this.spells
                }
            } else if (this.rsd.gamestate.view.search.type.toLowerCase() == 'bestiary') {
                if (this.rsd.gamestate.view.search.results.length > 0) {
                    this.search.results = this.bestiary.filter(fs => {
                        return this.rsd.gamestate.view.search.results.includes(fs._id)
                    })
                } else {
                    this.search.results = this.bestiary
                }
            }
        },
    },
    created() {
        this.$rsd.spells.on('Update',  this.handleSpellsUpdate)
        this.$rsd.bestiary.on('Update',  this.handleBestiaryUpdate)
        this.restoreSearchResults()
    },
    destroyed() {
        this.$rsd.spells.removeListener('Update',  this.handleSpellsUpdate)
        this.$rsd.bestiary.removeListener('Update',  this.handleBestiaryUpdate)
    },
    mounted() {
        this.handleSpellsUpdate()
        this.handleBestiaryUpdate()
        this.restoreSearchResults()
    },
}
</script>

<style lang="less" scoped>
.panel {
    width: 452px;
}
.right-border {
    border-right-color: rgba(0, 0, 0, 0.12) !important;
    border-right-style: solid;
    border-right-width: 1px;
}
.search-results {
    height: calc(~"100vh - 184px");
}
.search-menu-items {
    min-height: 24px;
}
.search-menu-items .v-list-item__content{
    padding-top: 0;
    padding-bottom: 0;
}
</style>