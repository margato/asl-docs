import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Get started',
      collapsible: false,
      items: ['intro', 'cli', 'vscode-extension'],
    },
    {
      type: 'category',
      label: 'Extend it',
      collapsible: false,
      items: ['custom-policies', 'custom-schemas'],
    },
    {
      type: 'category',
      label: 'Learn more about it',
      collapsible: false,
      items: ['why', 'aac-vs-diagram-as-code', 'architecture'],
    },
  ],
};

export default sidebars;
