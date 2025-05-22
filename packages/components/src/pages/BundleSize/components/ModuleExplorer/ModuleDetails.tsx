import React, { useContext } from 'react';
import { Card, Descriptions, List, Typography } from 'antd';
import { RsdoctorModuleInstance, ModuleReason } from './types'; // Added ModuleReason
import { ConfigContext } from '@rsdoctor/components/config';

const { Text } = Typography;

interface ModuleDetailsProps {
  module: RsdoctorModuleInstance | null;
}

export const ModuleDetails: React.FC<ModuleDetailsProps> = ({ module }) => {
  const config = useContext(ConfigContext);
  const { json: manifest } = config;
  const allModules: RsdoctorModuleInstance[] = manifest?.modules || [];

  if (!module) {
    return <p>Select a module to see details.</p>;
  }

  return (
    <Card title={`Details for ${module.name || module.path}`}>
      <Descriptions bordered column={1} size="small" labelStyle={{ width: '150px', fontWeight: 'bold' }}>
        <Descriptions.Item label="Name">{module.name || module.path}</Descriptions.Item>
        <Descriptions.Item label="ID">{module.id}</Descriptions.Item>
        <Descriptions.Item label="Path">{module.path}</Descriptions.Item>
        <Descriptions.Item label="Layer">{module.layer || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Chunks">
          {module.chunks && module.chunks.length > 0
            ? module.chunks.join(', ')
            : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
      <Card
        type="inner"
        title="Dependencies (Imports)"
        style={{ marginTop: 16 }}
      >
        {module.dependencies && module.dependencies.length > 0 ? (
          <List
            dataSource={module.dependencies}
            renderItem={(depId) => {
              const depModule = allModules.find(m => m.id === depId || m.name === depId);
              return (
                <List.Item>
                  {depModule ? `${depModule.name || depModule.path} (ID: ${depModule.id})` : `Unknown module (ID/Name: ${depId})`}
                </List.Item>
              );
            }}
            size="small"
          />
        ) : (
          <p>N/A</p>
        )}
      </Card>
      <Card
        type="inner"
        title="Dependents (Imported By)"
        style={{ marginTop: 16 }}
      >
        {module.dependents && module.dependents.length > 0 ? (
          <List
            dataSource={module.dependents}
            renderItem={(depId) => {
              const depModule = allModules.find(m => m.id === depId || m.name === depId);
              return (
                <List.Item>
                  {depModule ? `${depModule.name || depModule.path} (ID: ${depModule.id})` : `Unknown module (ID/Name: ${depId})`}
                </List.Item>
              );
            }}
            size="small"
          />
        ) : (
          <p>N/A</p>
        )}
      </Card>
      <Card type="inner" title="Reasons for Inclusion" style={{ marginTop: 16 }}>
        {module.reasons && module.reasons.length > 0 ? (
          <List
            dataSource={module.reasons}
            renderItem={(reason: ModuleReason) => ( // Explicitly type reason
              <List.Item>
                <Descriptions column={1} size="small" labelStyle={{ fontWeight: 'bold' }}>
                  <Descriptions.Item label="Type">
                    <Text strong>{reason.type}</Text>
                  </Descriptions.Item>
                  {reason.moduleName && (
                    <Descriptions.Item label="Module Name">{reason.moduleName}</Descriptions.Item>
                  )}
                  {reason.modulePath && (
                    <Descriptions.Item label="Module Path">{reason.modulePath}</Descriptions.Item>
                  )}
                  {reason.loc && <Descriptions.Item label="Location">{reason.loc}</Descriptions.Item>}
                </Descriptions>
              </List.Item>
            )}
            size="small"
          />
        ) : (
          <p>N/A</p>
        )}
      </Card>
    </Card>
  );
};
