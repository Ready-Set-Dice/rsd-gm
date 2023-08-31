<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
    />
</template>

<script>
import BaseDialog from '@root/.shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            tmpl: {
                name: 'gmc-stats-dialog',
                labels: {
                    new: {
                        title: 'Add Stats'
                    },
                    edit: {
                        title: 'Edit Stats'
                    }  
                },
                steps: {
                    enabled: true,
                    items: [
                        'Health, AC & Speed',
                        'Base stats',
                        'Saving throws',
                    ],
                },
                inputs: {
                    maxhp: {
                        label: "Maximum health",
                        type: "number",
                        min: 1,
                        max: 1000,
                        required: true,
                        rule: 'largeNumber',
                        step: 0,
                        extra: {},
                    },
                    ac: {
                        label: "Armor class (AC)",
                        type: "number",
                        min: 8,
                        max: 50,
                        required: true,
                        rule: 'smallNumber',
                        step: 0,
                        extra: {},
                    },
                    speed: {
                        label: "Movement speed",
                        type: "number",
                        min: 5,
                        max: 100,
                        stepSize: 5,
                        required: true,
                        rule: 'mediumNumber',
                        step: 0,
                        extra: {},
                    },
                    strength: {
                        label: "Strength",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    dexterity: {
                        label: "Dexterity",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    constitution: {
                        label: "Constitution",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    intelligence: {
                        label: "Intelligence",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    wisdom: {
                        label: "Wisdom",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    charisma: {
                        label: "Charisma",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    perception: {
                        label: "Perception",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                    fortitude: {
                        label: "Fortitude",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                    reflex: {
                        label: "Reflex",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                    will: {
                        label: "Will",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!options) {
                options = this.$rsd.format.convertStatObjectToFlat(options)

                this.updateLabels(options)
            }

            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {

            options = this.$rsd.format.convertStatFlatToObject(options)

            if (!!options && !!options.name && !!options.id) {
                this.$rsd.members.updateGMC(options.id, {...options})
            }
        },
        onChange(options) {
            this.updateLabels(options)
        },
        updateLabels(options) {
            // console.log('wisdom',options.wisdom)
            let saves = ['perception'].concat(this.$rsd.format.saveNames)
            saves.forEach(save => {
                if (!!options[save] || options[save] == 0) {
                    let val = options[save]

                    // console.log(`save ${save}, score_name ${score_name}, score ${score}, level ${level}, val ${val}, mod ${save_modifier}`)

                    this.tmpl.inputs[save].label = `${this.Format.capitalize(save)} (${val > 0 ? '+' : ''}${val})`
                } else {
                    this.tmpl.inputs[save].label = `${this.Format.capitalize(save)} (+0)`
                }
            })
        },
    }
}
</script>