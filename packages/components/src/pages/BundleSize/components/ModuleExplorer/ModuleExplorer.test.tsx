import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModuleExplorer } from './index';
import { ConfigContext, Config } from '@rsdoctor/components/config';
import { RsdoctorModuleInstance } from './types';

const mockModule1: RsdoctorModuleInstance = {
  id: 'm1',
  name: 'Module1.js',
  path: './src/Module1.js',
  layer: 'L1',
  chunks: ['c1'],
  reasons: [{ type: 'entry', moduleName: 'entry.js' }],
  dependencies: ['m2'],
  dependents: [],
};

const mockModule2: RsdoctorModuleInstance = {
  id: 'm2',
  name: 'Module2.js',
  path: './src/Module2.js',
  layer: 'L2',
  chunks: ['c1', 'c2'],
  reasons: [{ type: 'import', moduleName: 'Module1.js' }],
  dependencies: [],
  dependents: ['m1'],
};

const mockManifest = {
  modules: [mockModule1, mockModule2],
  chunks: [
    { id: 'c1', name: 'ChunkOne' },
    { id: 'c2', name: 'ChunkTwo' },
  ],
  // ... other necessary manifest data
};

const renderWithContext = (ui: React.ReactElement, providerProps?: Partial<Config>) => {
  return render(
    <ConfigContext.Provider value={{ json: mockManifest, ...providerProps } as Config}>
      {ui}
    </ConfigContext.Provider>
  );
};

describe('ModuleExplorer (Integration)', () => {
  beforeEach(() => {
    renderWithContext(<ModuleExplorer />);
  });

  it('renders ModuleList and ModuleDetails', () => {
    expect(screen.getByText('Module List')).toBeInTheDocument();
    expect(screen.getByText('Module Details')).toBeInTheDocument();
  });

  it('ModuleDetails initially shows "Select a module" message', () => {
    expect(screen.getByText('Select a module to see details.')).toBeInTheDocument();
  });

  it('updates ModuleDetails when a module is selected from ModuleList', () => {
    // Check initial state of ModuleDetails (already done above, but good for clarity)
    expect(screen.getByText('Select a module to see details.')).toBeInTheDocument();
    expect(screen.queryByText('Details for Module1.js')).not.toBeInTheDocument();

    // Find and click the first module in the list
    const module1ListItem = screen.getByText('Module1.js'); // Assuming name is displayed
    expect(module1ListItem).toBeInTheDocument();
    fireEvent.click(module1ListItem);

    // Verify ModuleDetails updates
    expect(screen.queryByText('Select a module to see details.')).not.toBeInTheDocument();
    expect(screen.getByText('Details for Module1.js')).toBeInTheDocument();

    // Check for some specific details of mockModule1 to ensure it's the selected one
    expect(screen.getByText('m1')).toBeInTheDocument(); // ID
    expect(screen.getByText('./src/Module1.js')).toBeInTheDocument(); // Path
    expect(screen.getByText('L1')).toBeInTheDocument(); // Layer
    expect(screen.getByText('c1')).toBeInTheDocument(); // Chunks
    expect(screen.getByText('entry')).toBeInTheDocument(); // Reason type
    expect(screen.getByText('Module2.js (ID: m2)')).toBeInTheDocument(); // Dependency

    // Select the second module
    const module2ListItem = screen.getByText('Module2.js');
    expect(module2ListItem).toBeInTheDocument();
    fireEvent.click(module2ListItem);

    // Verify ModuleDetails updates for Module2
    expect(screen.getByText('Details for Module2.js')).toBeInTheDocument();
    expect(screen.getByText('m2')).toBeInTheDocument(); // ID
    expect(screen.getByText('L2')).toBeInTheDocument(); // Layer
    expect(screen.getByText('c1, c2')).toBeInTheDocument(); // Chunks
    expect(screen.getByText('import')).toBeInTheDocument(); // Reason type
    expect(screen.getByText('Module1.js (ID: m1)')).toBeInTheDocument(); // Dependent
  });

  it('displays modules from context in ModuleList', () => {
    expect(screen.getByText('Module1.js')).toBeInTheDocument();
    expect(screen.getByText('Module2.js')).toBeInTheDocument();
  });
});
