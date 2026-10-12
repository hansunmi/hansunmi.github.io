const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// 웹 빌드에서 Pretendard WOFF2를 쓰기 위해 추가
config.resolver.assetExts.push('woff2');

module.exports = config;
