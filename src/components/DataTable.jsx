"use client";
import React, { useState, useEffect } from "react";
import { FileText, X, Edit, Trash2 } from "lucide-react";

const DataTable = ({
  currentSheet,
  competitorAnalysisOptions, // Prop for dropdown options
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    storeName: "",
    address: "",
    personnel: "",
    insight: "",
    competitorAnalysis: { competitor: "", item: "", color: "" },
  });
  const [deleteEntryId, setDeleteEntryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const rowsPerPage = 10;

  // Prevent TypeError by checking if currentSheet and currentSheet.data exist
  const totalRows = currentSheet && currentSheet.data ? currentSheet.data.length : 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = currentSheet && currentSheet.data
    ? currentSheet.data.slice(startIndex, endIndex)
    : [];

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleEditClick = (row) => {
    setEditEntryId(row._id);
    setEditFormData({
      storeName: row.storeName,
      address: row.address,
      personnel: row.personnel,
      insight: row.insight,
      competitorAnalysis: {
        competitor: row.competitorAnalysis?.competitor?._id || "",
        item: row.competitorAnalysis?.item?._id || "",
        color: row.competitorAnalysis?.color?._id || "",
      },
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (entryId) => {
    setDeleteEntryId(entryId);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editFormData.storeName.trim()) {
      alert("Store name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/sheets/${currentSheet._id}/entries/${editEntryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editFormData,
            competitorAnalysis: {
              competitor: editFormData.competitorAnalysis.competitor || null,
              item: editFormData.competitorAnalysis.item || null,
              color: editFormData.competitorAnalysis.color || null,
            },
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update entry: ${errorText}`);
      }
      const updatedEntry = await response.json();
      setShowEditModal(false);
      setEditEntryId(null);
      setEditFormData({
        storeName: "",
        address: "",
        personnel: "",
        insight: "",
        competitorAnalysis: { competitor: "", item: "", color: "" },
      });
      window.location.reload(); // Temporary solution; ideally, update state in parent
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/sheets/${currentSheet._id}/entries/${deleteEntryId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete entry: ${errorText}`);
      }
      setShowDeleteModal(false);
      setDeleteEntryId(null);
      window.location.reload(); // Temporary solution; ideally, update state in parent
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Format competitorAnalysis for tooltip
  const formatCompetitorAnalysis = (competitorAnalysis) => {
    if (!competitorAnalysis) return "-";
    const parts = [];
    if (competitorAnalysis.competitor?.name) {
      parts.push(`Competitor: ${competitorAnalysis.competitor.name}`);
    }
    if (competitorAnalysis.item?.name) {
      parts.push(`Item: ${competitorAnalysis.item.name}`);
    }
    if (competitorAnalysis.color?.name) {
      parts.push(`Color: ${competitorAnalysis.color.name}`);
    }
    if (competitorAnalysis.item?.description) {
      parts.push(`Desc: ${competitorAnalysis.item.description}`);
    }
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  // Group rows by competitor name
  const groupByCompetitor = (data) => {
    const grouped = {};
    data.forEach((row) => {
      const competitorName = row.competitorAnalysis?.competitor?.name || "No Competitor";
      if (!grouped[competitorName]) {
        grouped[competitorName] = [];
      }
      grouped[competitorName].push(row);
    });
    return grouped;
  };

  const groupedData = groupByCompetitor(paginatedData);

  return (
    <div className="p-1 bg-white h-full">
      {!currentSheet ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-600">
          <FileText className="w-6 h-6 text-gray-300 mb-2" />
          <p className="text-sm">No sheet selected. Please select or create a sheet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200 w-full">
          <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex flex-row space-x-4">
            <h3 className="text-sm font-semibold text-gray-900">Report: {currentSheet.name}</h3>
            <p className="text-sm text-gray-600">Hours: {currentSheet.hours}</p>
            <p className="text-sm text-blue-600">Total Entries: {totalRows}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-400">
                  <th className="px-2 py-1 text-left text-sm font-bold text-gray-900 border-r border-gray-300 w-12">
                    Order
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-bold text-gray-900 border-r border-gray-300 w-48">
                    Store Name
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-bold text-gray-900 border-r border-gray-300 w-40">
                    Address
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-bold text-gray-900 border-r border-gray-300 w-32">
                    Personnel
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-bold text-gray-900 border-r border-gray-300 w-64">
                    Insight
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-bold text-gray-900 border-r border-gray-300 w-48">
                    Comp. Analysis
                  </th>
                  <th className="px-2 py-1 text-left text-sm font-bold text-gray-900 w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              {Object.keys(groupedData).length === 0 ? (
                <tbody>
                  <tr>
                    <td
                      colSpan="7"
                      className="px-2 py-6 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-300" />
                        <p className="text-sm">
                          No data entries yet. Add your first entry using the form.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                Object.keys(groupedData).map((competitorName, index) => (
                  <tbody
                    key={competitorName + index}
                    className="border-2 border-gray-300 mb-2"
                  >
                    {groupedData[competitorName].map((row, rowIndex) => (
                      <tr
                        key={row._id || row.id}
                        className="bg-white hover:bg-gray-50 border-b border-gray-200"
                      >
                        <td className="px-2 py-1 text-sm text-gray-900 border-r border-gray-200">
                          {row.order}
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-900 border-r border-gray-200">
                          <div className="font-medium">{row.storeName}</div>
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-900 border-r border-gray-200">
                          {row.address}
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-900 border-r border-gray-200">
                          {row.personnel}
                        </td>
                        <td className="px-2 py-1 text-sm text-gray-900 border-r border-gray-200">
                          <div className="max-w-[240px] truncate" title={row.insight}>
                            {row.insight}
                          </div>
                        </td>
                     <td className="px-3 py-2 text-xs text-gray-900 align-top border-r border-gray-200">
  <div className="flex gap-2">
    {/* Competitor Name */}
    <div className="w-1/3 pr-3 border-r border-gray-300">
      <span className="block text-[11px] font-semibold text-gray-800 truncate">
        {row.competitorAnalysis?.competitor?.name || "-"}
      </span>
    </div>

    {/* Image, Color, and Item Details */}
    <div className="w-2/3 flex flex-col gap-1.5">
      <div className="flex items-start gap-2">
        {/* Item Image */}
        {row.competitorAnalysis?.item?.image?.url ? (
          <img
            src={row.competitorAnalysis.item.image.url}
            alt={row.competitorAnalysis.item.name}
            className="w-10 h-10 rounded-md object-cover border border-gray-300"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 text-[10px] text-gray-400 rounded-md">
            No Image
          </div>
        )}

        {/* Color Info & Item Name */}
        <div className="flex flex-col gap-1">
          {row.competitorAnalysis?.color?.hexCode && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium text-gray-700">
                {row.competitorAnalysis.color.name}
              </span>
              <span>:</span>
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{
                  backgroundColor: row.competitorAnalysis.color.hexCode,
                }}
              />
            </div>
          )}
          <p className="text-[10px] text-gray-600 font-medium leading-snug">
            Name: {row.competitorAnalysis?.item?.name || "N/A"}
          </p>
        </div>
      </div>

      {/* Item Description */}
      {row.competitorAnalysis?.item?.description && (
        <p className="text-[10px] text-gray-600 leading-snug mt-1">
          {row.competitorAnalysis.item.description}
        </p>
      )}
    </div>
  </div>
</td>

                        <td className="px-2 py-1 text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(row)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(row._id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))
              )}
            </table>
          </div>

          {totalRows > rowsPerPage && (
            <div className="flex items-center justify-between p-1 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalRows)} of {totalRows} entries
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                <div className="flex items-center gap-0.5">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-1.5 py-0.5 rounded-md transition-all text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Edit Entry Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Edit Entry
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditEntryId(null);
                  setEditFormData({
                    storeName: "",
                    address: "",
                    personnel: "",
                    insight: "",
                    competitorAnalysis: { competitor: "", item: "", color: "" },
                  });
                }}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={editFormData.storeName}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      storeName: e.target.value,
                    }))
                  }
                  className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  placeholder="Enter store name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Address
                </label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Personnel
                </label>
                <input
                  type="text"
                  value={editFormData.personnel}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      personnel: e.target.value,
                    }))
                  }
                  className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  placeholder="Enter personnel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Insight
                </label>
                <textarea
                  value={editFormData.insight}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      insight: e.target.value,
                    }))
                  }
                  className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  rows="2"
                  placeholder="Enter insights..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Competitor Analysis
                </label>
                <div className="grid grid-cols-1 gap-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Competitor
                    </label>
                    <select
                      value={editFormData.competitorAnalysis.competitor}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          competitorAnalysis: {
                            ...prev.competitorAnalysis,
                            competitor: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    >
                      <option value="">Select a Competitor</option>
                      {competitorAnalysisOptions.competitors.map((competitor) => (
                        <option key={competitor._id} value={competitor._id}>
                          {competitor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Item
                    </label>
                    <select
                      value={editFormData.competitorAnalysis.item}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          competitorAnalysis: {
                            ...prev.competitorAnalysis,
                            item: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    >
                      <option value="">Select an Item</option>
                      {competitorAnalysisOptions.items.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Color
                    </label>
                    <select
                      value={editFormData.competitorAnalysis.color}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          competitorAnalysis: {
                            ...prev.competitorAnalysis,
                            color: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    >
                      <option value="">Select a Color</option>
                      {competitorAnalysisOptions.colors.map((color) => (
                        <option key={color._id} value={color._id}>
                          {color.name} ({color.hexCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                disabled={loading || !editFormData.storeName.trim()}
              >
                {loading ? (
                  <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditEntryId(null);
                  setEditFormData({
                    storeName: "",
                    address: "",
                    personnel: "",
                    insight: "",
                    competitorAnalysis: { competitor: "", item: "", color: "" },
                  });
                }}
                className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
          <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Delete Entry
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteEntryId(null);
                }}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete this entry? This action cannot be undone.
            </p>
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleDeleteSubmit}
                className="bg-red-600 text-white px-2 py-0.5 rounded-md hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Delete"
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteEntryId(null);
                }}
                className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;