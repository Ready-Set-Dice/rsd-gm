<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
    >
    </BaseDialog>
</template>

<script>
import BaseDialog from '@root/.shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            current: {
                icon: '',
                color: {r: 255, g:255, b:255, a:1}
            },
            tmpl: {
                name: 'campaign-level-dialog',
                labels: {
                    new: {
                        title: 'Edit campaign level'
                    },
                    edit: {
                        title: 'Edit campaign level'
                    }  
                },
                inputs: {
                    level: {
                        label: "Level",
                        type: "slider",
                        min: 1,
                        max: 20,
                        required: true,
                        rule: 'levelNumber',
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
        save(options) {
            if (!!options && !!options.level && (!!options._key || options._key == 0)) {
                this.$rsd.campaigns.updateLevel(options._key, options.level)
            }
        },
    }
}
</script>