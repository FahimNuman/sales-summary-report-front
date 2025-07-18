import React, { useState } from "react";
import { Plus, X, Edit, Trash } from "lucide-react";

const ColorManagement = ({
  colors,
  setColors,
  showAddColorForm,
  setShowAddColorForm,
  showEditColorForm,
  setShowEditColorForm,
  editColorData,
  setEditColorData,
  showDeleteColorModal,
  setShowDeleteColorModal,
  deleteColorId,
  setDeleteColorId,
  loading,
  setLoading,
  API_URL,
  fetchWithRetry,
}) => {
  const [colorSearchTerm, setColorSearchTerm] = useState("");
  const [newColor, setNewColor] = useState({ name: "", hexCode: "" });

  const handleAddColor = async () => {
    if (!newColor.name.trim() || !newColor.hexCode.trim()) {
      alert("Please enter both a color name and a valid hex code.");
      return;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(newColor.hexCode)) {
      alert("Please enter a valid hex code (e.g., #FF0000).");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColor),
      });
      if (!response.ok) throw new Error("Failed to add color");
      const addedColor = await response.json();
      setColors((prev) => [...(prev || []), addedColor]);
      setNewColor({ name: "", hexCode: "" });
      setShowAddColorForm(false);
    } catch (error) {
      console.error("Error adding color:", error);
      alert("Failed to add color: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditColor = async () => {
    if (!editColorData.name.trim() || !editColorData.hexCode.trim()) {
      alert("Please enter both a color name and a valid hex code.");
      return;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(editColorData.hexCode)) {
      alert("Please enter a valid hex code (e.g., #FF0000).");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/colors/${editColorData.colorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editColorData.name,
          hexCode: editColorData.hexCode,
        }),
      });
      if (!response.ok) throw new Error("Failed to update color");
      const updatedColor = await response.json();
      setColors((prev) =>
        prev.map((color) => (color._id === editColorData.colorId ? updatedColor : color))
      );
      setShowEditColorForm(false);
      setEditColorData({ colorId: null, name: "", hexCode: "" });
    } catch (error) {
      console.error("Error updating color:", error);
      alert("Failed to update color: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColor = async () => {
    if (!deleteColorId) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/colors/${deleteColorId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete color");
      setColors((prev) => prev.filter((color) => color._id !== deleteColorId));
      setShowDeleteColorModal(false);
      setDeleteColorId(null);
    } catch (error) {
      console.error("Error deleting color:", error);
      alert("Failed to delete color: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Safely filter colors, ensuring no undefined or null values
  const filteredColors = (colors || []).filter((color) =>
    color?.name?.toLowerCase?.()?.includes?.(colorSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-md shadow-sm p-2 border border-gray-200">
      <h3 className="text-sm font-semibold mb-1 text-gray-900">Manage Colors</h3>
      <div className="mb-2">
        <input
          type="text"
          value={colorSearchTerm}
          onChange={(e) => setColorSearchTerm(e.target.value)}
          className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
          placeholder="Search colors..."
        />
      </div>
      <button
        onClick={() => setShowAddColorForm(true)}
        className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mb-2"
      >
        <Plus className="w-2.5 h-2.5" /> Add New Color
      </button>
      {showAddColorForm && (
        <div className="mb-2 p-2 border border-gray-200 rounded-md">
          <div className="grid grid-cols-2 gap-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Color Name</label>
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter color name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Hex Code</label>
              <input
                type="text"
                value={newColor.hexCode}
                onChange={(e) => setNewColor((prev) => ({ ...prev, hexCode: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="#FF0000"
              />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleAddColor}
              className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Add Color"
              )}
            </button>
            <button
              onClick={() => {
                setShowAddColorForm(false);
                setNewColor({ name: "", hexCode: "" });
              }}
              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showEditColorForm && (
        <div className="mb-2 p-2 border border-gray-200 rounded-md">
          <div className="grid grid-cols-2 gap-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Color Name</label>
              <input
                type="text"
                value={editColorData.name}
                onChange={(e) =>
                  setEditColorData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter color name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Hex Code</label>
              <input
                type="text"
                value={editColorData.hexCode}
                onChange={(e) =>
                  setEditColorData((prev) => ({ ...prev, hexCode: e.target.value }))
                }
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="#FF0000"
              />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleEditColor}
              className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              onClick={() => {
                setShowEditColorForm(false);
                setEditColorData({ colorId: null, name: "", hexCode: "" });
              }}
              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showDeleteColorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
          <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Delete Color</h3>
              <button
                onClick={() => {
                  setShowDeleteColorModal(false);
                  setDeleteColorId(null);
                }}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete the color "
              {colors.find((c) => c._id === deleteColorId)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleDeleteColor}
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
                  setShowDeleteColorModal(false);
                  setDeleteColorId(null);
                }}
                className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {filteredColors.length === 0 ? (
          <p className="text-sm text-gray-600">No colors found</p>
        ) : (
          filteredColors.map((color) => (
            <div
              key={color._id}
              className="flex items-center justify-between p-1 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hexCode }}
                ></div>
                <span className="text-sm text-gray-900">{color.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditColorData({
                      colorId: color._id,
                      name: color.name,
                      hexCode: color.hexCode,
                    });
                    setShowEditColorForm(true);
                  }}
                  className="p-0.5 text-blue-500 hover:text-blue-700 transition-all"
                >
                  <Edit className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => {
                    setDeleteColorId(color._id);
                    setShowDeleteColorModal(true);
                  }}
                  className="p-0.5 text-red-500 hover:text-red-700 transition-all"
                >
                  <Trash className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ColorManagement;