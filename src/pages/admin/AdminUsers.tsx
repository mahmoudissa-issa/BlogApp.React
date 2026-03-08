import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUpload } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../features/users/userSlice";
import type { User, CreateUserRequest, UpdateUserRequest } from "../../types/user";
import { SERVER_URL } from "../../constants/app";
import { getBaseTableOptions } from "../../utils/tableConfig";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "../../styles/AdminPosts.css";
import "../../styles/AdminUsers.css";
import { Roles } from "../../constants/enums";

/* ── Role helpers ── */
const ROLE_OPTIONS = [
  { id: 1, name: Roles.ADMIN },
  { id: 2, name: Roles.AUTHOR },
  { id: 3, name: Roles.READER },
] as const;

const roleNameToId = (name: string): number =>
  ROLE_OPTIONS.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id ?? 1;

const roleBadgeClass = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":  return "role-badge admin";
    case "author": return "role-badge author";
    default:       return "role-badge reader";
  }
};

/* ── Blank form state ── */
const EMPTY_FORM = {
  userName: "",
  email: "",
  fullName: "",
  password: "",
  roleId: 1,
  avatar: null as File | null,
  avatarPreview: "",
};

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((s) => s.users);

  const [deleting, setDeleting] = useState<number | null>(null);

  /* modal state */
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  /* ── Modal helpers ── */
  const openCreate = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      userName: user.userName,
      email: user.email,
      fullName: user.fullName ?? "",
      password: "",
      roleId: roleNameToId(user.roleName),
      avatar: null,
      avatarPreview: user.avatarUrl ? `${SERVER_URL}${user.avatarUrl}` : "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(EMPTY_FORM);
  };

  const updateField = (field: string, value: string | number | File | null) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({
      ...f,
      avatar: file,
      avatarPreview: file ? URL.createObjectURL(file) : f.avatarPreview,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userName.trim()) return toast.error("Username is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!editingUser && !form.password.trim())
      return toast.error("Password is required for new users");

    setSaving(true);
    try {
      if (editingUser) {
        const req: UpdateUserRequest = {
          userId: editingUser.id,
          userName: form.userName.trim(),
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          roleId: form.roleId,
          password: form.password || undefined,
          avatar: form.avatar,
        };
        await dispatch(updateUser(req)).unwrap();
        toast.success("User updated!");
      } else {
        const req: CreateUserRequest = {
          userName: form.userName.trim(),
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          password: form.password,
          roleId: form.roleId,
          avatar: form.avatar,
        };
        await dispatch(createUser(req)).unwrap();
        toast.success("User created!");
      }
      closeModal();
    } catch (err) {
      toast.error((err as string) || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete User?",
      text: "This user will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;

    try {
      setDeleting(id);
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted!");
    } catch (err) {
      toast.error((err as string) || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  /* ── Columns ── */
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
   
      {
        accessorKey: "userName",
        header: "Username",
        size: 180,
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
        size: 200,
        Cell: ({ row }) => (
          <span>{row.original.fullName || "—"}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 260,
      },
         {
        id: "avatar",
        header: "Avatar",
        size: 80,
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        Cell: ({ row }) => {
          const user = row.original;
          return user.avatarUrl ? (
            <img
              src={`${SERVER_URL}${user.avatarUrl}`}
              alt={user.userName}
              className="author-avatar-small"
            />
          ) : (
            <div className="author-avatar-placeholder">
              {(user.fullName ?? user.userName)?.charAt(0).toUpperCase()}
            </div>
          );
        },
      },
      {
        accessorKey: "roleName",
        header: "Role",
        size: 120,
        Cell: ({ row }) => (
          <span className={roleBadgeClass(row.original.roleName)}>
            {row.original.roleName}
          </span>
        ),
      },
    //   {
    //     accessorKey: "createdAt",
    //     header: "Joined",
    //     size: 130,
    //     Cell: ({ row }) =>
    //       new Date(row.original.createdAt).toLocaleDateString("en-US", {
    //         year: "numeric",
    //         month: "short",
    //         day: "numeric",
    //       }),
    //   },
      {
        id: "actions",
        header: "",
        size: 160,
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        Cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="table-actions">
              <button className="btn-action edit" onClick={() => openEdit(user)}>
                <FaEdit /> Edit
              </button>
              <button
                className="btn-action delete"
                disabled={deleting === user.id}
                onClick={() => handleDelete(user.id)}
              >
                <FaTrash /> {deleting === user.id ? "..." : "Delete"}
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleting],
  );

  const table = useMaterialReactTable({
    ...getBaseTableOptions(users, columns, loading),
    layoutMode: "grid",
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Users</h1>
          <p>Manage users</p>
        </div>
        <button className="btn-primary-action" onClick={openCreate}>
          <FaPlus /> New User
        </button>
      </div>

      <MaterialReactTable table={table} />

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className="user-modal-overlay" onClick={closeModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h2>{editingUser ? "Edit User" : "New User"}</h2>
              <button className="user-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="user-modal-form">
              {/* Avatar upload */}
              <div className="avatar-upload-area">
                <div className="avatar-preview-wrapper">
                  {form.avatarPreview ? (
                    <img src={form.avatarPreview} alt="avatar" className="avatar-preview-img" />
                  ) : (
                    <div className="avatar-preview-placeholder"><FaUpload /></div>
                  )}
                </div>
                <label className="avatar-upload-btn">
                  <FaUpload /> Choose Avatar
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </label>
              </div>

              <div className="user-form-grid">
                <div className="form-field">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={form.userName}
                    onChange={(e) => updateField("userName", e.target.value)}
                    placeholder="Enter username"
                  />
                </div>

                <div className="form-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-field">
                  <label>{editingUser ? "Password" : "Password *"}</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                  />
                </div>

                <div className="form-field">
                  <label>Role</label>
                  <select
                    value={form.roleId}
                    onChange={(e) => updateField("roleId", Number(e.target.value))}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="user-modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action" disabled={saving}>
                  <FaSave /> {saving ? "Saving..." : editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
