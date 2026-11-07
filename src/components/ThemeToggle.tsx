'use client';
export function ThemeToggle({label='◐'}:{label?:string}) {
 function toggle(){const root=document.documentElement;const current=root.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');const next=current==='dark'?'light':'dark';root.dataset.theme=next;try{localStorage.setItem('genai-theme',next)}catch{}}
 return <button onClick={toggle} aria-label="Switch color theme">{label}</button>
}
