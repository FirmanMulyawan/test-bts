import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getChecklistItems,
  addChecklistItem,
  deleteChecklistItem,
  updateItemStatus,
  renameChecklistItem,
} from '../api/api';

const ChecklistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchItems = async () => {
    try {
      const res = await getChecklistItems(id);
      setItems(res.data.data);
    } catch (err) {
      setError('Gagal mengambil item checklist');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem) return;

    try {
      await addChecklistItem(id, newItem);
      setNewItem('');
      fetchItems();
    } catch (err) {
      setError('Gagal menambahkan item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteChecklistItem(id, itemId);
      fetchItems();
    } catch {
      setError('Gagal menghapus item');
    }
  };

  const handleToggleStatus = async (itemId) => {
    try {
      await updateItemStatus(id, itemId);
      fetchItems();
    } catch {
      setError('Gagal update status');
    }
  };

  const handleRenameItem = async (itemId) => {
    try {
      await renameChecklistItem(id, itemId, editValue);
      setEditingItemId(null);
      fetchItems();
    } catch {
      setError('Gagal rename item');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:underline text-sm"
        >
          ← Kembali ke Checklist
        </button>

        <h2 className="text-2xl font-bold mb-4">📝 Detail Checklist</h2>

        <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Tambah item"
            className="flex-1 border px-3 py-2 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tambah
          </button>
        </form>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <ul className="space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.itemCompletionStatus}
                    onChange={() => handleToggleStatus(item.id)}
                  />
                  {editingItemId === item.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border px-2 py-1 rounded"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`${
                        item.itemCompletionStatus ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingItemId === item.id ? (
                    <>
                      <button
                        onClick={() => handleRenameItem(item.id)}
                        className="text-green-600 text-sm"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingItemId(null)}
                        className="text-gray-500 text-sm"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditValue(item.name);
                        }}
                        className="text-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 text-sm"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Belum ada item</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChecklistDetail;
