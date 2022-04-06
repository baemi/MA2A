import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { vtpSocketState, vtpCustomThrowItemListState, vtpTriggerListState, selectedVtpTriggerState, selectingVtpTriggerState, vtpCustomDropItemListState } from '../store/vtp';

import * as VtpMessage from '../vtp/message';

import { openInfoNotification } from "../util/noti";
import { Button, Card, Input, InputNumber, Select, Space, Switch, Tooltip, Row, Col, Checkbox } from 'antd';
const { Option } = Select;

export default function VTPTriggerForm() {
  const customThrowItemList = useRecoilValue(vtpCustomThrowItemListState);  // 커스텀 아이템(Throw) 목록
  const customDropItemList = useRecoilValue(vtpCustomDropItemListState);  // 커스텀 아이템(Drop) 목록

  const [selectedVtpTrigger, setSelectedVtpTrigger] = useRecoilState(selectedVtpTriggerState);
  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);
  const [selectingVtpTrigger, setSelectingVtpTrigger] = useRecoilState(selectingVtpTriggerState);
  const vtpSocket = useRecoilValue(vtpSocketState);

  const donationPlatformList = ['투네이션', '트윕'];
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    window.vtpTriggerList = vtpTriggerList;
  }, [vtpTriggerList]);

  /* 트리거 input 변경 값 처리 */
  const handleTriggerName = (e) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, triggerName: e.target.value });
  }

  const handleDonationAmounChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, donationAmount: value });
  }

  const handleDonationPlatformChange = list => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, platform: list });
    setIndeterminate(!!list.length && list.length < donationPlatformList.length);
    setCheckAll(list.length === donationPlatformList.length);
  };

  const handleDonationPlatformAllChange = e => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, platform: e.target.checked ? donationPlatformList : [] });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleMethodChange = (value) => {
    if('VTP_Drop' === value) {
      setSelectedVtpTrigger({ ...selectedVtpTrigger, method: value, count: 1, customItemName: '랜덤', customItemIndex: -1, customItemHash: undefined, isCustomItem: false });
    } else {
      setSelectedVtpTrigger({ ...selectedVtpTrigger, method: value, customItemName: '랜덤', customItemIndex: -1, customItemHash: undefined, isCustomItem: false });
    }
  }

  const handleCountChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, count: value });
  }

  const handleItemIndexChange = (value, option) => {
    const itemIndex = value;
    const itemName = option.children;
    console.log(option);

    setSelectedVtpTrigger({ ...selectedVtpTrigger, itemIndex: itemIndex, itemName: itemName });
  }

  const handleCustomItemIndexChange = (value, option) => {
    const customItemIndex = value;
    const customItemHash = option.key;
    const customItemName = option.children;
    setSelectedVtpTrigger({ ...selectedVtpTrigger, customItemIndex, customItemHash, customItemName });
  }

  const handleDamageChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, damage: value });
  }

  const handleCustomItemUseChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, isCustomItem: value });
  }

  const handleCustomItemUseAtChange = (value) => {
    setSelectedVtpTrigger({ ...selectedVtpTrigger, useAt: value });
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

        <Row>
          <Col style={{ paddingRight: '8px', paddingBottom: '8px' }}>
            연동 플랫폼
          </Col>
          <Col>
            <Checkbox indeterminate={indeterminate} onChange={handleDonationPlatformAllChange} checked={checkAll} style={{ marginRight: '6px'}}>전체</Checkbox>
            <Checkbox.Group options={donationPlatformList} value={selectedVtpTrigger.platform} onChange={handleDonationPlatformChange} />
          </Col>
        </Row>

        <div className="ant-input-number-wrapper ant-input-number-group">
          <div className="ant-input-number-group-addon">방법</div>
          <Select name='method' value={`${selectedVtpTrigger.method}`} style={{ width: 200 }} onChange={handleMethodChange}>
            <Option value="VTP_Throw">던지기(Throw)</Option>
            <Option value="VTP_Drop">떨구기(Drop)</Option>
          </Select>
        </div>

        <InputNumber disabled={selectedVtpTrigger.method === 'VTP_Drop'} name='count' addonBefore='개수' min={1} defaultValue={1} onChange={handleCountChange} value={selectedVtpTrigger.count} />

        <Row align='middle'>
          <Col style={{ paddingRight: '8px' }}>
            커스텀 아이템 사용
          </Col>
          <Col>
            <Tooltip placement="rightTop" title='커스텀 아이템 사용 여부를 선택합니다.'>
              <Switch checkedChildren="Y" unCheckedChildren="N" checked={selectedVtpTrigger.isCustomItem} onChange={handleCustomItemUseChange} disabled={(selectedVtpTrigger.method === 'VTP_Throw' && customThrowItemList.length === 0) || (selectedVtpTrigger.method === 'VTP_Drop' && customDropItemList.length === 0) ? true : false} />
            </Tooltip>
          </Col>
        </Row>
        {
          selectedVtpTrigger.method === 'VTP_Throw'
          ? selectedVtpTrigger.isCustomItem
            ? <div className="ant-input-number-wrapper ant-input-number-group">
                <div className="ant-input-number-group-addon">커스텀 아이템</div>
                <Select name='customItemIndex' value={`${selectedVtpTrigger.customItemIndex}`} style={{ width: 200 }} onChange={handleCustomItemIndexChange}>
                  <Option value="-1" key='random'>랜덤</Option>
                  {
                    customThrowItemList.map((customItem) => {
                      return (
                        <Option value={`${customItem.index}`} key={customItem.hash}>{customItem.name}</Option>
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
          : selectedVtpTrigger.isCustomItem
            ? <div className="ant-input-number-wrapper ant-input-number-group">
                <div className="ant-input-number-group-addon">커스텀 아이템</div>
                <Select name='customItemIndex' value={`${selectedVtpTrigger.customItemIndex}`} style={{ width: 200 }} onChange={handleCustomItemIndexChange}>
                  <Option value="-1" key='random'>랜덤</Option>
                  {
                    customDropItemList.map((customItem) => {
                      return (
                        <Option value={`${customItem.index}`} key={customItem.hash}>{customItem.name}</Option>
                      )
                    })
                  }
                </Select>
              </div>
            : <div className="ant-input-number-wrapper ant-input-number-group">
                <div className="ant-input-number-group-addon">아이템</div>
                <Select name='itemIndex' value={`${selectedVtpTrigger.itemIndex}`} style={{ width: 200 }} onChange={handleItemIndexChange}>
                  <Option value="-1">랜덤</Option>
                  <Option value="0">박스</Option>
                  <Option value="1">파이</Option>
                  <Option value="2">솜브레로</Option>
                  <Option value="3">모루</Option>
                </Select>
              </div>
          
          
        }
        <InputNumber name='damage' addonBefore='데미지' min={0} max={100} defaultValue={0} onChange={handleDamageChange} value={selectedVtpTrigger.damage} />

        <Row align='middle'>
          <Col style={{ paddingRight: '8px' }}>
            사용 여부
          </Col>
          <Col>
            <Tooltip placement="rightTop" title='트리거 사용 여부를 선택합니다.'>
              <Switch checkedChildren="Y" unCheckedChildren="N" checked={selectedVtpTrigger.useAt} onChange={handleCustomItemUseAtChange} />
            </Tooltip>
          </Col>
        </Row>

        <Button onClick={() => VtpMessage.sendTriggerMessage(vtpSocket, selectedVtpTrigger)}>테스트</Button>
        <Button onClick={() => addTrigger(selectedVtpTrigger)}>추가</Button>
        {
          selectingVtpTrigger && <Button onClick={() => modTrigger(selectedVtpTrigger)}>수정</Button>
        }
      </Space>
    </Card>
  )
}
