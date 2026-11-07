import type { Metadata } from 'next';
import './tokens.css';
import './globals.css';
import { ThemeToggle } from '../src/components/ThemeToggle';
export const metadata: Metadata = { title: 'GenAI Learner', description: 'Learn how generative AI works.' };
const themeScript = `(function(){try{var t=localStorage.getItem('genai-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})()`;
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}} /></head><body><a className="skip" href="#main">Skip to content</a><header className="header"><a className="brand" href="/">✳ GenAI Learner</a><ThemeToggle /></header><main id="main">{children}</main><footer>GenAI Learner · Learn by doing</footer></body></html>;
}
