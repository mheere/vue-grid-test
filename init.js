

import { VGrid, VGridSettings, CellStyleInfo, GridStateInfo, GridColumn, UpdateRowInfo } from 'vue-grid-advanced';
import { getColumns, createData } from 'vue-grid-advanced';

console.log("VueGridTest - Going to Run");

var vgrid = undefined;
var _col_settings = "";			// remember the grid UI state

let setData = (count = 5000) => {
	console.log('setData - init');
	var data = createData(count);
	vgrid.setData(data);
}

var createGrid = () => {
	// we ALWAYS start with defining the Grid Settings object
	let settings = new VGridSettings();

	settings.el = ".test-grid-1";	// either a class/id identifier or the actual html element

	// specify which columns to use
	settings.columns = getColumns();

	// spcify the column the grid can interpret to be the 'primary key' - this is returned
	// each time a selection(s) is made
	// if left blank the inner unique 'pkvalue' is returned as id value
	settings.idColumn = "code";

	// specify the currency lookup column (this specifies the code of the currency for that row)
	settings.currencyLookupColumn = "currency";	

	// treat these columns to be formatted using the currencyLookupColumn
	settings.currencyColumns = ["price", "valuation"];

	// if we are going to deal with currencies we have to provide a lookup of their codes to use...
	settings.setCurrencySymbol("GBP", "£");
	settings.setCurrencySymbol("USD", "$");
	settings.setCurrencySymbol("EUR", "€");
	settings.setCurrencySymbol("AUD", "A$");
	settings.setCurrencySymbol("CAD", "C$");

	settings.settings = _col_settings;						// in case you wish to re-initialise the grid with the changes the user made previously

	// specify other props
	settings.showLastRefreshTime = true;
	settings.requestFreshData = () => {
		// wait for a little while (pretend we are collecting from remote location) then provide new rows
		setTimeout(() => setData(1000), 700);
		return true;
	}
	
	// when the grid is fully constructed (and the the creation call is completed)
	settings.createdGridStructure = (grid) => {
		setData(30);
		grid.setGroupColumns(['currency', 'county']);
	}

	// allow for some custom styling...
	settings.cellStyling = (style) => {

		//style = doCurrencies(style);

		if (style.isTotalRow) return style;

		return cellStyling(style);

	}

	let cellStyling = (style) => {

		let row = style.row;
		let col = style.col;

		if (style.isTotalRow) return style;

		// highlight people aged between 20 and 40
		if (col.dbName == "firstname" && !style.isGroupRow) {

			if (row["age"] >= 20 && row["age"] <= 40) {
				style.backgroundColor = "rgb(97, 181, 61)";
				style.color = "white";
			}
			
			// change some actual text (Tom -> Tomsa)
			if (style.textDisplay == "Tom")
				style.textDisplay = "Tomsa";
		}

		// flag all person over the age of 70 
		if (col.dbName == "lastname" && row["age"] > 70 ) {
			style.faImage = "flag";
			if (row["age"] > 85)
				style.faImageColour = "red";
		}

		// if the column is the updown then interpret the data as the font-awesome image!
		if (col.dbName == "img")  
			style.faImage = row["img"];

		// on the valuation cell I wish an indicator (up/down image)
		if (col.dbName == "valuation")  {
			let img = row["updown"] || "";  // bear in mind (sub)total rows will be undefined otherwise...
			style.faImage = img;
			style.faImageColour = img.contains("up") ? "green" : "red";
		}
		
		// return the adjusted cell-style
		return style;
	}
	
	// create a new VGrid (given the settings)
	vgrid = new VGrid(settings);

	vgrid.onChanged = (info) => {
		let msg = `idColumn: ${info.idColumn},  selectedIDValue: ${info.selectedIDValue}, selectedPKValue: ${info.selectedPKValue} - # selected rows: ${info.selectedRows.length} - 
					isgroupHeader: ${info.isGroupHeader}, groupLevel: ${info.groupLevel}`;
		console.log("onChanged: " + msg);
	};
}

let xx = (s, f) => {
	document.getElementById(s).addEventListener("click", () => f());	
}

//object.addEventListener("click", myScript);
xx('btn5', () => setData(5));
xx('btn30', () => setData(30));
xx('btn8000', () => setData(8000));
xx('btnSelectCode5', () => vgrid.findAndSelect('Code5', 'code'));
//xx('btnCreateGrid', () => createGrid());
xx('btnClearRows', () => setData(0));
//xx('btnDestroyGrid', () => vgrid.destroy());
//xx('btnGetSettings', () => _col_settings = vgrid.getSettings());
xx('btnGroup1', () => vgrid.setGroupColumns(['currency']));
xx('btnGroup2', () => vgrid.setGroupColumns(['currency', 'county']));
xx('btnUnGroup10', () => vgrid.setGroupColumns([]));
//xx('btnRefresh', () => grid.refresh());


xx('btnUpdateCell', () => {
	let info = UpdateRowInfo.createSingleCell("Code8", "county", "Essex");
	vgrid.updateData(info);
});

xx('btnUpdateRow', () => {
	let row = vgrid.getCurrentRow();
	row.valuation = 9010.55;
	row.county = "London";
	row.price = 915.25;

	let info = UpdateRowInfo.createFromRow(row);
	vgrid.updateData(info);
});

// create a grid straight away
createGrid();
