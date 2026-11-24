// 后续只需在这里更新个人资料、开屏视频和项目内容。
export const profile = {
  name: '西西文',
  siteName: '西西文 · AI 产品手记',
  role: 'AI 产品经理',
  introduction: '我关注真实需求，连接 AI 能力与产品体验，让想法成为可用的产品。',
  phone: '18911293968',
  email: '3470994885@qq.com',
  officialAccountQr: '/portfolio/contact/wechat-official-account.jpg',
  wechat: '18911293968',
  github: 'https://github.com/xxwxixiwen',
  resume: '', // 将简历放入 public，再填入 /resume.pdf
  video: '', // 将视频放入 public/videos，再填入 /videos/intro.mp4
  videoPoster: '/portfolio/scenes/scene-1.webp',
  avatar: '/portfolio/layers/character-3.webp',
  avatarMini: '/portfolio/layers/character-2.webp',
};

// 用户提供的底图用于个人场景，不作为真实项目截图。
export const personalScenes = [
  { id: 'hero', section: 'hero-section', src: '/portfolio/layers/hero-close-v3.webp' },
  { id: 'about', section: 'about-section', src: '/portfolio/layers/about-crossleg-v4.webp' },
  { id: 'approach', section: 'approach-section', src: '/portfolio/layers/character-3.webp' },
  { id: 'work', section: 'work-section', src: '/portfolio/layers/work-unit-v2.webp' },
  { id: 'contact', section: 'contact-section', src: '/portfolio/layers/contact-unit-v2.webp' },
];

export const capabilities = [
  { number: '01', title: '从问题出发', english: 'DISCOVER', description: '用户研究 / 场景拆解 / 需求定义', detail: '先明确用户、场景与问题，再判断 AI 是否是合适的解决方式。' },
  { number: '02', title: '让想法可验证', english: 'DEFINE & BUILD', description: '产品方案 / 交互原型 / MVP 验证', detail: '把模糊想法拆成可讨论的流程、可体验的原型和可验证的假设。' },
  { number: '03', title: '让体验有闭环', english: 'EVALUATE', description: '模型评估 / 体验迭代 / 效果复盘', detail: '关注 AI 输出的质量、边界与成本，把用户反馈带回产品迭代。' },
];

// 项目内容独立维护，依据最新 PDF。
export { projects } from './resumeProjects';
