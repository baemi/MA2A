import React, { useState } from 'react';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { vtpIpState, vtpPortState, vtpSocketState, vtpCustomItemPathState, vtpCustomItemListState } from '../store/vtp';

import { Row, Col, Card, Input, Button } from 'antd';
import { openFailedNotification, openInfoNotification, openSuccessNotification } from '../util/noti';

export default function VTPSettingInput() {
  const [connected, setConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);

  const [vtpIp, setVtpIp] = useRecoilState(vtpIpState);
  const [vtpPort, setVtpPort] = useRecoilState(vtpPortState);
  const setVtpSocket = useSetRecoilState(vtpSocketState);
  const [vtpCustomItemPath, setVtpCustomItemPath] = useRecoilState(vtpCustomItemPathState);

  const setCustomItemList = useSetRecoilState(vtpCustomItemListState);

  const handleChange = (e) => {
    // eslint-disable-next-line default-case
    switch(e.target.name) {
      case 'vtpIp': {
        setVtpIp(() => (e.target.value));
        break;
      }
      case 'vtpPort': {
        setVtpPort(() => (e.target.value));
        break;
      }
      case 'vtpCustomItemPath': {
        const electronPath = window.require('path');

        const customItemPath = electronPath.normalize(e.target.value);
        setVtpCustomItemPath(() => (customItemPath));
      }
    }
  }

  const connectVTPWebsocket = () => {
    if(!vtpIp) {
      openInfoNotification('VTP Websocket IP를 입력해주세요.');
    }

    if(!vtpPort) {
      openInfoNotification('VTP Websocket IP를 입력해주세요.');
    }

    setVtpIp(vtpIp);
    setVtpPort(vtpPort);

    const vtpUrl = `ws://${vtpIp === '127.0.0.1' ? 'localhost' : vtpIp }:${vtpPort}/vtplus`;

    if('WebSocket' in window) {
      const socket = new WebSocket(vtpUrl);

      socket.onopen = (e) => {

        setConnected(true);
        setConnectionLoading(false);

        openSuccessNotification('성공적으로 연결되었습니다.');
      }

      socket.onclose = (e) => {
        openInfoNotification('VTP 연결 해제');
      }

      setVtpSocket(socket);

      setConnectionLoading(true);
    } else {
      openFailedNotification('현재 VTP와 연결을 지원하지 않습니다.(code: 101)');
      setConnectionLoading(false);
    }
  }

  const updateCustomItemList = () => {
    if(!vtpCustomItemPath) {
      openInfoNotification('VTP 커스텀 아이템이 저장된 폴더 경로를 입력하세요.');
      return;
    }

    getCustomItemFileList(vtpCustomItemPath);
  }

  const getCustomItemFileList = (path) => {
    const electronFs = window.require('fs');

    electronFs.readdir(path, (error, files) => {
      if(error) {
        openFailedNotification('목록을 불러오는데 실패하였습니다.');
      } else {
        setCustomItemList(files);
        openSuccessNotification('성공적으로 목록을 불러왔습니다.');
      }
    });
  }

  return (
    <Card title='VTP Websocket Server 설정' bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 6px 12px rgba(80,80,80,0.2)' }}>
        <Row>
          <Col flex="auto">
            <Input addonBefore='IP' id='vtpIp' name='vtpIp' placeholder='VTP Websocket Server IP' value={vtpIp} onChange={handleChange} />
          </Col>

          <Col flex="auto">
            <Input addonBefore='PORT' id='vtpPort' name='vtpPort' placeholder='VTP Websocket Server PORT' value={vtpPort} onChange={handleChange} />
          </Col>
          
          <Col flex="60px">
          <Button disabled={connected} size='middle' type='primary' htmlType='button' loading={connectionLoading} onClick={connectVTPWebsocket}>{connected ? '연결 완료' : '연결'}</Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col flex='auto'>
            <Input addonBefore='커스텀 아이템 폴더 경로' id='vtpCustomItemPath' name='vtpCustomItemPath' placeholder='VTP 커스텀 아이템이 저장된 경로를 입력하세요' value={vtpCustomItemPath} onChange={handleChange} />
          </Col>
          <Col>
            <Button size='middle' type='primary' htmlType='button' onClick={updateCustomItemList}>목록 불러오기</Button>
          </Col>
        </Row>
    </Card>
  )
}
