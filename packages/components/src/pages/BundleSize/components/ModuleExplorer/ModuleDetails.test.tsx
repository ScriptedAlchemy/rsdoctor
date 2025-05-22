import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModuleDetails } from './ModuleDetails';
import { RsdoctorModuleInstance, ModuleReason } from './types';
import { ConfigContext, Config } from '@rsdoctor/components/config';

const mockModuleA: RsdoctorModuleInstance = {
  id: 'moduleA_id',
  name: 'ModuleA.js',
  path: './src/ModuleA.js',
  layer: 'Layer1',
  chunks: ['chunk1', 'chunk2'],
  reasons: [
    { type: 'entry', moduleName: 'entry.js', modulePath: './entry.js', loc: '1:1-1:10' },
    { type: 'import', moduleName: 'ModuleB.js', modulePath: './src/ModuleB.js', loc: '5:10-5:20' },
  ],
  dependencies: ['moduleB_id', 'moduleC_id'],
  dependents: ['entry_id'],
};

const mockModuleB: RsdoctorModuleInstance = {
  id: 'moduleB_id',
  name: 'ModuleB.js',
  path: './src/ModuleB.js',
  layer: 'Layer2',
  chunks: ['chunk1'],
  reasons: [],
  dependencies: [],
  dependents: ['moduleA_id'],
};

const mockModuleC: RsdoctorModuleInstance = {
  id: 'moduleC_id',
  name: '', // Test case for missing name
  path: './src/ModuleC.css',
  chunks: ['chunk2'],
  dependencies: [],
  dependents: ['moduleA_id'],
};

const mockEntryModule: RsdoctorModuleInstance = {
  id: 'entry_id',
  name: 'entry.js',
  path: './entry.js',
  dependencies: ['moduleA_id'],
  dependents: [],
};


const mockManifest = {
  modules: [mockModuleA, mockModuleB, mockModuleC, mockEntryModule],
  chunks: [
    { id: 'chunk1', name: 'ChunkOne' },
    { id: 'chunk2', name: 'ChunkTwo' },
  ],
  // ... other manifest data
};

const renderWithContext = (ui: React.ReactElement, providerProps?: Partial<Config>) => {
  return render(
    <ConfigContext.Provider value={{ json: mockManifest, ...providerProps } as Config}>
      {ui}
    </ConfigContext.Provider>
  );
};

describe('ModuleDetails', () => {
  it('renders "Select a module" message when module is null', () => {
    renderWithContext(<ModuleDetails module={null} />);
    expect(screen.getByText('Select a module to see details.')).toBeInTheDocument();
  });

  describe('when module is provided', () => {
    beforeEach(() => {
      renderWithContext(<ModuleDetails module={mockModuleA} />);
    });

    it('displays basic module details (Name, ID, Path, Layer)', () => {
      expect(screen.getByText('Details for ModuleA.js')).toBeInTheDocument();
      expect(screen.getByText('ModuleA.js')).toBeInTheDocument();
      expect(screen.getByText('moduleA_id')).toBeInTheDocument();
      expect(screen.getByText('./src/ModuleA.js')).toBeInTheDocument();
      expect(screen.getByText('Layer1')).toBeInTheDocument();
    });

    it('displays chunk details', () => {
      expect(screen.getByText('chunk1, chunk2')).toBeInTheDocument();
    });
    
    it('displays path as name in title if name is missing', () => {
        renderWithContext(<ModuleDetails module={mockModuleC} />);
        expect(screen.getByText('Details for ./src/ModuleC.css')).toBeInTheDocument();
        expect(screen.getByText('./src/ModuleC.css')).toBeInTheDocument(); // For the name field
    });

    it('displays reasons for inclusion', () => {
      expect(screen.getByText('Reasons for Inclusion')).toBeInTheDocument();
      expect(screen.getByText('entry')).toBeInTheDocument();
      expect(screen.getByText('entry.js')).toBeInTheDocument();
      expect(screen.getByText('./entry.js')).toBeInTheDocument();
      expect(screen.getByText('1:1-1:10')).toBeInTheDocument();
      expect(screen.getByText('import')).toBeInTheDocument();
      expect(screen.getByText('ModuleB.js')).toBeInTheDocument(); // From reason.moduleName
      expect(screen.getByText('./src/ModuleB.js')).toBeInTheDocument(); // From reason.modulePath
      expect(screen.getByText('5:10-5:20')).toBeInTheDocument();
    });

    it('displays dependencies', () => {
      expect(screen.getByText('Dependencies (Imports)')).toBeInTheDocument();
      // Checks for resolved names/paths
      expect(screen.getByText('ModuleB.js (ID: moduleB_id)')).toBeInTheDocument();
      expect(screen.getByText('./src/ModuleC.css (ID: moduleC_id)')).toBeInTheDocument();
    });

    it('displays dependents', () => {
      expect(screen.getByText('Dependents (Imported By)')).toBeInTheDocument();
      expect(screen.getByText('entry.js (ID: entry_id)')).toBeInTheDocument();
    });
  });

  describe('when optional data is missing', () => {
    beforeEach(() => {
      renderWithContext(<ModuleDetails module={mockModuleB} />);
    });

    it('displays "N/A" for missing layer', () => {
        const moduleNoLayer = { ...mockModuleB, layer: undefined };
        renderWithContext(<ModuleDetails module={moduleNoLayer} />);
        expect(screen.getByText('Layer')).toBeInTheDocument();
        expect(screen.getAllByText('N/A').length).toBeGreaterThanOrEqual(1); // Check if N/A is present for Layer
    });
    
    it('displays "N/A" for missing chunks', () => {
        const moduleNoChunks = { ...mockModuleB, chunks: undefined };
        renderWithContext(<ModuleDetails module={moduleNoChunks} />);
        expect(screen.getByText('Chunks')).toBeInTheDocument();
        expect(screen.getAllByText('N/A').length).toBeGreaterThanOrEqual(1); 
    });


    it('displays "N/A" for reasons when reasons array is empty', () => {
      expect(screen.getByText('Reasons for Inclusion')).toBeInTheDocument();
      // Check for "N/A" within the "Reasons for Inclusion" card
      const reasonsCard = screen.getByText('Reasons for Inclusion').closest('.ant-card');
      expect(reasonsCard).toHaveTextContent('N/A');
    });

    it('displays "N/A" for dependencies when dependencies array is empty', () => {
      expect(screen.getByText('Dependencies (Imports)')).toBeInTheDocument();
      const depsCard = screen.getByText('Dependencies (Imports)').closest('.ant-card');
      expect(depsCard).toHaveTextContent('N/A');
    });

    it('displays "N/A" for dependents when dependents array is empty', () => {
      expect(screen.getByText('Dependents (Imported By)')).toBeInTheDocument();
      const dependentsCard = screen.getByText('Dependents (Imported By)').closest('.ant-card');
      expect(dependentsCard).toHaveTextContent('N/A');
    });
  });

   it('displays "Unknown module" for dependencies/dependents if ID is not found in manifest', () => {
    const moduleWithUnknownDep: RsdoctorModuleInstance = {
      ...mockModuleA,
      dependencies: ['unknown_id_1'],
      dependents: ['unknown_id_2'],
    };
    renderWithContext(<ModuleDetails module={moduleWithUnknownDep} />);
    expect(screen.getByText('Unknown module (ID/Name: unknown_id_1)')).toBeInTheDocument();
    expect(screen.getByText('Unknown module (ID/Name: unknown_id_2)')).toBeInTheDocument();
  });
});
