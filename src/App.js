import React, { useState } from "react"
import Datatable from './components/Datatable';
import 'semantic-ui-css/semantic.min.css';
import { Button } from 'semantic-ui-react';

function App() {
    const [datasource, setDatasource] = useState([]);
    const totalRows = 100;
    const colDefs = [
        {
          headerName: 'Label',
          field: 'label',
          sortable: true,
          filter: true
        },
        {
          headerName: 'Created at',
          field: 'createdAt',
          customRender: true,
          sortable: true,
          filter: true,
          filterOptions: {
            type: 'date'
          },
          cellRender: (data) => {
            return (
              data.createdAt
            )
          }
        },
        {
          headerName: 'Actions',
          field: 'actions',
          className: 'actions-cell',
          customRender: true,
          style: {
            minWidth: "120px",
            textAlign: 'center'
          },
          cellRender: (data) => {
            return (
              <>
                <Button className="action-btn" onClick={() => console.log(data._id)} circular primary icon='edit' />
                <Button className="action-btn" onClick={() => console.log(data._id)} circular negative icon='trash' />
              </>
            )
          }
        }
    ];

    const result = [
        {
          "_id": "60b569bbe6ccce3ca086dc97",
          "label": "Lord watch",
          "createdAt": "2021-05-31",
        },
        {
          "_id": "60b57059e6ccce3ca086dc99",
          "label": "Shirt",
          "createdAt": "2021-05-31",
        },
        {
          "_id": "60b957829c55fb24e0e00ee8",
          "label": "Samsung Galaxy S9",
          "createdAt": "2021-06-03"
        }
      ];

    const getServerSideData = (data) => {
        //get data from server
        setDatasource(result)
    };

    return (<div>
        <h2>Welcome to React App</h2>
        <h3>Date : {new Date().toDateString()}</h3>
        <Datatable
          onQueryChange={getServerSideData}
          columns={colDefs}
          totalRows={totalRows}
          datasource={datasource}
          paginated
          sortable
          checkbox
        />
    </div>)
}

export default App