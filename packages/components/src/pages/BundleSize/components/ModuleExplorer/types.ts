// Placeholder for ModuleExplorer types

export interface ModuleReason {
  type: string;
  moduleName?: string;
  modulePath?: string;
  loc?: string;
  // Add other relevant properties from manifest.modules[].reasons
}

export interface RsdoctorModuleInstance {
  id: string | number;
  name: string;
  path: string;
  layer?: string; // Optional layer
  chunks?: Array<string | number>; // Array of chunk IDs/names
  reasons?: ModuleReason[];
  dependencies?: Array<string | number>; // Array of module IDs
  dependents?: Array<string | number>; // Array of module IDs
  // Add other relevant properties as you discover them from the manifest
}

export interface RsdoctorChunk {
  id: string | number;
  name?: string;
  // other properties
}

// Keep existing types if they are still relevant or remove if replaced
export interface Module {
  id: string;
  name: string;
  // Add more properties as needed, e.g., size, path, etc.
}

export interface Chunk {
  id: string;
  name: string;
  // Add more properties as needed
}

export interface Layer {
  id: string;
  name: string;
  // Add more properties as needed
}
