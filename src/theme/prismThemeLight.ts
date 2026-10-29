import type {PrismTheme} from 'prism-react-renderer';

// Same token roles on a light ground, darkened to hold contrast on #fff.
const prismThemeLight: PrismTheme = {
  plain: {color: '#1f1f23', backgroundColor: '#fff'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#6b7280', fontStyle: 'italic'}},
    {types: ['punctuation', 'operator'], style: {color: '#52525b'}},
    {types: ['key', 'atrule', 'property', 'attr-name', 'tag'], style: {color: '#0014cc'}},
    {types: ['string', 'char', 'attr-value', 'inserted'], style: {color: '#15803d'}},
    {types: ['number', 'boolean', 'constant', 'symbol'], style: {color: '#b45309'}},
    {types: ['keyword', 'builtin', 'selector', 'important'], style: {color: '#0e7490'}},
    {types: ['function', 'class-name', 'directive'], style: {color: '#0f766e'}},
    {types: ['variable', 'parameter', 'environment'], style: {color: '#c2410c'}},
    {types: ['deleted', 'error', 'diag-error'], style: {color: '#d12b2b', fontWeight: '700'}},
    {types: ['diag-warning'], style: {color: '#b45309', fontWeight: '700'}},
    {types: ['diag-pointer'], style: {color: '#52525b'}},
    {types: ['diag-policy'], style: {color: '#0f766e'}},
    {types: ['diag-ok'], style: {color: '#15803d', fontWeight: '700'}},
    {types: ['diag-prompt'], style: {color: '#0014cc'}},
  ],
};

export default prismThemeLight;
