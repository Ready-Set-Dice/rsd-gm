<template>
    <v-app>
        <v-app-bar app color="main" elevation="0" dense class="pr-1">
            <v-toolbar-title class="">
                <span class="text-h6 font-weight-bold accent--text">{{
                    currentRouteName()
                }}</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn small icon class="mr-1" color="accent" @click="refreshData()">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>

            <v-menu v-model="infoMenu" :nudge-width="200" offset-x>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small icon class="mr-1" color="accent" v-bind="attrs" v-on="on">
                        <v-icon>mdi-information-outline</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-list dense>
                        <v-list-item link @click="license()">
                            <v-list-item-icon><v-icon>mdi-license</v-icon></v-list-item-icon>
                            <v-list-item-title>View our licenses </v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="discord()">
                            <v-list-item-icon><v-icon>mdi-discord</v-icon></v-list-item-icon>
                            <v-list-item-title>Join us on Discord!</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="patreon()">
                            <v-list-item-icon><v-icon>mdi-patreon</v-icon></v-list-item-icon>
                            <v-list-item-title>Support us on Patreon!</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>

            <v-menu v-model="accountMenu" :close-on-content-click="false" :nudge-width="200" offset-x>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small icon class="ml-1" color="accent" v-bind="attrs" v-on="on">
                        <v-icon>mdi-account</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-list dense v-show="loggedIn">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>User id</v-list-item-title>
                                <v-list-item-subtitle>{{
                                    $rsd.campaigns.uid
                                }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-divider v-show="loggedIn"></v-divider>

                    <v-list dense>
                        <v-list-item link @click="toggleDarkMode()">
                            <v-list-item-action>
                                <v-switch :value="rsd.darkmode" :input-value="rsd.darkmode"></v-switch>
                            </v-list-item-action>
                            <v-list-item-title>Toggle darkmode</v-list-item-title>
                        </v-list-item>
                    </v-list>

                    <v-divider v-show="loggedIn"></v-divider>
                    <v-list dense v-show="loggedIn">
                        <v-list-item link @click="openMobile()" v-if="mobileRoute()">
                            <v-list-item-icon><v-icon>mdi-cellphone</v-icon></v-list-item-icon>
                            <v-list-item-title>Open mobile version of RSD</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="openV2()" v-else>
                            <v-list-item-icon><v-icon>mdi-desktop-mac</v-icon></v-list-item-icon>
                            <v-list-item-title>Open desktop version of RSD</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="openSettings()">
                            <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
                            <v-list-item-title>Settings</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="openHelp()" v-if="mobileRoute()">
                            <v-list-item-icon><v-icon>mdi-help-circle</v-icon></v-list-item-icon>
                            <v-list-item-title>Need help?</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="logout()">
                            <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
                            <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-app-bar>

        <v-main>
            <router-view></router-view>
        </v-main>

        <DialogManager />
    </v-app>
</template>

<script>
import auth from "@root/.shared/services/AuthService";

import router from "./router";

import DialogManager from '@/components/DialogManager'

export default {
    components: {
        DialogManager,
    },
    mounted() {
        console.log("mounted");

        this.$vuetify.theme.dark = this.rsd.darkmode;
        document.title = "Ready Set Dice - GM Tools";

        this.$store.dispatch("clearOldState");

        auth.profile().then((profile) => {
            this.developer = profile.dev;
        });

        setTimeout(() => {
            if (!!this.isTouchDevice && !!this.mobileRoute()) {
                this.$rsd.dialog.open({name: 'confirmDialog', attrs:[
                    'Switch to mobile', 
                    `We detected touch compatibility. Switch to the mobile site?`,
                    () => {this.openMobile()}
                ]})
            }
        }, 1000);

        this.combatantTimer = setInterval(() => {
            this.refreshCombatantKey++;

            let nullCheck = true;
            if (!!this.combatantsArray) {
                this.combatantsArray.forEach((c) => {
                    if (!c.basestats) {
                        nullCheck = false;
                    }
                });
            }

            if (this.refreshCombatantKey == this.maxCombatantTimer || !!nullCheck) {
                clearInterval(this.combatantTimer);
            }
        }, 500);
    },
    unmounted() {
        console.alert('unmounted')
        this.$store.dispatch("rsd/toggleDarkMode");
        
    },
    data() {
        return {
            routes: router.options.routes,
            accountMenu: false,
            infoMenu: false,
            developer: false,
            combatantTimer: null,
            maxCombatantTimer: 20,
        };
    },
    computed: {
        loggedIn() {
            return !!this.rsd && !!this.rsd.user;
        },
    },
    methods: {
        toggleDarkMode() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            // this.$vuetify.theme.dark = !$vuetify.theme.dark
            this.$store.dispatch("rsd/toggleDarkMode");
        },
        license() {
            window.location.href = "https://readysetdice.com/license/";
        },
        discord() {
            window.location.href = "https://discord.gg/9gdTrgeY3X";
        },
        patreon() {
            window.location.href = "https://www.patreon.com/readysetdice";
        },
        // openV1() {
        //   this.$router.replace('campaign-manager')
        //   this.accountMenu = false
        // },
        openV2() {
            this.$router.replace("home");
            this.accountMenu = false;
        },
        openMobile() {
            this.$router.replace("mobile");
            this.accountMenu = false;
        },
        openSettings() {
            this.$store.dispatch("rsd/setGamePage", "Settings");
            this.$store.dispatch("rsd/setMobileView", {
                ...this.mobileView,
                sortMode: false,
                navigation: "Settings",
                settingDetailsSelected: false,
                settingTypeSelected: false,
            });
            this.accountMenu = false;
        },
        openHelp() {
            this.$store.dispatch("rsd/setGamePage", "Help");
            this.$store.dispatch("rsd/setMobileView", {
                ...this.mobileView,
                sortMode: false,
                navigation: "Help",
                settingDetailsSelected: false,
                settingTypeSelected: false,
            });
            this.accountMenu = false;
        },
        logout() {
            this.accountMenu = false;
            this.$router.replace("logout");
        },
        refreshData() {
            this.$store.dispatch("rsd/toggleRefresh");
        },
        toggleDrawer() {
            if (!!this.$refs && !!this.$refs.navBar) {
                this.$refs.navBar.toggleDrawer();
            }
        },
        currentRouteName() {
            return !!this.$route.meta.customTitle
                ? this.$route.meta.customTitle
                : this.$route.name;
        },
        mobileRoute() {
            return !!this.$route && this.$route.path != "/mobile";
        },
    },
};
</script>