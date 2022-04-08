import React from 'react';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { vtpTriggerListState, selectedVtpTriggerState, selectingVtpTriggerState } from '../store/vtp';

import { Switch, Table, Row, Col, Space, Button, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function VTPThrowTriggerList({ handleCustomItemUseChange, openVtpTriggerModal }) {

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

    openVtpTriggerModal();
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
      ellipsis: {
        showTitle: false,
      },
      render: name => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: '메소드',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
      width: 100,
      render: (text) => {
        let methodName = '던지기';
        if(text === 'VTP_Drop') {
          methodName = '떨구기'
        }
        return methodName
      }
    },
    {
      title: '후원금액',
      dataIndex: 'donationAmount',
      key: 'donationAmount',
      width: 100,
      align: 'right',
      className: 'donation-header-cell',
      render: amount => {
        return amount.toLocaleString('ko-KR')
      }
    },
    {
      title: '플랫폼',
      dataIndex: 'platform',
      className: 'donation-header-cell-min',
      render: (platformList) => {
        return (
          <>
          {
            platformList.map(platform => <Tag color={platform === '투네이션' ? '#29b5f6' : '#801fe8'} key={platform}>{platform}</Tag>)
          }
          </>
        )

      }
    },
    {
      title: '개수',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      width: 50
    },
    {
      title: '아이템',
      render: (text, item) => {
        if(item.isCustomItem) {
          return (
            <>
              <Tag color='#fa8c16'>커스텀</Tag>{item.customItemName}
            </>
          )
        } else {
          return (
            <>
              <Tag color='#bfbfbf'>기본</Tag>{item.itemName}
            </>
          )
        }
      }
    },
    {
      title: '데미지',
      dataIndex: 'damage',
      key: 'damage',
      align: 'center',
      width: 60
    },
    {
      title: '사용여부',
      dataIndex: 'useAt',
      key: 'useAt',
      align: 'center',
      width: 80,
      render: (text, item) => (
        <Switch checkedChildren="Y" unCheckedChildren="N" checked={item.useAt} onChange={(value) => { handleCustomItemUseAtChange(item, value); }} />
      )
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      width: 120,
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
      size="middle"
      scroll={{ y: 'calc(100vh - 220px)' }}  // 테이블 헤더 고정을 위한 테이블 바디 높이 고정 값 지정
    />
  )
}
