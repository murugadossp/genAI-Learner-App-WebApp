/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // /course is the original chapter 2 page. Chapter 2 now has its generated
    // course page, so send visitors there permanently.
    return [
      { source: "/course", destination: "/course/chapter-2", permanent: true },
    ];
  },
};

export default nextConfig;
