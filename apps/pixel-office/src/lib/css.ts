import type { CSSProperties } from 'react';

/**
 * 디자인 레퍼런스(`Pixel Office v2.dc.html`)의 인라인 스타일을 선언 단위로 그대로 옮기기 위한 헬퍼.
 * css`...` 로 감싼 CSS 텍스트를 React 의 style 객체로 바꿔준다.
 */

/** `;` 로 선언을 자르되, 괄호 안(`url(data:...;base64,...)`, `conic-gradient(...)`)은 건너뛴다. */
function splitDeclarations(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) {
      out.push(text.slice(start, i));
      start = i + 1;
    }
  }
  out.push(text.slice(start));
  return out;
}

function camel(prop: string): string {
  if (prop.startsWith('--')) return prop;
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export type Declaration = { prop: string; value: string };

export function parseDeclarations(text: string): Declaration[] {
  const out: Declaration[] = [];
  for (const decl of splitDeclarations(text)) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (prop && value) out.push({ prop, value });
  }
  return out;
}

const cache = new Map<string, CSSProperties>();

export function css(strings: TemplateStringsArray, ...values: unknown[]): CSSProperties {
  let text = strings[0];
  for (let i = 0; i < values.length; i++) text += String(values[i]) + strings[i + 1];

  const hit = cache.get(text);
  if (hit) return hit;

  const style: Record<string, string> = {};
  for (const { prop, value } of parseDeclarations(text)) style[camel(prop)] = value;

  const frozen = style as CSSProperties;
  cache.set(text, frozen);
  return frozen;
}
