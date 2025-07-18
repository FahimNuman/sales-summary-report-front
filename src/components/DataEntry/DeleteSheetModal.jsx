import React from "react";
import { X } from "lucide-react";

const DeleteSheetModal = ({
  showDeleteSheetModal,
  setShowDeleteSheetModal,
  deleteSheetId,
  setDeleteSheetId,
  loading,
  deleteSheet,
  sheets,
}) => {
  if (!showDeleteSheetModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
      <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Delete Sheet</h3>
          <button
            onClick={() => {
              setShowDeleteSheetModal(false);
              setDeleteSheetId(null);
            }}
            className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Are you sure you want to delete the sheet "{sheets.find((s) => s._id === deleteSheetId)?.name}"? This action cannot be undone.
        </p>
        <div className="flex gap-1 mt-2">
          <button
            onClick={deleteSheet}
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
              setShowDeleteSheetModal(false);
              setDeleteSheetId(null);
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

export default DeleteSheetModal;