import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAllComments,
  updateComment,
  deleteComment,
} from "../../features/comments/commentSlice";
import type { Comment } from "../../types/post";
import { SERVER_URL } from "../../constants/app";
import { getBaseTableOptions } from "../../utils/tableConfig";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "../../styles/AdminPosts.css";

export default function AdminComments() {
  const dispatch = useAppDispatch();
  const { comments, loading } = useAppSelector((s) => s.comments);

  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    dispatch(fetchAllComments());
  }, [dispatch]);

  /* ── Update ── */
  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const content = editContent.trim();
    if (!content) return toast.error("Comment cannot be empty");

    try {
      await dispatch(updateComment({ id: editingId, content })).unwrap();
      toast.success("Comment updated!");
      cancelEdit();
    } catch (err) {
      toast.error((err as string) || "Failed to update comment");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Comment?",
      text: "This comment will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;

    try {
      setDeleting(id);
      await dispatch(deleteComment(id)).unwrap();
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error((err as string) || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  /* ── Columns ── */
  const columns = useMemo<MRT_ColumnDef<Comment>[]>(
    () => [
      {
        accessorKey: "postTitle",
        header: "Post",
        size: 280,
        enableGrouping: true,
      },
      {
        accessorKey: "content",
        header: "Comment",
        size: 350,
        Cell: ({ row }) =>
          editingId === row.original.id ? (
            <textarea
              className="inline-edit-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleUpdate();
                }
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
              rows={3}
            />
          ) : (
            <span className="comment-content-cell">{row.original.content}</span>
          ),
      },
      {
        accessorKey: "userName",
        header: "Author",
        size: 160,
        Cell: ({ row }) => (
          <div className="author-cell">
            {row.original.avatrUrl ? (
              <img
                src={`${SERVER_URL}${row.original.avatrUrl}`}
                alt={row.original.userName}
                className="author-avatar-small"
              />
            ) : (
              <div className="author-avatar-placeholder">
                {row.original.userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 160,
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        Cell: ({ row }) => {
          const comment = row.original;
          if (editingId === comment.id) {
            return (
              <div className="table-actions">
                <button className="btn-action edit" onClick={handleUpdate}>
                  <FaSave /> Save
                </button>
                <button className="btn-action delete" onClick={cancelEdit}>
                  <FaTimes /> Cancel
                </button>
              </div>
            );
          }
          return (
            <div className="table-actions">
              <button className="btn-action edit" onClick={() => startEdit(comment)}>
                <FaEdit /> Edit
              </button>
              <button
                className="btn-action delete"
                disabled={deleting === comment.id}
                onClick={() => handleDelete(comment.id)}
              >
                <FaTrash /> {deleting === comment.id ? "..." : "Delete"}
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingId, editContent, deleting],
  );

  const table = useMaterialReactTable({
    ...getBaseTableOptions(comments, columns, loading),
    layoutMode: 'grid',
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Comments</h1>
          <p>Manage comments</p>
        </div>
      </div>

      <MaterialReactTable table={table} />
    </div>
  );
}
