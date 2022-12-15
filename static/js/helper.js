
function populateDataSetSelector(data) {
    data.forEach((databaseDict,i) => {
        //console.log(databaseDict['db_id'])
        document.getElementById("dataSetSelector").innerHTML += `<option value="${i}">${databaseDict['db_id']}</option>`
    })
}

function showDataSet() {
    let selectedDataSetId = document.getElementById('dataSetSelector').value

    let columnNames = dataSetData[selectedDataSetId]["column_names_original"]

    document.getElementById('dataSetExplorer').innerHTML = ``

    columnNames.forEach((column,i) => {
        if (i>0){
            document.getElementById('dataSetExplorer').innerHTML +=     `<div class="col data-table-column">
                                                                            <div class=d-flex">
                                                                                <span class="align-middle">${column[1]}</span>
                                                                            </div>
                                                                        </div>`
        }
    })

    console.log('get value',dataSetData[selectedDataSetId]["column_names_original"])

}

function generateQuery(){

    // send request
    sendString()
}

function displayQuery(queryString){

    document.getElementById('queryDisplayDiv').innerHTML =  `<div class="row justify-content-center" style="height: 25%">
                                                                <h2 class="align-self-center" style="text-align: center">Input question:</h2>
                                                            </div>
                                                            <div class="row justify-content-center" style="height: 25%">
                                                                <h3 class="align-self-center" style="text-align: center">${document.getElementById('inputString').value}?</h3>
                                                            </div>
                                                            <div class="row justify-content-center" style="height: 25%">
                                                                <h2 class="align-self-center" style="text-align: center">Output query:</h2>
                                                            </div>
                                                            <div class="row justify-content-center" style="height: 25%">
                                                                <h3 class="align-self-center" style="text-align: center">${queryString}</h3>
                                                            </div>`

    // switch to right carousel
    generate()

    // show evaluate
    displayEvaluate(queryString)
}

function displayEvaluate(queryString) {

    console.log('evaluate')

    // reset
    document.getElementById('evaluateDiv').innerHTML = ``

    console.log(queryString)
    let queryAsArray = queryString.split(" ")
    console.log(queryAsArray)

    queryAsArray.forEach((element,i)=>{
        document.getElementById('evaluateDiv').innerHTML +=  `<span class="query-element ${element.toLowerCase()}" id="element${i}" onclick="markWrong(${i})">${element}</span>`

    })
}

function markWrong(i) {
    console.log('wrong',i)
    d3.select(`#element${i}`).style('background', 'red')
    document.getElementById(`element${i}`).style.background = 'red'
}

function sendString() {

    let selectedDataSetId = document.getElementById('dataSetSelector').value
    let selectedDataSetName = dataSetData[selectedDataSetId]['db_id']
    let inputString = document.getElementById('inputString').value

    // console.log('fired', selectedDataSetName)

    axios.post('/generateSQL', {
        "inputs" : [inputString, selectedDataSetName]
    })
        .then(function (response) {

            console.log("The server sent back the following query:", response);    // log the response from server to examine data


            //display query
            displayQuery(response.data)

        })
        .catch(function (error) {
            console.log(error)
        });
}