// src/components/RemoveButton.tsx

import React from "react";

interface IRemoveButton {
  itemId: string;
  onRemove: (itemId: string) => void;
}

export const RemoveButton: React.FC<IRemoveButton> = ({ itemId, onRemove }) => {
  const handleRemove = () => {
    onRemove(itemId);
  };

  return (
    <button className="button" onClick={handleRemove}>
      Remove
    </button>
  );
};
