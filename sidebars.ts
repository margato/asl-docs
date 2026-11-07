import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Get started',
      collapsible: false,
      items: [
        'intro',
        'cli',
        'vscode-extension',
      ],
    },
    {
      type: 'category',
      label: 'Use cases',
      collapsible: true,
      collapsed: true,
      items: [
        'use-cases/designing',
        'use-cases/developing',
        'use-cases/pci-scope',
        'use-cases/interpreting',
        'use-cases/diagram-editor',
      ],
    },
    {
      type: 'category',
      label: 'SDKs',
      collapsible: false,
      items: ['javascript'],
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
      collapsible: true,
      collapsed: true,
      items: ['why', 'aac-vs-diagram-as-code', 'architecture', 'faq'],
    },
  ],
};

export default sidebars;
