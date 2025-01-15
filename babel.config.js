module.exports = {
    presets: ['babel-preset-expo',],
    plugins: [
      ['dotenv-import', {
        moduleName: '@env',
        path: '.env',
      }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
    ]
  };
  