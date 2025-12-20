// src/components/skeletons/TagsSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TagsSkeletonProps {
  count?: number; // Number of tag skeletons to show
}

export default function TagsSkeleton({ count = 5 }: TagsSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          width={90}
          height={36}
          borderRadius={999}

        />
      ))}
    </>
  );
}