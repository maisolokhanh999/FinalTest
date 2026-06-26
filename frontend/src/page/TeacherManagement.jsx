import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, Avatar, Modal, Form, Select, DatePicker, message } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const TeacherManagement = () => {
  // States quản lý dữ liệu
  const [teachers, setTeachers] = useState([]);
  const [positions, setPositions] = useState([]); // Đảm bảo khởi tạo ban đầu là mảng rỗng
  const [loading, setLoading] = useState(false);
  
  // States quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTeachers, setTotalTeachers] = useState(0);

  // States quản lý Modal tạo mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 1. Lấy danh sách giáo viên (có phân trang)
  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/teachers/?page=${page}&limit=${limit}`);
      // Hỗ trợ cả trường hợp API trả về mảng trực tiếp hoặc bọc trong object { data, total }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        setTeachers(response.data.data || []);
        setTotalTeachers(response.data.total || 0);
      } else {
        setTeachers(Array.isArray(response.data) ? response.data : []);
        setTotalTeachers(Array.isArray(response.data) ? response.data.length : 0);
      }
    } catch (error) {
      message.error('Không thể tải danh sách giáo viên');
    } finally {
      setLoading(false);
    }
  };

  // 2. Lấy danh sách vị trí công tác (Đã sửa lỗi Uncaught TypeError)
  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/teacherpositions/');
      
      // Kiểm tra cấu trúc dữ liệu trả về từ API để set state cho đúng
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Trường hợp API trả về dạng { data: [...] }
        setPositions(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        // Trường hợp API trả về mảng thuần [...]
        setPositions(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Lỗi API Positions:", error);
      message.error('Không thể tải danh sách vị trí công tác');
    }
  };

  useEffect(() => {
    fetchTeachers(currentPage, pageSize);
    fetchPositions();
  }, [currentPage, pageSize]);

  // Xử lý khi bấm chuyển trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Xử lý submit form tạo giáo viên mới
  const handleCreateTeacher = async (values) => {
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };
      
      await axios.post('/api/teachers/', payload);
      message.success('Tạo thông tin giáo viên thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchTeachers(currentPage, pageSize);
    } catch (error) {
      message.error('Lỗi khi tạo giáo viên mới');
    }
  };

  // Cấu hình các cột của Bảng
  const columns = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: '_id',
      render: (text) => text?.substring(0, 6).toUpperCase() || 'N/A',
    },
    {
      title: 'Giáo viên',
      key: 'teacher_info',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar || "https://api.dicebear.com/7.x/miniavs/svg?seed=1"} size={40} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.phone}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Trình độ (cao nhất)',
      key: 'degree',
      render: (_, record) => (
        <div>
          <div>Bậc: {record.degree || 'Thạc sĩ'}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Chuyên ngành: {record.major || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: 'Bộ môn',
      dataIndex: 'department',
      key: 'department',
      render: (text) => text || 'N/A',
    },
    {
      title: 'TT Công tác',
      dataIndex: 'position',
      key: 'position',
      render: (pos) => (typeof pos === 'object' ? pos?.name : pos) || 'Giáo viên bộ môn',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đang công tác' || !status ? 'green' : 'red'}>
          {status || 'Đang công tác'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Button type="text" icon={<EyeOutlined />}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
      {/* Tiêu đề & Thanh công cụ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Input
          placeholder="Tìm kiếm thông tin..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
        >
          Tạo mới giáo viên
        </Button>
      </div>

      {/* Bảng danh sách */}
      <Table
        columns={columns}
        dataSource={teachers}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalTeachers,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
        }}
        onChange={handleTableChange}
      />

      {/* Modal Form Tạo mới giáo viên */}
      <Modal
        title="Tạo thông tin giáo viên"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTeacher}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
              <Input placeholder="Ví dụ: Nguyễn Văn A" />
            </Form.Item>
            
            <Form.Item name="dob" label="Ngày sinh">
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
            </Form.Item>

            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
              <Input placeholder="example@school.edu.vn" />
            </Form.Item>

            <Form.Item name="identityCard" label="Số CCCD">
              <Input placeholder="Nhập số CCCD" />
            </Form.Item>

            <Form.Item name="position" label="Vị trí công tác">
              <Select placeholder="Chọn vị trí công tác">
                {/* Sử dụng Array.isArray phòng thủ chắc chắn không lo crash trang */}
                {Array.isArray(positions) && positions.map(pos => (
                  <Select.Option key={pos._id} value={pos._id}>
                    {pos.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="address" label="Địa chỉ" style={{ gridColumn: 'span 2' }}>
              <Input placeholder="Nhập địa chỉ cư trú" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherManagement;