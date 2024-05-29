import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>s
        <th>Name</th>
        <th> Availability </th>
        <th> Price</th>
        <th> Cuisine</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.characterData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.name}</td>
        <td>{row.availability}</td>
        <td>{row.cuisine}</td>
        <td>
          <button>Add to cart</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        characterData={props.menuData}
      />
    </table>
  );
}

export default Table;
