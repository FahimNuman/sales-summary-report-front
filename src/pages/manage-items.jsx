"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Search, ChevronDown } from "lucide-react";

const ManageItems = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editItem, setEditItem] = useState({ itemId: null, name: "", description: "", category: "", price: "", stock: "", image: null });
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetchWithRetry(`${API_URL}/api/items`);
        const data = await response.json();
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to fetch items: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [API_URL]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/items`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to add item");
      const newItem = await response.json();
      setItems((prev) => [...prev, newItem]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/items/${editItem.itemId}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update item");
      const updatedItem = await response.json();
      setItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!itemId) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/items/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      setShowDeleteModal(false);
      setDeleteItemId(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Items</h1>
      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
        <div className="relative mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search items..."
          />
          <Search className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="px-3 py-1 text-gray-600">No items found</div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="px-3 py-1 hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                    <div>
                      <button
                        onClick={() => {
                          setEditItem({
                            itemId: item._id,
                            name: item.name,
                            description: item.description || "",
                            category: item.category || "",
                            price: item.price || "",
                            stock: item.stock || "",
                            image: item.image || null,
                          });
                          setShowEditForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteItemId(item._id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddItem} className="bg-white p-4 rounded-md shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Add New Item</h2>
          <input type="text" name="name" placeholder="Name" className="w-full p-1 mb-2 border" required />
          <textarea name="description" placeholder="Description" className="w-full p-1 mb-2 border" />
          <input type="text" name="category" placeholder="Category" className="w-full p-1 mb-2 border" />
          <input type="number" name="price" placeholder="Price" step="0.01" className="w-full p-1 mb-2 border" required />
          <input type="number" name="stock" placeholder="Stock" className="w-full p-1 mb-2 border" />
          <input type="file" name="image" accept="image/jpeg,image/png" className="w-full p-1 mb-2 border" />
          <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
            Add
          </button>
          <button type="button" onClick={() => setShowAddForm(false)} className="ml-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        </form>
      )}

      {showEditForm && (
        <form onSubmit={handleUpdateItem} className="bg-white p-4 rounded-md shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Edit Item</h2>
          <input type="hidden" name="itemId" value={editItem.itemId} />
          <input type="text" name="name" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full p-1 mb-2 border" required />
          <textarea name="description" value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="w-full p-1 mb-2 border" />
          <input type="text" name="category" value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="w-full p-1 mb-2 border" />
          <input type="number" name="price" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} step="0.01" className="w-full p-1 mb-2 border" required />
          <input type="number" name="stock" value={editItem.stock} onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })} className="w-full p-1 mb-2 border" />
          <input type="file" name="image" className="w-full p-1 mb-2 border" />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
            Update
          </button>
          <button type="button" onClick={() => setShowEditForm(false)} className="ml-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        </form>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p>Are you sure you want to delete this item?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => handleDeleteItem(deleteItemId)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                Yes
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;