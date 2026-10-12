declare module '*.otf';
declare module '*.woff2';

// React Native Web: dataSet → DOM data-* 속성 (웹 폰 프레임 CSS 대상)
import 'react-native';
declare module 'react-native' {
  interface ViewProps {
    dataSet?: Record<string, string>;
  }
}
