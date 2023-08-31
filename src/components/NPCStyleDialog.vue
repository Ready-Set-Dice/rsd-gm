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
                name: 'npc-style-dialog',
                labels: {
                    new: {
                        title: 'Edit style'
                    },
                    edit: {
                        title: 'Edit style'
                    }  
                },
                inputs: {
                    color: {
                        label: "Color",
                        type: 'color',
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
                if (!options.color) {
                    options.color = this.Random.color()
                }

                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
                delete options.color
            }

            if (!!options && !!options.color && !!options.id) {
                if (!!this.combat) {
                    this.$rsd.combat.updateMember(options.id, {color: options.color})
                } else {
                    this.$rsd.encounters.updateMember(options.id, {color: options.color})
                }
            }
        },
    }
}
</script>