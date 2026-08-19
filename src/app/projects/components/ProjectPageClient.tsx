'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProjectList from '@/app/projects/components/ProjectList';
import ProjectFilter, { type ProjectFilters } from '@/app/projects/components/ProjectFilter';
import { ProjectType } from '@/types/ProjectType';
import SectionWrapper from '@/components/SectionWrapper';
import Pagination from '@/components/Pagination';
import SortTabs, { SortOption } from '@/components/SortTabs';
import { useLocale } from '@/components/LocaleContext';
import { trackEvent } from '@/components/AnalyticsEvent';

type ProjectPageClientProps = {
  initialProjects: ProjectType[];
};

type LikesResponse = { likes: Record<string, number> };

const ProjectPageClient = ({ initialProjects }: ProjectPageClientProps) => {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterQuery = searchParams.toString();
  const [projectsWithLikes, setProjectsWithLikes] = useState<ProjectType[]>(initialProjects);
  const filtersFromUrl = useCallback((): ProjectFilters => ({
    years: new Set(new URLSearchParams(filterQuery).getAll('year')),
    tags: new Set(new URLSearchParams(filterQuery).getAll('tag')),
  }), [filterQuery]);
  const [filters, setFilters] = useState<ProjectFilters>(filtersFromUrl);
  const [activePage, setActivePage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const limit = 6;

  // Load shared reaction totals once for the listing so "most popular" sorts real values.
  useEffect(() => {
    let cancelled = false;
    const ids = initialProjects.map((project) => project.id).join(',');

    fetch(`/api/likes?type=project&ids=${ids}`)
      .then((response) => response.json())
      .then((data: LikesResponse) => {
        if (cancelled) return;
        setProjectsWithLikes((current) =>
          current.map((project) => ({ ...project, like: data.likes?.[project.id] ?? project.like })),
        );
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [initialProjects]);

  // A shared URL restores filters on first load and supports browser back/forward.
  useEffect(() => {
    setFilters(filtersFromUrl());
  }, [filtersFromUrl]);

  const handleFiltersChange = useCallback((nextFilters: ProjectFilters) => {
    trackEvent('filter', [...nextFilters.tags, ...nextFilters.years].join(', ') || 'clear');
    setFilters(nextFilters);
    setActivePage(1);
    const params = new URLSearchParams();
    [...nextFilters.years].sort().forEach((year) => params.append('year', year));
    [...nextFilters.tags].sort((a, b) => a.localeCompare(b)).forEach((tag) => params.append('tag', tag));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

  const filteredProjects = useMemo(() => projectsWithLikes.filter((project) => {
    const year = project.date?.match(/^\d{4}/)?.[0];
    return (
      (filters.years.size === 0 || (year !== undefined && filters.years.has(year))) &&
      (filters.tags.size === 0 || project.tags.some((tag) => filters.tags.has(tag)))
    );
  }), [filters, projectsWithLikes]);

  // 🔥 Sort the *entire* filtered project list before pagination
  const sortedProjects = useMemo(() => {
    if (!sortBy) return filteredProjects;

    const sorted = [...filteredProjects];
    switch (sortBy) {
      case 'mostPopular':
        sorted.sort((a, b) => b.like - a.like);
        break;

      case 'newest':
        sorted.sort(
          (a, b) =>
            new Date(b.date || '1970/01/01').getTime() - new Date(a.date || '1970/01/01').getTime(),
        );
        break;

      case 'oldest':
        sorted.sort(
          (a, b) =>
            new Date(a.date || '1970/01/01').getTime() - new Date(b.date || '1970/01/01').getTime(),
        );
        break;
    }
    return sorted;
  }, [filteredProjects, sortBy]);

  // ⚙️ Apply pagination *after* sorting
  const start = (activePage - 1) * limit;
  const end = start + limit;
  const paginatedProjects = sortedProjects.slice(start, end);

  return (
    <SectionWrapper title={locale === 'ja' ? 'プロジェクト' : 'Projects'} subtitle={locale === 'ja' ? '技術スタックで絞り込み、カードを開いて制作の背景、ソースコード、公開サイトを見てみてください。' : 'Filter by stack, then open a card for the story, source code, and live result.'} className="px-4 max-w-7xl mx-auto pb-32 mt-[100px]">
      <ProjectFilter projects={initialProjects} filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Sorting Tabs */}
      <SortTabs sortBy={sortBy} onChange={setSortBy} />

      {/* Display paginated & sorted projects */}
      <ProjectList
        projects={paginatedProjects}
        onLikesChange={(updatedProjects) => {
          const likesById = new Map(updatedProjects.map((project) => [project.id, project.like]));
          setProjectsWithLikes((current) =>
            current.map((project) => ({ ...project, like: likesById.get(project.id) ?? project.like })),
          );
        }}
      />

      <Pagination
        activePage={activePage}
        limit={limit}
        total={sortedProjects.length}
        mode="client"
        onPageChange={setActivePage}
      />
    </SectionWrapper>
  );
};

export default ProjectPageClient;
