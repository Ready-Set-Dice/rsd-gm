<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @Add="add"
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
                name: 'encounter-dialog',
                labels: {
                    new: {
                        title: 'Create encounter'
                    },
                    edit: {
                        title: 'Edit encounter'
                    }  
                },
                inputs: {
                    name: {
                        label: "Encounter name",
                        type: "string",
                        counter: 30,
                        required: true,
                        rule: 'name',
                    },
                    level: {
                        label: "Party level",
                        type: "slider",
                        min: 1,
                        max: 20,
                        required: true,
                        rule: 'levelNumber',
                    },
                    partysize: {
                        label: "Party size",
                        type: "slider",
                        min: 1,
                        max: 10,
                        required: true,
                        rule: 'partysizeNumber',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {

            if (!!options && !!options.name && !!options.level && !!options.partysize) {
                if (!options.color) {
                    // options.color = {r: 255, b: 255, g:255, a: 1}
                    options.color = this.Random.color()
                }
                if (!options.icon) {
                    options.icon = this.GameIcons.get.random()
                }

                this.$rsd.encounters.addEncounter(options)
            }
            

            // console.log(options)

            // this.$emit('Add', options)
        },
        save(options) {
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }

            if (!!options && !!options.name && !!options.level && !!options.partysize && (!!options._key || options._key == 0)) {
                this.$rsd.encounters.updateEncounter(options._key, {name: options.name, level: options.level, partysize: options.partysize})
            }

            // this.$emit('Save', options)
        }
    }
}
</script>