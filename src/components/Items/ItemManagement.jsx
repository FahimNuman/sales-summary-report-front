import React, { useState } from "react";
import { Plus, X, Edit, Trash, Search } from "lucide-react";

const ItemManagement = ({
  items,
  setItems,
  showAddItemForm,
  setShowAddItemForm,
  showEditItemForm,
  setShowEditItemForm,
  editItemData,
  setEditItemData,
  showDeleteItemModal,
  setShowDeleteItemModal,
  deleteItemId,
  setDeleteItemId,
  loading,
  setLoading,
  API_URL,
  fetchWithRetry,
}) => {
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: null,
  });

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.price) {
      alert("Please enter both an item name and price.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("description", newItem.description);
      formData.append("category", newItem.category);
      formData.append("price", newItem.price);
      formData.append("stock", newItem.stock);
      if (newItem.image) {
        formData.append("image", newItem.image);
      }

      const response = await fetchWithRetry(`${API_URL}/api/items`, {
        method: "POST",
        body: formData, // No Content-Type header; FormData sets it automatically
      });
      if (!response.ok) throw new Error("Failed to add item");
      const addedItem = await response.json();
      setItems((prev) => [...(prev || []), addedItem]);
      setNewItem({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image: null,
      });
      setShowAddItemForm(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = async () => {
    if (!editItemData.name.trim() || !editItemData.price) {
      alert("Please enter both an item name and price.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editItemData.name);
      formData.append("description", editItemData.description);
      formData.append("category", editItemData.category);
      formData.append("price", editItemData.price);
      formData.append("stock", editItemData.stock);
      if (editItemData.image) {
        formData.append("image", editItemData.image);
      }

      const response = await fetchWithRetry(`${API_URL}/api/items/${editItemData.itemId}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update item");
      const updatedItem = await response.json();
      setItems((prev) =>
        prev.map((item) => (item._id === editItemData.itemId ? updatedItem : item))
      );
      setShowEditItemForm(false);
      setEditItemData({
        itemId: null,
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image: null,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/items/${deleteItemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((item) => item._id !== deleteItemId));
      setShowDeleteItemModal(false);
      setDeleteItemId(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = (items || []).filter((item) =>
    item?.name?.toLowerCase?.()?.includes?.(itemSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-md shadow-sm p-2 border border-gray-200">
      <h3 className="text-sm font-semibold mb-1 text-gray-900">Manage Items</h3>
      <div className="mb-2 relative">
        <input
          type="text"
          value={itemSearchTerm}
          onChange={(e) => setItemSearchTerm(e.target.value)}
          className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all pl-6"
          placeholder="Search items..."
        />
        <Search className="absolute left-1 top-1.5 w-2.5 h-2.5 text-gray-400" />
      </div>
      <button
        onClick={() => setShowAddItemForm(true)}
        className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mb-2"
      >
        <Plus className="w-2.5 h-2.5" /> Add New Item
      </button>
      {showAddItemForm && (
        <div className="mb-2 p-2 border border-gray-200 rounded-md">
          <div className="grid grid-cols-1 gap-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Item Name *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                rows="2"
                placeholder="Enter description..."
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Category</label>
              <input
                type="text"
                value={newItem.category}
                onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter category"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Price *</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter price"
                step="0.01"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Stock</label>
              <input
                type="number"
                value={newItem.stock}
                onChange={(e) => setNewItem((prev) => ({ ...prev, stock: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter stock quantity"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => setNewItem((prev) => ({ ...prev, image: e.target.files[0] }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md text-sm transition-all"
              />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleAddItem}
              className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Add Item"
              )}
            </button>
            <button
              onClick={() => {
                setShowAddItemForm(false);
                setNewItem({
                  name: "",
                  description: "",
                  category: "",
                  price: "",
                  stock: "",
                  image: null,
                });
              }}
              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showEditItemForm && (
        <div className="mb-2 p-2 border border-gray-200 rounded-md">
          <div className="grid grid-cols-1 gap-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Item Name *</label>
              <input
                type="text"
                value={editItemData.name}
                onChange={(e) => setEditItemData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Description</label>
              <textarea
                value={editItemData.description}
                onChange={(e) => setEditItemData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                rows="2"
                placeholder="Enter description..."
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Category</label>
              <input
                type="text"
                value={editItemData.category}
                onChange={(e) => setEditItemData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter category"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Price *</label>
              <input
                type="number"
                value={editItemData.price}
                onChange={(e) => setEditItemData((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter price"
                step="0.01"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Stock</label>
              <input
                type="number"
                value={editItemData.stock}
                onChange={(e) => setEditItemData((prev) => ({ ...prev, stock: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter stock quantity"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => setEditItemData((prev) => ({ ...prev, image: e.target.files[0] }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md text-sm transition-all"
              />
              {editItemData.image?.url && (
                <div className="mt-1">
                  <img
                    src={editItemData.image.url}
                    alt="Current item"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleEditItem}
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
                setShowEditItemForm(false);
                setEditItemData({
                  itemId: null,
                  name: "",
                  description: "",
                  category: "",
                  price: "",
                  stock: "",
                  image: null,
                });
              }}
              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showDeleteItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
          <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Delete Item</h3>
              <button
                onClick={() => {
                  setShowDeleteItemModal(false);
                  setDeleteItemId(null);
                }}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete the item "
              {items.find((i) => i._id === deleteItemId)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleDeleteItem}
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
                  setShowDeleteItemModal(false);
                  setDeleteItemId(null);
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
        {filteredItems.length === 0 ? (
          <p className="text-sm text-gray-600">No items found</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-1 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-1">
                {item.image?.url && (
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="w-6 h-6 object-cover rounded-md"
                  />
                )}
                <span className="text-sm text-gray-900">{item.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditItemData({
                      itemId: item._id,
                      name: item.name,
                      description: item.description || "",
                      category: item.category || "",
                      price: item.price || "",
                      stock: item.stock || "",
                      image: item.image || { url: "", public_id: "" },
                    });
                    setShowEditItemForm(true);
                  }}
                  className="p-0.5 text-blue-500 hover:text-blue-700 transition-all"
                >
                  <Edit className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => {
                    setDeleteItemId(item._id);
                    setShowDeleteItemModal(true);
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

export default ItemManagement;