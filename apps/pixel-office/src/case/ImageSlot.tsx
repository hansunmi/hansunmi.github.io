import { useState } from 'react';
import { css } from '../lib/css';

/**
 * 레퍼런스의 `<image-slot>` 자리. `public/screens/<file>` 이 있으면 그 이미지를,
 * 없으면 안내 문구가 담긴 플레이스홀더를 보여준다.
 */
export function ImageSlot({ file, placeholder }: { file: string; placeholder: string }) {
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}screens/${file}`;

  if (failed) {
    return (
      <div style={css`width:100%;height:100%;background:#fffdf7 repeating-linear-gradient(135deg,transparent 0 8px,#efe8da 8px 10px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px`}>
        <div style={css`width:26px;height:26px;background:oklch(0.72 0.13 75);box-shadow:inset -5px -5px 0 oklch(0.55 0.13 75)`} />
        <div style={css`font-family:Galmuri9,monospace;font-size:11px;color:#6b655a`}>{placeholder}</div>
        <div style={css`font-family:Galmuri9,monospace;font-size:9px;color:#a9a397`}>public/screens/{file}</div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={placeholder}
      onError={() => setFailed(true)}
      style={css`width:100%;height:100%;object-fit:cover;display:block`}
    />
  );
}
