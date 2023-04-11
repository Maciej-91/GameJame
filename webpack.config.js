const path = require('path');

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
        externals: { 'mongodb': 'commonjs mongodb', 'express': 'commonjs express' }
    },
    {
        entry: './src/client/script/index.js',
        target: 'web',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: { extensions: ['.js'] },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, './public/static/script'),   
        }
    }
];