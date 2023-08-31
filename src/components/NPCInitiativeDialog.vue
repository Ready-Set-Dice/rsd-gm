<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
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
                name: 'npc-initiative-dialog',
                labels: {
                    new: {
                        title: 'Edit initiative'
                    },
                    edit: {
                        title: 'Edit initiative'
                    }  
                },
                inputs: {
                    initiative: {
                        label: "Initiative",
                        min: -1,
                        max: 100,
                        type: "number",
                        extra: {},
                        rule: 'initiativeNumber',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }

            if (!!options && !!options.initiative && options.id) {
                this.$rsd.encounters.updateMember(options.id, {initiative: options.initiative})
            }

            // this.$emit('Save', options)
        }
    }
}
</script>