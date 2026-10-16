import React, { createContext, forwardRef, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext('light');

export function ThemeProvider({ children, theme }) {
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}

export const Button = memo(forwardRef(function Button({ label, onClick, disabled, ...rest }, ref) {
  const theme = useContext(ThemeContext);
  return (
    <button ref={ref} className={`btn btn-${theme}`} onClick={onClick} disabled={disabled} {...rest}>
      {label}
    </button>
  );
}));

export function SearchBox({ initialQuery, onSearch, results }) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(id);
  }, [query, onSearch]);

  const handleChange = useCallback((event) => setQuery(event.target.value), []);
  const sorted = useMemo(() => results.slice().sort((a, b) => a.score - b.score), [results]);

  return (
    <div className="search">
      <input value={query} onChange={handleChange} onFocus={() => setOpen(true)} />
      {open && sorted.length && (
        <ul role="listbox">
          {sorted.map((result) => (
            <li key={result.id} role="option" onClick={() => onSearch(result.title)}>
              <span>{result.title}</span> <small>{result.score}</small>
            </li>
          ))}
        </ul>
      )}
      {!open ? <p>Type to search</p> : null}
    </div>
  );
}

export const Table = ({ rows, columns, onSort }) => (
  <table>
    <thead>
      <tr>
        {columns.map((column, i) => (
          <th key={i} onClick={() => onSort(column.key)}>{column.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          {columns.map((column) => <td key={column.key}>{row[column.key]}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);

export default function App({ user }) {
  const [rows, setRows] = useState([]);
  const columns = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }];

  function Nested() {
    return <span>nested component</span>;
  }

  return (
    <ThemeProvider theme="dark">
      <>
        <Nested />
        <Button label="Reload" onClick={() => setRows([])} />
        <SearchBox initialQuery="" onSearch={(q) => setRows(rows.filter((r) => r.name.includes(q)))} results={rows} />
        <Table rows={rows} columns={columns} onSort={(key) => setRows([...rows].sort((a, b) => (a[key] > b[key] ? 1 : -1)))} />
        {user.isAdmin && <a href="/admin" target="_blank">Admin</a>}
        <iframe src="/embed" />
        <textarea value="static" />
      </>
    </ThemeProvider>
  );
}
