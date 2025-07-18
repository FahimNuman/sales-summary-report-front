import React, { useState } from "react";
import { Plus, X, Edit, Trash, Search } from "lucide-react";

const CompetitorManagement = ({
  competitors,
  setCompetitors,
  showAddCompetitorForm,
  setShowAddCompetitorForm,
  showEditCompetitorForm,
  setShowEditCompetitorForm,
  editCompetitorData,
  setEditCompetitorData,
  showDeleteCompetitorModal,
  setShowDeleteCompetitorModal,
  deleteCompetitorId,
  setDeleteCompetitorId,
  loading,
  setLoading,
  API_URL,
  fetchWithRetry,
}) => {
  const [competitorSearchTerm, setCompetitorSearchTerm] = useState("");
  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    address: "",
    contacts: [{ personName: "", email: "", phone: "", website: "" }],
    website: "",
    notes: "",
  });

  const handleAddCompetitor = async () => {
    if (!newCompetitor.name.trim() || !newCompetitor.address.trim()) {
      alert("Please enter both a competitor name and address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompetitor),
      });
      if (!response.ok) throw new Error("Failed to add competitor");
      const addedCompetitor = await response.json();
      setCompetitors((prev) => [...(prev || []), addedCompetitor]);
      setNewCompetitor({
        name: "",
        address: "",
        contacts: [{ personName: "", email: "", phone: "", website: "" }],
        website: "",
        notes: "",
      });
      setShowAddCompetitorForm(false);
    } catch (error) {
      console.error("Error adding competitor:", error);
      alert("Failed to add competitor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompetitor = async () => {
    if (!editCompetitorData.name.trim() || !editCompetitorData.address.trim()) {
      alert("Please enter both a competitor name and address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/competitors/${editCompetitorData.competitorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCompetitorData),
      });
      if (!response.ok) throw new Error("Failed to update competitor");
      const updatedCompetitor = await response.json();
      setCompetitors((prev) =>
        prev.map((competitor) => (competitor._id === editCompetitorData.competitorId ? updatedCompetitor : competitor))
      );
      setShowEditCompetitorForm(false);
      setEditCompetitorData({ competitorId: null, name: "", address: "", contacts: [], website: "", notes: "" });
    } catch (error) {
      console.error("Error updating competitor:", error);
      alert("Failed to update competitor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompetitor = async () => {
    if (!deleteCompetitorId) return;
    setLoading(true);
    try {
      const response = await fetchWithRetry(`${API_URL}/api/competitors/${deleteCompetitorId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete competitor");
      setCompetitors((prev) => prev.filter((competitor) => competitor._id !== deleteCompetitorId));
      setShowDeleteCompetitorModal(false);
      setDeleteCompetitorId(null);
    } catch (error) {
      console.error("Error deleting competitor:", error);
      alert("Failed to delete competitor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addContactField = () => {
    setNewCompetitor((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { personName: "", email: "", phone: "", website: "" }],
    }));
  };

  const updateContactField = (index, field, value) => {
    setNewCompetitor((prev) => {
      const updatedContacts = [...prev.contacts];
      updatedContacts[index] = { ...updatedContacts[index], [field]: value };
      return { ...prev, contacts: updatedContacts };
    });
  };

  const removeContactField = (index) => {
    setNewCompetitor((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const updateEditContactField = (index, field, value) => {
    setEditCompetitorData((prev) => {
      const updatedContacts = [...prev.contacts];
      updatedContacts[index] = { ...updatedContacts[index], [field]: value };
      return { ...prev, contacts: updatedContacts };
    });
  };

  const addEditContactField = () => {
    setEditCompetitorData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { personName: "", email: "", phone: "", website: "" }],
    }));
  };

  const removeEditContactField = (index) => {
    setEditCompetitorData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const filteredCompetitors = (competitors || []).filter((competitor) =>
    competitor?.name?.toLowerCase?.()?.includes?.(competitorSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-md shadow-sm p-2 border border-gray-200">
      <h3 className="text-sm font-semibold mb-1 text-gray-900">Manage Competitors</h3>
      <div className="mb-2 relative">
        <input
          type="text"
          value={competitorSearchTerm}
          onChange={(e) => setCompetitorSearchTerm(e.target.value)}
          className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all pl-6"
          placeholder="Search competitors..."
        />
        <Search className="absolute left-1 top-1.5 w-2.5 h-2.5 text-gray-400" />
      </div>
      <button
        onClick={() => setShowAddCompetitorForm(true)}
        className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mb-2"
      >
        <Plus className="w-2.5 h-2.5" /> Add New Competitor
      </button>
      {showAddCompetitorForm && (
        <div className="mb-2 p-2 border border-gray-200 rounded-md">
          <div className="grid grid-cols-1 gap-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Competitor Name *</label>
              <input
                type="text"
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter competitor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Address *</label>
              <input
                type="text"
                value={newCompetitor.address}
                onChange={(e) => setNewCompetitor((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Contacts</label>
              {newCompetitor.contacts.map((contact, index) => (
                <div key={index} className="mb-2 p-2 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-1 gap-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Person Name *</label>
                      <input
                        type="text"
                        value={contact.personName}
                        onChange={(e) => updateContactField(index, "personName", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContactField(index, "email", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Phone</label>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => updateContactField(index, "phone", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Website</label>
                      <input
                        type="text"
                        value={contact.website}
                        onChange={(e) => updateContactField(index, "website", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact website"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      onClick={() => removeContactField(index)}
                      className="mt-1 p-0.5 text-red-500 hover:text-red-700 transition-all"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addContactField}
                className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mt-1"
              >
                <Plus className="w-2.5 h-2.5" /> Add Contact
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Website</label>
              <input
                type="text"
                value={newCompetitor.website}
                onChange={(e) => setNewCompetitor((prev) => ({ ...prev, website: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Notes</label>
              <textarea
                value={newCompetitor.notes}
                onChange={(e) => setNewCompetitor((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                rows="2"
                placeholder="Enter notes..."
              />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleAddCompetitor}
              className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Add Competitor"
              )}
            </button>
            <button
              onClick={() => {
                setShowAddCompetitorForm(false);
                setNewCompetitor({
                  name: "",
                  address: "",
                  contacts: [{ personName: "", email: "", phone: "", website: "" }],
                  website: "",
                  notes: "",
                });
              }}
              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showEditCompetitorForm && (
        <div className="mb-2 p-2 border border-gray-200 rounded-md">
          <div className="grid grid-cols-1 gap-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Competitor Name *</label>
              <input
                type="text"
                value={editCompetitorData.name}
                onChange={(e) => setEditCompetitorData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter competitor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Address *</label>
              <input
                type="text"
                value={editCompetitorData.address}
                onChange={(e) => setEditCompetitorData((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Contacts</label>
              {editCompetitorData.contacts.map((contact, index) => (
                <div key={index} className="mb-2 p-2 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-1 gap-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Person Name *</label>
                      <input
                        type="text"
                        value={contact.personName}
                        onChange={(e) => updateEditContactField(index, "personName", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateEditContactField(index, "email", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Phone</label>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => updateEditContactField(index, "phone", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">Website</label>
                      <input
                        type="text"
                        value={contact.website}
                        onChange={(e) => updateEditContactField(index, "website", e.target.value)}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        placeholder="Contact website"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      onClick={() => removeEditContactField(index)}
                      className="mt-1 p-0.5 text-red-500 hover:text-red-700 transition-all"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEditContactField}
                className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all mt-1"
              >
                <Plus className="w-2.5 h-2.5" /> Add Contact
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Website</label>
              <input
                type="text"
                value={editCompetitorData.website}
                onChange={(e) => setEditCompetitorData((prev) => ({ ...prev, website: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Enter website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Notes</label>
              <textarea
                value={editCompetitorData.notes}
                onChange={(e) => setEditCompetitorData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                rows="2"
                placeholder="Enter notes..."
              />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleEditCompetitor}
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
                setShowEditCompetitorForm(false);
                setEditCompetitorData({ competitorId: null, name: "", address: "", contacts: [], website: "", notes: "" });
              }}
              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showDeleteCompetitorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
          <div className="bg-white rounded-md shadow-xl w-full max-w-xs p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Delete Competitor</h3>
              <button
                onClick={() => {
                  setShowDeleteCompetitorModal(false);
                  setDeleteCompetitorId(null);
                }}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete the competitor "
              {competitors.find((c) => c._id === deleteCompetitorId)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleDeleteCompetitor}
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
                  setShowDeleteCompetitorModal(false);
                  setDeleteCompetitorId(null);
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
        {filteredCompetitors.length === 0 ? (
          <p className="text-sm text-gray-600">No competitors found</p>
        ) : (
          filteredCompetitors.map((competitor) => (
            <div
              key={competitor._id}
              className="flex items-center justify-between p-1 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-900">{competitor.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditCompetitorData({
                      competitorId: competitor._id,
                      name: competitor.name,
                      address: competitor.address,
                      contacts: competitor.contacts || [{ personName: "", email: "", phone: "", website: "" }],
                      website: competitor.website || "",
                      notes: competitor.notes || "",
                    });
                    setShowEditCompetitorForm(true);
                  }}
                  className="p-0.5 text-blue-500 hover:text-blue-700 transition-all"
                >
                  <Edit className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => {
                    setDeleteCompetitorId(competitor._id);
                    setShowDeleteCompetitorModal(true);
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

export default CompetitorManagement;