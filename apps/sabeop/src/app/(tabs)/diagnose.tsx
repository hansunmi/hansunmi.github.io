import { Redirect } from 'expo-router';

// '진단' 탭은 탭바를 숨긴 하위 화면(SCR-02)으로 바로 보낸다. 탭바에서 push로 처리하고,
// 주소로 직접 들어온 경우만 여기서 넘긴다.
export default function DiagnoseTab() {
  return <Redirect href="/diagnosis" />;
}
