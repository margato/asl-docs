import type {PrismTheme} from 'prism-react-renderer';

// Flat theme on the dark surface, with GitHub-dark-like syntax colors. Yellow is reserved for the brand.
const prismTheme: PrismTheme = {
  plain: {color: '#e6edf3', backgroundColor: '#161b22'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#8b949e', fontStyle: 'italic'}},
    {types: ['punctuation', 'operator'], style: {color: '#8b949e'}},
    {types: ['key', 'atrule', 'property', 'attr-name', 'tag'], style: {color: '#7ee787'}},
    {types: ['string', 'char', 'attr-value', 'inserted'], style: {color: '#a5d6ff'}},
    {types: ['number', 'boolean', 'constant', 'symbol'], style: {color: '#79c0ff'}},
    {types: ['keyword', 'builtin', 'selector', 'important'], style: {color: '#ff7b72'}},
    {types: ['function', 'class-name', 'directive'], style: {color: '#d2a8ff'}},
    {types: ['variable', 'parameter', 'environment'], style: {color: '#ffa657'}},
    {types: ['deleted', 'error', 'diag-error'], style: {color: '#ff6b6b', fontWeight: '700'}},
    {types: ['diag-warning'], style: {color: '#fbbf24', fontWeight: '700'}},
    {types: ['diag-pointer'], style: {color: '#a8a8a8'}},
    {types: ['diag-policy'], style: {color: '#d2a8ff'}},
    {types: ['diag-ok'], style: {color: '#3ddc97', fontWeight: '700'}},
    {types: ['diag-prompt'], style: {color: '#58a6ff'}},
  ],
};

export default prismTheme;
