import './App.css';

import { RecoilRoot } from 'recoil';

import { Button, Row, Col } from 'antd';

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
          <Row wrap={true} justify='space-around'>
            <Col span={11}>
              <ToonationSettingInput />
            </Col>
            <Col span={11}>
              <TwipSettingInput />
            </Col>
            <Col span={23} style={{ marginTop: 16}}>
              <VTPSettingInput />
            </Col>
            <Col span={23} style={{ marginTop: 16}}>
              <Button onClick={openVTPSettingPanel} icon={<SettingOutlined />}>Vtuber Plus 트리거 설정</Button>
            </Col>
          </Row>
        </div>
        <VTPTriggerSettingPanel />
      </div>

    </RecoilRoot>
  );
}

export default App;
