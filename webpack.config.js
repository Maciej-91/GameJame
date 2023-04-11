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
        }
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
        }
    }
];