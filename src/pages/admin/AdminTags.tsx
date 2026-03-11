import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from "../../features/tags/tagSlice";
import type { Tag } from "../../types/tag";
import { getBaseTableOptions } from "../../utils/tableConfig";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "../../styles/AdminPosts.css";

export default function AdminTags() {
  const dispatch = useAppDispatch();
  const { tags, loading } = useAppSelector((s) => s.tags);

  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  /* ── Create ── */
  const handleCreate = async () => {
    const name = newTagName.trim();
    if (!name) return toast.error("Tag name is required");

    setCreating(true);
    try {
      await dispatch(createTag(name)).unwrap();
      toast.success("Tag created!");
      setNewTagName("");
      setShowCreate(false);
    } catch (err) {
      toast.error((err as string) || "Failed to create tag");
    } finally {
      setCreating(false);
    }
  };

  /* ── Update ── */
  const startEdit = (tag: Tag) => {
    setEditingId(tag.tagId);
    setEditName(tag.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const name = editName.trim();
    if (!name) return toast.error("Tag name is required");

    try {
      await dispatch(updateTag({ tagId: editingId, tagName: name })).unwrap();
      toast.success("Tag updated!");
      cancelEdit();
    } catch (err) {
      toast.error((err as string) || "Failed to update tag");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id: number, name: string) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Tag?",
      text: `"${name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;

    try {
      setDeleting(id);
      await dispatch(deleteTag(id)).unwrap();
      toast.success("Tag deleted!");
    } catch (err) {
      toast.error((err as string) || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  /* ── Columns ── */
  const columns = useMemo<MRT_ColumnDef<Tag>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tag",
        Cell: ({ row }) =>
          editingId === row.original.tagId ? (
            <input
              className="inline-edit-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdate();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
            />
          ) : (
            <span className="tag-chip">{row.original.name}</span>
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
          const tag = row.original;
          if (editingId === tag.tagId) {
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
              <button className="btn-action edit" onClick={() => startEdit(tag)}>
                <FaEdit /> Edit
              </button>
              <button
                className="btn-action delete"
                disabled={deleting === tag.tagId}
                onClick={() => handleDelete(tag.tagId, tag.name)}
              >
                <FaTrash /> {deleting === tag.tagId ? "..." : "Delete"}
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingId, editName, deleting],
  );

  const table = useMaterialReactTable({
    ...getBaseTableOptions(tags, columns, loading),
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Tags</h1>
          <p>Manage tags</p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => setShowCreate((v) => !v)}
        >
          <FaPlus /> New Tag
        </button>
      </div>

      {showCreate && (
        <div className="inline-create-bar">
          <input
            className="inline-create-input"
            type="text"
            placeholder="Enter tag name…"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") {
                setShowCreate(false);
                setNewTagName("");
              }
            }}
            autoFocus
          />
          <button
            className="btn-primary-action"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? "Creating…" : "Create"}
          </button>
          <button
            className="btn-cancel"
            onClick={() => {
              setShowCreate(false);
              setNewTagName("");
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <MaterialReactTable table={table} />
    </div>
  );
}
