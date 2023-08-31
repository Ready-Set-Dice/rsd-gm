<template>
    <v-container>
        <span :style="'background-color: red;'" @contextmenu="testContextMenu">test</span>
    </v-container>
</template>

<script>

export default {
    data() {
    },
    methods: {
        testContextMenu(event) {
            console.log('Context menu', event)
        },
    }
}
</script>