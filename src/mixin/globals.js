import { dmgTypes, healTypes, conditionTypes } from '@root/.shared/constants/gametypes'

export default {
    data() {
        return {
            refreshCombatantKey: 0,
            combatantDragIndex: -1,

            strengthTypes: [
                {type: 'elite'},
                {type: 'normal'},
                {type: 'weak'},
            ],

            combatAddTypes: [
                {type: 'party'},
                {type: 'combatant'},
            ],

            playerConditions: {
                regular: [
                    {type: 'blinded'},
                    {type: 'concealed'},
                    {type: 'clumsy'},
                    {type: 'dying'},
                    {type: 'enfeebled'},
                    {type: 'fatigued'},
                    {type: 'frightened'},
                    {type: 'grabbed'},
                    {type: 'hidden'},
                    {type: 'immobilized'},
                    {type: 'off-Guard'},
                    {type: 'prone'},
                    {type: 'restrained'},
                    {type: 'stunned'},
                    {type: 'sickened'},
                    {type: 'wounded'},
                ],
                other: [
                    {type: 'broken'},
                    {type: 'confused'},
                    {type: 'controlled'},
                    {type: 'dazzled'},
                    {type: 'deafened'},
                    {type: 'doomed'},
                    {type: 'drained'},
                    {type: 'encumbered'},
                    {type: 'fascinated'},
                    {type: 'fleeing'},
                    {type: 'invisible'},
                    {type: 'paralyzed'},
                    {type: 'petrified'},
                    {type: 'quickened'},
                    {type: 'slowed'},
                    {type: 'stupified'},
                    {type: 'unconscious'},
                    {type: 'undetected'},
                    {type: 'unnoticed'},
                    
                ]
            },
            npcConditions: {
                regular: [
                    {type: 'blinded'},
                    {type: 'concealed'},
                    {type: 'confused'},
                    {type: 'clumsy'},
                    {type: 'dazzled'},
                    {type: 'enfeebled'},
                    {type: 'frightened'},
                    {type: 'grabbed'},
                    {type: 'hidden'},
                    {type: 'immobilized'},
                    {type: 'off-Guard'},
                    {type: 'paralyzed'},
                    {type: 'prone'},
                    {type: 'restrained'},
                    {type: 'stunned'},
                    {type: 'sickened'},
                ],
                other: [
                    {type: 'broken'},
                    {type: 'controlled'},
                    {type: 'dying'},
                    {type: 'deafened'},
                    {type: 'doomed'},
                    {type: 'drained'},
                    {type: 'encumbered'},
                    {type: 'fatigued'},
                    {type: 'fascinated'},
                    {type: 'fleeing'},
                    {type: 'invisible'},
                    {type: 'petrified'},
                    {type: 'quickened'},
                    {type: 'slowed'},
                    {type: 'stupified'},
                    {type: 'unconscious'},
                    {type: 'unnoticed'},
                    {type: 'undetected'},
                    {type: 'wounded'},                    
                ]
            },
        }
    },
    computed: {
        dmgTypes() {
            return dmgTypes
        },
        healTypes() {
            return healTypes
        },
        conditionTypes() {
            return conditionTypes
        },
        combatantsArray: {
            get() {
                this.refreshCombatantKey++;
                return this.$rsd.combat.getCombatantsArray()
            },
            set(value) {
                const oldValue = this.combatantsArray
                const draggedObject = !!oldValue && (!!this.combatantDragIndex || this.combatantDragIndex == 0)
                    && !!oldValue[this.combatantDragIndex] ? oldValue[this.combatantDragIndex] : null

                this.$rsd.combat.setMembersArray(value, draggedObject)
            }
        },
        campaignArray: {
            get() {
                return this.$store.getters['remotedb/campaignArray']
            },
            set(value) {
                this.$rsd.campaigns.setArray(value)
            }
        },
        membersArray: {
            get() {
                return this.$rsd.members.getMembersArray()
            },
        },
        encounterArray: {
            get() {
                return this.$store.getters['remotedb/encounterArray']
            },
            set(value) {
                this.$rsd.encounters.setArray(value)
            }
        },
        encounterMembersArray: {
            get() {
                return this.$store.getters['remotedb/encounterMembersArray']
            },
            set(value) {
                const oldValue = this.encounterMembersArray
                const draggedObject = !!oldValue && !!this.encmember && (!!this.encmember.dragOldIndex || this.encmember.dragOldIndex == 0)
                && !!oldValue[this.encmember.dragOldIndex] ? oldValue[this.encmember.dragOldIndex] : null

                this.$rsd.encounters.setMembersArray(value, draggedObject)
            }
        },
        encounterMembersArrayReadOnly: {
            get() {
                this.refreshEncounterKey;

                let originalArray = this.$store.getters['remotedb/encounterMembersArray']

                if (!!originalArray && originalArray.length > 0) {
                    originalArray.forEach((member, key) => {
                        if (!member.name && !!member.bid) {
                            originalArray[key].name = this.$rsd.bestiary.getName(member.bid)
                        }
                        originalArray[key].identifier = (member.adj == 'weak' || member.adj == 'elite' ? this.$rsd.format.capitalize(member.adj) + ' ' : '') + this.$rsd.bestiary.getType(member.bid)
                    })
                }

                return originalArray
            },
        },

        isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        },

        isCurrentCombat() {
            return this.mobileView.navigation == 'Campaign' && !!this.rsd.gamestate.menu.campaign.combat && !!this.mobileView.encounterSelected && !this.mobileView.addCombatantSelected
        },
        isSelectedEncounter() {
            return this.mobileView.navigation == 'Campaign' && !this.rsd.gamestate.menu.campaign.combat && !!this.mobileView.encounterSelected && !this.mobileView.addCombatantSelected
        },
        isEncounterOverview() {
            return this.mobileView.navigation == 'Campaign' && !!this.mobileView.campaignSelected && !this.mobileView.encounterSelected
        },
        isCampaignOverview() {
            return this.mobileView.navigation == 'Campaign' && !this.mobileView.campaignSelected
        },
        isPartyOverview() {
            return this.mobileView.navigation == 'Party'
        },

    },
}