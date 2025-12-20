import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PostCardSkeleton() {
  return (
    <div className="post-card" >
 {/* ✅Separate container for image (no padding) */}
      <div className="post-image-container">
        <Skeleton 
          height={200} 
          style={{ 
            display: 'block',
            lineHeight: 1,
            borderRadius: '12px 12px 0 0' // Match card corners
          }} 
        />
      </div>
      <div className="post-content">
        <Skeleton width={80} height={12} />
        <Skeleton count={2} height={20} style={{ marginBottom: '0.75rem' }} />
        <Skeleton count={3} height={14} style={{ marginBottom: '0.5rem' }} />
        
        <div className="post-meta">
          <div className="author-info">
            <Skeleton circle width={40} height={40} />
            <div>
              <Skeleton width={100} height={12} />
              <Skeleton width={80} height={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}