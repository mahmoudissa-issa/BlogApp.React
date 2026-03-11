import MuiPagination from "@mui/material/Pagination";
import "../../styles/Pagination.css";

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalRows?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalRows,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = currentPage * (pageSize ?? 9) + 1;
  const endItem = Math.min((currentPage + 1) * (pageSize ?? 9), totalRows ?? 0);

  return (
    <div className="pagination-wrapper">
      {totalRows !== undefined && pageSize !== undefined && (
        <p className="pagination-info">
          Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalRows}</strong> posts
        </p>
      )}

      <MuiPagination
        count={totalPages}
        page={currentPage + 1}           /* MUI is 1-indexed */
        onChange={(_e, value) => onPageChange(value - 1)} /* convert back to 0-indexed */
        shape="rounded"
        size="large"
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            fontWeight: 600,
            borderRadius: "10px",
            border: "2px solid #e8ecf1",
            minWidth: 38,
            height: 38,
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "var(--primary-color, #39bdf9)",
              color: "var(--primary-color, #39bdf9)",
              backgroundColor: "rgba(57, 189, 249, 0.08)",
            },
          },
          "& .Mui-selected": {
            background: "linear-gradient(135deg, var(--primary-color, #39bdf9) 0%, #0384c7 100%) !important",
            borderColor: "var(--primary-color, #39bdf9) !important",
            color: "#fff !important",
            boxShadow: "0 4px 12px rgba(57, 189, 249, 0.35)",
          },
          "& .MuiPaginationItem-ellipsis": {
            border: "none",
          },
        }}
      />
    </div>
  );
}
