import './App.css';

import ToonationSettingInput from './components/ToonationSettingInput';
import VTPSettingInput from './components/VTPSettingInput';
import VTPTriggerSettingPanel from './components/VTPTriggerSettingPanel';

import { Button, Typography } from 'antd';
const { Title } = Typography;

function App() {
  const openVTPSettingPanel = () => {
    const panel = document.getElementById('vtpPanel');
    panel.classList.add('open');
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
