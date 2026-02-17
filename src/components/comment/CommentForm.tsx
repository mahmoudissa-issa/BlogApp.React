import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { CreateCommentRequest } from "../../types/post";
import { addComment } from "../../features/postDetails/postDetailSlice";

interface CommentFormProps {
  postId: number;
}

function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get User Info From Auth State
  const { user } = useAppSelector((state) => state.auth);

  //Get Comments Loading State
  const { commentsLoading } = useAppSelector((state) => state.postDetail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.info("Please login to comment");
      navigate("/login");
      return;
    }

    if (content.trim() === "") {
      return;
    }

    try {
      const commentRequest: CreateCommentRequest = {
        postId,
        content: content.trim(),
      };

      await dispatch(addComment(commentRequest)).unwrap();
      setContent("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Failed to post comment", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const isSubmitDisabled = commentsLoading || !user || !content.trim();

  // Show login prompt when user is not authenticated
  if (!user) {
    return (
      <div className="comment-form-login-prompt">
        <p className="login-message">Want to join the conversation?</p>
        <button 
          onClick={() => navigate("/login")} 
          className="login-prompt-btn"
        >
          Login to Comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <label htmlFor="comment-textarea">Add a Comment</label>
        <textarea
          id="comment-textarea"
          className="form-textarea"
          placeholder="What  your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={commentsLoading}
          rows={4}
        />
      </div>

      <button type="submit" className="submit-comment-btn" disabled={isSubmitDisabled}>
        {commentsLoading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}

export default CommentForm;
