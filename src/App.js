import './App.css';

import { RecoilRoot } from 'recoil';

import { Button } from 'antd';

import ToonationSettingInput from './components/ToonationSettingInput';
import VTPSettingInput from './components/VTPSettingInput';
import VTPTriggerSettingPanel from './components/VTPTriggerSettingPanel';
import { SettingOutlined } from '@ant-design/icons';
import TwipSettingInput from './components/TwipSettingInput';


function App() {
  const openVTPSettingPanel = () => {
    const panel = document.getElementById('vtpPanel');
    panel.classList.add('open');
  }

  return (
    <RecoilRoot>
      <div id='app' className='app'>
        <div className='content'>
          <ToonationSettingInput />
          <br />
          <TwipSettingInput />
          <br />
          <VTPSettingInput />
          <br />
          <Button onClick={openVTPSettingPanel} icon={<SettingOutlined />}>VTP 트리거 설정</Button>
        </div>
        <VTPTriggerSettingPanel />
      </div>

    </RecoilRoot>
  );
}

export default App;
