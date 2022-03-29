import React from 'react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { toonationKeyState, toonationConnectedState } from '../store/donation';

import { Row, Col, Card, Input, Button } from 'antd';
import { openInfoNotification, openSuccessNotification } from '../util/noti';

export default function ToonationSettingInput() {
  const [connected, setConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);

  const [toonationKey, setToonationKey] = useRecoilState(toonationKeyState);
  const [toonationConnected, setToonationConnected] = useRecoilState(toonationConnectedState);

  const { ipcRenderer } = window.require('electron');

  const handleChange = (e) => {
    setToonationKey(e.target.value );
  }

  const connectToonationAlert = () => {
    if(!toonationKey) {
      openInfoNotification('투네이션 키를 입력해주세요.');
      return;
    }

    setConnected(false);
    setConnectionLoading(true);

    ipcRenderer.send('toonation-connection', {
      key: toonationKey
    });
  }

  useEffect(() => {
    ipcRenderer.on('toonation-connection-success', (event, arg) => {
      setConnected(true);
      setConnectionLoading(false);
      setToonationConnected(true);

      openSuccessNotification('성공적으로 연결되었습니다.');
    });
  }, 
  // eslint-disable-next-line
  []);

  return (
    <Card title='Toonation Alert 설정' bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 6px 12px rgba(80,80,80,0.2)' }}>
      <Row>
        <Col flex="auto">
          <Input.Password addonBefore='https://toon.at/widget/alertbox/' id='toonationKey' name='toonationKey' autoComplete='off' placeholder='투네이션 URL 끝 키를 입력하세요' style={{ height: 'inherited' }} value={toonationKey} onChange={handleChange} />
        </Col>
        <Col flex="60px">
          <Button disabled={connected} size='middle' type='primary' htmlType='button' loading={connectionLoading} onClick={connectToonationAlert}>{connected ? '연결 완료' : '연결'}</Button>
        </Col>
      </Row>
    </Card>
  )
}