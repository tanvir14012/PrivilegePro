$(function () {

    const getFormattedRequestData = (paginationData, dtColumns, dtOrder, dtSearch) => {
        let data = {};

        dtColumns.forEach((col, index) => {
            data[`columns[${index}][data]`] = col.Data;
            data[`columns[${index}][name]`] = col.Name ?? ""; // Assuming Name is optional
            data[`columns[${index}][searchable]`] = col.Searchable;
            data[`columns[${index}][orderable]`] = col.Orderable;
            data[`columns[${index}][search][value]`] = col.Search?.Value ?? "";
            data[`columns[${index}][search][regex]`] = col.Search?.Regex ?? false;
        });

        dtOrder.forEach((order, index) => {
            data[`order[${index}][column]`] = order.Column;
            data[`order[${index}][dir]`] = order.Dir === 1 ? "desc" : "asc";
            data[`order[${index}][name]`] = order.Name ?? ""; // Assuming Name is optional
        });

        data["start"] = paginationData.offset;
        data["length"] = paginationData.limit;
        data["search[value]"] = dtSearch.Value ?? "";
        data["search[regex]"] = dtSearch.Regex ?? false;

        return data;
    }
    window.getAgents = function (params) {

        const paginationData = params.data;

        let columns = [...$("#agents").bootstrapTable("getVisibleColumns"),
            ...$("#agents").bootstrapTable("getHiddenColumns")];

        columns = [...columns].sort((a, b) => a.fieldIndex - b.fieldIndex);

        let dtColumns = columns.map((col) => {
            return {
                Data: col["field"],
                Orderable: col["sortable"],
                Searchable: col["searchable"],
                Index: col["fieldIndex"]
            }
        });


        let dtOrders = [];
        let isMultiSort = false;

        if (typeof (paginationData["multiSort"]) !== 'undefined') {
            isMultiSort = true;
            dtOrders = dtColumns.filter(col => paginationData["multiSort"].find(s => s["sortName"] === col["Data"]));
        }
        else if (typeof(paginationData["order"]) !== 'undefined') {
            dtOrders = dtColumns.filter((col) => col["Data"] == paginationData.sort);
        }
        else {
            dtOrders = dtColumns.filter((col) => col.Index == 1);
        }

        const dtOrder = dtOrders.map((col) => {
            let dir = paginationData.order === "desc" ? 1 : 0;
            if (isMultiSort) {
                dir = paginationData["multiSort"].find(s => s["sortName"] === col["Data"]).sortOrder === 'asc' ? 0 : 1;
            }
            return {
                Column: col["Index"] - 1,
                Dir: dir
            }
        });


        const dtSearch = {
            Value: paginationData.search,
            Regex: false
        };


        const requestData = getFormattedRequestData(paginationData, dtColumns, dtOrder, dtSearch);


        new Promise((resolve, reject) => {
            $.ajax({
                url: '/home/getAgents',
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                processData: true,
                data: requestData,
                success: resolve,
                error: reject
            });
        }).then(res => {
            const data = {
                total: res.recordsFiltered,
                totalNotFiltered: res.recordsTotal - res.recordsFiltered,
                rows: res.data
            };

            params.success(data);

        }).catch(err => {
            console.log(err);
        });

    }

    // Event listener for when data load is successful
    $('#agents').on('load-success.bs.table', function () {
        $('#agents').bootstrapTable('uncheckAll');
    });

    $('#agents').on('multiple-sort.bs.table', function (e, sortOptions) {
        console.log('Multiple sort options:', sortOptions);
        console.log('Multiple sort options event:', e);
        //$('#table').bootstrapTable('refresh', { query: { sortOptions: sortOptions } });
    });

    function actionFormatter(value, row, index) {
        return `<ul class="list-group list-group-horizontal list-group-flush">
                        <li class="list-group-item p-0 me-2 rounded">
                            <a onclick="javascript:void(0)" class="btn btn-light hover-bg-white" data-toggle="tooltip" title="Edit">
                                <i class="fas fa-edit text-info"></i>
                            </a>
                        </li>
                        <li class="list-group-item p-0 me-2 rounded">
                            <a onclick="javascript:void(0)" class="btn btn-light hover-bg-white" data-toggle="tooltip" title="Delete">
                                <i class="fas fa-trash text-danger"></i>
                            </a>
                        </li>
                    </ul>`;
    }

    // Event handlers for edit and delete buttons
    window.actionEvents = {
        'click .edit': function (e, value, row, index) {
            alert('Edit button clicked for: ' + JSON.stringify(row));
            // Implement your edit logic here
        },
        'click .delete': function (e, value, row, index) {
            alert('Delete button clicked for: ' + JSON.stringify(row));
            // Implement your delete logic here
        }
    };
});

