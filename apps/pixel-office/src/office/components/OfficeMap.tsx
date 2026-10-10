import { css } from '../../lib/css';
import { variant } from '../../lib/variant';
import type { OfficeView } from '../view';
import { CharacterPopup } from './CharacterPopup';

const darkHover = variant({ hover: 'background:#3a362f' });
const cabinetHover = variant({ hover: 'background:#c9bea6' });

export function OfficeMap({ vm }: { vm: OfficeView }) {
  return (
    <div style={css`flex:1;display:flex;align-items:center;justify-content:center;background:#d9d1c0;position:relative`}>
      <div
        onClick={vm.bgClick}
        style={css`position:relative;width:1360px;height:560px;background-color:#e8e0cf;background-image:linear-gradient(#ddd4c1 2px,transparent 2px),linear-gradient(90deg,#ddd4c1 2px,transparent 2px);background-size:40px 40px;border:4px solid #24211c;box-shadow:6px 6px 0 #b5ab96`}
      >
        {vm.isArchive && (
          <div style={css`position:absolute;left:50%;top:-18px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:6px 8px 6px 12px;background:#24211c;color:#f4f1ea;border:3px solid #24211c;z-index:70`}>
            <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:oklch(0.8 0.12 150)`}>ARCHIVE</div>
            <div style={css`font-size:12px`}>보관된 프로젝트 열람 중 · 읽기 전용</div>
            <button type="button" onClick={vm.viewCurrent} className={darkHover} style={css`font-family:Galmuri9,monospace;font-size:10px;padding:4px 8px;border:2px solid #f4f1ea;background:transparent;color:#f4f1ea;cursor:pointer`}>현재 프로젝트로 ↩</button>
          </div>
        )}

        {/* rooms */}
        <div style={css`position:absolute;left:30px;top:30px;width:310px;height:250px;border:4px solid #24211c;background:#efe3c8`} />
        <div style={css`position:absolute;left:40px;top:38px;font-family:Galmuri11,monospace;font-size:12px;font-weight:700`}>사장실 · CEO</div>
        <div style={css`position:absolute;left:400px;top:30px;width:280px;height:160px;border:3px solid #24211c;background:#e9e7e0`} />
        <div style={css`position:absolute;left:410px;top:36px;font-family:Galmuri9,monospace;font-size:10px`}>기획자 책상</div>
        <div style={css`position:absolute;left:740px;top:30px;width:280px;height:160px;border:3px solid #24211c;background:#e9e7e0`} />
        <div style={css`position:absolute;left:750px;top:36px;font-family:Galmuri9,monospace;font-size:10px`}>디자이너 책상</div>
        <div style={css`position:absolute;left:510px;top:212px;width:440px;height:170px;border:4px solid #24211c;background:${vm.meetingBg};transition:background .6s`} />
        <div style={css`position:absolute;left:520px;top:219px;display:flex;gap:8px;align-items:center`}>
          <div style={css`font-family:Galmuri11,monospace;font-size:12px;font-weight:700`}>회의실</div>
          {vm.meetingLive && (
            <div style={css`font-family:Galmuri9,monospace;font-size:9px;padding:2px 5px;background:oklch(0.62 0.17 25);color:#fff;animation:blink 1s steps(2) infinite`}>회의 중</div>
          )}
        </div>
        <div style={css`position:absolute;left:400px;top:400px;width:280px;height:140px;border:3px solid #24211c;background:#e9e7e0`} />
        <div style={css`position:absolute;left:410px;top:406px;font-family:Galmuri9,monospace;font-size:10px`}>개발자 책상</div>
        <div style={css`position:absolute;left:740px;top:400px;width:280px;height:140px;border:3px solid #24211c;background:#e9e7e0`} />
        <div style={css`position:absolute;left:750px;top:406px;font-family:Galmuri9,monospace;font-size:10px`}>QA 책상</div>
        <div style={css`position:absolute;left:1060px;top:30px;width:270px;height:510px;border:4px solid #24211c;background:#ece4d2`} />
        <div style={css`position:absolute;left:1070px;top:38px;font-family:Galmuri11,monospace;font-size:12px;font-weight:700`}>탕비실 · 자료실</div>

        {/* CEO furniture */}
        <div style={css`position:absolute;left:70px;top:70px;width:44px;height:30px;background:oklch(0.62 0.1 145);box-shadow:inset -4px -4px 0 oklch(0.48 0.1 145)`} />
        <div style={css`position:absolute;left:84px;top:100px;width:16px;height:14px;background:#8a6a4a`} />
        <div style={css`position:absolute;left:250px;top:62px;width:70px;height:20px;background:#24211c;color:#f4f1ea;font-family:Galmuri9,monospace;font-size:9px;display:flex;align-items:center;justify-content:center`}>CEO ROOM</div>
        <div style={css`position:absolute;left:120px;top:186px;width:150px;height:40px;background:#8a6a4a;border:3px solid #24211c;box-shadow:inset 0 -6px 0 #6e5236;z-index:20`} />
        <div style={css`position:absolute;left:140px;top:178px;width:30px;height:14px;background:#f4f1ea;border:2px solid #24211c;z-index:21`} />
        {vm.ceoStamp && (
          <div style={css`position:absolute;left:214px;top:168px;width:40px;height:22px;border:3px solid oklch(0.55 0.17 25);color:oklch(0.55 0.17 25);font-family:Galmuri11,monospace;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;transform:rotate(-10deg);z-index:22;background:#fffdf7;animation:pop .4s steps(4)`}>결재</div>
        )}

        {/* meeting table */}
        <div style={css`position:absolute;left:640px;top:280px;width:180px;height:50px;background:#8a6a4a;border:3px solid #24211c;box-shadow:inset 0 -6px 0 #6e5236;z-index:15`} />
        <div style={css`position:absolute;left:676px;top:288px;width:40px;height:22px;background:#f4f1ea;border:2px solid #24211c;z-index:16`} />
        <div style={css`position:absolute;left:740px;top:290px;width:22px;height:16px;background:#f4f1ea;border:2px solid #24211c;z-index:16`} />
        <div style={css`position:absolute;left:530px;top:250px;width:60px;height:110px;background:#f4f1ea;border:3px solid #24211c;font-family:Galmuri9,monospace;font-size:9px;padding:6px;line-height:1.5;display:flex;flex-direction:column;gap:4px`}>
          <div>WHITE<br />BOARD</div>
          {vm.meetingLive && (
            <div style={css`display:flex;flex-direction:column;gap:3px`}>
              <div style={css`height:3px;width:38px;background:oklch(0.72 0.12 250)`} />
              <div style={css`height:3px;width:28px;background:oklch(0.72 0.12 350)`} />
              <div style={css`height:3px;width:34px;background:oklch(0.72 0.12 150)`} />
              <div style={css`height:3px;width:22px;background:#24211c`} />
            </div>
          )}
        </div>

        {/* lounge */}
        <div style={css`position:absolute;left:1090px;top:80px;width:46px;height:60px;background:#5a544a;border:3px solid #24211c;box-shadow:inset 0 -14px 0 #3a362f`} />
        <div style={css`position:absolute;left:1100px;top:92px;width:26px;height:10px;background:oklch(0.72 0.13 75);animation:blink 2s steps(2) infinite`} />
        <div style={css`position:absolute;left:1104px;top:66px;width:4px;height:8px;background:#fffdf7;animation:steam 1.6s steps(4) infinite`} />
        <div style={css`position:absolute;left:1114px;top:62px;width:4px;height:8px;background:#fffdf7;animation:steam 1.6s steps(4) .8s infinite`} />
        <div style={css`position:absolute;left:1150px;top:90px;width:24px;height:50px;background:oklch(0.8 0.06 230);border:3px solid #24211c`} />
        <div style={css`position:absolute;left:1090px;top:300px;width:200px;height:44px;background:oklch(0.62 0.1 30);border:3px solid #24211c;box-shadow:inset 0 -10px 0 oklch(0.5 0.1 30)`} />
        <div
          onClick={vm.openCabinet}
          className={cabinetHover}
          style={css`position:absolute;left:1180px;top:390px;width:110px;height:120px;background:#b9ae96;border:3px solid #24211c;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding:8px;animation:${vm.cabinetAnim}`}
        >
          <div style={css`font-family:Galmuri9,monospace;font-size:10px`}>산출물 서류함</div>
          <div style={css`height:22px;border:2px solid #24211c;background:#d5cbb4`} />
          <div style={css`height:22px;border:2px solid #24211c;background:#d5cbb4`} />
          <div style={css`height:22px;border:2px solid #24211c;background:#d5cbb4`} />
        </div>
        {vm.cabinetBadge && (
          <div style={css`position:absolute;left:1270px;top:378px;min-width:24px;height:24px;padding:0 6px;background:oklch(0.62 0.17 25);color:#fff;border:2px solid #24211c;font-family:Galmuri9,monospace;font-size:10px;display:flex;align-items:center;justify-content:center;z-index:30;animation:pop .35s steps(4)`}>{vm.readyCount}</div>
        )}

        {/* desks */}
        {vm.desks.map((d) => (
          <div key={d.id} style={css`position:absolute;left:${d.left}px;top:${d.top}px;width:130px;height:36px;z-index:20`}>
            <div style={css`position:absolute;left:0;top:0;width:130px;height:36px;background:#8a6a4a;border:3px solid #24211c;box-shadow:inset 0 -6px 0 #6e5236`} />
            <div style={css`position:absolute;left:8px;top:-22px;width:34px;height:26px;background:#24211c;padding:3px`}>
              <div style={css`width:100%;height:100%;background-color:${d.screen};background-image:${d.scanImg};background-size:100% 4px;animation:${d.scanAnim};box-shadow:${d.glow};transition:background-color .5s`} />
            </div>
            <div style={css`position:absolute;left:21px;top:4px;width:8px;height:4px;background:#24211c`} />
            <div style={css`position:absolute;left:96px;top:-8px;width:12px;height:12px;background:#f4f1ea;border:2px solid #24211c`} />
            {d.fan && (
              <div style={css`position:absolute;left:112px;top:-26px;width:22px;height:30px`}>
                <div style={css`position:absolute;left:0;top:0;width:22px;height:22px;border:2px solid #24211c;background:#fffdf7;border-radius:50%;overflow:hidden`}>
                  <div style={css`position:absolute;inset:1px;border-radius:50%;background:conic-gradient(oklch(0.78 0.08 200) 0 60deg,transparent 60deg 120deg,oklch(0.78 0.08 200) 120deg 180deg,transparent 180deg 240deg,oklch(0.78 0.08 200) 240deg 300deg,transparent 300deg);animation:spin .35s steps(6) infinite`} />
                  <div style={css`position:absolute;left:7px;top:7px;width:4px;height:4px;background:#24211c`} />
                </div>
                <div style={css`position:absolute;left:9px;top:21px;width:4px;height:5px;background:#24211c`} />
                <div style={css`position:absolute;left:4px;top:25px;width:14px;height:4px;background:#24211c`} />
              </div>
            )}
            {d.steam && (
              <div style={css`position:absolute;left:100px;top:-18px;width:3px;height:6px;background:#a9a397;animation:steam 1.4s steps(4) infinite`} />
            )}
            {d.done && (
              <div style={css`position:absolute;left:100px;top:-34px;width:26px;height:26px;background:oklch(0.68 0.14 150);border:2px solid #24211c;color:#fff;font-family:Galmuri11,monospace;font-size:14px;display:flex;align-items:center;justify-content:center;animation:pop .45s steps(5) ${d.delay}s both`}>✓</div>
            )}
          </div>
        ))}

        {/* CEO character */}
        <div style={css`position:absolute;left:179px;top:136px;width:32px;height:48px;z-index:10;animation:breathe 2.4s steps(2) infinite`}>
          <div style={css`position:absolute;inset:0;background-image:url(${vm.ceoSprite});background-size:64px 48px;background-repeat:no-repeat;image-rendering:pixelated`} />
          <div style={css`position:absolute;left:-6px;top:-18px;width:44px;font-family:Galmuri9,monospace;font-size:9px;text-align:center;background:#24211c;color:#f4f1ea;padding:2px 0`}>YOU</div>
        </div>

        {/* agents */}
        {vm.agents.map((a) => (
          <div
            key={a.id}
            onClick={a.onClick}
            style={css`position:absolute;left:${a.left}px;top:${a.top}px;width:32px;height:48px;z-index:${a.z};cursor:pointer;transition:left 1.6s steps(16),top 1.6s steps(16)`}
          >
            {a.hasBubble && (
              <div style={css`position:absolute;bottom:58px;left:14px;transform:translateX(-50%);width:max-content;max-width:190px;background:#fffdf7;border:2px solid #24211c;box-shadow:3px 3px 0 #24211c;padding:6px 8px;font-family:Galmuri11,monospace;font-size:11px;line-height:1.45;text-wrap:pretty;z-index:40`}>
                {a.bubble}
                <span style={css`display:${a.caret};width:6px;height:11px;margin-left:2px;vertical-align:-1px;background:#24211c;animation:caret .6s steps(2) infinite`} />
              </div>
            )}
            {a.walking && (
              <div style={css`position:absolute;bottom:52px;left:14px;transform:translateX(-50%);font-family:Galmuri9,monospace;font-size:10px;padding:2px 5px;background:#24211c;color:#f4f1ea`}>···</div>
            )}
            <div style={css`position:absolute;left:4px;top:44px;width:24px;height:4px;background:rgba(36,33,28,.2)`} />
            <div style={css`position:absolute;left:0;top:0;width:32px;height:48px;animation:${a.bodyAnim}`}>
              <div style={css`position:absolute;inset:0;background-image:url(${a.sprite});background-size:64px 48px;background-repeat:no-repeat;image-rendering:pixelated;animation:${a.sheetAnim}`} />
              {a.carry && (
                <div style={css`position:absolute;left:-4px;top:28px;width:12px;height:14px;background:#fffdf7;border:2px solid #24211c;box-shadow:inset 0 3px 0 #d5cbb4`} />
              )}
            </div>
            <div style={css`position:absolute;left:-14px;top:50px;width:60px;text-align:center;font-family:Galmuri9,monospace;font-size:9px;color:#24211c;background:${a.tagBg};border:1px solid #24211c;padding:1px 0`}>{a.name}</div>
          </div>
        ))}

        {/* celebration */}
        {vm.celebrate && (
          <div style={css`position:absolute;inset:0;pointer-events:none;z-index:80`}>
            {vm.sparkles.map((s, i) => (
              <div key={i} style={css`position:absolute;left:${s.x}px;top:${s.y}px;width:${s.size}px;height:${s.size}px;background:${s.color};animation:rise 1.8s steps(9) ${s.delay}s infinite`} />
            ))}
            <div style={css`position:absolute;left:50%;top:180px;transform:translateX(-50%);background:#24211c;color:#f4f1ea;border:4px solid #24211c;box-shadow:6px 6px 0 oklch(0.72 0.13 75);padding:14px 22px;display:flex;flex-direction:column;align-items:center;gap:6px;animation:popIn .6s steps(6) both`}>
              <div style={css`font-family:Galmuri11,monospace;font-size:11px;color:oklch(0.8 0.12 75);letter-spacing:2px`}>PROJECT COMPLETE</div>
              <div style={css`font-family:Galmuri11,monospace;font-size:20px;font-weight:700`}>최종 개발 팩 완성!</div>
              <div style={css`font-size:12px;color:#d5cbb4`}>산출물 서류함에 5개의 파일이 도착했어요</div>
            </div>
          </div>
        )}

        {vm.popup && <CharacterPopup popup={vm.popup} onClose={vm.closePopup} />}

        {/* phase caption */}
        <div style={css`position:absolute;left:30px;top:300px;width:310px;border:3px solid #24211c;background:#fffdf7;padding:10px 12px;display:flex;flex-direction:column;gap:6px`}>
          <div style={css`display:flex;align-items:center;gap:8px`}>
            <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a;flex:1`}>{vm.phaseKicker}</div>
            <div style={css`display:flex;gap:3px`}>
              {vm.steps.map((st, i) => (
                <div key={i} style={css`width:10px;height:10px;border:2px solid #24211c;background:${st.bg};transition:background .4s`} />
              ))}
            </div>
          </div>
          <div style={css`font-family:Galmuri11,monospace;font-size:14px;font-weight:700`}>{vm.phaseTitle}</div>
          <div style={css`font-size:12px;line-height:1.5;color:#4a453c;text-wrap:pretty`}>{vm.phaseDesc}</div>
          {vm.waitingCeo && (
            <div style={css`font-family:Galmuri9,monospace;font-size:10px;padding:4px 6px;background:oklch(0.82 0.1 75);border:2px solid #24211c;animation:blink 1.2s steps(2) infinite;align-self:flex-start`}>CEO 응답 대기 중</div>
          )}
        </div>
        <div style={css`position:absolute;left:30px;top:510px;font-family:Galmuri9,monospace;font-size:9px;color:#6b655a`}>캐릭터를 클릭하면 작업 내역을 볼 수 있어요</div>
      </div>
    </div>
  );
}
