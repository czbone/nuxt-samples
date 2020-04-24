module.exports = {
  extends: [
    'standard',
    'plugin:vue/essential',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'standard/no-callback-literal': 'off',
    'no-var': 'error'
  },
  globals: {
    'appRoot': false,
    'log': false,
    'empty': false,
    'striptags': false
  }
}