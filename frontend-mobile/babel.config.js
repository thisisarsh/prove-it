module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:babel-plugin-inline-dotenv"]
    ]
  };
};
