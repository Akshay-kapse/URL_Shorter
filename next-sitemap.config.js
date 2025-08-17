/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://url-shorter-cyan.vercel.app',
  generateRobotsTxt: true,
}
