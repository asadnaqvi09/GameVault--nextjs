'use client';

export default function DataTable({ columns, rows, onRowClick, emptyMessage = 'No records found.' }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 px-5 py-3.5"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-gray-50 last:border-0 ${
                  onRowClick ? 'hover:bg-[#5B42F3]/5 cursor-pointer transition-colors' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-sm text-gray-700 align-middle">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
