import { Injectable } from '@angular/core';
import { ColDef, GridApi } from "ag-grid-community";

@Injectable()

export class AGGridHelper {

    constructor() { }
    public static DeafultCol: ColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        // cellClass: 'ics-ag-cell-border'
    };

    public static GetRows(gridApi: GridApi) {
        const rowData: any[] = [];
        gridApi.forEachNode(function (node) {
            rowData.push(node.data);
        });
        return rowData;
    }

    public static GetSelectedRow(gridApi: GridApi) {
        const oSelectedItems = gridApi.getSelectedRows();
        if (oSelectedItems == null || oSelectedItems.length <= 0) {
            return null;
        }
        return oSelectedItems[0];
    }
    public static GetSelectedRows(gridApi: GridApi) {
        const oSelectedItems = gridApi.getSelectedRows();
        if (oSelectedItems == null || oSelectedItems.length <= 0) {
            return [];
        }
        return oSelectedItems;
    }

    public static SelectRow(gridApi: GridApi, nRowIndex: any) {
        gridApi.forEachNode((rowNode) => {
            if (rowNode.rowIndex == nRowIndex) {
                rowNode.setSelected(true);
            }
        });
    }

    public static AddNewRow(gridApi: GridApi, newRowData: any) {
        if (!gridApi) {
            console.error("Grid API is not initialized.");
            return;
        }
        gridApi.applyTransaction({ add: [newRowData] });
    }

    public static SelectRowUpdate(gridApi: GridApi, seletObject: any) {
        var node = gridApi.getSelectedNodes()[0];
        node.setData(seletObject);
    }

    public static SelectedRowDelete(gridApi: GridApi) {
        const selectedRows = gridApi.getSelectedRows();
        gridApi.applyTransaction({ remove: selectedRows });
    }

    public static GetSelectedRowIndex(gridApi: GridApi) {
        const selectedNodes = gridApi.getSelectedNodes();
        if (selectedNodes == null || selectedNodes.length <= 0) {
            return -1;
        }
        return selectedNodes[0].rowIndex;
    }

}