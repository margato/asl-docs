import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function warmSearch(): void {
  const input = document.querySelector('.navbar__search-input');
  input?.dispatchEvent(
    new MouseEvent('mouseover', {bubbles: true, relatedTarget: document.body}),
  );
}

if (ExecutionEnvironment.canUseDOM) {
  const whenIdle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
  window.addEventListener('load', () => whenIdle(warmSearch));
}

// The clear (✕) button lives inside `.navbar__search`; pressing it would focus the
// search and `:focus-within` moves the button into the modal before `click` fires,
// so the click is lost and only the modal opens. Keep focus where it is instead.
if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener(
    'mousedown',
    (event) => {
      const target = event.target as Element | null;
      if (target?.closest('.navbar__search [class*="searchClearButton"]')) {
        event.preventDefault();
      }
    },
    true,
  );
}
