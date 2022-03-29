import React from 'react';
import { useEffect } from 'react';
import './panel.css';

import { useRecoilState, useRecoilValue } from 'recoil';
import { vtpSocketState, vtpCustomItemListState, vtpTriggerListState, selectedVtpTriggerState, selectingVtpTriggerState } from '../store/vtp';

import { Row, Col, Card, Input, InputNumber, Button, Select, Space, Switch, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import VTPThrowTriggerList from './VTPThrowTriggerList';
import { openInfoNotification } from '../util/noti';

const { Option } = Select;

const { ipcRenderer } = window.require('electron');

export default function VTPTriggerSettingPanel() {
  const vtpSocket = useRecoilValue(vtpSocketState);
  const customItemList = useRecoilValue(vtpCustomItemListState);
  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);
  const [selectedVtpTrigger, setSelectedVtpTrigger] = useRecoilState(selectedVtpTriggerState);
  const [selectingVtpTrigger, setSelectingVtpTrigger] = useRecoilState(selectingVtpTriggerState);


  // VTP 설정 패널 닫기
  const closeVTPSettingPanel = () => {
    const panel = document.getElementById('vtpPanel');
    panel.classList.remove('open');
  }

  /* input 변경 값 처리 */
  const handleTriggerName = (e) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, triggerName: e.target.value });
  }

  const handleDonationAmounChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, donationAmount: value });
  }

  const handleThrownCountChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, thrownCount: value });
  }

  const handleItemIndexChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, itemIndex: value });
  }

  const handleCustomItemIndexChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, customItemIndex: value });
  }

  const handleDamageChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, damage: value });
  }

  const handleCustomItemUseChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, isCustomItem: value });
  }
  /* **** **** */

  // 초기 컴포넌트 마운트 시 최초 한 번 실행
  // 투네이션 알림에 대한 VTP Throw 처리
  useEffect(() => {
    window.vtpTriggerList = vtpTriggerList;
    ipcRenderer.on('toonation-message', handleToonationMessage);
  }, 
  // eslint-disable-next-line
  []);

  // VTP 트리거 변경(추가, 삭제, 수정)에 따른 이벤트 재등록
  // ipc 특성으로 인해 변경된 vtpTriggerList에 따른 처리를 위해 이벤트 재등록이 필요함
  useEffect(() => {
    window.vtpTriggerList = vtpTriggerList;
  }, [vtpTriggerList]);


  // 투네이션 알림 메시지 처리
  function handleToonationMessage(e, toonationMsg) {
    const content = toonationMsg.content;
    const onlyTxtDona = null === content.video_info;
    if(onlyTxtDona) {
      const amount = content.amount;

      const trigger = window.vtpTriggerList.find(trigger => trigger.donationAmount === amount);

      if(trigger) {
        sendMsgToVTP(trigger);
      }
    }
  }

  // VTP 메시지 전달
  function sendMsgToVTP(trigger) {
    const itemIndex = trigger.isCustomItem ? 8 : trigger.itemIndex;
    const customItemIndex = trigger.isCustomItem ? trigger.customItemIndex : -1;
    const vtpMsg = `VTP_Throw:${trigger.thrownCount}:${itemIndex}:${customItemIndex}:${trigger.damage}`;
    window.vtpSocket.send(vtpMsg);
  }

  // VTP 테스트 메시지 전달
  function sendTestMsgToVTP() {
    const itemIndex = selectedVtpTrigger.isCustomItem ? 8 : selectedVtpTrigger.itemIndex;
    const customItemIndex = selectedVtpTrigger.isCustomItem ? selectedVtpTrigger.customItemIndex : -1;
    const vtpMsg = `VTP_Throw:${selectedVtpTrigger.thrownCount}:${itemIndex}:${customItemIndex}:${selectedVtpTrigger.damage}`;
    vtpSocket.send(vtpMsg);
  }

  // VTP 트리거 추가(현재 Throw만 반영)
  const addVTPTrigger = () => {
    if(!selectedVtpTrigger.triggerName) {
      openInfoNotification('트리거 이름을 입력하세요.');
      return;
    }

    const newId = vtpTriggerList.length;

    if(vtpTriggerList.find(trigger => trigger.triggerName === selectedVtpTrigger.triggerName)) {
      openInfoNotification('이미 존재하는 트리거 이름 입니다.');
      return;
    }

    setVtpTriggerList([...vtpTriggerList, { ...selectedVtpTrigger, id: newId}]);
    setSelectingVtpTrigger(false);
  }

  // VTP 트리거 수정(현재 Throw만 반영)
  const modVTPTrigger = () => {
    if(!selectedVtpTrigger.triggerName) {
      openInfoNotification('트리거 이름을 입력하세요.');
      return;
    }

    if(vtpTriggerList.find(trigger => trigger.triggerName === selectedVtpTrigger.triggerName && trigger.id !== selectedVtpTrigger.id)) {
      openInfoNotification('이미 존재하는 트리거 이름 입니다.');
      return;
    }

    const newTriggerItemList = vtpTriggerList.filter(trigger => trigger.id !== selectedVtpTrigger.id);
    setVtpTriggerList([...newTriggerItemList, selectedVtpTrigger]);
    setSelectingVtpTrigger(false);
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
          <Card>
            <Space direction="vertical">
              <Input name='triggerName' addonBefore='트리거 이름' placeholder='40자 내 이름을 입력해주세요.' maxLength={40} onChange={handleTriggerName} value={selectedVtpTrigger.triggerName} />

              <InputNumber name='donationAmount' addonBefore='후원 금액' min={1000} defaultValue={1000} onChange={handleDonationAmounChange} value={selectedVtpTrigger.donationAmount} />

              <InputNumber name='thrownCount' addonBefore='개수' min={1} defaultValue={1} onChange={handleThrownCountChange} value={selectedVtpTrigger.thrownCount} />

              <Tooltip placement="rightTop" title='커스텀 아이템 사용 여부를 선택합니다.'>
                <Switch checked={selectedVtpTrigger.isCustomItem} onChange={handleCustomItemUseChange} disabled={customItemList.length === 0 ? true : false} />
              </Tooltip>
              {
                selectedVtpTrigger.isCustomItem
                  ? <div className="ant-input-number-wrapper ant-input-number-group">
                    <div className="ant-input-number-group-addon">커스텀 아이템</div>
                    <Select name='customItemIndex' value={`${selectedVtpTrigger.customItemIndex}`} style={{ width: 200 }} onChange={handleCustomItemIndexChange}>
                      <Option value="-1" key='random'>랜덤</Option>
                      {
                        customItemList.map((customItem, index) => {
                          return (
                            <Option value={`${index}`} key={customItem}>{customItem}</Option>
                          )
                        })
                      }
                    </Select>
                  </div>
                  : <div className="ant-input-number-wrapper ant-input-number-group">
                    <div className="ant-input-number-group-addon">아이템</div>
                    <Select name='itemIndex' value={`${selectedVtpTrigger.itemIndex}`} style={{ width: 200 }} onChange={handleItemIndexChange}>
                      <Option value="-1">랜덤</Option>
                      <Option value="0">테니스 볼</Option>
                      <Option value="1">비치 볼</Option>
                      <Option value="2">슬리퍼</Option>
                      <Option value="3">바나나</Option>
                      <Option value="4">장난감 오리</Option>
                      <Option value="5">장난감 뼈</Option>
                    </Select>
                  </div>
              }
              <InputNumber name='damage' addonBefore='데미지' min={0} max={100} defaultValue={0} onChange={handleDamageChange} value={selectedVtpTrigger.damage} />

              <Button onClick={sendTestMsgToVTP}>테스트</Button>
              <Button onClick={addVTPTrigger}>추가</Button>
              {
                selectingVtpTrigger && <Button onClick={modVTPTrigger}>수정</Button>
              }
            </Space>
          </Card>

        </Col>
      </Row>

    </Card>
  )
}
