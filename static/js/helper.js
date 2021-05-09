let stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
    "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they",
    "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those",
    "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does",
    "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
    "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after",
    "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further",
    "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more",
    "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
    "t", "can", "will", "just", "don", "should", "now"]

// stop word switch
function sw_switch_triggered(){
    //console.log(document.getElementById('sw-switch').checked)

    // fire topWordsVis' wrangleData method after the switch has been triggered
    topWordsVis.stopWordsSwitch = document.getElementById('sw-switch').checked

    if (topWordsVis.stopWordsSwitch){
        document.getElementById('sw-switch-label').innerHTML= 'stop words included'
    } else {
        document.getElementById('sw-switch-label').innerHTML= 'stop words dropped'
    }

    topWordsVis.wrangleData()
}

function show_token_difference() {
    topWordsVis.animateTokenFreqDiff()
}




function display_instructions() {
    let htmlString = `<div class="col">
                    <div class="row box" style="height: 29vh; border: thin solid grey; background: #ececec; padding: 5px; border-radius: 5px">
        
                        <div class="col-2 offset-1">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col" style="background: rgba(53,151,143,0.75); border: thin solid #01665e; border-radius: 5px;">
                                    <div class="row justify-content-center" style="height: 66%;">
                                        <img class="align-self-center" src="static/img/explore.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row justify-content-center" style="height: 34%">
                                        <span class="align-self-center structure-text" style="text-align: center;">explore data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col">
                                    <div class="row justify-content-center" style="height: 100%;">
                                        <img class="align-self-center" src="static/img/arrow-right.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col" style="background: rgba(223,194,125,0.75); border: thin solid #8c510a; border-radius: 5px;">
                                    <div class="row justify-content-center" style="height: 66%;">
                                        <img class="align-self-center" src="static/img/logo.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row justify-content-center" style="height: 34%">
                                        <span class="align-self-center structure-text" style="text-align: center;">generate interview</span>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col">
                                    <div class="row justify-content-center" style="height: 100%;">
                                        <img class="align-self-center" src="static/img/arrow-right.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col" style="background: rgba(94,177,191,0.75); border: thin solid rgb(54,106,115); border-radius: 5px;">
                                    <div class="row justify-content-center" style="height: 66%;">
                                        <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row justify-content-center" style="height: 34%">
                                        <span class="align-self-center structure-text" style="text-align: center;">examine interviews</span>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                    </div>
                </div>`

    document.getElementById('output-row').innerHTML = htmlString
}

function display_interviews(data, prediction=false) {

    let backgroundColor = (!prediction) ? '#c7eae5' : 'red'

    // update text
    let interview_home = data['interview_home_english']
    let interview_away = data['interview_away_english']

    let htmlString = `<div class="col">
                            <div class="row box" style="height: 14vh; border: thin solid grey; margin-bottom: 1vh; background: ${backgroundColor}; padding: 5px; border-radius: 5px">
                                <div class="col-1">
                                    <div class="row justify-content-center" style="height: 75%">
                                        <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row">
                                        <span style="text-align: center; font-size: 0.7em">(home)</span>
                                    </div>
                                </div>
                                <div class="col-11">
                                    <div class="row" style="height: 100%">
                                        <div class="coach-output"><span id="interview_home">${interview_home}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row box" style="height: 14vh; border: thin solid grey; margin-bottom: 1vh; background: ${backgroundColor}; padding: 5px; border-radius: 5px">
                                <div class="col-1">
                                    <div class="row justify-content-center" style="height: 75%">
                                        <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row">
                                        <span style="text-align: center; font-size: 0.7em">(away)</span>
                                    </div>
                                </div>
                                <div class="col-11">
                                    <div class="row" style="height: 100%">
                                        <div class="coach-output"><span id="interview_away">${interview_away}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>`

    // update
    document.getElementById('output-row').innerHTML = htmlString
}