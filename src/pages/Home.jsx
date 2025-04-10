import React, { useEffect, useState } from "react";
import { getAllChecklists, createChecklist, deleteChecklist, renameChecklistItem } from "../api/api";

const Home = () => {
  const [checklists, setChecklists] = useState([]);
  const [newChecklist, setNewChecklist] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchChecklists = async () => {
    try {
      const res = await getAllChecklists();
      setChecklists(res.data.data);
    } catch (err) {
      setError("Gagal mengambil data checklist");
    }
  };

  const handleAddChecklist = async (e) => {
    e.preventDefault();
    if (!newChecklist) return;

    try {
      await createChecklist(newChecklist);
      setNewChecklist("");
      fetchChecklists();
    } catch (err) {
      setError("Gagal menambahkan checklist");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus checklist ini?")) return;

    try {
      await deleteChecklist(id);
      fetchChecklists();
    } catch (err) {
      setError("Gagal menghapus checklist");
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">📋 To-do List</h1>

        <form onSubmit={handleAddChecklist} className="flex mb-4 gap-2">
          <input
            type="text"
            value={newChecklist}
            onChange={(e) => setNewChecklist(e.target.value)}
            placeholder="Tambah checklist baru"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tambah
          </button>
        </form>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <ul className="space-y-3 mt-4">
          {checklists.length > 0 ? (
            checklists.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div className="flex-1">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                      autoFocus
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>

                <div className="flex gap-2 text-sm">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await renameChecklistItem(item.id, editValue);
                            setEditingId(null);
                            fetchChecklists();
                          } catch {
                            setError("Gagal mengganti nama checklist");
                          }
                        }}
                        className="text-green-600"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditValue(item.name);
                        }}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Checklist kosong</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
