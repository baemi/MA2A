import './App.css';

import { useEffect } from 'react';

import { useRecoilValue } from 'recoil';
import { vtpTriggerListState, vtpSocketState } from './store/vtp';

import { Button } from 'antd';

import ToonationSettingInput from './components/ToonationSettingInput';
import VTPSettingInput from './components/VTPSettingInput';
import VTPTriggerSettingPanel from './components/VTPTriggerSettingPanel';

const { ipcRenderer } = window.require('electron');


function App() {
  const vtpTriggerList = useRecoilValue(vtpTriggerListState);
  const vtpSocket = useRecoilValue(vtpSocketState);

  const openVTPSettingPanel = () => {
    const panel = document.getElementById('vtpPanel');
    panel.classList.add('open');
  }

  /** 전역(window) 객체 동기화 관련 핸들링 **/

  // 초기 컴포넌트 마운트 시 최초 한 번 실행
  // 투네이션 알림에 대한 VTP Throw 처리
  useEffect(() => {
    window.vtpTriggerList = vtpTriggerList;
    ipcRenderer.on('toonation-message', handleToonationMessage);
  }, 
  // eslint-disable-next-line
  []);

  // VTP 트리거 변경(추가, 삭제, 수정)에 따른 이벤트 재등록
  // ipc에서 사용하기 위해 변경된 vtpTriggerList에 따른 처리를 위해 이벤트 재등록이 필요함
  useEffect(() => {
    window.vtpTriggerList = vtpTriggerList;
  }, [vtpTriggerList]);

  // ipc에서 사용하기 위해 vtpSocket 글로벌에 저장
  useEffect(()=>{
    window.vtpSocket = vtpSocket;
  }, [vtpSocket]);
  /** ********************************** **/


  // 투네이션 알림 메시지 처리
  function handleToonationMessage(e, toonationMsg) {
    const content = toonationMsg.content;
    const onlyTxtDona = null === content.video_info;

    console.dir(toonationMsg);

    // if(onlyTxtDona) {
    //   const amount = content.amount;

    //   const trigger = window.vtpTriggerList.find(trigger => trigger.donationAmount === amount);

    //   if(trigger) {
    //     VtpMessage.sendTriggerMessage(window.vtpSocket, trigger);
    //   }
    // }
  }

  return (
    <div id='app' className='app'>
      <ToonationSettingInput />
      <br/>
      <VTPSettingInput />
      <br />
      <Button onClick={openVTPSettingPanel}>VTP 트리거 설정</Button>
      
      <VTPTriggerSettingPanel />
    </div>
  );
}

export default App;
