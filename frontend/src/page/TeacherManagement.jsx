import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Tag,
  Space,
  Avatar,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
} from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const TeacherManagement = () => {
  // States quản lý dữ liệu
  const [teachers, setTeachers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // States quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTeachers, setTotalTeachers] = useState(0);

  // States quản lý Modal tạo mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 1. Lấy danh sách giáo viên (Phân trang theo cấu trúc API mới)
  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/teachers/?page=${page}&limit=${limit}`);
      
      if (response.data && response.data.success) {
        setTeachers(response.data.data || []);
        // Lấy total từ object pagination của Backend
        setTotalTeachers(response.data.pagination?.total || 0);
      } else {
        setTeachers([]);
        setTotalTeachers(0);
      }
    } catch (error) {
      message.error('Không thể tải danh sách giáo viên');
      console.error("Lỗi API Teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Lấy danh sách vị trí công tác để đổ vào Select Option
  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/teacherpositions/');
      if (response.data && response.data.success) {
        setPositions(response.data.data || []);
      } else {
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

  // Xử lý khi bấm chuyển trang hoặc thay đổi size
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 3. Xử lý submit form tạo giáo viên mới (Đã sửa đổi map trường dữ liệu)
  const handleCreateTeacher = async (values) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phone,    // Khớp với Backend đón nhận
        identity: values.identityCard, // Khớp với Backend đón nhận
        address: values.address,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null, // Gửi kèm startDate bắt buộc
        
        // teacherPositions yêu cầu mảng các ObjectId
        teacherPositions: values.position ? [values.position] : [],
        degrees: [] // Gửi mảng rỗng nếu chưa làm form bằng cấp sâu
      };
      
      const response = await axios.post('/api/teachers/', payload);
      
      if (response.data.success) {
        message.success('Tạo thông tin giáo viên thành công!');
        setIsModalOpen(false);
        form.resetFields();
        fetchTeachers(currentPage, pageSize); // Reload lại danh sách
      }
    } catch (error) {
      console.error("Lỗi tạo giáo viên:", error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi tạo giáo viên mới';
      message.error(errorMsg);
    }
  };

  // Cấu hình các cột của Bảng (Khớp hoàn toàn dữ liệu map từ hàm getTeachers)
  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'code',
      key: 'code',
      render: (text) => text || 'N/A',
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
          <div>Bậc: {record.degree || 'Chưa có'}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Chuyên ngành: {record.major || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: 'Vị trí công tác',
      dataIndex: 'position',
      key: 'position',
      render: (text) => text || 'Chưa có',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đang công tác' ? 'green' : 'red'}>
          {status}
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
                {Array.isArray(positions) && positions.map(pos => (
                  <Select.Option key={pos._id} value={pos._id}>
                    {pos.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Ô CHỌN NGÀY BẮT ĐẦU CÔNG TÁC (ĐÃ SỬA LỖI VALIDATE BẮT BUỘC) */}
            <Form.Item 
              name="startDate" 
              label="Ngày bắt đầu công tác" 
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu công tác!' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày bắt đầu công tác" />
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