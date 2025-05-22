import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModuleList } from './ModuleList';
import { RsdoctorModuleInstance } from './types';

const mockModules: RsdoctorModuleInstance[] = [
  { id: '1', name: 'ModuleA.js', path: './src/ModuleA.js' },
  { id: '2', name: 'ModuleB.js', path: './src/ModuleB.js' },
  { id: '3', name: 'moduleC.css', path: './src/moduleC.css' }, // Test with name fallback to path
];

describe('ModuleList', () => {
  it('renders a list of modules correctly', () => {
    const mockOnSelectModule = jest.fn();
    render(<ModuleList modules={mockModules} onModuleSelect={mockOnSelectModule} />);

    expect(screen.getByText('ModuleA.js')).toBeInTheDocument();
    expect(screen.getByText('ModuleB.js')).toBeInTheDocument();
    expect(screen.getByText('moduleC.css')).toBeInTheDocument(); // Should display path if name is not a typical module name
  });

  it('renders an empty state or message if modules prop is an empty array', () => {
    const mockOnSelectModule = jest.fn();
    render(<ModuleList modules={[]} onModuleSelect={mockOnSelectModule} />);
    // Ant Design's List renders a 'No Data' message by default.
    // We can check for the presence of this message or a custom one if implemented.
    // For now, let's check if any of the mock module names are NOT present.
    expect(screen.queryByText('ModuleA.js')).not.toBeInTheDocument();
    expect(screen.getByText('No Data')).toBeInTheDocument(); // Default AntD message
  });

  it('calls onModuleSelect with the correct module data when a module is clicked', () => {
    const mockOnSelectModule = jest.fn();
    render(<ModuleList modules={mockModules} onModuleSelect={mockOnSelectModule} />);

    fireEvent.click(screen.getByText('ModuleB.js'));
    expect(mockOnSelectModule).toHaveBeenCalledTimes(1);
    expect(mockOnSelectModule).toHaveBeenCalledWith(mockModules[1]);
  });

  it('displays module path if name is not available', () => {
    const mockOnSelectModule = jest.fn();
    const modulesWithNameMissing: RsdoctorModuleInstance[] = [
      { id: '4', name: '', path: './src/ModuleD.js' },
    ];
    render(<ModuleList modules={modulesWithNameMissing} onModuleSelect={mockOnSelectModule} />);
    expect(screen.getByText('./src/ModuleD.js')).toBeInTheDocument();
  });
});
