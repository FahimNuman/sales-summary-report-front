import React from "react";
import { Plus, Upload, X, Search, ChevronDown, FileText } from "lucide-react";

const DataEntryMainForm = ({
  formData,
  setFormData,
  searchTerm,
  setSearchTerm,
  showStoreDropdown,
  setShowStoreDropdown,
  uploadedFiles,
  setUploadedFiles,
  loading,
  addRow,
  filteredStores,
  selectedStore,
  availableAddresses,
  availablePersonnel,
  handleInputChange,
  handleFileUpload,
  removeFile,
  setShowAddStoreForm,
  competitorAnalysisOptions,
}) => {
  return (
    <div className="bg-sky-50 rounded-md shadow-sm p-2 border border-gray-200">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900">Data Entry</h3>
        <button
          onClick={() => setShowAddStoreForm(true)}
          className="flex items-center gap-0.5 text-sm bg-gray-100 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-200 transition-all"
        >
          <Plus className="w-2.5 h-2.5" /> Add Store
        </button>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Store Name *</label>
          <div className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowStoreDropdown(true);
                }}
                onFocus={() => setShowStoreDropdown(true)}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="Search stores..."
              />
              <Search className="absolute right-1 top-1.5 w-2.5 h-2.5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowStoreDropdown(!showStoreDropdown)}
              className="px-1 py-0.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-all"
            >
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
          {showStoreDropdown && (
            <div className="absolute z-10 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredStores.length === 0 ? (
                <div className="px-1 py-0.5 text-sm text-gray-600">No stores found</div>
              ) : (
                filteredStores.map((store) => (
                  <button
                    key={store._id}
                    onClick={() => {
                      handleInputChange("storeName", store.storeName);
                      setShowStoreDropdown(false);
                      setSearchTerm("");
                    }}
                    className="w-full px-1 py-0.5 text-left hover:bg-gray-100 transition-all text-sm"
                  >
                    {store.storeName}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Address</label>
          <select
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            disabled={!selectedStore}
          >
            <option value="">Select address</option>
            {availableAddresses.map((address, index) => (
              <option key={index} value={address}>{address}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Personnel</label>
          <select
            value={formData.personnel}
            onChange={(e) => handleInputChange("personnel", e.target.value)}
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            disabled={!selectedStore}
          >
            <option value="">Select personnel</option>
            {availablePersonnel.map((person, index) => (
              <option key={index} value={person}>{person}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Insight</label>
          <textarea
            value={formData.insight}
            onChange={(e) => handleInputChange("insight", e.target.value)}
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            rows="2"
            placeholder="Enter insights..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Validation Notes</label>
          <textarea
            value={formData.validationNotes}
            onChange={(e) => handleInputChange("validationNotes", e.target.value)}
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            rows="2"
            placeholder="Enter validation notes..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Competitor Analysis</label>
          <div className="grid grid-cols-1 gap-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Competitor</label>
              <select
                value={formData.competitorAnalysis.competitor}
                onChange={(e) => handleInputChange("competitorAnalysis.competitor", e.target.value)}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              >
                <option value="">Select a Competitor</option>
                {competitorAnalysisOptions.competitors.map((competitor) => (
                  <option key={competitor._id} value={competitor._id}>{competitor.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Item</label>
              <select
                value={formData.competitorAnalysis.item}
                onChange={(e) => handleInputChange("competitorAnalysis.item", e.target.value)}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              >
                <option value="">Select an Item</option>
                {competitorAnalysisOptions.items.map((item) => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">Color</label>
              <select
                value={formData.competitorAnalysis.color}
                onChange={(e) => handleInputChange("competitorAnalysis.color", e.target.value)}
                className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              >
                <option value="">Select a Color</option>
                {competitorAnalysisOptions.colors.map((color) => (
                  <option key={color._id} value={color._id}>{color.name} ({color.hexCode})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-1 hover:border-blue-400 transition-all">
            <input
              type="file"
              id="file-upload"
              accept="image/jpeg, image/png, application/pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-4 h-4 text-gray-400 mb-0.5" />
              <span className="text-sm text-gray-600">Upload or drag and drop</span>
              <span className="text-sm text-gray-500">Images, PDFs</span>
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 p-1 rounded-md"
                >
                  <div className="flex items-center gap-1">
                    {file.type.startsWith("image/") && file.url ? (
                      <img
                        src={file.url || ""}
                        alt={file.name}
                        className="w-4 h-4 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-4 h-4 bg-blue-100 rounded-md flex items-center justify-center">
                        <FileText className="w-2.5 h-2.5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-0.5 text-red-500 hover:text-red-700 transition-all"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
      <button
        onClick={addRow}
        className="w-full mt-2 bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
        disabled={loading || !formData.storeName.trim()}
      >
        {loading ? (
          <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "Add Entry"
        )}
      </button>
    </div>
  );
};

export default DataEntryMainForm;