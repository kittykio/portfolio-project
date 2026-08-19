import InterestsSection from '@/app/components/interest-section/InterestSection';
import HeroSection from '@/app/components/HeroSection';
import ProjectSection from '@/app/components/ProjectSection';
import BlogSection from '@/app/components/BlogSection';
import { getAllPosts } from '@/lib/blogApi';
import ExperienceSection from '@/app/components/ExperienceSection';
import GetToKnowMeSection from '@/app/components/GetToKnowMeSection';
import { getAllProjects } from '@/lib/projectApi';
import IntroSection from '@/app/components/IntroSection';
import { getRequestLocale } from '@/i18n/server';

export const runtime = 'nodejs';

const HomePage = async () => {
  const locale = getRequestLocale();
  const posts = await getAllPosts(locale);
  const projects = await getAllProjects(locale);

  return (
    <>
      <HeroSection />
      <IntroSection />
      <InterestsSection />
      <GetToKnowMeSection />
      <ProjectSection projects={projects} />
      <BlogSection posts={posts} />
      <ExperienceSection />
    </>
  );
};

export default HomePage;
