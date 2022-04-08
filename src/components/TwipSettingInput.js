import React from 'react'
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { twipKeyState } from '../store/donation';

import { Row, Col, Card, Input, Button, Tooltip, Space } from 'antd';
import { PoweroffOutlined, DisconnectOutlined, QuestionCircleOutlined } from '@ant-design/icons';
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

    if (!twipKey) {
      openInfoNotification('트윕 키를 입력해주세요.');
      return;
    }

    // 투네이션 알림 연동
    const twip = new Twip(twipKey);
    const successLoad = await twip.loadToken();
    if (!successLoad) {
      setConnectionLoading(false);
      openFailedNotification('연결에 실패하였습니다.');
      return;
    }
    await twip.connect(handleTwip);
  }

  const handleTwip = (eventName, data, self) => {
    switch (eventName) {
      case 'connect': {
        if (data) {
          setTwip(self);
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

        const manualDisconnect = data;
        if (!manualDisconnect) {
          console.log('트윕을 재연결합니다.');
          // 재연결 수행
          self.connect(handleTwip);
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

  const handleTwipMessage = (twipMsg) => {
    const onlyTxtDona = null === twipMsg.variation_id;

    if (onlyTxtDona) {
      const amount = twipMsg.amount;
      const message = twipMsg.comment;

      // 후원 금액과 플랫폼이 일치하는 트리거 목록 가져오기
      const triggerList = window.vtpTriggerList.filter(trigger => trigger.donationAmount === amount && trigger.platform.find(platform => platform === '트윕' && trigger.useAt));

      // 후원 조건과 일치하는 트리거 가져오기
      const trigger = triggerList.find(trigger => {
        const cond = trigger.donationContentCond;

        if ('none' === cond) {
          return true;
        }

        if ('equal' === cond && message && trigger.donationContent === message) {
          return true;
        }

        if ('contain' === cond && message && message.includes(trigger.donationContent)) {
          return true;
        }

        return false;
      });

      if (trigger) {
        VtpMessage.sendTriggerMessage(window.vtpSocket, trigger);
      }
    }
  }

  const disconnectTwipAlert = () => {
    setDisconnectingLoading(true);
    twip.disconnect(true);
    setTwip(null);
    setConnected(false);
    setDisconnectingLoading(false);
  }

  return (
    <Card
      title='Twip 알림 설정'
      bordered={true}
      extra={
        <>
          <Tooltip placement='bottomRight' title='Twip > 스트리머 로그인 > 알림창 > 클릭해서 URL 확인 에 표시되는 URL, https://twip.kr/widgets/alertbox/xxxxx... 의 끝 xxxxx...를 키로 입력합니다.'>
            <QuestionCircleOutlined size='large' />
          </Tooltip>
        </>
      }
      // style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 6px 12px rgba(80,80,80,0.2)' }}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        <Row align='middle'>
          <Col flex="auto">
            <Input.Password addonBefore='Key' id='twipKey' name='twipKey' autoComplete='off' placeholder='트윕 URL 끝 키를 입력하세요' style={{ height: 'inherited' }} value={twipKey} onChange={handleChange} />
          </Col>
        </Row>
        <Row align='middle'>
          <Col flex='auto'>
            트윕 통합 알림
          </Col>
          <Col flex='24px' style={{ marginRight: 4 }}>
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
          <Col flex='24px'>
            <Tooltip placement='top' title='연결 끊기'>
              <Button
                disabled={!connected}
                size='middle'
                htmlType='button'
                shape='circle'
                loading={disconnectingLoading}
                onClick={disconnectTwipAlert}
                icon={<DisconnectOutlined style={{ fontSize: '20px', color: `${!connected ? '#bfbfbf' : '#f5222d'}` }} />}
              />
            </Tooltip>
          </Col>
          <Col>
            <div style={{ fontSize: '12px', color: `${connected ? '#1890ff' : '#f5222d'}`, marginTop: '4px', marginLeft: '4px' }}>{connected ? '연결 중' : '연결 끊김'}</div>
          </Col>
        </Row>
      </Space>
    </Card>
  )
}
