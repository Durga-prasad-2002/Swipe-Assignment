import React from 'react'
import Spreadsheet from 'react-spreadsheet';

function Sheet() {
    let col = ["Flavour", "Food"];
    const data = [
      [{ value: "Vanilla" }, { value: "Chocolate" }],
      [{ value: "Strawberry" }, { value: "Cookies" }],
    ];
    return <Spreadsheet data={data} columnLabels={col}  />;
}

export default Sheet
