import React from 'react';
import { List } from 'antd';

import { useRecoilState } from 'recoil';
import { vtpTriggerListState } from '../store/vtp';

import VTPThrowTriggerItem from './VTPThrowTriggerItem';

export default function VTPThrowTriggerList({ handleCustomItemUseChange }) {

  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);

  return (
    <div>
    <List
      size="small"
      bordered
      dataSource={vtpTriggerList}
      // renderItem={triggerItem => <List.Item onClick={() => selectTriggerItem(triggerItem)}>{triggerItem.triggerName}</List.Item>}
      renderItem={triggerItem => <VTPThrowTriggerItem item={triggerItem} handleCustomItemUseChange={handleCustomItemUseChange} />}

      style={{ position: 'absolute', overflow: 'auto', top: 0, bottom: 0, left: 0, right: '20px' }}
    />
    </div>
  )
}
