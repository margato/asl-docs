import prismTheme from './src/theme/prismTheme';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ASL - Architecture Specification Language',
  tagline: 'Architecture as code, validated by policy.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // Published at the custom domain below (GitHub Pages). The site lives at the
  // root of the subdomain, so baseUrl stays '/' both locally and in production.
  url: process.env.SITE_URL ?? 'https://asl.architectureascode.dev',
  baseUrl: process.env.BASE_URL ?? '/',
  organizationName: 'margato',
  projectName: 'asl-docs',
  trailingSlash: false,

  // Set by scripts/dev.cjs: one dev server per locale, so the language switch
  // has to link across ports.
  customFields: {
    devPorts: process.env.ASL_DEV_PORTS ? JSON.parse(process.env.ASL_DEV_PORTS) : undefined,
  },

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    localeConfigs: {
      en: {label: 'English', htmlLang: 'en'},
      pt: {label: 'Português', htmlLang: 'pt-BR'},
    },
  },

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Unbounded:wght@700&display=swap',
  ],

  markdown: {mermaid: true},
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en', 'pt'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/margato/asl-docs/tree/main/',
          editLocalizedFiles: true,
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/docs.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {alt: 'ASL', src: 'img/logo.svg'},
      items: [
        {
          type: 'html',
          position: 'left',
          className: 'navbar-expansion',
          value: '<span>Architecture Specification Language</span>',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'right',
          label: 'Docs',
        },
        {type: 'search', position: 'right'},
        {type: 'custom-githubLink', position: 'left'},
        {type: 'custom-localeSwitch', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'ASL',
          items: [
            {
              html: '<span class="footer-brand">Architecture Specification Language</span>',
            },
          ],
        },
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Why architecture as code', to: '/docs/why'},
            {label: 'CLI', to: '/docs/cli'},
            {label: 'Custom policies', to: '/docs/custom-policies'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'How ASL works', to: '/docs/architecture'},
            {label: 'GitHub', href: 'https://github.com/margato/asl'},
            {label: 'CEL', href: 'https://cel.dev'},
          ],
        },
      ],
      copyright: `ASL · Architecture Specification Language · © ${new Date().getFullYear()}`,
    },
    mermaid: {
      theme: {light: 'dark', dark: 'dark'},
      options: {
        fontFamily: 'Instrument Sans, system-ui, sans-serif',
        flowchart: {curve: 'basis', htmlLabels: true},
      },
    },
    prism: {
      theme: prismTheme,
      darkTheme: prismTheme,
      additionalLanguages: ['bash', 'yaml', 'go', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
