import './panel.css';

import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedVtpTriggerState, vtpTriggerListState } from '../store/vtp';

import { Row, Col, Card, Button, Space, Modal } from 'antd';
import { CloseOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';

import VTPTriggerList from './VTPTriggerList';
import { openFailedNotification, openSuccessNotification } from '../util/noti';
import VTPTriggerModal from './VTPTriggerModal';

const electronFs = window.require('fs');
const electronPath = window.require('path');
const remote = window.require('@electron/remote');

export default function VTPTriggerSettingPanel() {

  const [selectedVtpTrigger, setSelectedVtpTrigger] = useRecoilState(selectedVtpTriggerState);
  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);

  const [isOpenVtpTriggerModal, setIsOpenVtpTriggerModal] = useState(false);

  useEffect(() => {
    window.vtpTriggerList = vtpTriggerList;
  }, [vtpTriggerList]);

  // VTP 설정 패널 닫기
  const closeVTPSettingPanel = () => {
    const panel = document.getElementById('vtpPanel');
    panel.classList.remove('open');
  }

  const handleCustomItemUseChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, isCustomItem: value });
  }

  const importVtpTriggerList = async () => {
    const options = {
      title: 'VTP 트리거 목록',
      defaultPath: electronPath.join(remote.app.getPath('documents')),
      filters: [
        { name: 'MA2A Trigger List', extensions: ['ma2atl'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    try {
      const filepath = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), options);

      if (!filepath.canceled) {
        const fileBuffer = electronFs.readFileSync(filepath.filePaths[0]);
        const uploadedVtpTriggerList = JSON.parse(fileBuffer);

        const validTriggerList = uploadedVtpTriggerList.map(trigger => {
          if (!trigger.donationContentCond) {
            trigger.donationContentCond = 'none';
            trigger.donationContent = '';
          }
          return trigger;
        });

        setVtpTriggerList(validTriggerList);

        openSuccessNotification('가져오기 성공');
      }
    } catch (e) {
      openFailedNotification('잘못된 파일입니다.');
    }
  }

  const exportVtpTriggerList = async () => {
    console.log(remote);

    const options = {
      title: 'Vtuber Plus 트리거 목록',
      defaultPath: electronPath.join(remote.app.getPath('documents'), 'vtp_trigger_list.ma2atl'),
      filters: [
        { name: 'MA2A Trigger List', extensions: ['ma2atl'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    const result = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), options);
    if (!result.canceled) {
      const file = electronFs.createWriteStream(result.filePath);
      file.write(JSON.stringify(vtpTriggerList));
      file.end();
    }
  }

  const openVtpTriggerModal = () => {
    setIsOpenVtpTriggerModal(true);
  }

  const closeVtpTriggerModal = () => {
    setIsOpenVtpTriggerModal(false);
  }

  return (
    <Card
      title='Vtuber Plus 트리거 설정'
      extra={
        <>
          <Space>
            <Button onClick={importVtpTriggerList}>Vtuber Plus 트리거 가져오기<UploadOutlined /></Button>
            <Button onClick={exportVtpTriggerList}>Vtuber Plus 트리거 내보내기<DownloadOutlined /></Button>
            <Button shape="circle" onClick={closeVTPSettingPanel}><CloseOutlined /></Button>
          </Space>
        </>
      }
      id='vtpPanel'
      className='vtp-setting-panel'
    >
      <Row>
        <Col style={{ marginBottom: 8 }}>
          <Button onClick={openVtpTriggerModal}>트리거 추가</Button>
        </Col>
        <Col>
          <VTPTriggerList handleCustomItemUseChange={handleCustomItemUseChange} openVtpTriggerModal={openVtpTriggerModal} />
        </Col>
      </Row>

      <VTPTriggerModal isOpenVtpTriggerModal={isOpenVtpTriggerModal} closeVtpTriggerModal={closeVtpTriggerModal} />
    </Card>
  )
}
