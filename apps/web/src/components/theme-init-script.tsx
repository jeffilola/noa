/** Runs before paint so system / saved theme applies without a light flash. */
export function ThemeInitScript() {
  const script = `(function(){try{var d=document.documentElement,s='theme',t=localStorage.getItem(s)||'system',e=t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':t==='system'?'light':t;d.classList.remove('light','dark');d.classList.add(e);if(e==='light'||e==='dark'){d.style.colorScheme=e}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
