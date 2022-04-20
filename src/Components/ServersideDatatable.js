import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Pagination, Grid, Table, Segment, Dimmer, Loader, Icon, Dropdown, Checkbox, Form } from 'semantic-ui-react';
import NoData from '../utils/NoData';
import Tooltip from '../utils/Tooltip'
import {
    dropdownLimitOptions,
    getSortData,
    initFilter,
    filtersDataReq,
    sortDirection,
    initFilterVisibility
} from '../utils';
import ColumnFilter from '../utils/ColumnFilter';
import settingsIcon from '../icons/settings.svg';

const ServerSideDatatable = forwardRef(({
    className = '',
    loading = false,
    centered = false,
    selectable = true,
    striped = false,
    collapsing=false,
    checkbox=false,
    columns,
    datasource,
    paginated = false,
    limiRows = ['10', '15','25'],
    totalRows = 10,
    sortable = false,
    onQueryChange = () => {}
}, ref ) => {

    const [filter, setFilter] = useState(initFilter(columns))
    const [filterVisibility, setFilterVisibility] = useState(initFilterVisibility(columns))
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: totalRows
    })
    const {
        page,
        limit,
        total
    } = pagination;
    const [sortData, setSortData] = useState({
        sortField: null,
        sortDir: null
    })
    const {
        sortField,
        sortDir
    } = sortData;

    useEffect(() => {
        onQueryChange({
            pagination,
            sortData,
            filterData: filtersDataReq(filter)
        });
    }, [page, limit, sortData, filter])

    const onPageChnage = (page) => {
        setPagination({
            ...pagination,
            page: page
        })
    }
    
    const onSortChnage = (column, direction) => {
        setSortData({
            sortField: column,
            sortDir: direction
        })
    }

    const onLimitChnage = (value) => {
        setPagination({
            ...pagination,
            limit: value,
            page: 1
        })
    }

    const onFilterChnage = (data) => {
        setFilter(data)
        setPagination({
            ...pagination,
            page: 1
        })
    }

    const setFilterInput = (field, value) => {
        const aux = filter[field];
        if (aux.value != value) {
            aux.value = value
            onFilterChnage({ ...filter, [field]: aux })
           // setFilter({ ...filter, [field]: aux })
        }

    }

    const setFilterDate = (field, fromTo, value) => {
        const aux = filter[field];
        if (aux[fromTo].value != value) {
            aux[fromTo].value = value
            onFilterChnage({ ...filter, [field]: aux })
        }
    }

    const toggleFilterVisibility = (field) => {
        setFilterVisibility(prev => {
            const aux = prev[field];
            aux.visible = !aux.visible
            return { ...filterVisibility, [field]: aux }
        })
    }
    
    useImperativeHandle(ref, () => ({
        hideAllFilters: () => {
            let result = {};
            for (const [key, value] of Object.entries(filter)) {
                result[key] = { visible: false }
            }
            setFilterVisibility(result)
        }
      }));

    const paginationState = {
        boundaryRange: 1,
        siblingRange: 1,
        showEllipsis: true
    }

    const {
        boundaryRange,
        siblingRange,
        showEllipsis
    } = paginationState;

    const Loading = (
        <Segment style={{ width: '100%', display: 'contents' }}>
            <Dimmer style={{ height: '50vh', border: 'none' }} active inverted>
                <Loader inline='centered' size='large' inverted>Loading</Loader>
            </Dimmer>
        </Segment>
    )

    const handlePaginationChange = (e, { activePage }) => {
        onPageChnage(activePage)
    }

    const paginationItem = (label, iconName) => {
        return {
            content: <Tooltip content={label}><Icon name={iconName} /></Tooltip>,
            icon: true
        }
    }
    
    const handleLimitChange = (e, { value }) => {
        onLimitChnage(value)
    }

    const paginationPanel = (
        paginated && pagination && 
        <Grid.Row style={{
            flex: 1,
            padding: "10px"
        }}>
            <div
                id="pagination-bar"
                style={{ 
                width: '100%',
                textAlign: pagination && pagination.align ? pagination.align : 'center',
            }}>
                <Pagination
                    id="grid-pagination"
                    activePage={pagination.page}
                    boundaryRange={boundaryRange}
                    onPageChange={handlePaginationChange}
                    siblingRange={siblingRange}
                    totalPages={Math.ceil(totalRows / limit)}
                    ellipsisItem={showEllipsis ? undefined : null}
                    firstItem={null}
                    lastItem={null}
                    prevItem={paginationItem('Prev page', 'angle left')}
                    nextItem={paginationItem('Next page', 'angle right')}
                />
                <Dropdown
                    id="page-limit"
                    upward
                    icon={<i className="icon"><img src={settingsIcon} /></i>}
                    options={dropdownLimitOptions(limiRows)}
                    onChange={handleLimitChange}
                    trigger={<></>}
                />
            </div>
        </Grid.Row>
    )

    const tableHeader = () => {
        return (
            <Table.Header>
                <Table.Row>
                    {
                        checkbox && <Table.HeaderCell collapsing={collapsing} />
                    }
                    {
                        columns && columns.map(
                            col =>
                                <Table.HeaderCell
                                    key={col.field}
                                    style={{ position: 'relative', ...col.style ? col.style : null }}
                                    sorted={sortable && sortField && sortField === col.field && col.sortable ? getSortData(sortDir) : null}
                                    onClick={
                                        () => sortable && col.sortable && onSortChnage(col.field, sortDirection({ sortField, sortDir }, col.field))
                                    }
                                    collapsing={collapsing}
                                >
                                    {col.headerName}
                                    {col.filter &&
                                        <ColumnFilter
                                            data={col}
                                            filter={filter}
                                            filterVisibility={filterVisibility}
                                            toggleFilterVisibility={toggleFilterVisibility}
                                            setFilterInput={setFilterInput}
                                            setFilterDate={setFilterDate}
                                        />
                                    }
                                </Table.HeaderCell>
                        )
                    }
                </Table.Row>
            </Table.Header>
        );
    }

    const tableRow = data => {
        return (
            <Table.Row key={data._id}>
            {
                checkbox && <Table.Cell collapsing={collapsing}>
                  <Form.Field control={Checkbox} id={columns[0]['_id']} />
                </Table.Cell>
            }
            {
                columns && columns.map(
                    col =>
                        <Table.Cell className={col.className ? col.className : ''}
                            style={col.style ? col.style : null}
                            collapsing={collapsing}
                        >
                            {
                                col.customRender ?
                                    col.cellRender(data)
                                    :
                                    (data[col.field])
                            }
                        </Table.Cell>
                )
            }
            </Table.Row>
        );
    };

    const dataTable = (
        <Grid.Row
          stretched
          style={{
            overflow: 'auto',
            padding: 0,
            margin: 0,
            borderRadius: 0,
            flex: 8,
            border: 'none'
          }}
        >
            <Table   
                striped={striped}
                sortable={sortable}
                selectable={selectable}
                celled
                collapsing={collapsing}
                style={{
                    borderRadius: 0,
                    textAlign: centered ? 'center' : ''
                }}
                className={`ppc-data-table ${className}`}
                id="ppc-data-table"
            >
                { tableHeader() }
                <Table.Body>
                    {
                        datasource && !loading ?
                            datasource.length > 0 ?
                                datasource.map(tableRow)
                                :
                                <Table.Row>
                                    <Table.Cell colSpan={columns.length}>
                                        <NoData />
                                    </Table.Cell>
                                </Table.Row>
                            :
                            <Loading />
                    }
                </Table.Body>
            </Table>
        </Grid.Row>
    )


    return (
        <>
            {dataTable}
            {paginated == true && paginationPanel}
        </>
    )
})

export default ServerSideDatatable