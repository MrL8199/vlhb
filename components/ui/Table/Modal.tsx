import React from 'react';
import { Form, Input, Modal, ModalProps } from 'antd';
import { Publisher } from 'types';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

interface Props extends ModalProps {
  type: string;
  item: Publisher;
  onOk: (...args: any[]) => any;
}

const UserModal: React.FC<Props> = ({ item = {}, onOk, ...modalProps }) => {
  const formRef = React.createRef();

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const data = {
          ...values,
          key: item.key,
        };
        data.address = data.address.join(' ');
        onOk(data);
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });

    return (
      <Modal {...modalProps} onOk={handleOk}>
        <Form ref={formRef} name="control-ref" initialValues={{ ...item }} layout="horizontal">
          <FormItem
            name="name"
            rules={[{ required: true }]}
            label={`Name`}
            hasFeedback
            {...formItemLayout}
          >
            <Input />
          </FormItem>
          <FormItem
            name="nickName"
            rules={[{ required: true }]}
            label={`NickName`}
            hasFeedback
            {...formItemLayout}
          >
            <Input />
          </FormItem>
        </Form>
      </Modal>
    );
  };
};

export default UserModal;
