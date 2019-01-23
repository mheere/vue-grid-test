var path = require("path");

module.exports = {
	mode: "development",
	entry: {
		app: ["./init.js"]
	},
	output: {
		path: path.resolve(__dirname, "build"),
		//publicPath: "/assets/",
		filename: "bundle.js"
	},
	devtool: '#eval-source-map'
};