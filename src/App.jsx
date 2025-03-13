import { useEffect, useState } from "react";

function App() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/tables")
      .then((res) => res.json())
      .then((data) => setTables(data.tables))
      .catch((err) => console.error("Ошибка получения таблиц:", err));
  }, []);

  const fetchTableInfo = (tableName) => {
    fetch(`http://localhost:8000/tables/${tableName}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedTable(tableName);
        setTableInfo(data);
      })
      .catch((err) => console.error("Ошибка получения информации о таблице:", err));
  };

  const executeQuery = () => {
    fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => setQueryResult(data.result))
      .catch((err) => console.error("Ошибка выполнения запроса:", err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <section>
        <h2>Список таблиц</h2>
        <ul>
          {tables.map((table, index) => (
            <li key={index} onClick={() => fetchTableInfo(table)} style={{ cursor: "pointer", marginBottom: "5px" }}>
              {table}
            </li>
          ))}
        </ul>
      </section>

      {selectedTable && tableInfo && (
        <section>
          <h2>Информация о таблице: {selectedTable}</h2>
          <pre>{JSON.stringify(tableInfo.columns, null, 2)}</pre>
        </section>
      )}

      <section>
        <h2>Выполнить SQL-запрос</h2>
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows="4" cols="50" placeholder="Введите SQL-запрос..." />
        <br />
        <button onClick={executeQuery}>Выполнить запрос</button>
        <div>
          <h3>Результат:</h3>
          <pre>{JSON.stringify(queryResult, null, 2)}</pre>
        </div>
      </section>
    </div>
  );
}

export default App;
