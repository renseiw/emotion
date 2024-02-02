function setupExportButton() {
    let exportButton = select('#exportButton');
    exportButton.mousePressed(exportCSV);
}

function exportCSV() {
    // Erstelle einen String für die CSV-Datei
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Füge die Header der CSV-Datei hinzu
    csvContent += "Zeit," + emotionData.map(e => e.emotion).join(",") + "\r\n";

    // Füge die Daten der Tabelle hinzu
    selectAll('tr', 'table').forEach(row => {
        let rowData = [];
        row.elt.childNodes.forEach(td => {
            rowData.push(td.innerHTML);
        });
        csvContent += rowData.join(",") + "\r\n";
    });

    // Erstelle einen Download-Link und klicke darauf
    let encodedUri = encodeURI(csvContent);
    let link = createA(encodedUri, 'export.csv');
    link.attribute('download', 'emotion_data.csv');
    link.elt.click();
    link.remove();
}

// Führe setupExportButton aus, sobald die Seite geladen ist
window.onload = function() {
    document.getElementById('exportButton').addEventListener('click', exportCSV);
};