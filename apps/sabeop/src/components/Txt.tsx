import { Text, type TextProps } from 'react-native';
import { color, font, type as typeScale, type TypeKey } from '../theme/tokens';

type Props = TextProps & {
  /** 타입 스케일 */
  v?: TypeKey;
  /** 굵기만 바꿀 때 */
  w?: keyof typeof font;
  /** 글자색 */
  c?: string;
};

export function Txt({ v = 'body', w, c = color.text.primary, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[typeScale[v], w ? { fontFamily: font[w] } : null, { color: c }, style]}
    />
  );
}
