import './panel.css';

import React from 'react';
import { useRecoilState } from 'recoil';
import { selectedVtpTriggerState } from '../store/vtp';

import { Row, Col, Card, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import VTPThrowTriggerList from './VTPThrowTriggerList';
import VTPTriggerForm from './VTPTriggerForm';

export default function VTPTriggerSettingPanel() {

  const [selectedVtpTrigger, setSelectedVtpTrigger] = useRecoilState(selectedVtpTriggerState);


  // VTP 설정 패널 닫기
  const closeVTPSettingPanel = () => {
    const panel = document.getElementById('vtpPanel');
    panel.classList.remove('open');
  }

  const handleCustomItemUseChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, isCustomItem: value });
  }

  return (
    <Card title='VTP 트리거 설정' extra={<Button shape="circle" onClick={closeVTPSettingPanel}><CloseOutlined /></Button>} id='vtpPanel' className='vtp-setting-panel' bodyStyle={{ position: 'absolute', top: '60px', left: 0, right: 0, bottom: '0' }}>
      <Row style={{ height: '100%'}}>
        {/* VTP 트리거 목록 */}
        <Col span={12}>
          <VTPThrowTriggerList handleCustomItemUseChange={handleCustomItemUseChange} />
        </Col>
        {/* VTP 폼 */}
        <Col span={12}>
          <VTPTriggerForm />
        </Col>
      </Row>

    </Card>
  )
}
