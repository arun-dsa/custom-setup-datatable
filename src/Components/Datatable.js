import React, { useRef } from 'react'
import ServerSideDatatable from './ServerSideDatatable';
import 'semantic-ui-css/semantic.min.css';
import './Datatable.scss'
import { Grid } from 'semantic-ui-react';


const Datatable = ({
    loading,
    centered,
    selectable,
    checkbox,
    striped,
    columns,
    datasource,
    paginated,
    sortable,
    totalRows,
    onQueryChange = () => { }
}) => {

    const serverSideRef = useRef();

    const hideAllFilters = () => {
        serverSideRef.current.hideAllFilters();
    }

    const datatable = (
        <ServerSideDatatable
            ref={serverSideRef}
            loading={loading}
            centered={centered}
            selectable={selectable}
            checkbox={checkbox}
            striped={striped}
            columns={columns}
            datasource={datasource}
            totalRows={totalRows}
            paginated={paginated}
            sortable={sortable}
            onQueryChange={onQueryChange}
        />
    );

    return (
        <Grid onClick={hideAllFilters} style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            borderRadius: 0,
            border: '1px solid rgba(34, 36, 38, 0.15)',
            margin: '1rem auto',
            padding: 0
        }}>
            {datatable}
        </Grid>
    )
}



export default Datatable