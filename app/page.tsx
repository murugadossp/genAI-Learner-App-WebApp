import { redirect } from 'next/navigation';
export default function Home() {
  if (process.env.VERCEL_ENV !== 'production' && process.env.APP_ENV !== 'production') redirect('/learn/genai-basics/c2-02');
  return <div className="placeholder"><h1>GenAI Learner</h1><p>Our web learning experience is coming soon.</p></div>;
}
