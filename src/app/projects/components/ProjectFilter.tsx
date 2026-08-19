'use client';

import { useMemo, useRef } from 'react';
import { ProjectType } from '@/types/ProjectType';
import { FilterTag } from '@/components/Tag';
import FilterWrapper from '@/components/FilterWrapper';
import gsap from 'gsap';

export type FilterKey = 'years' | 'tags';
export type ProjectFilters = Record<FilterKey, Set<string>>;

type Props = {
  projects: ProjectType[];
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
};

const ProjectFilter = ({ projects, filters, onFiltersChange }: Props) => {

  const background = useRef<HTMLDivElement>(null!);
  const setBackground = (isActive: boolean) => {
    if (!background.current) return;
    gsap.to(background.current, { opacity: isActive ? 0.6 : 0, duration: 0.3 });
  };

  const extractYear = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    const match = dateString.match(/^\d{4}/);
    return match ? match[0] : 'Unknown';
  };

  // Precompute unique filter options
  const filterOptions = useMemo(
    () => ({
      years: Array.from(
        new Set(projects.map((a) => extractYear(a.date)).filter((y) => y && y !== 'Unknown')),
      ).sort((a, b) => Number(b) - Number(a)),
      tags: Array.from(new Set(projects.flatMap((a) => a.tags))),
    }),
    [projects],
  );

  // Toggle filter
  const toggleFilter = (key: FilterKey, value: string) => {
    const nextSet = new Set(filters[key]);
    if (nextSet.has(value)) nextSet.delete(value);
    else nextSet.add(value);
    onFiltersChange({ ...filters, [key]: nextSet });
  };

  // Clear all filters
  const handleClearAll = () => {
    onFiltersChange({
      years: new Set(),
      tags: new Set(),
    });
  };

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((set) => set.size > 0),
    [filters],
  );

  // Render filter group
  const renderFilterGroup = (key: FilterKey, options: string[], colClasses: string) => (
    <div className={`flex flex-col gap-2 ${colClasses}`}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <FilterTag
            key={opt}
            i={i}
            tag={opt}
            handleOnChange={() => toggleFilter(key, opt)}
            setRef={setBackground}
            active={filters[key].has(opt)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <FilterWrapper onClearAll={handleClearAll} showClear={hasActiveFilters} background={background}>
      <div className="flex flex-wrap sm:flex-nowrap w-full gap-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/4">
          {renderFilterGroup('years', filterOptions.years, 'w-full')}
        </div>

        {renderFilterGroup('tags', filterOptions.tags, 'w-full md:w-3/4')}
      </div>
    </FilterWrapper>
  );
};

export default ProjectFilter;
