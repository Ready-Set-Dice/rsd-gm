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
                name: 'campaign-dialog',
                labels: {
                    new: {
                        title: 'Create campaign'
                    },
                    edit: {
                        title: 'Edit campaign'
                    }  
                },
                inputs: {
                    name: {
                        label: "Campaign name",
                        type: "string",
                        counter: 30,
                        required: true,
                        rule: 'name',
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

            if (!!options && !!options.name) {
                if (!options.color) {
                    // options.color = {r: 255, b: 255, g:255, a: 1}
                    options.color = this.Random.color()
                }
                if (!options.icon) {
                    options.icon = this.GameIcons.get.random()
                }

                this.$rsd.campaigns.addParty(options)
            }
            

            // console.log(options)

            // this.$emit('Add', options)
        },
        save(options) {
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }

            if (!!options && !!options.name && (!!options._key || options._key == 0)) {
                this.$rsd.campaigns.updateName(options._key, options.name)
            }

            // this.$emit('Save', options)
        }
    }
}
</script>