import React from "react";
import { Package, ArrowLeft } from "lucide-react";

const ItemManagementToggle = ({ setShowItemManagement, showItemManagement }) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-2 mb-2 border border-gray-200">
      {showItemManagement ? (
        <button
          onClick={() => setShowItemManagement(false)}
          className="flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        >
          <ArrowLeft className="w-2.5 h-2.5" /> Back to Form
        </button>
      ) : (
        <button
          onClick={() => setShowItemManagement(true)}
          className="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        >
          <Package className="w-2.5 h-2.5" /> Manage Items
        </button>
      )}
    </div>
  );
};

export default ItemManagementToggle;