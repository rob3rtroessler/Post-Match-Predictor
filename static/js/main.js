// global variables
let dataSetData;

// load data using promises
let promises = [
    d3.json("static/data/tables.json"),
];

// promises
Promise.all(promises)
    .then(function (data) {
        dataSetData = data[0]
        initMainPage(data[0])
    })
    .catch(function (err) {
        console.log(err)
    });


function initMainPage(data) {
    console.log('data', data)

    // populate data sets
    populateDataSetSelector(data)
}





