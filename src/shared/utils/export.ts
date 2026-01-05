/**
 * Export Utilities
 * Functions for exporting data to CSV
 */

/**
 * Converts an array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, unknown>>(data: T[], columns?: { key: keyof T; header: string }[]): string {
    if (data.length === 0) return '';

    const keys = columns ? columns.map(c => c.key) : Object.keys(data[0] as object) as (keyof T)[];
    const headers = columns ? columns.map(c => c.header) : keys.map(String);

    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            keys.map(key => {
                const value = row[key];
                // Escape quotes and wrap in quotes if contains comma
                const cellValue = String(value ?? '').replace(/"/g, '""');
                return cellValue.includes(',') || cellValue.includes('\n') ? `"${cellValue}"` : cellValue;
            }).join(',')
        ),
    ];

    return csvRows.join('\n');
}

/**
 * Downloads a string as a file
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Exports data to CSV and triggers download
 */
export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; header: string }[]
) {
    const csv = arrayToCSV(data, columns);
    downloadFile(csv, filename);
}
