<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
    >
        <template v-slot:prepend-slot>
            <span class="mr-2">Preview:</span>
            <v-btn
                icon 
                class="white--text icon-offset"
                elevation="5"
                small
                :style="GameIcons.get.color(current.color)"
            >
                <span 
                    class="gi-icon white"
                    :style="GameIcons.get.style(current.icon)"    
                ></span>
            </v-btn>
        </template>
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
                name: 'encounter-style-dialog',
                labels: {
                    new: {
                        title: 'Edit encounter style'
                    },
                    edit: {
                        title: 'Edit encounter style'
                    }  
                },
                inputs: {
                    icon: {
                        label: "Icon",
                        type: "gicons",
                        items: [],
                    },
                    color: {
                        label: "Color",
                        type: 'color',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.tmpl.inputs.icon.items = this.GameIcons.items

                if (!options.color) {
                    options.color = this.Random.color()
                }
                if (!options.icon) {
                    options.icon = this.GameIcons.get.random()
                }

                this.$set(this.current, 'color', options.color)
                this.$set(this.current, 'icon', options.icon)

                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
                delete options.color
            }

            if (!!options && !!options.color && !!options.icon && (!!options._key || options._key == 0)) {
                this.$rsd.encounters.updateEncounter(options._key, {color: options.color, icon: options.icon})
            }
        },
        onChange(options) {
            this.$set(this.current, 'color', options.color)
            this.$set(this.current, 'icon', options.icon)
        }
    }
}
</script>