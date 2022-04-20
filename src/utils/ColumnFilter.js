import React from 'react'
import { Button, Input, Icon, Dropdown } from 'semantic-ui-react'

const ColumnFilter = ({
    data,
    filter,
    filterVisibility,
    toggleFilterVisibility,
    setFilterInput,
    setFilterDate 
}) => {
    const clearIcon = (name, toFrom) => (
        <Icon
          link name="x"
          style={{ cursor: 'pointer' }}
          onClick={() => onClearIconClick(name, toFrom)}
        />
    );

    const onClearIconClick = (name, toFrom) => {
        if (toFrom) {
            setFilterDate(name, toFrom, '')
        } else {
            setFilterInput(name, '')
        }
    };

    const onFilterIconClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFilterVisibility(data.field)
    };

    const dateFilter = (filterVisibility, field) => {
        return (
        <div
          style={{ display: filterVisibility[field].visible ? '' : 'none' }}
          className="date-filter-container"
        >
        <span>From :</span>
        <Input
            className="date-filter-input"
            value={filter[field]['from'].value}
            icon={clearIcon(field, 'from')}
            size="mini"
            placeholder="Filter"
            onChange={(e) => setFilterDate(field, 'from', e.target.value)}
            type="date"
        />
        <span>To :</span>
        <Input
            className="date-filter-input"
            value={filter[field]['to'].value}
            icon={clearIcon(field, 'to')}
            size="mini"
            placeholder="Filter"
            onChange={(e) => setFilterDate(field, 'to', e.target.value)}
            type="date"
        />
        </div>);
    }

    const displayFilters = (col) => {
        const { filter:colFilter, field, filterOptions } = col;
        if (colFilter) {
            if (filterOptions && filterOptions.type) {
                if (filterOptions.type == "date") {
                    return dateFilter(filterVisibility, field);
                }
            } else {
                return (
                    <Input
                        className="filter-input"
                        onChange={(e) => setFilterInput(field, e.target.value)}
                        value={filter[field].value}
                        icon={clearIcon(field, null)}
                        type="text"
                        size="mini"
                        placeholder="Filter"
                    />
                )
            }

        }
        return null
    }

    return (
        <>
            <Button
                id={`${data.field}-filter-btn`}
                icon="filter"
                className="filter-btn"
                onClick={ onFilterIconClick }
            />
            <Dropdown
                closeOnBlur={false}
                id={`${data.field}-filter-dropdown`}
                className="filter-dropdown" multiple
                open={filterVisibility[data.field].visible}
            >
                <Dropdown.Menu>
                    <Dropdown.Menu scrolling>
                        <Dropdown.Item key={data.field}>
                            {displayFilters(data)}
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default ColumnFilter