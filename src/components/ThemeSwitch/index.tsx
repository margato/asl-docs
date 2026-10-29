import type {ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {useColorMode} from '@docusaurus/theme-common';
import {LuMoon, LuSun} from 'react-icons/lu';
import styles from './styles.module.css';

// Segmented light | dark control. Same shape as the language switch, icons only.
// Like it, it is pinned to the top bar on phones and not repeated in the side menu.
export default function ThemeSwitch({mobile}: {mobile?: boolean}): ReactNode {
  if (mobile) return null;
  const {colorMode, setColorMode} = useColorMode();

  const options = [
    {
      mode: 'light' as const,
      Icon: LuSun,
      label: translate({id: 'asl.theme.light', message: 'Light theme'}),
    },
    {
      mode: 'dark' as const,
      Icon: LuMoon,
      label: translate({id: 'asl.theme.dark', message: 'Dark theme'}),
    },
  ];

  return (
    <div
      className={styles.switch}
      role="group"
      aria-label={translate({id: 'asl.theme.label', message: 'Theme'})}>
      {options.map(({mode, Icon, label}) => {
        const active = colorMode === mode;
        return (
          <button
            key={mode}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onClick={() => setColorMode(mode)}
            className={clsx(styles.option, active && styles.active)}>
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
