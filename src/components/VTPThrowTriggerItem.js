import React from 'react'

import { useRecoilState, useSetRecoilState } from 'recoil';
import { vtpTriggerListState, selectedVtpTriggerState, selectingVtpTriggerState } from '../store/vtp';

import { List, Row, Col, Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function VTPThrowTriggerItem({ item, handleCustomItemUseChange }) {

  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);
  const setSelectedVtpTrigger = useSetRecoilState(selectedVtpTriggerState);
  const setSelectingVtpTrigger = useSetRecoilState(selectingVtpTriggerState);

  const loadVTPTriggerItem = () => {
    handleCustomItemUseChange(item.isCustomItem);

    setSelectedVtpTrigger(item);
    setSelectingVtpTrigger(true);
  }

  const delVTPTriggerItem = () => {
    const newTriggerItemList = vtpTriggerList.filter(trigger => trigger.triggerName !== item.triggerName);

    setVtpTriggerList(newTriggerItemList);
  }

  return (
    <List.Item>
      <Row wrap={false} align='middle' justify='center' style={{ width: '100%'}}>
        <Col flex="auto" style={{ marginRight: '20px' }}>{item.triggerName}</Col>
        <Col flex='72px'>
          <Space>
            <Button shape='circle' onClick={loadVTPTriggerItem}><EditOutlined style={{ fontSize: '18px' }} /></Button>
            <Button shape='circle' onClick={delVTPTriggerItem}><DeleteOutlined style={{ fontSize: '18px' }} /></Button>
          </Space>
        </Col>
      </Row>
    </List.Item>
  )
}
