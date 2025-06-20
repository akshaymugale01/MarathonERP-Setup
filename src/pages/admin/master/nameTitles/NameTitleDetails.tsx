import { useState, useEffect } from "react";
import { getNameTitleById } from "../../../../services/nameTitles";

interface ViewNameTitleModalProps {
  id: number;
  onClose: () => void;
}

export default function ViewNameTitleModal({ id, onClose }: ViewNameTitleModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    getNameTitleById(id).then((data) => {
      setName(data.name);
    });
  }, [id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-red-800">Name Titles</h2>
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Names Title</span>
          <span className="text-black">{name}</span>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="border border-red-800 text-red-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
