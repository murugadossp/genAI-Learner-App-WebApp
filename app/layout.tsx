import type { Metadata } from "next";
import "./tokens.css";
import "./studio.css";
export const metadata: Metadata = {
  title: "GenAI Learner",
  description: "A hands-on studio for understanding and building AI.",
};
const themeScript = `(function(){try{var t=localStorage.getItem('genai-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})()`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
