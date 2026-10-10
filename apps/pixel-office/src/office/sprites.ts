/**
 * 16×24px 문자열 맵을 canvas 로 그려 2프레임(걷기) 스프라이트 시트를 만든다.
 * 레퍼런스의 PAL / BODY / LEGS / LOOKS 를 그대로 옮겼다.
 */

export type SpriteId = 'planner' | 'designer' | 'dev' | 'qa' | 'ceo';

const PAL: Record<string, string> = {
  K: '#2a2420', S: '#f6d2b0', s: '#e0b08c', E: '#2a2420', W: '#fffdf7',
  B: '#5a4434', G: '#2a2420', L: '#d6ecf5', M: '#ec8f8f', w: '#ffffff',
};

const BODY_TOP = ['...KCCWWWWCCK...', '..KCCCCWWCCCCK..', '.KCKCCCCCCCCKCK.', '.KCKCCCCCCCCKCK.', '.KSKccccccccKSK.', '..KKPPPPPPPPKK..'];
const LEGS_A = ['...KPPPKKPPPK...', '...KPPPKKPPPK...', '...KPPK..KPPK...', '...KBBK..KBBK...', '...KKKK..KKKK...'];
const LEGS_B = ['...KPPPKKPPPK...', '...KPPK.KPPPK...', '...KBBK.KPPK....', '...KKKK.KBBK....', '........KKKK....'];

type Look = {
  pal: Record<string, string>;
  head: string[];
  body?: string[];
  legsA?: string[];
  legsB?: string[];
};

const LOOKS: Record<SpriteId, Look> = {
  planner: { pal: { H: '#2e2420', h: '#5e4a3c', C: '#6d93cf', c: '#4f74ad', P: '#2f3a4a', G: '#1d1a18', L: '#cfe6f2', W: '#f4f7fb' }, body: BODY_TOP, head: [
    '....KKKKKKKK....', '...KHHHHHHHHKK..', '..KHHhhHHHHHHHK.', '.KHHHHHHHhhHHHK.', '.KHHHHHHHHHHHHK.', '.KHSSSHHHHHHHSK.', '.KSSKKSSSSKKSSK.',
    '.KSSSSSSSSSSSSK.', '.KSSSESSSSESSSK.', '.KSSSSSsSSSSSSK.', '..KSSSSKKSSSSK..', '..KsSSSSSSSSsK..', '...KKKKKKKKKK...'] },
  designer: { pal: { H: '#9a4f3c', h: '#c97a62', A: '#ffd34d', C: '#e389a8', c: '#c06a88', P: '#4a3a4a', W: '#fff4c2' }, body: BODY_TOP, head: [
    '.....KKKKKK.....', '...KKHHHHHHKK...', '..KHHhHhHHHHHK..', '.KHHHHHHHHHHHHK.', '.KHHHHHHHHHAAHK.', '.KHHSSSSSSSSHHK.', '.KHSSSSSSSSSSHK.',
    '.KHSSESSSSESSHK.', '.KHSSESSSSESSHK.', '.KHSMSSSSSSMSHK.', '.KHHSSSSSSSSHHK.', '.KHHKSSSSSSKHHK.', '.KKK.KKKKKK.KKK.'] },
  dev: { pal: { H: '#1f1c1a', h: '#4a443d', C: '#36363c', c: '#26262b', P: '#2c2c31', W: '#8a8a92', B: '#e8e6e0' }, head: [
    '....KKKKKKKK....', '..KKHHHHHHHHKK..', '.KHHHhHHhHHHHHK.', '.KHHHHHHHHHHHHK.', 'KHHHHHHHHHHHHHHK', 'KHSSSSSSSSSSSSHK', 'KSSSSSSSSSSSSSSK',
    'KSSSESSSSSSESSSK', 'KSSSESSSSSSESSSK', 'KSsSSSSSSSSSSsSK', 'KSSSSSSMMSSSSSSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'],
    body: ['..KCCCCCCCCCCK..', '.KCCCCCWWCCCCCK.', 'KCCKCCCWWCCCKCCK', 'KCCKCCCCCCCCKCCK', 'KSSKccccccccKSSK', '.KKKPPPPPPPPKKK.'],
    legsA: ['..KPPPPKKPPPPK..', '..KPPPPKKPPPPK..', '..KPPPK..KPPPK..', '..KBBBK..KBBBK..', '..KKKKK..KKKKK..'],
    legsB: ['..KPPPPKKPPPPK..', '..KPPPK.KPPPPK..', '..KBBBK.KPPPK...', '..KKKKK.KBBBK...', '........KKKKK...'] },
  qa: { pal: { H: '#6b4a2a', h: '#9a7148', C: '#e3b04f', c: '#c08f32', P: '#4a453c' }, body: BODY_TOP, head: [
    '....KKKKKKKK....', '...KHHHHHHHHK...', '..KHHHHHhHhHHK..', '.KHHHHHHHHHHHHK.', '.KHHHHHHHHHHHHK.', '.KHHHHHHSSSSSHK.', '.KHHSSSSSSSSSHK.',
    '.KHSKKSSSSKKSHK.', '.KHSSESSSSESSHK.', '.KHSSSSSSSSSSHK.', '.KHHSSSMMSSSHHK.', '.KHHKSSSSSSKHHK.', '..KK.KKKKKK.KK..'] },
  ceo: { pal: { H: '#1a1716', h: '#45403b', C: '#2f3a4a', c: '#232c38', A: '#d9534f', P: '#232c38', B: '#1d1f20' },
    body: ['...KCCWWWWCCK...', '..KCCCCWWCCCCK..', '.KCKCCCCCCCCKCK.', '.KCKCCCCCCCCKCK.', '.KSKccccccccKSK.', '..KKPPPPPPPPKK..'], head: [
    '....KKKKKKKK....', '..KKHHHHHHHHKK..', '.KHHHhhHHHHHHHK.', '.KHHHHHHHHHHHHK.', '.KHHHHHHHHHHHHK.', '.KHHSSSSSSSSHHK.', '.KHSSSSSSSSSSHK.',
    '.KHSSESSSSESSHK.', '.KHSSESSSSESSHK.', '.KHSMSSSSSSMSHK.', '.KHHSSSAASSSHHK.', '.KHHKSSSSSSKHHK.', '.KKKKKKKKKKKKKK.'],
    legsA: ['..KPPPPPPPPPPK..', '...KKSSKKSSKK...', '....KSSK.KSSK...', '....KBBK.KBBK...', '....KKKK.KKKK...'],
    legsB: ['..KPPPPPPPPPPK..', '...KKSSKKSSKK...', '....KSSKKSSK....', '....KBBKKBBK....', '....KKKKKKKK....'] },
};

function draw(look: Look): string {
  const cv = document.createElement('canvas');
  cv.width = 32;
  cv.height = 24;
  const ctx = cv.getContext('2d');
  if (!ctx) return '';
  const pal = { ...PAL, ...look.pal };
  const body = look.body ?? BODY_TOP;

  [look.legsA ?? LEGS_A, look.legsB ?? LEGS_B].forEach((legs, frame) => {
    look.head.concat(body, legs).forEach((row, y) => {
      (row + '................').slice(0, 16).split('').forEach((ch, x) => {
        const color = pal[ch];
        if (ch === '.' || !color) return;
        ctx.fillStyle = color;
        ctx.fillRect(frame * 16 + x, y, 1, 1);
      });
    });
  });
  return cv.toDataURL();
}

let memo: Record<SpriteId, string> | null = null;

/** 스프라이트 시트 data URL. 브라우저에서 한 번만 생성해 재사용한다. */
export function sprites(): Record<SpriteId, string> {
  if (memo) return memo;
  const out = {} as Record<SpriteId, string>;
  try {
    (Object.keys(LOOKS) as SpriteId[]).forEach((id) => { out[id] = draw(LOOKS[id]); });
  } catch {
    /* canvas 를 쓸 수 없는 환경에서는 빈 문자열 */
  }
  memo = out;
  return out;
}
