const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ['web', 'native', 'ios', 'android'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      type: 'empty',
    };
  }
  if (context.resolveRequest) {
    return context.resolveRequest(context, moduleName, platform);
  }
  return context.defaultResolver(context, moduleName, platform);
};

module.exports = config;

