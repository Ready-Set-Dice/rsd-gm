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
                name: 'gmc-dialog',
                labels: {
                    new: {
                        title: 'Add GMC'
                    },
                    edit: {
                        title: 'Edit GMC'
                    }  
                },
                inputs: {
                    name: {
                        label: "GMC name",
                        type: "string",
                        counter: 30,
                        required: true,
                        rule: 'name',
                    },
                    ancestry: {
                        label: "Ancestry",
                        type: "pair",
                        items: [],
                    },
                    background: {
                        label: "Background",
                        type: "pair",
                        items: [],
                    },
                    class: {
                        label: "Class",
                        type: "pair",
                        items: [],
                    }
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.tmpl.inputs.ancestry.items = this.$rsd.build.getAncestries()
                this.tmpl.inputs.background.items = this.$rsd.build.getBackgrounds()
                this.tmpl.inputs.class.items = this.$rsd.build.getClasses()

                if (!!options && !!options.abc) {
                    if (!!options.abc.a) {options.ancestry = options.abc.a}
                    if (!!options.abc.b) {options.background = options.abc.b}
                    if (!!options.abc.c) {options.class = options.abc.c}
                }

                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {

            if (!!options && !!options.name) {
                this.$rsd.members.addGMC(options)
            }
        },
        save(options) {
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }

            if (!!options && !!options.name && !!options.id) {
                const a = !!options.ancestry ? options.ancestry : null
                const b = !!options.background ? options.background : null
                const c = !!options.class ? options.class : null

                const newObj = {
                    name: options.name,
                    abc: !!a || !!b || !!c ? {
                        a: !!a ? a : null,
                        b: !!b ? b : null,
                        c: !!c ? c : null,
                    } : null,
                }

                this.$rsd.members.updateGMC(options.id, newObj)
            }

            // this.$emit('Save', options)
        }
    }
}
</script>