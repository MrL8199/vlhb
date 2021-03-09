import React from 'react';
import { Table, Modal, Avatar, TableProps } from 'antd';
import { DropOption } from 'components/ui';
import Link from 'next/link';
import styles from './List.module.css';
import { Publisher } from 'types';

const { confirm } = Modal;

interface Props extends TableProps<Publisher> {
  onDeleteItem(key: string): void;
  onEditItem(record: Publisher): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: Publisher, e: { key: string; name: string }) => {
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Bạn có chắc xóa bản ghi này?',
        cancelText: 'Hủy',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 72,
      fixed: 'left',
      render: (text: string) => <Avatar style={{ marginLeft: 8 }} src={text} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Publisher) => <Link href={`user/${record.id}`}>{text}</Link>,
    },
    {
      title: 'NickName',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Gender',
      dataIndex: 'isMale',
      key: 'isMale',
      render: (text: string) => <span>{text ? 'Male' : 'Female'}</span>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'CreateTime',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: 'Hoạt động',
      key: 'operation',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <DropOption
            onMenuClick={(e) => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Cập nhật' },
              { key: '2', name: 'Xóa' },
            ]}
          />
        );
      },
    },
  ];

  return (
    <Table
      {...tableProps}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => `Tổng ${total} mục`,
      }}
      className={styles.table}
      bordered
      scroll={{ x: 1200 }}
      columns={columns}
      simple
      rowKey={(record) => record.id}
    />
  );
};

export default List;
