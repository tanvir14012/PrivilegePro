//$(function () {

//    let lengthArr = [10, 25, 50, 100];

//    let tbl = $("#agents").DataTable({
//        responsive: true,
//        caption: 'Fig. 1.1 Data Record of Agents',
//        layout: {
//            topStart: 'search',
//            top2Start: {
//                buttons: [
//                    {
//                        text: 'Delete Selected',
//                        action: function (e, dt, node, config) {
//                            console.log(e);
//                            let selectedRowIds = $(e.currentTarget).parents("#agents_wrapper")
//                                .find("tbody tr.selected")
//                                .map((_, el) => parseInt(el.id))
//                                .get();
//                            handleDelete(selectedRowIds, dt);

//                        }
//                    },
//                    {
//                        text: 'Delete All',
//                        action: function (e, dt, node, config) {
//                            handleDelete([-1], dt);
//                        }
//                    }
//                ]
//            },
//            top2End: {
//                buttons: [
//                    'colvis',
//                    {
//                        extend: 'copyHtml5',
//                        text: '<i class="fas text-info fa-copy pe-1"></i>  Copy',
//                        filename: 'Agent Information',
//                        title: 'Agent Information',
//                        titleAttr: 'Copy to Clipboard',
//                        exportOptions: {
//                            modifier: {
//                                page: 'current'
//                            },
//                            columns: ':not(:last-child)'
//                        }
//                    },
//                    {
//                        extend: 'excelHtml5',
//                        text: '<i class="fas text-info fa-file-excel pe-1"></i>  Excel',
//                        filename: 'Agent Information',
//                        title: 'Agent Information',
//                        titleAttr: 'Export to Excel',
//                        exportOptions: {
//                            modifier: {
//                                page: 'current'
//                            },
//                            columns: ':not(:last-child)'
//                        }
//                    },

//                    {
//                        extend: 'csvHtml5',
//                        text: '<i class="fas text-info fa-file-text pe-1"></i>  CSV',
//                        filename: 'Agent Information',
//                        title: 'Agent Information',
//                        titleAttr: 'CSV',
//                        exportOptions: {
//                            modifier: {
//                                page: 'current'
//                            },
//                            columns: ':not(:last-child)'
//                        }
//                    },
//                    {
//                        extend: 'pdfHtml5',
//                        text: '<i class="fas fa-file-pdf text-info pe-1"></i>  PDF',
//                        filename: 'Agent Information',
//                        title: 'Agent Information',
//                        titleAttr: 'PDF',
//                        pageSize: 'A4',
//                        exportOptions: {
//                            modifier: {
//                                page: 'current'
//                            },
//                            columns: ':not(:last-child)'
//                        }
//                    }]
//            },
//            topEnd: 'pageLength'
//        },
//        lengthMenu: lengthArr,
//        processing: true,
//        serverSide: true,
//        ajax: {
//            url: '/home/getAgents',
//            type: 'POST'
//        },
//        columns: [
//            {
//                data: null,
//                defaultContent: '',
//                orderable: false,
//                className: 'select-checkbox',
//                searchable: false
//            },
//            { data: 'Name', searchable: true },
//            { data: 'Position', searchable: true },
//            { data: 'Office', searchable: true },
//            { data: 'Age', searchable: false },
//            { data: 'StartDate', searchable: false },
//            { data: 'Salary', searchable: false },
//            {
//                data: null,
//                defaultContent: `<ul class="list-group list-group-horizontal list-group-flush">
//                        <li class="list-group-item p-0 me-2 rounded">
//                            <a onclick="editRecord(event)"
//                               class="btn btn-light hover-bg-white" data-toggle="tooltip" data-placement="auto" title="Edit">
//                                <i class="fas fa-edit text-info"></i>
//                            </a>
//                        </li>
//                        <li class="list-group-item p-0 me-2 rounded">
//                            <a onclick="deleteRecord(event)"
//                               class="btn btn-light hover-bg-white" data-toggle="tooltip" data-placement="auto" title="Delete">
//                                <i class="fas fa-trash text-danger"></i>
//                            </a>
//                        </li>
//                    </ul>`,
//                orderable: false,
//                className: 'action-btns',
//                searchable: false
//            }
//        ],
//        rowId: 'Id',
//        order: [
//            [1, 'asc']
//        ],
//        select: {
//            style: 'multi',
//            selector: 'td:first-child'
//        },
//        initComplete: function (settings, json) {

//            //Add name to the first menu item of the column visibility button's dropdown menu
//            $("#agents_wrapper .dt-buttons button.dropdown-toggle").on("click", function (e) {
//                $("#agents_wrapper .dt-buttons .dropdown-menu a:nth-child(1) > span").text("Checkbox");
//            });

//            let customSelectTemplate = `<div class="d-flex">
//                <div class="w-65px h-32px border rounded py-1 px-2 small position-relative alt-dt-len-selectbox" tabindex="0">
//                    <div class="alt-dt-len-selectbox-arrow-down"></div>
//                    <span class="selected-val float-start">{}</span>
//                    <ul class="alt-dt-len-select-dropdown list-group list-group-flush position-absolute border w-65px start-0">
//                        <li class="list-group-item list-group-item-light px-2 py-0 border-0 selected">{}</li>
//                    </ul>
//                </div>
//                <div class="px-2 py-1 text-break"> entries per page</div>
//            </div>`;

//            customSelectTemplate = customSelectTemplate.split("{}").join(lengthArr[0].toString());

//            $("#agents_wrapper .dt-length").children().addClass("visually-hidden");
//            $("#agents_wrapper .dt-length").append(customSelectTemplate);
//            if (lengthArr.length > 1) {
//                for (let i = 1; i < lengthArr.length; i++) {
//                    let li = `<li class="list-group-item list-group-item-light px-2 py-0 border-0">{}</li>`.replace("{}", lengthArr[i].toString());
//                    $("#agents_wrapper .alt-dt-len-select-dropdown").append(li);
//                }
//            }

//            $("#agents_wrapper .alt-dt-len-select-dropdown li").on("mouseenter mouseleave", function (e) {
//                $("#agents_wrapper .alt-dt-len-select-dropdown li").removeClass("selected");
//                $(e.currentTarget).addClass("selected");
//            });

//            $("#agents_wrapper .alt-dt-len-select-dropdown li").on("click", function (e) {
//                let selectedVal = $(this).html().trim();
//                $(".alt-dt-len-selectbox .selected-val").html(selectedVal);
//                $(".alt-dt-len-selectbox").trigger("blur");

//                $("#agents_wrapper .alt-dt-len-select-dropdown li").removeClass("selected");
//                $(e.currentTarget).addClass("selected");

//                //Set the datatable select value
//                $("#agents_wrapper .dt-length select").val(selectedVal);
//                $("#agents_wrapper .dt-length select").trigger("change");
//            });

//            //Hide the 'Delete Selected' button initially
//            $("#agents_wrapper .dt-buttons").first().find("button").first().hide();

//        }
//    });




//    tbl.on('click', 'thead tr th.select-checkbox', function (e) {
//        var parentTr = $(e.currentTarget).parent("tr");
//        parentTr.toggleClass("selected");

//        if (parentTr.hasClass("selected")) {
//            parentTr.closest("table").children("tbody").children("tr").addClass("selected");
//        }
//        else {
//            parentTr.closest("table").children("tbody").children("tr").removeClass("selected");
//        }

//        //Toggle Delete Selected button
//        toggleDeleteSelectedBtn();

//    });



//    //Toggle 'Delete Selected' button
//    let toggleDeleteSelectedBtn = function () {
//        let selectedItemCount = $("#agents_wrapper table tbody").children("tr.selected").length;

//        if (selectedItemCount > 0)
//            $("#agents_wrapper .dt-buttons").first().find("button").first().show();
//        else
//            $("#agents_wrapper .dt-buttons").first().find("button").first().hide();
//    }

//    //Handle class change in tbody > tr
//    let classChangeObserverCallback = function (mutationList, observer) {
//        for (let mutation of mutationList) {
//            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
//                toggleDeleteSelectedBtn();
//            }
//        }
//    }

//    tlbRowClassChangeObservers = [];

//    //When the data table is redrawn because of events such as pagination, reload, search, sort etc.
//    tbl.on('draw', function () {

//        //Destory previous observers
//        for (let observer of tlbRowClassChangeObservers) {
//            observer.disconnect();
//        }
//        tlbRowClassChangeObservers = [];

//        let allTblRows = document.querySelectorAll("#agents_wrapper table tbody tr");

//        for (let tr of allTblRows) {
//            let observer = new MutationObserver(classChangeObserverCallback);

//            observer.observe(
//                tr,
//                {
//                    attributes: true
//                }
//            );

//            tlbRowClassChangeObservers.push(observer);
//        }
//    });

//    let sendDeleteRequest = function (ids) {
//        return new Promise((resolve, reject) => {
//            $.ajax({
//                url: '/home/deleteAgents',
//                method: 'POST',
//                contentType: "application/json; charset=utf-8",
//                data: JSON.stringify(ids),
//                success: function (data) {
//                    resolve(data);
//                },
//                error: function (error) {
//                    reject(error);
//                }
//            });
//        });
//    }

//    editRecord = function (e) {
//        bsFormWrapper.show();
//        var model = tbl.row($(e.target).closest("tr")).data();

//        //Set input field values
//        $("#agentForm input:hidden[name='Id']").val(model["Id"]);
//        $("#agentForm input[name='Name']").val(model["Name"]);
//        $("#agentForm input[name='Position']").val(model["Position"]);
//        $("#agentForm input[name='Office']").val(model["Office"]);
//        $("#agentForm input[name='Age']").val(parseInt(model["Age"]));
//        $("#agentForm input[name='StartDate']").val(model["StartDate"]);
//        $("#agentForm input[name='Salary']").val(Number(model["Salary"].replace(/[^0-9.-]+/g, "")));
//    };

//    deleteRecord = function (e) {
//        let id = $(e.currentTarget).closest("tr").attr("id");
//        handleDelete([parseInt(id)], tbl);
//    };

//    let handleDelete = function (ids, dt) {
//        let response = confirm("Are you sure you want to delete the record(s)? This action can not be undone.")
//        if (response) {
//            sendDeleteRequest(ids).then(resp => {
//                dt.ajax.reload(null, false);
//                $("#agents_wrapper").find("tr.selected").removeClass("selected");
//                alert('The record(s) has been deleted successfully!');
//            })
//                .catch(err => {
//                    alert('Error! The record(s) has not be deleted.');
//                });
//        }
//    }

//    //Init the collapse object for (hide/show)
//    bsFormWrapper = new bootstrap.Collapse($("#agentFormWrapper"), {
//        toggle: false
//    });

//    $("#agentFormWrapper").on("show.bs.collapse", function () {
//        // Enable unobtrusive validation for the form, otherwise the form will get submitted on the collapsible UI toggle
//        $.validator.unobtrusive.parse($("#agentForm"));

//        //Remove validation messages
//        $("#agentForm").find("[data-valmsg-summary=true]")
//            .removeClass("validation-summary-errors")
//            .addClass("validation-summary-valid")
//            .find("ul").empty();

//        $("#agentForm").find("[data-valmsg-replace]")
//            .removeClass("field-validation-error")
//            .addClass("field-validation-valid")
//            .empty();

//        $("div[data-valmsg-summary] ul").addClass("mx-auto");

//        $("#addBtn > span").text("Close");
//        $("#addBtn > i").removeClass("fa-plus").addClass("fa-xmark");
//    });

//    $("#agentFormWrapper").on("hidden.bs.collapse", function () {
//        $('#agentForm').trigger("reset");
//        $("#agentForm").removeData("validator")    //Remove data-* states added by jQuery Validation
//            .removeData("unobtrusiveValidation"); //Remove data-* states added by jQuery Unobtrusive Validation

//        $("#addBtn > span").text("Add");
//        $("#addBtn > i").removeClass("fa-xmark").addClass("fa-plus");


//    });

//    //Save
//    $("#agentsRoot #saveBtn").on("click", function () {
//        let form = $("#agentForm");
//        if (form.valid()) {
//            $.ajax({
//                type: form.attr("method"),
//                url: form.attr("action"),
//                data: form.serialize(),
//                headers: {
//                    "X-CSRF-TOKEN": $('#agentForm input:hidden[name="__RequestVerificationToken"]').val()
//                },
//                success: function (resp) {
//                    $('#agentForm').trigger('reset');
//                    tbl.ajax.reload(null, false);
//                    alert('Success! The record is saved. Details: ' + JSON.stringify(resp));
//                },

//                error: function (err) {
//                    console.log(err);
//                    alert('Error! The record could not be saved.');
//                }
//            });
//        }
//    });
//});
