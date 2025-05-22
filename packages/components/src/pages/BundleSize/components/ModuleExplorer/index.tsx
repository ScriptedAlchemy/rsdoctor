import React, { useContext, useState } from 'react';
import { Row, Col } from 'antd';
import { ModuleList } from './ModuleList';
import { ModuleDetails } from './ModuleDetails';
import { ConfigContext } from '@rsdoctor/components/config';
import { RsdoctorModuleInstance } from './types';

export const ModuleExplorer: React.FC = () => {
  const config = useContext(ConfigContext);
  const { json: manifest } = config;
  const modules: RsdoctorModuleInstance[] = manifest?.modules || [];
  const [selectedModule, setSelectedModule] = useState<RsdoctorModuleInstance | null>(null);

  const handleModuleSelect = (module: RsdoctorModuleInstance) => {
    setSelectedModule(module);
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <h2>Module List</h2>
        <ModuleList modules={modules} onModuleSelect={handleModuleSelect} />
      </Col>
      <Col span={16}>
        <h2>Module Details</h2>
        {selectedModule ? (
          <ModuleDetails module={selectedModule} />
        ) : (
          <p>Select a module to see details.</p>
        )}
      </Col>
    </Row>
  );
};
