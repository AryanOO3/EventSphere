module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /source-map-loader/
      ];
      return webpackConfig;
    }
  }
};