import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { vtpSocketState, vtpCustomItemListState, vtpTriggerListState, selectedVtpTriggerState, selectingVtpTriggerState } from '../store/vtp';

import * as VtpMessage from '../vtp/message';

import { openInfoNotification } from "../util/noti";
import { Button, Card, Input, InputNumber, Select, Space, Switch, Tooltip } from 'antd';
const { Option } = Select;

export default function VTPTriggerForm() {
  const customItemList = useRecoilValue(vtpCustomItemListState);  // 커스텀 아이템 목록
  const [selectedVtpTrigger, setSelectedVtpTrigger] = useRecoilState(selectedVtpTriggerState);
  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);
  const [selectingVtpTrigger, setSelectingVtpTrigger] = useRecoilState(selectingVtpTriggerState);
  const vtpSocket = useRecoilValue(vtpSocketState);

  /* 트리거 input 변경 값 처리 */
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

  /**
 * VTP 트리거 추가
 * @param {*} trigger 
 * @returns 
 */
const addTrigger = (trigger) => {
  if(!trigger.triggerName) {
    openInfoNotification('트리거 이름을 입력하세요.');
    return;
  }

  const newId = vtpTriggerList.length;

  if(vtpTriggerList.find(oldTrigger => oldTrigger.triggerName === trigger.triggerName)) {
    openInfoNotification('이미 존재하는 트리거 이름 입니다.');
    return;
  }

  setVtpTriggerList([...vtpTriggerList, { ...trigger, id: newId}]);
  setSelectingVtpTrigger(false);
}


/**
 * VTP 트리거 수정
 * @param {*} trigger 
 * @returns 
 */
const modTrigger = (trigger) => {
  if(!trigger.triggerName) {
    openInfoNotification('트리거 이름을 입력하세요.');
    return;
  }

  if(vtpTriggerList.find(oldTrigger => oldTrigger.triggerName === trigger.triggerName && oldTrigger.id !== trigger.id)) {
    openInfoNotification('이미 존재하는 트리거 이름 입니다.');
    return;
  }

  const newTriggerItemList = vtpTriggerList.filter(oldTrigger => oldTrigger.id !== trigger.id);
  setVtpTriggerList([...newTriggerItemList, trigger]);
  setSelectingVtpTrigger(false);
}

  return (
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

        <Button onClick={() => VtpMessage.sendTriggerMessage(vtpSocket, selectedVtpTrigger)}>테스트</Button>
        <Button onClick={() => addTrigger(selectedVtpTrigger)}>추가</Button>
        {
          selectingVtpTrigger && <Button onClick={() => modTrigger(selectedVtpTrigger)}>수정</Button>
        }
      </Space>
    </Card>
  )
}
