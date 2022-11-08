/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}

module.exports = {
    nextConfig,
    images: { loader: "custom" },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.ignoreWarnings = [
            {
                message: /(magic-sdk|@walletconnect\/web3-provider|@web3auth\/web3auth)/,
            },
        ]
        return config
    },
}
