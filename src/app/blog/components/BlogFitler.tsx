import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import type { PostType } from '@/types/PostType';
import FilterWrapper from '@/components/FilterWrapper';
import { FilterTag } from '@/components/Tag';

type FilterType = string;

type BlogFilterProps = {
  posts: PostType[];
  selectedFilters: FilterType[];
  onFiltersChange: (filters: FilterType[]) => void;
};

const BlogFilter = ({ posts, selectedFilters, onFiltersChange }: BlogFilterProps) => {

  const background = useRef<HTMLDivElement>(null!);
  const setBackground = (isActive: boolean) => {
    if (!background.current) return;
    gsap.to(background.current, { opacity: isActive ? 0.6 : 0, duration: 0.3 });
  };

  const uniqueTags = useMemo(() => {
    if (!posts) return [];
    return Array.from(new Set(posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))));
  }, [posts]);

  const filters = uniqueTags;

  const handleOnChange = (filter: FilterType) => {
    const exists = selectedFilters.includes(filter);
    const updated = exists
      ? selectedFilters.filter((state) => state !== filter)
      : [...selectedFilters, filter];
    onFiltersChange(updated);
  };

  const handleClearAll = () => {
    onFiltersChange([]);
  };

  return (
    <FilterWrapper
      onClearAll={handleClearAll}
      showClear={selectedFilters.length > 0}
      background={background}
    >
      <div className="flex flex-wrap gap-2 justify-center py-8">
        {filters.map((filter, i) => (
          <FilterTag
            key={filter}
            i={i}
            tag={filter}
            handleOnChange={handleOnChange}
            setRef={setBackground}
            active={selectedFilters.includes(filter)}
          />
        ))}
      </div>
    </FilterWrapper>
  );
};

export default BlogFilter;
