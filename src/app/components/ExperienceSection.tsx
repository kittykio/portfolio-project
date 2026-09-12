'use client';

import { FaBriefcase, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper';
import { useLocale } from '@/components/LocaleContext';
import { Card } from '@/components/CardFloatWrapper';
import { DisplayTag } from '@/components/Tag';

export type ExperienceType = {
  title: string;
  company_name: string;
  description: string;
  date: string;
  technologies: string[];
  icon?: React.ReactNode;
  url?: string;
  japanese?: { title: string; description: string; date: string };
};

export const experiences: ExperienceType[] = [
  {
    title: 'Full-stack Developer',
    company_name: 'Enterprise AI & Data Platform',
    description: 'Building an enterprise platform that helps teams find, understand, and use business information through generative AI. The service connects organizational data with everyday workflows to support informed decisions. I translate business requirements into usable features, developing the interfaces, application logic, and data connections that bring the experience together.',
    date: 'September 2026 - Present',
    technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'LLMs', 'SQL', 'ORM', 'Docker', 'Codex', 'Claude Code', 'Spec Kit'],
    japanese: { title: 'フルスタックエンジニア', date: '2026年9月 - 現在', description: '生成AIを通じて、社内の情報を見つけ、理解し、業務に活用できる企業向けプラットフォームを開発。組織内のデータと日々の業務をつなぎ、情報に基づく意思決定を支援します。業務要件を使いやすい機能へ落とし込み、画面からアプリケーションの処理、データ連携まで一貫して開発しています。' },
    icon: <FaCode />,
  },
  {
    title: 'Frontend Developer',
    company_name: 'Mobile & Internet Services System Development',
    description:
      'Designed and shipped responsive web interfaces for mobile and internet services, turning product requirements into accessible, maintainable React and Next.js experiences. Partnered with design and engineering to refine user flows, interactions, and shared UI foundations.',
    date: '2024 - August 2026',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma'],
    icon: <FaCode />,
  },
  {
    title: 'Backend Developer',
    company_name: 'Geographic & Spatial Information Services System Development',
    description:
      'Built internal systems for geographic and spatial-information services, developing data workflows, automation, and web tools that made day-to-day operations more reliable. Worked across frontend and backend to turn complex domain needs into practical software.',
    date: '2022 - 2024',
    technologies: [
      'HTML',
      'CSS',
      'SCSS',
      'Tailwind CSS',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Python',
      'Django',
      'VBA',
      'Linux',
    ],
    icon: <FaCode />,
  },
];

const ExperienceSection = () => {
  const { locale } = useLocale();
  return (
    <SectionWrapper
      title={locale === 'ja' ? '経験' : 'Experience'}
      subtitle={locale === 'ja' ? '信頼できるデータツールから、人が心地よく使えるレスポンシブUIまで。現在はAI駆動開発によるフルスタック開発に取り組んでいます。' : 'From reliable data tools and responsive interfaces to full-stack, AI-driven product development.'}
      className="scroll-mt-24 flex flex-col mt-32 px-4 w-full gap-8"
    >
      <div className="w-full py-24 relative max-w-7xl mx-auto pb-[700px] overflow-x-hidden">
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-1 top-0 bottom-0 
            bg-gradient-to-b from-surface-subtle via-surface-subtle to-transparent"
        ></div>

        <div className="flex flex-col space-y-20 relative">
          {experiences.map((exp, index) => {
            const isLeft = index % 2 === 0;
            const localized = locale === 'ja' ? exp.japanese : undefined;
            return (
              <div key={index} className="relative flex items-center w-full">
                {/* Node */}
                <div className="absolute left-1/2 -translate-x-[49.9%] w-10 h-10 bg-flame-500 text-gray-100 border-2 border-border-subtle rounded-full flex justify-center items-center text-xl shadow-lg shadow-[var(--shadow)]">
                  {exp.icon ?? <FaBriefcase />}
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative w-full px-4 md:w-1/2 ${
                    isLeft ? 'mr-auto text-left md:pr-12 md:text-right' : 'ml-auto text-left md:pl-12'
                  }`}
                >
                  <Card rounded>
                    <div className="flex flex-col justify-center gap-2 m-4 p-4">
                      <div
                        className={`flex text-sm font-bodyBold ${
                          isLeft ? 'justify-start md:justify-end' : 'justify-start'
                        }`}
                      >
                        {localized?.date ?? exp.date}
                      </div>
                      <div className="font-bodyBold text-xl">{localized?.title ?? exp.title}</div>
                      <div className="text-sm italic mb-2">{exp.url ? <a href={exp.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{exp.company_name} ↗</a> : exp.company_name}</div>
                      <p className="text-base">{localized?.description ?? exp.description}</p>
                      <div
                        className={`flex flex-wrap gap-2 mt-2 text-sm ${
                          isLeft ? 'justify-start md:justify-end' : 'justify-start'
                        }`}
                      >
                        {exp.technologies.map((tech) => (
                          <DisplayTag key={tech} tag={tech} />
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ExperienceSection;
