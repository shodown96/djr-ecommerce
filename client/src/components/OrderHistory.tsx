import React from "react";

const BasicTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">#</th>
            <th className="border px-4 py-2 text-left">First</th>
            <th className="border px-4 py-2 text-left">Last</th>
            <th className="border px-4 py-2 text-left">Handle</th>
          </tr>
        </thead>

        <tbody>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">Mark</td>
            <td className="border px-4 py-2">Otto</td>
            <td className="border px-4 py-2">@mdo</td>
          </tr>

          <tr className="odd:bg-white even:bg-gray-50">
            <td className="border px-4 py-2">2</td>
            <td className="border px-4 py-2">Jacob</td>
            <td className="border px-4 py-2">Thornton</td>
            <td className="border px-4 py-2">@fat</td>
          </tr>

          <tr className="odd:bg-white even:bg-gray-50">
            <td className="border px-4 py-2">3</td>
            <td className="border px-4 py-2">Larry</td>
            <td className="border px-4 py-2">the Bird</td>
            <td className="border px-4 py-2">@twitter</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BasicTable;
