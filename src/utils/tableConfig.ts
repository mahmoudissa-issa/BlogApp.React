import type { MRT_RowData, MRT_TableOptions } from "material-react-table";

/**
 * Shared Material React Table configuration.
 * Use this for every admin table to keep a consistent look and DRY code.
 *
 * Usage:
 *   const table = useMaterialReactTable({ ...getBaseTableOptions(data, columns, loading) });
 */
export function getBaseTableOptions<T extends MRT_RowData>(
  data: T[],
  columns: MRT_TableOptions<T>["columns"],
  isLoading = false,
): MRT_TableOptions<T> {
  return {
    columns,
    data,
    enableGrouping: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableFullScreenToggle: true,
    positionGlobalFilter: "left",
    initialState: {
      showGlobalFilter: true,
      density: "comfortable",
    },
    state: { isLoading },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e0e7ef",
        maxWidth: "100%",
        "&.MuiPaper-root[style*='position: fixed']" : {
          zIndex: 1200,
          left: "0 !important",
          width: "100vw !important",
        },
      },
    },
    muiTableContainerProps: {
      sx: {
        maxWidth: "100%",
        overflowX: "auto",
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#f8fbff",
        borderBottom: "1px solid #e0e7ef",
        minHeight: "56px",
        px: 2,
        gap: 1,
        "& .MuiBox-root": {
          flex: 1,
          display: "flex",
        },
        "& .MuiCollapse-root": {
          flex: "1 1 auto !important",
          width: "100%",
        },
        "& .MuiCollapse-wrapperInner": {
          width: "100%",
        },
        "& .MuiInputBase-root": {
          borderRadius: "8px",
          backgroundColor: "#fff",
          width: "100%",
        },
      },
    },
    muiSearchTextFieldProps: {
      placeholder: "Search…",
      variant: "outlined",
      size: "small",
      fullWidth: true,
      sx: {
        width: "100%",
        minWidth: 0,
        flex: "1 1 auto",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          width: "100%",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700,
        fontSize: "0.8rem",
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        color: "#475569",
        backgroundColor: "#f1f6fc",
        borderBottom: "2px solid #d4e0f0",
        py: 1.5,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "0.88rem",
        color: "#1e293b",
        borderBottom: "1px solid #f0f4f8",
        py: 1.2,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? "#fff" : "#fafcff",
        "&:hover": { backgroundColor: "#eef5ff" },
        transition: "background-color 0.15s ease",
      },
    }),
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#f8fbff",
        borderTop: "1px solid #e0e7ef",
      },
    },
  };
}
