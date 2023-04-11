const path = require('path');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

module.exports = [
    {
        entry: './src/server/index.ts',
        target: 'node',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: { extensions: ['.ts', '.js'] },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, './'),
        },
        externals: { 'mongodb': 'commonjs mongodb', 'express': 'commonjs express' },
        plugins: [ new LicenseWebpackPlugin({outputFilename: 'licenses.txt'}) ]
    },
    {
        entry: './src/client/script/index.ts',
        target: 'web',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: { extensions: ['.ts', '.js'] },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, './public/static/script'),   
        },
        plugins: [ new LicenseWebpackPlugin({outputFilename: 'licenses.txt'}) ]
    }
];