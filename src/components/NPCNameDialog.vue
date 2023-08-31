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
            combat: false,
            tmpl: {
                name: 'npc-name-dialog',
                labels: {
                    new: {
                        title: 'Edit NPC name'
                    },
                    edit: {
                        title: 'Edit NPC name'
                    }  
                },
                inputs: {
                    name: {
                        label: "NPC name",
                        type: "string",
                        counter: 35,
                        required: true,
                        rule: 'name',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}, extra = {}) {
            if (!!extra) {
                this.combat = !!extra.combat
            }
            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }
            
            if (!!options && !!options.name && !!options.id) {
                if (!!this.combat) {
                    this.$rsd.combat.updateMember(options.id, {name: options.name})
                } else {
                    this.$rsd.encounters.updateMember(options.id, {name: options.name})
                }
            }

            // this.$emit('Save', options)
        }
    }
}
</script>