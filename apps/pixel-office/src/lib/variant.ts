import { parseDeclarations } from './css';

/**
 * 레퍼런스의 `style-hover` / `style-focus` / `style-active` 를 재현한다.
 * 기본 스타일이 인라인이라 클래스 규칙만으로는 우선순위가 밀리므로 `!important` 를 붙인다.
 */

type Variants = {
  hover?: string;
  focus?: string;
  active?: string;
};

let sheet: CSSStyleSheet | null = null;
let seq = 0;
const cache = new Map<string, string>();

function getSheet(): CSSStyleSheet | null {
  if (sheet) return sheet;
  if (typeof document === 'undefined') return null;
  const el = document.createElement('style');
  el.setAttribute('data-pixel-office-variants', '');
  document.head.appendChild(el);
  sheet = el.sheet as CSSStyleSheet;
  return sheet;
}

function important(text: string): string {
  return parseDeclarations(text)
    .map(({ prop, value }) => `${prop}:${value} !important`)
    .join(';');
}

export function variant(v: Variants): string {
  const key = JSON.stringify(v);
  const hit = cache.get(key);
  if (hit) return hit;

  const name = `v${++seq}`;
  cache.set(key, name);

  const target = getSheet();
  if (target) {
    for (const pseudo of ['hover', 'focus', 'active'] as const) {
      const body = v[pseudo];
      if (!body) continue;
      try {
        target.insertRule(`.${name}:${pseudo}{${important(body)}}`, target.cssRules.length);
      } catch {
        /* 지원하지 않는 선언은 무시한다 */
      }
    }
  }
  return name;
}
