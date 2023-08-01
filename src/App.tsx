import { useEffect, useState } from "react";
import jsonData from "./example-data.json";
import { HierarchyTable } from "./components/HierarchyTable";
import { v4 as uuidv4 } from "uuid";
import { Item } from "./interfaces/interfaces";
import "./App.css";

export const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const addUniqueIdsRecursive = (item: any): Item => {
    const uniqueId = uuidv4();
    return {
      data: {
        uniqueId,
        ...item.data,
        // Map other fields as needed...
      },
      children: item.children
        ? Object.keys(item.children).reduce((childGroups: any, key) => {
            const childGroup = item.children[key];
            if (childGroup.records) {
              childGroups[key] = {
                ...childGroup,
                records: childGroup.records.map(addUniqueIdsRecursive),
              };
            } else {
              childGroups[key] = addUniqueIdsRecursive(childGroup);
            }
            return childGroups;
          }, {})
        : undefined,
    };
  };

  // Process the data and set it to the state when the component mounts
  useEffect(() => {
    isLoading(true);
    // Check if jsonData is available
    const processedData = jsonData.map(addUniqueIdsRecursive);
    setData(processedData);
    console.log(processedData);
    isLoading(false);
  }, []);

  return (
    <div className="app">
      {!loading && data.length > 0 && (
        <HierarchyTable data={data} setData={setData} />
      )}
    </div>
  );
};
