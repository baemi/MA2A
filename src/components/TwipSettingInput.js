import React from 'react'
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { twipKeyState } from '../store/donation';

import { Row, Col, Card, Input, Button, Tooltip } from 'antd';
import { PoweroffOutlined, DisconnectOutlined } from '@ant-design/icons';
import { openFailedNotification, openInfoNotification, openSuccessNotification } from '../util/noti';

import * as VtpMessage from '../vtp/message';
import { Twip } from '../donation/twip';


export default function TwipSettingInput() {
  const [connected, setConnected] = useState(false);
  const [disconnectingLoading, setDisconnectingLoading] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);

  const [twipKey, setTwipKey] = useRecoilState(twipKeyState);

  const [twip, setTwip] = useState(null);

  const handleChange = (e) => {
    setTwipKey(e.target.value);
  }

  const connectTwipAlert = async () => {
    setConnectionLoading(true);

    if(!twipKey) {
      openInfoNotification('트윕 키를 입력해주세요.');
      return;
    }

    // 투네이션 알림 연동
    const twip = new Twip(twipKey);
    await twip.connect((eventName, data) => {
      switch(eventName) {
        case 'connect': {
          if(data) {
            setTwip(twip);
            openSuccessNotification('성공적으로 연결되었습니다.');
          } else {
            openFailedNotification('연결에 실패하였습니다.');
          }
    
          setConnected(data);
          break;
        }
        case 'message': {
          handleTwipMessage(data);
          break;
        }
        case 'close': {
          openInfoNotification('트윕 연결이 해제되었습니다.');
          setConnected(false);
          break;
        }
        default: {
          // none
        }
      }

      setConnectionLoading(false);
    });
  }

  const handleTwipMessage = (twipMsg) => {
    console.log('twip:', twipMsg);

    const onlyTxtDona = null === twipMsg.variation_id;

    if(onlyTxtDona) {
      const amount = twipMsg.amount;

      const trigger = window.vtpTriggerList.find(trigger => trigger.donationAmount === amount && trigger.platform.find(platform => platform === '트윕'));

      if(trigger && trigger.useAt) {
        VtpMessage.sendTriggerMessage(window.vtpSocket, trigger);
      }
    }
  }

  const disconnectTwipAlert = () => {
    setDisconnectingLoading(true);
    twip.disconnect();
    setTwip(null);
    setConnected(false);
    setDisconnectingLoading(false);
  }

  return (
    <Card title='Twip Alert 설정' bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 6px 12px rgba(80,80,80,0.2)' }}>
      <Row align='middle'>
        <Col flex="auto" style={{ padding: '4px'}}>
          <Input.Password addonBefore='https://twip.kr/widgets/alertbox/' id='twipKey' name='twipKey' autoComplete='off' placeholder='트윕 URL 끝 키를 입력하세요' style={{ height: 'inherited' }} value={twipKey} onChange={handleChange} />
        </Col>
        <Col flex='24px' style={{ padding: '4px'}}>
          <Tooltip placement='top' title='연결'>
            <Button 
              disabled={connected}
              size='middle'
              htmlType='button'
              shape='circle'
              loading={connectionLoading}
              onClick={connectTwipAlert}
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
              onClick={disconnectTwipAlert}
              icon={<DisconnectOutlined style={{ fontSize: '20px', color: `${!connected ? '#bfbfbf' : '#f5222d'}`}} />}
              />
          </Tooltip>
        </Col>
      </Row>
      <div style={{ fontSize: '12px', color: `${connected ? '#1890ff' : '#f5222d'}`, marginTop: '4px', marginLeft: '4px' }}>{connected ? '연결 중' : '연결 끊김'}</div>
    </Card>
  )
}
