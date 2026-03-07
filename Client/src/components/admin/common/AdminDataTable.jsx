import { useEffect, useMemo, useState } from "react";
import "../../../assets/scss/adminTable.scss";
import "../../../assets/scss/adminCrudTheme.scss";

const AdminDataTable = ({
  columns = [],
  data = [],
  rowKey = "id",
  onRowClick,
  renderActions,
  emptyText = "Không có dữ liệu",
  selectable = true,
  onBulkDelete,
}) => {
  const [orderedColumns, setOrderedColumns] = useState(columns);
  const [draggedColumnKey, setDraggedColumnKey] = useState(null);
  const [dragOverColumnKey, setDragOverColumnKey] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [ghostColumn, setGhostColumn] = useState({
    visible: false,
    x: 0,
    y: 0,
    width: 180,
    title: "",
  });

  const getRowId = (row) => (typeof rowKey === "function" ? rowKey(row) : row?.[rowKey]);

  useEffect(() => {
    setOrderedColumns((prev) => {
      if (!prev.length) return columns;
      const prevMap = new Map(prev.map((col) => [col.key, col]));
      const merged = columns.map((col) => prevMap.get(col.key) || col);
      return merged;
    });
  }, [columns]);

  useEffect(() => {
    const availableIds = new Set(data.map((row) => getRowId(row)));
    setSelectedIds((prev) => prev.filter((id) => availableIds.has(id)));
  }, [data]);

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const hasSelectedRows = selectedIds.length > 0;

  const selectedRows = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return data.filter((row) => selectedSet.has(getRowId(row)));
  }, [data, selectedIds]);

  const toggleAllRows = (checked) => {
    if (checked) {
      setSelectedIds(data.map((row) => getRowId(row)));
      return;
    }
    setSelectedIds([]);
    setConfirmBulkDelete(false);
  };

  const toggleRow = (id, checked) => {
    setSelectedIds((prev) => {
      if (checked) return [...prev, id];
      return prev.filter((item) => item !== id);
    });
    if (!checked) setConfirmBulkDelete(false);
  };

  const handleDragStart = (event, column) => {
    const key = column?.key;
    if (!key) return;
    setDraggedColumnKey(key);
    setDragOverColumnKey(null);
    setGhostColumn({
      visible: true,
      x: event.clientX + 14,
      y: event.clientY + 14,
      width: Math.max(event.currentTarget?.offsetWidth || 180, 140),
      title: column?.title || "",
    });

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      const transparent = new Image();
      transparent.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
      event.dataTransfer.setDragImage(transparent, 0, 0);
    }
  };

  const handleDragEnter = (targetKey) => {
    if (!draggedColumnKey || draggedColumnKey === targetKey) {
      setDragOverColumnKey(null);
      return;
    }
    setDragOverColumnKey(targetKey);
  };

  const handleDragEnd = () => {
    setDraggedColumnKey(null);
    setDragOverColumnKey(null);
    setGhostColumn((prev) => ({ ...prev, visible: false }));
  };

  const handleDropColumn = (targetKey) => {
    if (!draggedColumnKey || draggedColumnKey === targetKey) return;
    const current = [...orderedColumns];
    const dragIndex = current.findIndex((item) => item.key === draggedColumnKey);
    const dropIndex = current.findIndex((item) => item.key === targetKey);
    if (dragIndex < 0 || dropIndex < 0) return;

    const [dragged] = current.splice(dragIndex, 1);
    current.splice(dropIndex, 0, dragged);
    setOrderedColumns(current);
    setDraggedColumnKey(null);
    setDragOverColumnKey(null);
    setGhostColumn((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (!draggedColumnKey) return;

    const handleWindowDragOver = (event) => {
      setGhostColumn((prev) => ({
        ...prev,
        visible: true,
        x: event.clientX + 14,
        y: event.clientY + 14,
      }));
    };

    window.addEventListener("dragover", handleWindowDragOver);
    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
    };
  }, [draggedColumnKey]);

  const getColumnDragClass = (columnKey, headerCell = false) => {
    if (!draggedColumnKey) return "";
    if (columnKey === draggedColumnKey) return "admin-table__column--dragging";
    if (!dragOverColumnKey) return "";

    const dragIndex = orderedColumns.findIndex((col) => col.key === draggedColumnKey);
    const overIndex = orderedColumns.findIndex((col) => col.key === dragOverColumnKey);
    const currentIndex = orderedColumns.findIndex((col) => col.key === columnKey);

    if (dragIndex < 0 || overIndex < 0 || currentIndex < 0) return "";

    if (dragIndex < overIndex && currentIndex > dragIndex && currentIndex <= overIndex) {
      return "admin-table__column--shift-left";
    }

    if (dragIndex > overIndex && currentIndex >= overIndex && currentIndex < dragIndex) {
      return "admin-table__column--shift-right";
    }

    if (headerCell && columnKey === dragOverColumnKey) {
      return "admin-table__header-cell--drop-target";
    }

    return "";
  };

  const handleConfirmDelete = async () => {
    if (!onBulkDelete || !hasSelectedRows || bulkDeleting) return;
    setBulkDeleting(true);
    try {
      await onBulkDelete(selectedIds, selectedRows);
      setSelectedIds([]);
      setConfirmBulkDelete(false);
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="admin-table">
      {ghostColumn.visible && (
        <div
          className="admin-table__ghost-column"
          style={{
            width: ghostColumn.width,
            transform: `translate(${ghostColumn.x}px, ${ghostColumn.y}px)`,
          }}
        >
          {ghostColumn.title}
        </div>
      )}

      {hasSelectedRows && (
        <div className="admin-table__bulk-bar">
          <span>{selectedIds.length} hàng đã chọn</span>
          {!confirmBulkDelete ? (
            <button className="admin-table__bulk-delete" onClick={() => setConfirmBulkDelete(true)}>
              Xóa đã chọn
            </button>
          ) : (
            <div className="admin-table__confirm-box">
              <span>Xác nhận xóa các hàng đã chọn?</span>
              <button className="admin-table__confirm-btn" disabled={bulkDeleting} onClick={handleConfirmDelete}>
                {bulkDeleting ? "Đang xóa..." : "Xác nhận"}
              </button>
              <button
                className="admin-table__cancel-btn"
                disabled={bulkDeleting}
                onClick={() => {
                  setConfirmBulkDelete(false);
                }}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      )}

      <div className="admin-table__container">
        <table className="admin-table__table">
          <thead>
            <tr>
              {selectable && (
                <th className="admin-table__select-col">
                  <input type="checkbox" checked={allSelected} onChange={(e) => toggleAllRows(e.target.checked)} />
                </th>
              )}

              {orderedColumns.map((col) => (
                <th
                  key={col.key}
                  className={`admin-table__header-cell ${getColumnDragClass(col.key, true)}`}
                  draggable
                  onDragStart={(event) => handleDragStart(event, col)}
                  onDragEnter={() => handleDragEnter(col.key)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropColumn(col.key)}
                  onDragEnd={handleDragEnd}
                  title="Nhấn giữ và kéo để đổi vị trí cột"
                >
                  {col.title}
                </th>
              ))}

              {renderActions && <th className="admin-table__action-col">Thao tác</th>}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={orderedColumns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0)}>{emptyText}</td>
              </tr>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row);
                const isChecked = selectedIds.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    className={onRowClick ? "admin-table__row admin-table__row--clickable" : "admin-table__row"}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td
                        className="admin-table__cell admin-table__select-col"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            toggleRow(rowId, e.target.checked);
                          }}
                        />
                      </td>
                    )}

                    {orderedColumns.map((col) => (
                      <td key={col.key} className={`admin-table__cell ${getColumnDragClass(col.key)}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}

                    {renderActions && (
                      <td
                        className="admin-table__cell admin-table__action-col"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {renderActions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDataTable;
