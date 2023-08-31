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
                name: 'gmc-skills-dialog',
                labels: {
                    new: {
                        title: 'Add Skills'
                    },
                    edit: {
                        title: 'Edit Skills'
                    }  
                },
                inputs: {
                    acrobatics: {
                        label: "Acrobatics",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    arcana: {
                        label: "Arcana",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    athletics: {
                        label: "Athletics",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    crafting: {
                        label: "Crafting",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    deception: {
                        label: "Deception",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    diplomacy: {
                        label: "Diplomacy",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    intimidation: {
                        label: "Intimidation",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    lore: {
                        label: "Lore",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    medicine: {
                        label: "Medicine",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    nature: {
                        label: "Nature",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    occultism: {
                        label: "Occultism",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    performance: {
                        label: "Performance",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    religion: {
                        label: "Religion",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    society: {
                        label: "Society",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    stealth: {
                        label: "Stealth",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    survival: {
                        label: "Survival",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        extra: {},
                    },
                    thievery: {
                        label: "Thievery",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
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
            // console.log(options)
            
            this.$rsd.format.skillNames.forEach(skill => {
                if (!!options[skill] || options[skill] == 0) {
                    let val = options[skill]

                    this.tmpl.inputs[skill].label = `${this.Format.capitalize(skill)} (${val > 0 ? '+' : ''}${val})`
                } else {
                    this.tmpl.inputs[skill].label = `${this.Format.capitalize(skill)} (+0)`
                }
            })
        },
    }
}
</script>