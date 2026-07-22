import React from 'react';

/**
 * @interface SkeletonLoaderProps
 * @property {'card' | 'track' | 'banner' | 'profile'} type - The layout style of skeleton loader to render.
 * @property {number} [count] - The number of loader instances to render. Defaults to 1.
 */
interface SkeletonLoaderProps {
  type: 'card' | 'track' | 'banner' | 'profile';
  count?: number;
}

/**
 * SkeletonLoader Component
 * Renders a set of animated placeholders (cards, lists, banners, or profiles) to simulate layout during async data fetching.
 *
 * @param {SkeletonLoaderProps} props - Component properties.
 * @returns {React.ReactElement} The rendered SkeletonLoader component.
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const CardSkeleton = () => (
    <div className="w-[180px] bg-zinc-900/60 rounded-md p-4 flex flex-col shrink-0 animate-pulse border border-zinc-800">
      <div className="aspect-square w-full bg-zinc-800 rounded-md mb-4" />
      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-800 rounded w-1/2" />
    </div>
  );

  const TrackSkeleton = () => (
    <div className="w-full flex items-center justify-between p-2 rounded-md bg-zinc-900/20 animate-pulse gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 bg-zinc-850 rounded" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 bg-zinc-800 rounded w-1/4" />
          <div className="h-2.5 bg-zinc-800 rounded w-1/6" />
        </div>
      </div>
      <div className="w-12 h-3 bg-zinc-800 rounded" />
    </div>
  );

  const BannerSkeleton = () => (
    <div className="w-full h-60 bg-zinc-900/80 animate-pulse flex items-end p-6 gap-6">
      <div className="w-40 h-40 bg-zinc-800 rounded-md shrink-0 shadow-lg" />
      <div className="flex flex-col gap-3 flex-1 mb-2">
        <div className="h-3 bg-zinc-800 rounded w-16" />
        <div className="h-10 bg-zinc-800 rounded w-1/2" />
        <div className="h-4 bg-zinc-800 rounded w-1/3" />
      </div>
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-zinc-900/40 rounded-lg animate-pulse max-w-md mx-auto gap-4 border border-zinc-800">
      <div className="w-24 h-24 rounded-full bg-zinc-800" />
      <div className="h-5 bg-zinc-800 rounded w-1/3" />
      <div className="h-4 bg-zinc-800 rounded w-1/2" />
    </div>
  );

  return (
    <div className={`flex ${type === 'card' ? 'flex-row gap-4 overflow-hidden' : 'flex-col gap-2'} w-full`}>
      {Array.from({ length: count }).map((_, i) => {
        if (type === 'card') return <CardSkeleton key={i} />;
        if (type === 'track') return <TrackSkeleton key={i} />;
        if (type === 'banner') return <BannerSkeleton key={i} />;
        return <ProfileSkeleton key={i} />;
      })}
    </div>
  );
};

export default SkeletonLoader;
