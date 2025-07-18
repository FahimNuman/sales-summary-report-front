import React from "react";
import { X } from "lucide-react";

const EditSheetModal = ({
  editSheetName,
  setEditSheetName,
  editSheetHours,
  setEditSheetHours,
  showEditSheetModal,
  setShowEditSheetModal,
  editSheetId,
  setEditSheetId,
  loading,
  editSheet,
}) => {
  if (!showEditSheetModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
      <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Edit Sheet</h3>
          <button
            onClick={() => {
              setShowEditSheetModal(false);
              setEditSheetId(null);
              setEditSheetName("");
              setEditSheetHours("");
            }}
            className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">Sheet Name</label>
            <input
              type="text"
              value={editSheetName}
              onChange={(e) => setEditSheetName(e.target.value)}
              className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              placeholder="Enter sheet name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">Hours</label>
            <input
              type="text"
              value={editSheetHours}
              onChange={(e) => setEditSheetHours(e.target.value)}
              className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              placeholder="e.g., 9:00 AM - 7:00 PM"
            />
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          <button
            onClick={editSheet}
            className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            disabled={loading || !editSheetName.trim()}
          >
            {loading ? (
              <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            onClick={() => {
              setShowEditSheetModal(false);
              setEditSheetId(null);
              setEditSheetName("");
              setEditSheetHours("");
            }}
            className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSheetModal;