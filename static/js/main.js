// DECLARE GLOBAL VARIABLES AND CREATE CLASS INSTANCES
let data = 'placeholder';
let distributionVis = new DistributionVis('distributionVisContainer', data)
let topWordsVis = new TopWordsVis('topWordsVisContainer', data)

// initial filter settings
let filterSettings = {
    score_home: sliderSettings[0].start,
    score_away: sliderSettings[1].start,
    shots_home:  sliderSettings[2].start,
    shots_away:  sliderSettings[3].start,
    passes_home: sliderSettings[4].start,
    passes_away: sliderSettings[5].start,
    misplaced_passes_home: sliderSettings[6].start,
    misplaced_passes_away: sliderSettings[7].start,
    pass_accuracy_home:  sliderSettings[8].start,
    pass_accuracy_away:  sliderSettings[9].start,
    distance_home:  sliderSettings[10].start,
    distance_away:  sliderSettings[11].start
}

function sendFilterSettings() {

    console.log("---------------------------------------------- \n " +
        "The following filter settings will be sent to the server:", filterSettings);


    axios.post('/filterData', {
        'filters' : filterSettings
    })
        .then(function (response) {

            console.log("The server sent back the following matches:", response);    // log the response from server to examine data

            // update data for distributionVis & call wrangleData method
            distributionVis.data = response.data
            distributionVis.wrangleData()

            // compute most frequent words & call
            console.log('cling toWordsVis')
            topWordsVis.data = response.data//computeMostFrequent(response.data)
            topWordsVis.wrangleData()
        })
        .catch(function (error) {
            console.log(error)
        });
}

// start by sending initial filter settings to the server
sendFilterSettings()