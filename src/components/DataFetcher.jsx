import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

function DataFetcher() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'your_table' with your actual table name
        const { data, error } = await supabase.from("customers").select("*");

        if (error) throw error;

        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container'>
      <h2>Customers Data</h2>
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
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataFetcher;
