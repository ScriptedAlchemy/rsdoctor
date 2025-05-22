import { Col, Row, Tabs } from 'antd';
import React from 'react';

import { Size } from '../../constants';
import { WebpackModulesOverall } from './components';
import { ModuleExplorer } from './components/ModuleExplorer';

const { TabPane } = Tabs;

export const Page: React.FC = () => {
  return (
    <Row>
      <Col span={24} style={{ marginBottom: Size.BasePadding }}>
        <Tabs defaultActiveKey="overall">
          <TabPane tab="Overall" key="overall">
            <WebpackModulesOverall />
          </TabPane>
          <TabPane tab="Module Explorer" key="module-explorer">
            <ModuleExplorer />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export * from './constants';
