import InterestsSection from '@/app/components/interest-section/InterestSection';
import HeroSection from '@/app/components/HeroSection';
import ProjectSection from '@/app/components/ProjectSection';
import BlogSection from '@/app/components/BlogSection';
import ExperienceSection from '@/app/components/ExperienceSection';
import GetToKnowMeSection from '@/app/components/GetToKnowMeSection';
import IntroSection from '@/app/components/IntroSection';
import { getAllPosts } from '@/lib/blogApi';
import { getAllProjects } from '@/lib/projectApi';

export const runtime = 'nodejs';

const JapaneseHomePage = async () => {
  const [posts, projects] = await Promise.all([getAllPosts('ja'), getAllProjects('ja')]);

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

export default JapaneseHomePage;
