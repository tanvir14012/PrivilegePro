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
            data[`order[${index}][column]`] = order.Data;
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
        console.log(paginationData);

        let columns = [...$("#agents").bootstrapTable("getVisibleColumns"),
            ...$("#agents").bootstrapTable("getHiddenColumns")];

        console.log(columns);

        columns = [...columns].sort((a, b) => a.fieldIndex - b.fieldIndex);
        console.log(columns);

        let dtColumns = columns.map((col) => {
            return {
                Data: col["field"],
                Orderable: col["sortable"],
                Searchable: col["searchable"],
                Index: col["fieldIndex"]
            }
        });

        console.log(dtColumns);

        let dtOrders = [];

        if (typeof(paginationData["order"]) !== 'undefined') {
            dtOrders = dtColumns.filter((col) => col["Data"] == paginationData.order);
        }
        else {
            dtOrders = dtColumns.filter((col) => col.Index == 1);
        }
        console.log(dtOrders);
        const dtOrder = dtOrders.map((col) => {
            return {
                Column: col["Index"],
                Dir: paginationData.sort === "desc" ? 1: 0
            }
        });

        const dtSearch = {
            Value: paginationData.search,
            Regex: false
        };


        const requestData = getFormattedRequestData(paginationData, dtColumns, dtOrder, dtSearch);
        console.log(requestData);

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
            console.log(res);
            const data = {
                total: res.recordsTotal,
                totalNotFiltered: res.recordsFiltered,
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
});

