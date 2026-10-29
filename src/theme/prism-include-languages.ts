import siteConfig from '@generated/docusaurus.config';
import type * as PrismNamespace from 'prismjs';

export default function prismIncludeLanguages(
  PrismObject: typeof PrismNamespace,
): void {
  const {
    themeConfig: {prism},
  } = siteConfig;
  const {additionalLanguages} = prism as {additionalLanguages: string[]};

  const PrismBefore = globalThis.Prism;
  globalThis.Prism = PrismObject;
  additionalLanguages.forEach((lang) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`prismjs/components/prism-${lang}`);
  });

  // yaml: highlight unquoted scalar values (Prism only tokenizes quoted ones)
  PrismObject.languages.insertBefore('yaml', 'punctuation', {
    'attr-value': {
      pattern:
        /(:[ \t]+)(?!['"|>&*!{\[#])[^#\n]*?(?=[ \t]*(?:#.*)?$)/m,
      lookbehind: true,
    },
  });

  // asl diagnostics: rustc-style output printed by the CLI
  PrismObject.languages.asldiag = {
    'diag-error': /^(?:error)(?::.*)?$/m,
    'diag-warning': /^warning(?::.*)?$/m,
    'diag-pointer': /^\s*-->.*$/m,
    'diag-policy': /^\s*policy:.*$/m,
    'diag-ok': /^ok\b.*$/m,
    'diag-prompt': /^\$ .*$/m,
  } as never;

  delete (globalThis as {Prism?: unknown}).Prism;
  if (typeof PrismBefore !== 'undefined') {
    globalThis.Prism = PrismObject;
  }
}
