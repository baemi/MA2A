import './panel.css';

import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { selectedVtpTriggerState, vtpTriggerListState } from '../store/vtp';

import { Row, Col, Card, Button, Space } from 'antd';
import { CloseOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';

import VTPTriggerList from './VTPTriggerList';
import VTPTriggerForm from './VTPTriggerForm';
import { openFailedNotification, openSuccessNotification } from '../util/noti';

const electronFs = window.require('fs');
const electronPath = window.require('path');
const remote = window.require('@electron/remote');

export default function VTPTriggerSettingPanel() {

  const [selectedVtpTrigger, setSelectedVtpTrigger] = useRecoilState(selectedVtpTriggerState);
  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);

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

      if(!filepath.canceled) {
        const fileBuffer = electronFs.readFileSync(filepath.filePaths[0]);
        const uploadedVtpTriggerList = JSON.parse(fileBuffer);
  
        setVtpTriggerList(uploadedVtpTriggerList);

        openSuccessNotification('가져오기 성공');
      }  
    } catch (e) {
      openFailedNotification('잘못된 파일입니다.');
    }
  }

  const exportVtpTriggerList = async () => {
    console.log(remote);

    const options = {
      title: 'VTP 트리거 목록',
      defaultPath: electronPath.join(remote.app.getPath('documents'), 'vtp_trigger_list.ma2atl'),
      filters: [
        { name: 'MA2A Trigger List', extensions: ['ma2atl'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    const result = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), options);
    if(!result.canceled) {
      const file = electronFs.createWriteStream(result.filePath);
      file.write(JSON.stringify(vtpTriggerList));
      file.end();
    }
  }

  return (
    <Card
      title='VTP 트리거 설정'
      extra={
        <>
          <Space>
            <Button onClick={importVtpTriggerList}>VTP 트리거 가져오기<UploadOutlined /></Button>
            <Button onClick={exportVtpTriggerList}>VTP 트리거 내보내기<DownloadOutlined /></Button>
            <Button shape="circle" onClick={closeVTPSettingPanel}><CloseOutlined /></Button>
          </Space>
        </>
      }
      id='vtpPanel'
      className='vtp-setting-panel'
      bodyStyle={{ position: 'absolute', top: '60px', left: 0, right: 0, bottom: '0' }}
    >
      <Row style={{ height: '100%'}}>
        {/* VTP 트리거 목록 */}
        <Col span={16}>
          <VTPTriggerList handleCustomItemUseChange={handleCustomItemUseChange} />
        </Col>
        {/* VTP 폼 */}
        <Col span={8}>
          <VTPTriggerForm />
        </Col>
      </Row>

    </Card>
  )
}
