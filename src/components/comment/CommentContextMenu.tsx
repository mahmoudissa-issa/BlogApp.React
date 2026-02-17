import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import "../../styles/CommentContextMenu.css";
import { showConfirmDialog } from "../../utils/confirmDialog";
interface CommentContextMenuProps {
  commentId: number;
  commentUserId: number;
  currentUserId?: number;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void; 
}

const CommentContextMenu: React.FC<CommentContextMenuProps> = ({
  commentId,
  commentUserId,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Only show menu if user owns the comment
  const canModify = currentUserId && commentUserId === currentUserId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    onEdit(commentId);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    const isConfirmed= await showConfirmDialog({
      title: "Delete Comment?",
      message: "Are you sure you want to delete this comment? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        icon: "error",
    });
    if (isConfirmed) {
      onDelete(commentId);
      setIsOpen(false);
    }
  };

  if (!canModify) return null;

  return (
    <div className="comment-context-menu-container">
      <button
        ref={buttonRef}
        className="comment-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Comment options"
      >
        <FaEllipsisV />
      </button>

      {isOpen && (
        <div ref={menuRef} className="comment-context-menu">
          <button className="menu-item edit-item" onClick={handleEdit}>
            <FaEdit className="menu-icon" />
            <span>Edit Comment</span>
          </button>
          <button className="menu-item delete-item" onClick={handleDelete}>
            <FaTrash className="menu-icon" />
            <span>Delete Comment</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentContextMenu;