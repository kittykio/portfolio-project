import React from 'react';
import styles from '@/app/components/interest-section/style.module.scss';
import { DataType } from '@/app/components/interest-section/InterestSection';

type DescriptionsProps = {
  data: DataType[];
  selectedProject: number | null;
};

const Descriptions: React.FC<DescriptionsProps> = ({ data, selectedProject }) => {
  const crop = (str: string, maxLength: number) => str.substring(0, maxLength);

  return (
    <div className={styles.descriptions}>
      {data.map((project: DataType, i: number) => {
        const { title, description } = project;

        const isSelected = selectedProject === i;
        const clip = isSelected ? 'inset(0 0 0 0)' : 'inset(50% 0 50% 0)';

        return (
          <div key={i} className={styles.description} style={{ clipPath: clip }}>
            <p>{crop(title, 9)}</p>
            <p>{description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Descriptions;
