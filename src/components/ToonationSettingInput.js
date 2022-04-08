import React from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { toonationKeyState } from '../store/donation';

import { Row, Col, Card, Input, Button, Tooltip } from 'antd';
import { PoweroffOutlined, DisconnectOutlined } from '@ant-design/icons';
import { openFailedNotification, openInfoNotification, openSuccessNotification } from '../util/noti';

import * as VtpMessage from '../vtp/message';
import { Toonation } from '../donation/toonation';
import { ToonationMini } from '../donation/toonationMini';

export default function ToonationSettingInput() {
  const [connected, setConnected] = useState(false);
  const [disconnectingLoading, setDisconnectingLoading] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);

  const [toonationKey, setToonationKey] = useRecoilState(toonationKeyState);

  const [toonation, setToonation] = useState(null);
  const [toonationMini, setToonationMini] = useState(null);

  const [connectedMini, setConnectedMini] = useState(false);
  const [disconnectingLoadingMini, setDisconnectingLoadingMini] = useState(false);
  const [connectionLoadingMini, setConnectionLoadingMini] = useState(false);

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
        return;
      }

      await toonation.connect(handleToonation);
    } catch (e) {
      setConnectionLoading(false);
      console.error(e);
    }
  }

  const connectToonationMiniAlert = async () => {
    if(!toonationKey) {
      openInfoNotification('투네이션 키를 입력해주세요.');
      return;
    }

    setConnectionLoadingMini(true);
    
    // 투네이션 미니 후원 알림 연동
    try {
      const toonationMini = new ToonationMini(toonationKey);
      const successLoad = await toonationMini.loadPayload();
      if(!successLoad) {
        setConnectionLoadingMini(false);
        openFailedNotification('연결에 실패하였습니다.');
        return;
      }

      await toonationMini.connect(handleToonationMini);
    } catch (e) {
      setConnectionLoadingMini(false);
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

  const handleToonationMini = (eventName, data, self) => {
    switch(eventName) {
      case 'connect': {
        if(data) {
          setToonationMini(self);
          openSuccessNotification('성공적으로 연결되었습니다.');
        } else {
          openFailedNotification('연결에 실패하였습니다.');
        }
  
        setConnectedMini(data);
        break;
      }
      case 'message': {
        handleToonationMessage(data);
        break;
      }
      case 'close': {
        openInfoNotification('투네이션 연결이 해제되었습니다.');
        setConnectedMini(false);

        const manualDisconnect = data;
        if(!manualDisconnect) {
          console.log('투네이션을 재연결합니다.');
          // 재연결 수행
          self.connect(handleToonation);
        }
        break;
      }
      case 'connect-failed': {
        setConnectionLoadingMini(false);
        openFailedNotification('연결에 실패하였습니다.');
        break;
      }
      default: {
        // none
      }
    }

    setConnectionLoadingMini(false);
  }

  const handleToonationMessage = (toonationMsg) => {
    const content = toonationMsg.content;
    const onlyTxtDona = null === content.video_info && 300 !== toonationMsg.code_ex && !content.roulette;

    if(onlyTxtDona) {
      const amount = content.amount;
      const message = content.message;

      // 후원 금액과 플랫폼이 일치하는 트리거 목록 가져오기
      const triggerList = window.vtpTriggerList.filter(trigger => trigger.donationAmount === amount && trigger.platform.find(platform => platform === '투네이션' && trigger.useAt));

      if(triggerList.length === 0) {
        return;
      }

      // 후원 조건과 일치하는 트리거 가져오기
      const trigger = triggerList.find(trigger => {
        const cond = trigger.donationContentCond;

        if('none' === cond) {
          return true;
        }

        if('equal' === cond && message && trigger.donationContent === message) {
          return true;
        }

        if('contain' === cond && message && message.includes(trigger.donationContent)) {
          return true;
        }

        return false;
      });

      if(trigger) {
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

  const disconnectToonationMiniAlert = () => {
    setDisconnectingLoadingMini(true);
    toonationMini.disconnect(true);
    setToonationMini(null);
    setConnectedMini(false);
    setDisconnectingLoadingMini(false);
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
      <Row align='middle'>
        <Col flex="auto" style={{ padding: '4px'}}>
          <Input.Password addonBefore='https://toon.at/widget/mini_donation/' id='toonationMiniKey' name='toonationMiniKey' autoComplete='off' style={{ height: 'inherited' }} value={toonationKey} disabled={true} />
        </Col>
        <Col flex='24px' style={{ padding: '4px'}}>
          <Tooltip placement='top' title='연결'>
            <Button 
              disabled={connectedMini}
              size='middle'
              htmlType='button'
              shape='circle'
              loading={connectionLoadingMini}
              onClick={connectToonationMiniAlert}
              icon={<PoweroffOutlined style={{ fontSize: '20px', color: `${connectedMini ? '#bfbfbf' : '#1890ff'}` }} />} 
            />
          </Tooltip>
        </Col>
        <Col>
          <Tooltip placement='top' title='연결 끊기'>
            <Button
              disabled={!connectedMini}
              size='middle'
              htmlType='button'
              shape='circle'
              loading={disconnectingLoadingMini}
              onClick={disconnectToonationMiniAlert}
              icon={<DisconnectOutlined style={{ fontSize: '20px', color: `${!connectedMini ? '#bfbfbf' : '#f5222d'}`}} />}
              />
          </Tooltip>
        </Col>
      </Row>
      <div style={{ fontSize: '12px', color: `${connectedMini ? '#1890ff' : '#f5222d'}`, marginTop: '4px', marginLeft: '4px' }}>{connectedMini ? '연결 중' : '연결 끊김'}</div>
    </Card>
  )
}