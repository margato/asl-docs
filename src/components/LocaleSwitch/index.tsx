import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

const SHORT: Record<string, string> = {en: 'EN', pt: 'PT'};

// Segmented EN | PT control that keeps the current page when switching.
// `mobile` is set by the navbar when it renders inside the side menu. The switch is
// already pinned to the top bar on phones, so it is not repeated in the menu.
export default function LocaleSwitch({mobile}: {mobile?: boolean}): ReactNode {
  if (mobile) return null;
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternate = useAlternatePageUtils();
  const {search, hash} = useLocation();

  const control = (
    <div className={styles.switch} role="group" aria-label="Language">
      {locales.map((locale) => {
        const active = locale === currentLocale;
        const to = `pathname://${alternate.createUrl({locale, fullyQualified: false})}${search}${hash}`;
        return (
          <Link
            key={locale}
            to={to}
            target="_self"
            autoAddBaseUrl={false}
            lang={localeConfigs[locale].htmlLang}
            aria-label={localeConfigs[locale].label}
            aria-current={active ? 'true' : undefined}
            className={clsx(styles.option, active && styles.active)}>
            {SHORT[locale] ?? locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );

  return control;
}
