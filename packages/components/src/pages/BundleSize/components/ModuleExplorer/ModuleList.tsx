import React from 'react';
import { List } from 'antd';
import { RsdoctorModuleInstance } from './types';

interface ModuleListProps {
  modules: RsdoctorModuleInstance[];
  onModuleSelect: (module: RsdoctorModuleInstance) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({ modules, onModuleSelect }) => {
  return (
    <List
      bordered
      dataSource={modules}
      renderItem={(module) => (
        <List.Item onClick={() => onModuleSelect(module)} style={{ cursor: 'pointer' }}>
          {module.name || module.path}
        </List.Item>
      )}
    />
  );
};
