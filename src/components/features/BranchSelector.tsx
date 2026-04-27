// src/components/features/BranchSelector.tsx

"use client";

import { useCart } from "@/context/CartContext";
import branches from "@/data/branches.json";

export default function BranchSelector() {
  const { selectedBranch, setSelectedBranch } = useCart();

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">
        Select Branch
      </h3>

      <select
        className="w-full p-2 border rounded"
        value={selectedBranch || ""}
        onChange={(e) => setSelectedBranch(e.target.value)}
      >
        <option value="">-- Choose Branch --</option>

        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name} - {branch.location}
          </option>
        ))}
      </select>
    </div>
  );
}