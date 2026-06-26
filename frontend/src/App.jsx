import React from 'react';
import { App as AntdApp, Tabs } from 'antd';
import TeacherManagement from './page/TeacherManagement';
import PositionManagement from './page/PositionManagement';

const MainApp = () => {
  const items = [
    { key: '1', label: 'Quản lý Giáo viên', children: <TeacherManagement /> },
    { key: '2', label: 'Vị trí công tác', children: <PositionManagement /> },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 0' }}>
      <Tabs defaultActiveKey="1" items={items} centered />
    </div>
  );
};

// Bọc ngoài cùng bằng <AntdApp> để giải quyết triệt để lỗi Hàm tĩnh (static functions) trong Antd v5
const App = () => (
  <AntdApp>
    <MainApp />
  </AntdApp>
);

export default App;