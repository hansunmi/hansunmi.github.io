import { css } from '../../lib/css';
import { variant } from '../../lib/variant';
import type { OfficeView } from '../view';

const enterActive = variant({ active: 'transform:translate(3px,3px);box-shadow:2px 2px 0 #f4f1ea' });

type Props = {
  agents: OfficeView['introAgents'];
  onEnter: () => void;
};

export function IntroScreen({ agents, onEnter }: Props) {
  return (
    <div style={css`position:absolute;inset:0;z-index:300;background-color:#24211c;background-image:linear-gradient(#2e2a24 2px,transparent 2px),linear-gradient(90deg,#2e2a24 2px,transparent 2px);background-size:40px 40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px;color:#f4f1ea`}>
      <div style={css`display:flex;flex-direction:column;align-items:center;gap:14px;animation:fadeUp .5s steps(5) both`}>
        <div style={css`display:flex;align-items:center;gap:10px`}>
          <div style={css`width:26px;height:26px;background:oklch(0.72 0.13 75);box-shadow:inset -5px -5px 0 oklch(0.55 0.13 75)`} />
          <div style={css`font-family:Galmuri9,monospace;font-size:12px;color:#a9a397;letter-spacing:2px`}>PIXELHANS AI OFFICE</div>
        </div>
        <div style={css`font-family:Galmuri11,monospace;font-size:44px;font-weight:700;letter-spacing:1px`}>픽셀한스 AI 오피스</div>
        <div style={css`font-size:17px;color:#d5cbb4;text-align:center;line-height:1.6`}>
          아이디어를 맡기면, 4명의 AI 팀원이<br />기획부터 디자인 · 개발 · QA까지 진행합니다.
        </div>
      </div>

      <div style={css`display:grid;grid-template-columns:repeat(4,220px);gap:16px`}>
        {agents.map((ia) => (
          <div key={ia.en} style={css`background:#fffdf7;color:#24211c;border:3px solid #f4f1ea;box-shadow:5px 5px 0 ${ia.color};display:flex;flex-direction:column;animation:fadeUp .5s steps(5) ${ia.delay}s both`}>
            <div style={css`height:110px;background-color:#efe8da;background-image:linear-gradient(${ia.color} 0 0);background-size:100% 30px;background-position:bottom;background-repeat:no-repeat;border-bottom:3px solid #24211c;position:relative;overflow:hidden`}>
              <div style={css`position:absolute;left:78px;top:7px;width:64px;height:96px;background-image:url(${ia.sprite});background-size:128px 96px;background-repeat:no-repeat;image-rendering:pixelated;animation:bob 1.2s steps(2) infinite`} />
            </div>
            <div style={css`padding:14px;display:flex;flex-direction:column;gap:6px`}>
              <div style={css`display:flex;align-items:baseline;gap:6px`}>
                <div style={css`font-family:Galmuri11,monospace;font-size:16px;font-weight:700`}>{ia.name}</div>
                {ia.rank && (
                  <div style={css`font-family:Galmuri9,monospace;font-size:9px;padding:1px 5px;background:#24211c;color:#f4f1ea;align-self:center`}>{ia.rank}</div>
                )}
                <div style={css`font-family:Galmuri9,monospace;font-size:9px;color:#6b655a`}>{ia.en}</div>
              </div>
              <div style={css`font-size:12px;line-height:1.5;color:#4a453c;text-wrap:pretty`}>{ia.role}</div>
              <div style={css`font-family:Galmuri9,monospace;font-size:9px;padding:3px 6px;border:1px solid #24211c;align-self:flex-start;margin-top:2px`}>{ia.trait}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={css`display:flex;align-items:center;gap:10px;font-family:Galmuri9,monospace;font-size:11px;color:#a9a397;animation:fadeUp .5s steps(5) .6s both`}>
        <div style={css`padding:5px 10px;border:2px solid #4a453c`}>01 지시서 전달</div><div>▸</div>
        <div style={css`padding:5px 10px;border:2px solid #4a453c`}>02 회의 · 결재</div><div>▸</div>
        <div style={css`padding:5px 10px;border:2px solid #4a453c`}>03 디자인 · 개발 · QA</div><div>▸</div>
        <div style={css`padding:5px 10px;border:2px solid #4a453c`}>04 산출물 수령</div>
      </div>

      <button
        type="button"
        onClick={onEnter}
        className={enterActive}
        style={css`font-family:Galmuri11,monospace;font-size:18px;font-weight:700;padding:14px 36px;border:3px solid #f4f1ea;background:oklch(0.72 0.13 75);color:#24211c;cursor:pointer;box-shadow:5px 5px 0 #f4f1ea;animation:fadeUp .5s steps(5) .75s both`}
      >
        출근하기 ▶
      </button>
    </div>
  );
}
