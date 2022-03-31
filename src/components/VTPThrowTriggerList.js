import React from 'react';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { vtpTriggerListState, selectedVtpTriggerState, selectingVtpTriggerState } from '../store/vtp';

import { Switch, Table, Row, Col, Space, Button, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function VTPThrowTriggerList({ handleCustomItemUseChange }) {

  const [vtpTriggerList, setVtpTriggerList] = useRecoilState(vtpTriggerListState);

  const setSelectedVtpTrigger = useSetRecoilState(selectedVtpTriggerState);
  const setSelectingVtpTrigger = useSetRecoilState(selectingVtpTriggerState);

  const handleCustomItemUseAtChange = (trigger, value) => {
    const newTriggerItemList = vtpTriggerList.filter(oldTrigger => oldTrigger.id !== trigger.id);
    setVtpTriggerList([...newTriggerItemList, {...trigger, useAt: value }]);
  }

  const loadVTPTriggerItem = (item) => {
    handleCustomItemUseChange(item.isCustomItem);

    setSelectedVtpTrigger(item);
    setSelectingVtpTrigger(true);
  }

  const delVTPTriggerItem = (item) => {
    const newTriggerItemList = vtpTriggerList.filter(trigger => trigger.triggerName !== item.triggerName);

    setVtpTriggerList(newTriggerItemList);
  }

  const columns = [
    {
      title: '이름',
      dataIndex: 'triggerName',
      key: 'triggerName',
    },
    {
      title: '메소드',
      dataIndex: 'method',
      key: 'method',
      render: (text) => {
        let methodName = '던지기';
        if(text === 'VTP_Drop') {
          methodName = '떨구기'
        }
        return (
          <span>{methodName}</span>
        )
      }
    },
    {
      title: '후원금액',
      dataIndex: 'donationAmount',
      key: 'donationAmount',
    },
    {
      title: '플랫폼',
      dataIndex: 'platform',
      render: (platformList) => {
        return (
          <div>
          {
            platformList.map(platform => <Tag color={platform === '투네이션' ? '#29b5f6' : '#801fe8'} key={platform}>{platform}</Tag>)
          }
          </div>
        )

      }
    },
    {
      title: '개수',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '데미지',
      dataIndex: 'damage',
      key: 'damage',
    },
    {
      title: '사용여부',
      dataIndex: 'useAt',
      key: 'useAt',
      render: (text, item) => (
        <Switch checkedChildren="Y" unCheckedChildren="N" checked={item.useAt} onChange={(value) => { handleCustomItemUseAtChange(item, value); }} />
      )
    },
    {
      title: '',
      key: 'action',
      render: (text, item) => (
        <Row wrap={false} align='middle' justify='center' style={{ width: '100%'}}>
          <Col flex='72px'>
            <Space>
              <Button shape='circle' onClick={() => { loadVTPTriggerItem(item); } }><EditOutlined style={{ fontSize: '18px' }} /></Button>
              <Button shape='circle' onClick={() => { delVTPTriggerItem(item); }}><DeleteOutlined style={{ fontSize: '18px' }} /></Button>
            </Space>
          </Col>
        </Row>
      )
    }
  ];

  return (
    <Table
      dataSource={vtpTriggerList}
      columns={columns}
      rowKey={(record) => (record.triggerName)}
      pagination={false}
      style={{ position: 'absolute', overflow: 'auto', top: 0, bottom: 0, left: 0, right: '20px' }}
      scroll={{ y: 320 }}
    />
  )
}
