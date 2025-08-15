/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://urlshorter-five.vercel.app',
  generateRobotsTxt: true,
}
