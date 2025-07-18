export const exportToCSV = async (sheetId, sheetName) => {
  if (!sheetId) return;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sheets/${sheetId}/export`);
    if (!response.ok) throw new Error("Failed to export sheet");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sheetName.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting sheet:", error);
    alert("Failed to export sheet: " + error.message);
  }
};

export const exportAllToExcel = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sheets/export/all`);
    if (!response.ok) throw new Error("Failed to export all sheets");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "All_Sheets.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting all sheets:", error);
    alert("Failed to export all sheets: " + error.message);
  }
};