module.exports = {
    module: {
        rules: [
            {
                test: /\.csv$/i,
                use: [
                    {
                        loader: 'raw-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
};
