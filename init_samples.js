import { VGrid, VGridSettings, CellStyleInfo, GridStateInfo, GridColumn, UpdateRowInfo } from 'vue-grid-advanced';
import moment from 'moment'
import * as R from 'ramda'

function getColumns() {

    // define some columns
    let cols = [];

    //cols.push(new GridColumn("pkvalue", 120));
    cols.push(new GridColumn("code", 70, "", "", "center"));
    cols.push(new GridColumn("firstname", 160));
    cols.push(new GridColumn("lastname", 160));
    cols.push(new GridColumn("county", 90, "", "", ""));
    let col = new GridColumn("age", 100, "", "number", "right", "#,##0");
    col.aggregate = "avg";
    cols.push(col);
    cols.push(new GridColumn("created", 100, "", "date", "center", "DD MMM YYYY"));

    return cols;
}

function createData(newRowCount = 500) {

    let rows= [];

    let firstNames = ["Marcel", "Deniz", "Sam", "Tom"];
    let lastNames = ["Heeremans", "de Wit", "van Dam", "Bakker", "van Oostenbroek", "de Boer"];
    let counties = ["Kent", "Surrey", "Devon", "Cornwall"];

    let randomEntry = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let randomNumber = (n) => Math.floor((Math.random() * n));

    let createRow = (i) => {
            var row = {};
            row.index = i;
            row.code = "Code" + i.toString();
            row.firstname = randomEntry(firstNames);
            row.lastname = randomEntry(lastNames);
            row.county = randomEntry(counties);
            row.age = randomNumber(100);
            row.created = moment().subtract(randomNumber(30), 'days')
            return row;
    }

    R.times((i) => rows.push(createRow(i)), newRowCount);

    return rows;
}


// ------------------------------------ create grid ------------------------------------

let settings = new VGridSettings();

// the actual DOM element the grid will be injected into
settings.el = ".test-grid-1";	

// hand over a set of predefined columns
settings.columns = getColumns();

// Specifies the column that will be interpreted as the unique ID column. If none exists then leave this blank and a 'pkvalue' will be generated guaranteeing a unique reference for each row. 
settings.idColumn = "code";

// when the grid is fully constructed the given function is called back
settings.createdGridStructure = (grid) => {
    // the grid is ready so create some sample data 
    let tempData = createData(500);
    // and pass it to the grid
    grid.setData(tempData);
};

// create a new VGrid (based on the settings)
let vgrid = new VGrid(settings);

// get informed when the user selects a row (or rows)
vgrid.onChanged = (info) => {
    console.log(`selectedIDValue: ${info.selectedIDValue}`);
};