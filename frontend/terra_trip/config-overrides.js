const path = require('path');

module.exports = function override(config, env) {
    config.devServer = {
        ...config.devServer,
        allowedHosts: 'all',
    };
    config.resolve.fallback = {
        "path": require.resolve("path-browserify"), 
        "http": require.resolve("stream-http"),
        "url": require.resolve("url/"),
        "zlib": require.resolve("browserify-zlib"), 
        "querystring": require.resolve("querystring-es3"), 
        "crypto": require.resolve("crypto-browserify"), 
        "stream": require.resolve("stream-browserify"), 
        "assert": require.resolve("assert/"), 
        "vm": require.resolve("vm-browserify"), 
        "fs": false, 
        "net": false, 
        "async_hooks": false,
        "process": require.resolve("process/browser")
    };
    
    config.plugins.push(
        new (require('webpack')).DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env),
            },
            process: 'require("process/browser")',
        })
    );

    return config; 
};
