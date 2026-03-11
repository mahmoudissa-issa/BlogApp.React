import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deletePost, fetchPostsByUser } from "../../features/posts/postSlice";
import type { Post } from "../../types/post";
import { SERVER_URL } from "../../constants/app";
import { getBaseTableOptions } from "../../utils/tableConfig";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "../../styles/AdminPosts.css";

export default function AuthorPosts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: posts, loading } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.auth);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPostsByUser(Number(user.id)));
    }
  }, [dispatch, user?.id]);

  const handleDelete = async (id: number, title: string) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Post?",
      text: `"${title}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
    });

    if (!isConfirmed) return;

    try {
      setDeleting(id);
      await dispatch(deletePost(id)).unwrap();
      toast.success("Post deleted!");
    } catch (err) {
      toast.error((err as string) || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        size: 280,
      },
      {
        accessorFn: (row) => row.tagNames?.join(", ") ?? "",
        id: "tags",
        header: "Tags",
        size: 200,
        enableGrouping: true,
        Cell: ({ row }) => (
          <div className="tag-chips">
            {row.original.tagNames?.map((tag, i) => (
              <span key={i} className="tag-chip">{tag}</span>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        size: 80,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) =>
          row.original.imageUrl ? (
            <img
              src={`${SERVER_URL}${row.original.imageUrl}`}
              alt=""
              className="post-image-thumb"
            />
          ) : (
            <span className="post-image-none">—</span>
          ),
      },
      {
        id: "actions",
        header: "",
        size: 130,
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        Cell: ({ row }) => (
          <div className="table-actions">
            <button
              className="btn-action edit"
              onClick={() => navigate(`/author/posts/edit/${row.original.id}`)}
            >
              <FaEdit /> Edit
            </button>
            <button
              className="btn-action delete"
              disabled={deleting === row.original.id}
              onClick={() => handleDelete(row.original.id, row.original.title)}
            >
              <FaTrash /> {deleting === row.original.id ? "..." : "Delete"}
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, deleting],
  );

  const table = useMaterialReactTable({
    ...getBaseTableOptions(posts, columns, loading),
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>My Posts</h1>
          <p>Manage your posts</p>
        </div>
        <Link to="/author/posts/new" className="btn-primary-action">
          <FaPlus /> New Post
        </Link>
      </div>

      <MaterialReactTable table={table} />
    </div>
  );
}
