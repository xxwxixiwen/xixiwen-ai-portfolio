import './globals.css';
import './motion.css';
import './scenes.css';
import MotionRuntime from '@/components/portfolio/MotionRuntime';
import { profile } from '@/data/portfolio';
export const metadata = {
  title: { default: profile.siteName, template: `%s · ${profile.siteName}` },
  description: profile.introduction,
  icons: { icon: '/portfolio-icon.svg' },
  robots: { index: false, follow: false },
};
export const viewport = { themeColor: '#080808' };
export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body><MotionRuntime>{children}</MotionRuntime></body></html>;
}
