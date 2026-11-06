import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import LocaleSwitch from '@site/src/components/LocaleSwitch';
import ThemeSwitch from '@site/src/components/ThemeSwitch';
import GithubLink from '@site/src/components/GithubLink';
import PlaygroundLink from '@site/src/components/PlaygroundLink';

export default {
  ...ComponentTypes,
  'custom-localeSwitch': LocaleSwitch,
  'custom-themeSwitch': ThemeSwitch,
  'custom-githubLink': GithubLink,
  'custom-playgroundLink': PlaygroundLink,
};
