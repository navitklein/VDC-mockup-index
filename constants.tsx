
import { Mockup, MockupStatus } from './types';

export const INITIAL_MOCKUPS: Mockup[] = [
  {
    id: '1',
    title: 'VDC Global Dashboard',
    description: 'The main command center for visualizing spatial data and real-time sensor updates.',
    status: MockupStatus.IN_DEVELOPMENT,
    url: 'https://vdc-dashboard-mock.app',
    azureUrl: 'https://dev.azure.com/vdc/project/_workitems/edit/101',
    docsUrl: 'https://docs.vdc.internal/dashboard',
    lastUpdated: '2024-03-20',
    author: 'Sarah Chen',
    version: '2.4.0',
    tags: ['Dashboard', 'Visualization', 'Spatial']
  },
  {
    id: '2',
    title: 'Spatial Explorer v2',
    description: 'Revamped 3D explorer with better occlusion handling and point cloud rendering.',
    status: MockupStatus.IN_REVIEW,
    url: 'https://vdc-spatial-v2.app',
    azureUrl: 'https://dev.azure.com/vdc/project/_workitems/edit/105',
    docsUrl: 'https://docs.vdc.internal/spatial-v2',
    lastUpdated: '2024-03-22',
    author: 'Marco Rossi',
    version: '1.2.0-beta',
    tags: ['3D', 'Review', 'Graphics']
  },
  {
    id: '3',
    title: 'Asset Management Portal',
    description: 'Interface for managing digital twins and physical assets within the VDC ecosystem.',
    status: MockupStatus.IN_DESIGN,
    url: 'https://vdc-assets.app',
    lastUpdated: '2024-03-24',
    author: 'Emily White',
    version: '0.8.0-alpha',
    tags: ['Assets', 'Management', 'CRUD']
  }
];

export const STATUS_COLORS: Record<MockupStatus, string> = {
  [MockupStatus.IN_DESIGN]: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
  [MockupStatus.IN_REVIEW]: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  [MockupStatus.IN_DEVELOPMENT]: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
  [MockupStatus.ARCHIVED]: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
};
