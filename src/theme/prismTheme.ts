import type {PrismTheme} from 'prism-react-renderer';

// Flat, high-contrast theme on pure black. Accent blue is the brand color.
const prismTheme: PrismTheme = {
  plain: {color: '#e6e6e6', backgroundColor: '#0a0a0a'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#6b7280', fontStyle: 'italic'}},
    {types: ['punctuation', 'operator'], style: {color: '#9ca3af'}},
    {types: ['key', 'atrule', 'property', 'attr-name', 'tag'], style: {color: '#ffd633'}},
    {types: ['string', 'char', 'attr-value', 'inserted'], style: {color: '#86efac'}},
    {types: ['number', 'boolean', 'constant', 'symbol'], style: {color: '#fbbf24'}},
    {types: ['keyword', 'builtin', 'selector', 'important'], style: {color: '#22d3ee'}},
    {types: ['function', 'class-name', 'directive'], style: {color: '#2dd4bf'}},
    {types: ['variable', 'parameter', 'environment'], style: {color: '#fdba74'}},
    {types: ['deleted', 'error', 'diag-error'], style: {color: '#ff6b6b', fontWeight: '700'}},
    {types: ['diag-warning'], style: {color: '#fbbf24', fontWeight: '700'}},
    {types: ['diag-pointer'], style: {color: '#a8a8a8'}},
    {types: ['diag-policy'], style: {color: '#2dd4bf'}},
    {types: ['diag-ok'], style: {color: '#3ddc97', fontWeight: '700'}},
    {types: ['diag-prompt'], style: {color: '#ffcc00'}},
  ],
};

export default prismTheme;
