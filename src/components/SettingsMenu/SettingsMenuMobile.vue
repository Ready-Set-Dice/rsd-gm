<template>
    <div class="fill-height width-100">
        <div class="d-flex flex-column fill-height">
            <div class="flex-row fill-height d-flex">
                <v-list
                    dense
                    class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :style="`width:${campaigns.width}px;`"
                    :class="!mobileView.settingTypeSelected ? 'd-flex' : 'd-none'"
                    v-show="!mobileView.settingTypeSelected"
                >
                    <v-list-item
                        link 
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="!!settingsState && !!settingsState.account ? 'accent-selected' : ''"
                        @click="campaigns.select(true, null)"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>Account</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item 
                        v-for="(campaign, index) in campaignArray"
                        :key="'settings-'+index"
                        link
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="!!settingsState && !settingsState.account && !!settingsState.campaign && settingsState.campaign == campaign._key ? 'accent-selected' : ''"
                        @click="campaigns.select(false, campaign._key)"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>{{campaign.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list
                    dense
                    class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :style="`width:${pages.width}px;`"
                    :class="!!mobileView.settingTypeSelected ? 'd-flex' : 'd-none'"
                    v-show="!!mobileView.settingTypeSelected"
                >
                    <v-list-item
                        v-for="(page, index) in settingPages" :key="'page-'+index"
                        link 
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="page.toLowerCase() == settingsState.page ? 'accent-selected' : ''"
                        @click="!!page ? pages.select(page.toLowerCase()) : null"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{page}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
    },
    components: {
    },
    data() {
        return {
            campaigns: {
                width: 150,
                select: (account, campaign) => {
                    this.$store.dispatch('rsd/setSettingsPage', {account: !!account, campaign: !!campaign ? campaign : null})
                    this.$store.dispatch('rsd/setMobileView', {
                        ...this.mobileView,
                        settingDetailsSelected: false,
                        settingTypeSelected: true,
                    })
                },
            },
            pages: {
                width: 150,
                select: (page) => {
                    this.$store.dispatch('rsd/setSettingsPage', {page: !!page ? page : ''})
                    this.$store.dispatch('rsd/setMobileView', {
                        ...this.mobileView,
                        settingDetailsSelected: true,
                        settingTypeSelected: true,
                    })
                },
            },
            settingPages: ['General', 'Combat','Custom'],
            
        }
    },
    computed: {
        settingsState: {
            get() {
                return this.rsd.gamestate.view.settings
            }
        },
    },
}
</script>

<style lang="less" scoped>
.right-border {
    border-right-color: rgba(0, 0, 0, 0.12) !important;
    border-right-style: solid;
    border-right-width: 1px;
}

.no-flex {
    flex: none;
}

.icon-offset {
    top: -2px;
}

.content-list {
    height: calc(~"100vh - 82px");
    overflow-y: auto;
}

.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}

.quick-fade-enter-active {
    transition: all 0.1s ease;
}
.quick-fade-leave-active {
    transition: all 0.1s ease;
}
.quick-fade-enter, .quick-fade-leave-to {
    opacity: 0;
}

.list-header {
    position: sticky;
    z-index: 1;
    top: 0;
}
</style>