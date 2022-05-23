const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 8081,
        proxy: {
            '/': {
                ws: false,
                target: 'http://localhost:8080',
                logLevel: 'debug',
                changeOrigin: true,
                pathReWrite: {
                    '^/': '/'
                }
            }
        }
    }
})
