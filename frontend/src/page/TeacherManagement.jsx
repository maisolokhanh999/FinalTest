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
  Descriptions,
  Divider
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

  // STATES QUẢN LÝ XEM CHI TIẾT GIÁO VIÊN
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // 1. Lấy danh sách giáo viên (Phân trang theo cấu trúc API mới)
  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/teachers/?page=${page}&limit=${limit}`);
      
      if (response.data && response.data.success) {
        setTeachers(response.data.data || []);
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

  // 3. Xử lý submit form tạo giáo viên mới
  const handleCreateTeacher = async (values) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phone,    
        identity: values.identityCard, 
        address: values.address,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null, 
        
        teacherPositions: values.position ? [values.position] : [],
        degrees: [] 
      };
      
      const response = await axios.post('/api/teachers/', payload);
      
      if (response.data.success) {
        message.success('Tạo thông tin giáo viên thành công!');
        setIsModalOpen(false);
        form.resetFields();
        fetchTeachers(currentPage, pageSize); 
      }
    } catch (error) {
      console.error("Lỗi tạo giáo viên:", error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi tạo giáo viên mới';
      message.error(errorMsg);
    }
  };

  // Hàm kích hoạt hiển thị chi tiết giáo viên
  const handleViewDetails = (record) => {
    setSelectedTeacher(record);
    setIsPreviewModalOpen(true);
  };

  // Cấu hình các cột của Bảng
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
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetails(record)}
        >
          Chi tiết
        </Button>
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

      {/* 1. Modal Form Tạo mới giáo viên */}
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

      {/* 2. MODAL XEM CHI TIẾT THÔNG TIN GIÁO VIÊN */}
      <Modal
        title="Thông tin chi tiết giáo viên"
        open={isPreviewModalOpen}
        onCancel={() => {
          setIsPreviewModalOpen(false);
          setSelectedTeacher(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsPreviewModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={750}
      >
        {selectedTeacher && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <Avatar src={selectedTeacher.avatar || "https://api.dicebear.com/7.x/miniavs/svg?seed=1"} size={70} />
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>{selectedTeacher.name}</h3>
                <p style={{ color: '#8c8c8c', margin: '4px 0 0 0' }}>Mã giáo viên: <strong>{selectedTeacher.code}</strong></p>
              </div>
            </div>

            <Divider orientation="left" style={{ margin: '12px 0' }}>Thông tin cá nhân</Divider>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Email" span={2}>{selectedTeacher.email || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedTeacher.phone || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedTeacher.status === 'Đang công tác' ? 'green' : 'red'}>
                  {selectedTeacher.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{selectedTeacher.address || 'N/A'}</Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" style={{ margin: '24px 0 12px 0' }}>Công tác & Học vị</Divider>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Vị trí hiện tại" span={2}>
                {selectedTeacher.position || 'Chưa bổ nhiệm'}
              </Descriptions.Item>
              <Descriptions.Item label="Học vị cao nhất">
                {selectedTeacher.degree || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên ngành">
                {selectedTeacher.major || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            {/* Hiển thị danh sách bằng cấp đầy đủ nếu có */}
            {selectedTeacher.degrees && selectedTeacher.degrees.length > 0 && (
              <>
                <Divider orientation="left" style={{ margin: '24px 0 12px 0' }}>Danh sách bằng cấp chi tiết</Divider>
                <Table 
                  dataSource={selectedTeacher.degrees} 
                  rowKey={(record, index) => index}
                  pagination={false}
                  size="small"
                  columns={[
                    { title: 'Loại bằng', dataIndex: 'type', key: 'type' },
                    { title: 'Trường đào tạo', dataIndex: 'school', key: 'school' },
                    { title: 'Chuyên ngành', dataIndex: 'major', key: 'major' },
                    { title: 'Năm tốt nghiệp', dataIndex: 'year', key: 'year' },
                    { 
                      title: 'Tốt nghiệp', 
                      dataIndex: 'isGraduated', 
                      key: 'isGraduated',
                      render: (isGrad) => isGrad ? <Tag color="blue">Đã tốt nghiệp</Tag> : <Tag color="warning">Chưa tốt nghiệp</Tag>
                    },
                  ]}
                />
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherManagement;