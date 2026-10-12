import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { color as palette } from '../theme/tokens';

export type IconName =
  | 'bell'
  | 'compass'
  | 'hourglass'
  | 'megaphone'
  | 'arrowUp'
  | 'arrowLeft'
  | 'chevronRight'
  | 'check'
  | 'search'
  | 'close'
  | 'help'
  | 'home'
  | 'diagnose'
  | 'folder'
  | 'edit'
  | 'user';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** 탭바 활성 상태: 면을 채운다 */
  filled?: boolean;
};

export function Icon({ name, size = 24, color = palette.text.primary, strokeWidth = 1.6, filled = false }: Props) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const solid = { ...s, fill: filled ? color : 'none' };
  const inner = { ...s, stroke: filled ? palette.bg.surface : color };

  const body = (() => {
    switch (name) {
      case 'bell':
        return (
          <>
            <Path {...s} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <Path {...s} d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </>
        );
      case 'compass':
        return (
          <>
            <Circle {...s} cx={12} cy={12} r={10} />
            <Polygon {...s} points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </>
        );
      case 'hourglass':
        return (
          <>
            <Path {...s} d="M5 22h14M5 2h14" />
            <Path {...s} d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
            <Path {...s} d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
          </>
        );
      case 'megaphone':
        return (
          <>
            <Path {...s} d="m3 11 18-5v12L3 14v-3z" />
            <Path {...s} d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </>
        );
      case 'arrowUp':
        return <Path {...s} d="m5 12 7-7 7 7M12 19V5" />;
      case 'arrowLeft':
        return <Path {...s} d="m12 19-7-7 7-7M19 12H5" />;
      case 'chevronRight':
        return <Path {...s} d="m9 18 6-6-6-6" />;
      case 'check':
        return <Path {...s} d="M20 6 9 17l-5-5" />;
      case 'search':
        return (
          <>
            <Circle {...s} cx={11} cy={11} r={7} />
            <Path {...s} d="m20 20-4-4" />
          </>
        );
      case 'close':
        return <Path {...s} d="M18 6 6 18M6 6l12 12" />;
      case 'help':
        return (
          <>
            <Circle {...s} cx={12} cy={12} r={10} />
            <Path {...s} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
          </>
        );
      case 'home':
        return <Path {...solid} d="M3 10.2 12 3l9 7.2V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20z" />;
      case 'diagnose':
        return (
          <>
            <Path {...solid} d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <Rect {...s} x={8} y={2} width={8} height={4} rx={1} fill={filled ? color : palette.bg.surface} />
            <Circle {...inner} cx={11.5} cy={14.5} r={2.5} />
            <Path {...inner} d="M13.3 16.3 15.5 18.5" />
          </>
        );
      case 'folder':
        return (
          <>
            <Path {...solid} d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
            <Path {...inner} d="M2 9.5h20" />
          </>
        );
      case 'edit':
        return (
          <>
            <Rect {...solid} x={3} y={3} width={18} height={18} rx={2} />
            <Path
              {...inner}
              fill={filled ? color : palette.bg.surface}
              d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
            />
          </>
        );
      case 'user':
        return (
          <>
            <Circle {...solid} cx={12} cy={8} r={4.5} />
            <Path {...solid} d="M20 21a8 8 0 0 0-16 0" />
          </>
        );
    }
  })();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body}
    </Svg>
  );
}
