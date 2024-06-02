import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th> Price</th>
        <th> Cuisine</th>
        <th> Description</th>
        <th> Availability </th>
      </tr>
    </thead>
  );
}

function TableBody({menu}) {
  const rows = menu.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.foodName}</td>
        <td>{row.price}</td>
        <td>{row.cuisine}</td>
        <td>{row.description}</td>
        <td>{row.availability ? "Available" : "Not Available"}</td>
        <td>
          <button>Add to cart</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table({menu}) {
  return (
    <table>
      <TableHeader />
      <TableBody
        menu={menu}
      />
    </table>
  );
}

export default Table;
