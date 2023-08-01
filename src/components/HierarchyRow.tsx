import React, { useContext } from "react";
import { Item } from "../interfaces/interfaces";
import { ExpandedItemsContext } from "./HierarchyTable";
import { RemoveButton } from "./RemoveButton";

interface HierarchyRowProps {
  item: Item;
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

export const HierarchyRow: React.FC<HierarchyRowProps> = ({
  item,
  setExpandedItems,
  setData,
}) => {
  const expandedItems = useContext(ExpandedItemsContext);

  const handleToggleExpand = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setData((prevData) => {
      const filterItemById = (items: Item[]): Item[] => {
        return items.reduce((filtered: any, item) => {
          if (item.records) {
            item.records = filterItemById(item.records);
            if (item.records.length > 0) {
              filtered.push(item);
            }
          } else if (item.data && item.data.uniqueId === itemId) {
            if (item.children && Object.keys(item.children).length > 0) {
              item.children = Object.keys(item.children).reduce(
                (filteredChildren: any, key) => {
                  const childGroup = item.children[key];
                  if (childGroup.records) {
                    const filteredRecords = filterItemById(childGroup.records);
                    if (filteredRecords.length > 0) {
                      filteredChildren[key] = {
                        ...childGroup,
                        records: filteredRecords,
                      };
                    }
                  } else {
                    const filteredChild = filterItemById([childGroup])[0];
                    if (filteredChild) {
                      filteredChildren[key] = filteredChild;
                    }
                  }
                  return filteredChildren;
                },
                {}
              );
            }
          } else {
            // Keep other items, including items with nested children
            if (item.children && Object.keys(item.children).length > 0) {
              item.children = filterItemById(Object.values(item.children));
            }
            filtered.push(item);
          }
          return filtered;
        }, []);
      };

      return filterItemById(prevData);
    });
  };

  const hasValidChildren = (children: any) => {
    // Check if any child group has records
    return Object.values(children).some(
      (childGroup: any) => childGroup.records.length > 0
    );
  };

  return (
    <>
      <tr>
        {item.data &&
          Object.values(item.data).map((value) => (
            <td key={item.data.uniqueId}>{value ?? null}</td>
          ))}
        <td>
          {item.data && (
            <RemoveButton
              itemId={item.data.uniqueId}
              onRemove={handleRemoveItem}
            />
          )}
          {/* Check if item has children with valid records before rendering the toggle button */}
          {item.children && hasValidChildren(item.children) && (
            <button
              className="button"
              onClick={() => handleToggleExpand(item.data.uniqueId)}
            >
              {expandedItems.includes(item.data.uniqueId)
                ? "Hide Children"
                : "Show Children"}
            </button>
          )}
        </td>
      </tr>
      {/* Check if item has children before rendering the nested rows */}
      {expandedItems.includes(item.data.uniqueId) &&
        item.children &&
        Object.values(item.children).map((childGroup: any) => {
          // Check if childGroup has records (has_nemesis.records or has_secrete.records)
          if (childGroup.records) {
            // If it has records, map through the records and render HierarchyRow for each child
            return childGroup.records.map((child: any) => (
              <HierarchyRow
                key={child.data.uniqueId}
                item={child}
                setExpandedItems={setExpandedItems}
                setData={setData}
              />
            ));
          } else {
            // If it doesn't have records, return null to skip rendering in this case
            return null;
          }
        })}
    </>
  );
};
