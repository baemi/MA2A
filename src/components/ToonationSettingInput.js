import React from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { toonationKeyState } from '../store/donation';

import { Row, Col, Card, Input, Button, Tooltip } from 'antd';
import { PoweroffOutlined, DisconnectOutlined } from '@ant-design/icons';
import { openFailedNotification, openInfoNotification, openSuccessNotification } from '../util/noti';

import * as VtpMessage from '../vtp/message';
import { Toonation } from '../donation/toonation';

export default function ToonationSettingInput() {
  const [connected, setConnected] = useState(false);
  const [disconnectingLoading, setDisconnectingLoading] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);

  const [toonationKey, setToonationKey] = useRecoilState(toonationKeyState);

  const [toonation, setToonation] = useState(null);

  // const Toonation = window.require('../donation/toonation');

  const handleChange = (e) => {
    setToonationKey(e.target.value);
  }

  const connectToonationAlert = async () => {
    if(!toonationKey) {
      openInfoNotification('투네이션 키를 입력해주세요.');
      return;
    }

    setConnectionLoading(true);

    // 투네이션 알림 연동
    try {
      const toonation = new Toonation(toonationKey);
      const successLoad = await toonation.loadPayload();
      if(!successLoad) {
        setConnectionLoading(false);
        openFailedNotification('연결에 실패하였습니다.');
      }

      await toonation.connect(handleToonation);
    } catch (e) {
      setConnectionLoading(false);
      console.error(e);
    }
    
  }

  const handleToonation = (eventName, data, self) => {
    switch(eventName) {
      case 'connect': {
        if(data) {
          setToonation(self);
          openSuccessNotification('성공적으로 연결되었습니다.');
        } else {
          openFailedNotification('연결에 실패하였습니다.');
        }
  
        setConnected(data);
        break;
      }
      case 'message': {
        handleToonationMessage(data);
        break;
      }
      case 'close': {
        openInfoNotification('투네이션 연결이 해제되었습니다.');
        setConnected(false);

        const manualDisconnect = data;
        if(!manualDisconnect) {
          console.log('투네이션을 재연결합니다.');
          // 재연결 수행
          self.connect(handleToonation);
        }
        break;
      }
      case 'connect-failed': {
        setConnectionLoading(false);
        openFailedNotification('연결에 실패하였습니다.');
        break;
      }
      default: {
        // none
      }
    }

    setConnectionLoading(false);
  }

  const handleToonationMessage = (toonationMsg) => {
    console.log('toonation:', toonationMsg);

    const content = toonationMsg.content;
    const onlyTxtDona = null === content.video_info && 300 !== toonationMsg.code_ex && !content.roulette;

    if(onlyTxtDona) {
      const amount = content.amount;

      const trigger = window.vtpTriggerList.find(trigger => trigger.donationAmount === amount && trigger.platform.find(platform => platform === '투네이션'));

      if(trigger && trigger.useAt) {
        VtpMessage.sendTriggerMessage(window.vtpSocket, trigger);
      }
    }
  }

  const disconnectToonationAlert = () => {
    setDisconnectingLoading(true);
    toonation.disconnect(true);
    setToonation(null);
    setConnected(false);
    setDisconnectingLoading(false);
  }

  return (
    <Card title='Toonation Alert 설정' bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 6px 12px rgba(80,80,80,0.2)' }}>
      <Row align='middle'>
        <Col flex="auto" style={{ padding: '4px'}}>
          <Input.Password addonBefore='https://toon.at/widget/alertbox/' id='toonationKey' name='toonationKey' autoComplete='off' placeholder='투네이션 URL 끝 키를 입력하세요' style={{ height: 'inherited' }} value={toonationKey} onChange={handleChange} />
        </Col>
        <Col flex='24px' style={{ padding: '4px'}}>
          <Tooltip placement='top' title='연결'>
            <Button 
              disabled={connected}
              size='middle'
              htmlType='button'
              shape='circle'
              loading={connectionLoading}
              onClick={connectToonationAlert}
              icon={<PoweroffOutlined style={{ fontSize: '20px', color: `${connected ? '#bfbfbf' : '#1890ff'}` }} />} 
            />
          </Tooltip>
        </Col>
        <Col>
          <Tooltip placement='top' title='연결 끊기'>
            <Button
              disabled={!connected}
              size='middle'
              htmlType='button'
              shape='circle'
              loading={disconnectingLoading}
              onClick={disconnectToonationAlert}
              icon={<DisconnectOutlined style={{ fontSize: '20px', color: `${!connected ? '#bfbfbf' : '#f5222d'}`}} />}
              />
          </Tooltip>
        </Col>
      </Row>
      <div style={{ fontSize: '12px', color: `${connected ? '#1890ff' : '#f5222d'}`, marginTop: '4px', marginLeft: '4px' }}>{connected ? '연결 중' : '연결 끊김'}</div>
    </Card>
  )
}