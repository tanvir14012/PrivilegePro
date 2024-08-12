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
    window.getAgents = (params) => {

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

        
        if (typeof(paginationData["order"]) !== 'undefined') {
            dtOrders = dtColumns.filter((col) => col["Data"] == paginationData.sort);
        }

        if (typeof (paginationData["multiSort"]) !== 'undefined') {
            isMultiSort = true;
            dtOrders = dtOrders.concat(dtColumns.filter(col => paginationData["multiSort"].find(s => s["sortName"] === col["Data"])));

            dtOrders = dtOrders.reduce((acc, cur) => {
                if (!acc.find(o => o["Data"] === cur["Data"])) {
                    acc.push(cur);
                }
                return acc;
            }, []);
        }

        const dtOrder = dtOrders.map((col) => {
            let dir = paginationData.order === "desc" ? 1 : 0;
            if (isMultiSort && col["Data"] !== paginationData.sort) {
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

    window.clearAgentForm = () => {

        // Remove validation messages
        $("#agentForm").find("[data-valmsg-summary=true]")
            .removeClass("validation-summary-errors")
            .addClass("validation-summary-valid")
            .find("ul").empty();

        $("#agentForm").find("[data-valmsg-replace]")
            .removeClass("field-validation-error")
            .addClass("field-validation-valid")
            .empty();

        const valdtnSmryWrpr = $("#agentForm > div[data-valmsg-summary]");
        valdtnSmryWrpr.addClass("validation-summary-valid")
            .removeClass("validation-summary-errors");

        $(":input", "#agentForm")
            .not(":button, :submit, :reset, :hidden")
            .val("")
            .prop("checked", false)
            .prop("selected", false);
    }

    $("#agentFormWrapper").on("show.bs.collapse", () => {
        // Enable unobtrusive validation for the form, otherwise the form will get submitted on the collapsible UI toggle
        $.validator.unobtrusive.parse($("#agentForm"));

        clearAgentForm();

        $("div[data-valmsg-summary] ul").addClass("mx-auto");

        $("#addBtn > span").text("Close");
        $("#addBtn > i").removeClass("fa-plus").addClass("fa-xmark");
    });

    $("#agentFormWrapper").on("hidden.bs.collapse", () => {
        $('#agentForm').trigger("reset");
        $("#agentForm").removeData("validator")    // Remove data-* states added by jQuery Validation
            .removeData("unobtrusiveValidation"); // Remove data-* states added by jQuery Unobtrusive Validation

        $("#addBtn > span").text("Add");
        $("#addBtn > i").removeClass("fa-xmark").addClass("fa-plus");
    });

    // Save
    $("#agentsRoot #saveBtn").on("click", () => {
        const form = $("#agentForm");
        if (form.valid()) {
            $.ajax({
                type: form.attr("method"),
                url: form.attr("action"),
                data: form.serialize(),
                headers: {
                    "X-CSRF-TOKEN": $('#agentForm input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: (resp) => {
                    clearAgentForm();
                    $("#agents").bootstrapTable("refresh");
                    clearAgentForm();
                    alert('Success! The record is saved. Details: ' + JSON.stringify(resp));
                },
                error: (err) => {
                    const errList = err.responseJSON?.errors;
                    if (Array.isArray(errList)) {

                        const valdtnSmryWrpr = $("#agentForm > div[data-valmsg-summary]");
                        valdtnSmryWrpr.removeClass("validation-summary-valid")
                            .addClass("validation-summary-errors");

                        errList.forEach(errMsg => {

                            const li = `<li>${errMsg}</li>`;
                            $(valdtnSmryWrpr).children("ul").first().append(li);
                        });
                    }
                    alert('Error! The record could not be saved.');
                }
            });
        }
    });

    window.actionFormatter = (value, row, index) => {
        return `<ul class="list-group list-group-horizontal list-group-flush">
                        <li class="list-group-item p-0 me-2 rounded edit">
                            <a onclick="javascript:void(0)" class="btn btn-light hover-bg-white" data-toggle="tooltip" title="Edit">
                                <i class="fas fa-edit text-info"></i>
                            </a>
                        </li>
                        <li class="list-group-item p-0 me-2 rounded delete">
                            <a onclick="javascript:void(0)" class="btn btn-light hover-bg-white" data-toggle="tooltip" title="Delete">
                                <i class="fas fa-trash text-danger"></i>
                            </a>
                        </li>
                    </ul>`;
    }

    window.sendDeleteRequest = (ids) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/home/deleteAgents',
                method: 'POST',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(ids),
                success: resolve,
                error: reject
            });
        });
    }
    // Event handlers for edit and delete buttons
    window.actionEvents = {
        'click .edit': function (e, value, row, index) {
            alert('Edit button clicked for: ' + JSON.stringify(row));
            // Implement your edit logic here
        },
        'click .delete': function (e, value, row, index) {
            const response = confirm("Are you sure you want to delete the record(s)? This action cannot be undone.");
            if (response) {
                sendDeleteRequest([row.Id])
                    .then(resp => {
                        $("#agents").bootstrapTable('remove', {
                            field: 'Id',
                            values: [row.Id]
                        })
                        alert('The record(s) has been deleted successfully!');
                    })
                    .catch(err => {
                        alert('Error! The record(s) has not been deleted.');
                    });
            }
        }
    };

});

