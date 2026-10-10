import { css } from '../lib/css';
import { ApprovalModal } from './components/ApprovalModal';
import { BottomPanel } from './components/BottomPanel';
import { FilePreview } from './components/FilePreview';
import { IntroScreen } from './components/IntroScreen';
import { OfficeMap } from './components/OfficeMap';
import { TopBar } from './components/TopBar';
import { useOffice, type OfficeProps } from './useOffice';

/** 오피스 데모. 1440 × 900 고정 레이아웃, 가운데 정렬. */
export function OfficeApp(props: OfficeProps) {
  const vm = useOffice(props);

  return (
    <div style={css`width:1440px;height:900px;margin:0 auto;display:flex;flex-direction:column;background:#f4f1ea;position:relative;overflow:hidden`}>
      <TopBar vm={vm} />
      <OfficeMap vm={vm} />
      <BottomPanel vm={vm} />

      {vm.modal && (
        <ApprovalModal
          modal={vm.modal}
          memo={vm.memo}
          onMemo={vm.onMemo}
          onRevise={vm.revise}
          onApprove={vm.approve}
        />
      )}

      {vm.pv && (
        <FilePreview
          pv={vm.pv}
          projectName={vm.projectName}
          onClose={vm.closePreview}
          onPrev={vm.pvPrev}
          onNext={vm.pvNext}
          onDownload={vm.pvDownload}
        />
      )}

      {vm.hasIntro && <IntroScreen agents={vm.introAgents} onEnter={vm.enter} />}

      {vm.toast && (
        <div style={css`position:absolute;left:50%;bottom:270px;transform:translateX(-50%);background:#24211c;color:#f4f1ea;padding:10px 16px;font-family:Galmuri11,monospace;font-size:12px;box-shadow:4px 4px 0 #b5ab96;z-index:320;animation:fadeUp .2s steps(3)`}>
          {vm.toast}
        </div>
      )}
    </div>
  );
}
