import { http, HttpResponse } from 'msw';
import { mockPosts, mockTags } from './data';

export const handlers = [
  // GET /api/posts - Fetch posts with optional tagId filter and pagination
  http.get('*/api/posts', ({ request }) => {
    const url = new URL(request.url);
    const tagId = url.searchParams.get('tagId');

    let filtered = mockPosts;
    if (tagId) {
      const tagIdNum = Number(tagId);
      filtered = mockPosts.filter((p) => p.tagIds.includes(tagIdNum));
    }

    return HttpResponse.json({
      isSuccess: true,
      statusCode: 200,
      errorCode: 0,
      totalRows: filtered.length,
      result: filtered,
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
