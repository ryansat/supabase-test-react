import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

function DataFetcher() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from("customers").select("*");
      if (error) throw error;
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data: insertedData, error } = await supabase
        .from("customers")
        .insert([newCustomer])
        .select();

      if (error) throw error;
      setData([...data, ...insertedData]);
      setNewCustomer({ name: "", email: "", phone: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from("customers")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;
      setData(
        data.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
      setEditingId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const { error } = await supabase
          .from("customers")
          .delete()
          .eq("id", id);

        if (error) throw error;
        setData(data.filter((item) => item.id !== id));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container'>
      <h2>Customers Data</h2>

      {/* Add Customer Form */}
      <form
        onSubmit={handleAdd}
        className='add-form'
      >
        <input
          type='text'
          placeholder='Name'
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
        />
        <input
          type='email'
          placeholder='Email'
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, email: e.target.value })
          }
        />
        <input
          type='tel'
          placeholder='Phone'
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
        />
        <button type='submit'>Add Customer</button>
      </form>

      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((header) => (
                  <th key={header}>
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </th>
                ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    {Object.keys(item).map((key) => (
                      <td key={key}>
                        <input
                          type='text'
                          value={item[key]}
                          onChange={(e) => {
                            const updatedData = [...data];
                            const index = updatedData.findIndex(
                              (d) => d.id === item.id
                            );
                            updatedData[index] = {
                              ...updatedData[index],
                              [key]: e.target.value,
                            };
                            setData(updatedData);
                          }}
                        />
                      </td>
                    ))}
                    <td>
                      <button onClick={() => handleUpdate(item.id, item)}>
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    {Object.values(item).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                    <td>
                      <button onClick={() => setEditingId(item.id)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataFetcher;
