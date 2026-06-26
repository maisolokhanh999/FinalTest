import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { positionApi } from '../configs/api';

const PositionManagement = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const res = await positionApi.getList();
      if (res.data?.success) setPositions(res.data.data);
    } catch (err) {
      message.error('Lỗi tải dữ liệu vị trí công tác');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const res = await positionApi.create(values);
      if (res.data?.success) {
        message.success('Tạo vị trí công tác thành công!');
        setIsModalOpen(false);
        form.resetFields();
        fetchPositions();
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Mã vị trí đã tồn tại hoặc có lỗi xảy ra');
    }
  };

  const columns = [
    { title: 'Mã vị trí (Unique Code)', dataIndex: 'code', key: 'code' },
    { title: 'Tên vị trí', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả cụ thể', dataIndex: 'des', key: 'des' },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => (
        <Tag color={active !== false ? 'green' : 'red'}>
          {active !== false ? 'Hoạt động' : 'Khóa'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }} justify="space-between" width="100%">
        <h2>Quản lý Vị trí Công tác</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm Vị trí
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={positions}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={false}
      />

      <Modal
        title="Thêm vị trí công tác mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="code" label="Mã vị trí (Duy nhất)" rules={[{ required: true, message: 'Vui lòng nhập mã vị trí' }]}>
            <Input placeholder="Ví dụ: GVC, GV, CNK..." />
          </Form.Item>
          <Form.Item name="name" label="Tên vị trí" rules={[{ required: true, message: 'Vui lòng nhập tên vị trí' }]}>
            <Input placeholder="Ví dụ: Giảng viên chính" />
          </Form.Item>
          <Form.Item name="des" label="Mô tả công việc">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PositionManagement;
