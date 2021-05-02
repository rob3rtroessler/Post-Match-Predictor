// DECLARE GLOBAL VARIABLES

// home_away_matters: false,
//     score_home: score_home,
//     score_away: score_away,
//     shots_home: shots_home,
//     shots_away: shots_away,
//     passes_home: passes_home,
//     passes_away: passes_away,
//     misplaced_passes_home: misplaced_passes_home,
//     misplaced_passes_away: misplaced_passes_away,
//     pass_accuracy_home: pass_accuracy_home,
//     pass_accuracy_away: pass_accuracy_away,
//     distance_home: distance_home,
//     distance_away: distance_away,
//     grade: grade,
//     summary_german: summary_german,
//     summary_english: summary_english,
//     coach_home: 'TODO',
//     coach_away: 'TODO',
//     interview_german: 'TODO',
//     interview_english: 'TODO'
//

console.log('main.js loaded')
let data = 'placeholder';
let distributionVis = new DistributionVis('distributionVisContainer', data)
let topWordsVis = new TopWordsVis('topWordsVisContainer', data)



// declare async initialize function to keep all processes in order
async function initializeTexTileModule (data){
}

// declare function that is triggered when server response received
function initTexTileModule(data){

    // call async function
    initializeTexTileModule(data)
        .then( wrangleTexTileData(data) )    // the reason why we passed the 'promised' data from function to function
        .then( wrangleLineChartData(lockedWords, data) )    // lineChart data should take info from lockedWords from
        .then (computeDistinctWords() )
    // searched word should be computed in python and passed into the JSON file's 'metadata'.
    //    .then( wrangleNetworkData() )
    //    .then( wrangleMatrixData() )
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
            topWordsVis.data = computeMostFrequent(response.data)
            topWordsVis.wrangleData()
        })
        .catch(function (error) {
            console.log(error)
        });
}

// helper functions
function computeMostFrequent(data) {

    let most_freq_home = {}
    let most_freq_away = {}
    data.forEach(match=>{
        // home team
        match['interview_home_english_as_tokens'].forEach(token =>{
            if (token in most_freq_home){
                most_freq_home[token] +=1
            }
            else{
                most_freq_home[token] = 1
            }
        })

        // away team
        match['interview_away_english_as_tokens'].forEach(token =>{
            if (token in most_freq_away){
                most_freq_away[token] +=1
            }
            else{
                most_freq_away[token] = 1
            }
        })
    })

    let most_freq_home_sorted = sortMostFrequentDict(most_freq_home)
    let most_freq_away_sorted = sortMostFrequentDict(most_freq_away)

    // Create a new array with only the first 5 items
    //console.log(items.slice(0, 50));

    return {home: most_freq_home_sorted, away: most_freq_away_sorted}
}

function sortMostFrequentDict(freqDict){
    let items = Object.keys(freqDict).map(function(key) {
        return [key, freqDict[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    console.log('returning', items)
    return items
}