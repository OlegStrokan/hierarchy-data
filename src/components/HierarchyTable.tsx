import React, { createContext, useState } from "react";
import { Item } from "../interfaces/interfaces";
import { HierarchyRow } from "./HierarchyRow";
import "./HierarchyTable.css";
// Create a context for the expanded items state
export const ExpandedItemsContext = createContext<string[]>([]);

interface HierarchyTableProps {
  data: Item[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

export const HierarchyTable: React.FC<HierarchyTableProps> = ({
  data,
  setData,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  return (
    <ExpandedItemsContext.Provider value={expandedItems}>
      <table className="hierarchy-table">
        <thead>
          <tr className="hierarchy-row">
            {Object.keys(data[0].data).map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <HierarchyRow
              key={item.data.uniqueId}
              item={item}
              setExpandedItems={setExpandedItems}
              setData={setData}
            />
          ))}
        </tbody>
      </table>
    </ExpandedItemsContext.Provider>
  );
};
