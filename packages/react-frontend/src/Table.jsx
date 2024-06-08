import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th> Cuisine</th>
        <th> Description</th>
      </tr>
    </thead>
  );
}

function TableBody({ menu }) {
  const rows = menu.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.foodName}</td>
        <td>{row.cuisine}</td>
        <td>{row.description}</td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table({ menu }) {
  return (
    <table>
      <TableHeader />
      <TableBody menu={menu} />
    </table>
  );
}

export default Table;
