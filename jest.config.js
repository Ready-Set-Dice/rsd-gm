module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
    testEnvironment: "jsdom",
    transform: {
        ".*\\.(vue)$": "@vue/vue2-jest",
        "^.+\\.js$": "babel-jest"
    }
};
