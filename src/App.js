import './App.css';

import { RecoilRoot } from 'recoil';

import { Button } from 'antd';

import ToonationSettingInput from './components/ToonationSettingInput';
import VTPSettingInput from './components/VTPSettingInput';
import VTPTriggerSettingPanel from './components/VTPTriggerSettingPanel';
import { SettingOutlined } from '@ant-design/icons';


function App() {
  const openVTPSettingPanel = () => {
    const panel = document.getElementById('vtpPanel');
    panel.classList.add('open');
  }

  return (
    <RecoilRoot>
      <div id='app' className='app'>
        
        <ToonationSettingInput />
        <br/>
        <VTPSettingInput />
        <br />
        <Button onClick={openVTPSettingPanel} icon={<SettingOutlined />}>VTP 트리거 설정</Button>
        
        <VTPTriggerSettingPanel />
      </div>
    </RecoilRoot>
  );
}

export default App;
