import React from "react";

function PageHeader(props)
{
    return(
        <div className="container">
            <center>
                <h1> Chefs List</h1>
            </center>
            <div className="input-box">
            <input
                type="search"
                name="search-form"
                id="search-form"
                className="search-input"
                placeholder="Search for a Chef"
            />
            </div>
        </div>
    );
}

function TableHeader() {
    return (
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Price</th>
          <th>Cuisines</th>
          <th>Location</th>
        </tr>
      </thead>
    );
  }

function TableBody(props) {
    const rows = props.chefData.map((row, index) => {
      return (
          <tr key={index}>
            <td>{row.firstName}</td>
            <td>{row.lastName}</td>
            <td>{row.price}</td>
            <td>{row.cuisines}</td>
            <td>{row.location}</td>
          </tr>
      );
     }
    );
    return (
        <tbody>
          {rows}
         </tbody>
     );
  }

function SearchPage(props)
{

    return(
        <div>
            <PageHeader/>
            <center>
                <TableHeader></TableHeader>
                <TableBody chefData={props.chefData}/>
            </center>
        </div>
        );

}

export default SearchPage;