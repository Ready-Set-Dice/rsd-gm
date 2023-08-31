<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @Add="add"
        @Remove="remove"
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
                removeButton: true,
                name: 'round-alert-dialog',
                labels: {
                    new: {
                        title: 'Create round alert'
                    },
                    edit: {
                        title: 'Edit round alert'
                    }  
                },
                inputs: {
                    remove: {
                        label: "Remove on trigger",
                        type: "choice",
                        choices: ['True', 'False'],
                    },
                    round: {
                        label: "Round trigger (lower than current triggers always)",
                        type: "number",
                        rule: "initiativeNumber",
                        min: -1,
                        max: 100,
                        extra: {},
                    },
                    title: {
                        type: 'string',
                        label: 'Alert title',
                        counter: 20,
                        rule: 'alertTitle',
                    },
                    description: {
                        type: 'textarea',
                        label: 'Alert message',
                        counter: 120,
                        rule: 'alertRule',
                        required: true,
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {

                options = this.reverseOptions(options)

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {
            options = this.parseOptions(options)

            if (!!options) {
                // this.$rsd.campaigns.addParty(options)
                this.$rsd.combat.addRoundAlert(options)
            }
        },
        save(options) {
            options = this.parseOptions(options)

            if (!!options && !!options.title && (!!options._key || options._key == 0)) {
                const alertIndex = options._key
                delete options._key

                this.$rsd.combat.updateRoundAlert(alertIndex, options)
            }
        },
        remove(options) {
            options = this.parseOptions(options)

            if (!!options && (!!options._key || options._key == 0)) {
                const alertIndex = options._key
                delete options._key

                this.$rsd.combat.removeRoundAlert(alertIndex)
            }
        },

        parseOptions(options) {
            if (!!options) {
                options.remove = !options.remove

                delete options.trigger
                delete options.type
            }
            return options
        },

        reverseOptions(options) {
            if (!!options) {
                options.remove = !!options.remove ? 0 : 1

                options.round = !!options.round || options.round == 0 ? options.round : -1

                options.description = !!options.description ? options.description : ''
            }

            // console.log("options", options)

            return options
        },
    }
}
</script>