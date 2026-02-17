import type { Post } from '../types/post';
import type { Tag } from '../types/tag';

export const mockTags: Tag[] = [
  { tagId: 1, name: 'React', slug: 'react' },
  { tagId: 2, name: 'TypeScript', slug: 'typescript' },
  { tagId: 3, name: 'Node.js', slug: 'nodejs' },
];

export const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    content: '<p>React is a popular JavaScript library for building user interfaces.</p>',
    authorId: 1,
    authorName: 'John Doe',
    avatarUrl: '/avatars/john.png',
    categoryId: 1,
    categoryName: 'Frontend',
    tagIds: [1],
    tagNames: ['React'],
    createdAt: '2026-01-15T10:00:00Z',
    publishedA: '2026-01-15T10:00:00Z',
    imageUrl: 'uploads/post1.jpg',
  },
  {
    id: 2,
    title: 'TypeScript Best Practices',
    slug: 'typescript-best-practices',
    content: '<p>TypeScript adds static typing to JavaScript for better developer experience.</p>',
    authorId: 2,
    authorName: 'Jane Smith',
    avatarUrl: '/avatars/jane.png',
    categoryId: 1,
    categoryName: 'Frontend',
    tagIds: [2],
    tagNames: ['TypeScript'],
    createdAt: '2026-02-10T12:00:00Z',
    publishedA: '2026-02-10T12:00:00Z',
    imageUrl: 'uploads/post2.jpg',
  },
  {
    id: 3,
    title: 'Building APIs with Node.js',
    slug: 'building-apis-with-nodejs',
    content: '<p>Node.js is a runtime that lets you run JavaScript on the server.</p>',
    authorId: 1,
    authorName: 'John Doe',
    avatarUrl: '/avatars/john.png',
    categoryId: 2,
    categoryName: 'Backend',
    tagIds: [3],
    tagNames: ['Node.js'],
    createdAt: '2026-02-14T08:00:00Z',
    publishedA: '2026-02-14T08:00:00Z',
    imageUrl: 'uploads/post3.jpg',
  },
];
