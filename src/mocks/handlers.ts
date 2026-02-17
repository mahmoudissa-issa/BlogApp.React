import { http, HttpResponse } from 'msw';
import { mockPosts, mockTags } from './data';

export const handlers = [
  // GET /api/posts - Fetch all posts
  http.get('*/api/posts', () => {
    return HttpResponse.json({
      isSuccess: true,
      statusCode: 200,
      errorCode: 0,
      totalRows: mockPosts.length,
      result: mockPosts,
    });
  }),

  // GET /api/tags - Fetch all tags
  http.get('*/api/tags', () => {
    return HttpResponse.json({
      isSuccess: true,
      statusCode: 200,
      errorCode: 0,
      totalRows: mockTags.length,
      result: mockTags,
    });
  }),
];
