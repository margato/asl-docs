import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Link from '@docusaurus/Link';
import OriginalLink from '@theme-original/DocSidebarItem/Link';
import type {Props} from '@theme/DocSidebarItem/Link';
import {FiArrowUpRight} from 'react-icons/fi';

export default function DocSidebarItemLink(props: Props): ReactNode {
  const {item, level} = props;
  const {href, label, className: itemClassName} = item;
  if (isInternalUrl(href)) {
    return <OriginalLink {...props} />;
  }
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        itemClassName,
      )}>
      <Link
        className="menu__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{display: 'flex', alignItems: 'center', gap: '0.6em'}}>
        <span>{label}</span>
        <FiArrowUpRight aria-hidden="true" />
      </Link>
    </li>
  );
}
