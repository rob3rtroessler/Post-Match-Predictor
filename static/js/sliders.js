
let sliderSettings = [
    {id:'home-goals-slider', start: [0, 10], step: 1, range: {'min': 0,'max': 10}, span_id: "home-goals-span", filter_key: 'score_home'},
    {id:'away-goals-slider', start: [0, 10], step: 1, range: {'min': 0,'max': 10}, span_id: "away-goals-span", filter_key: 'score_away'},
    {id:'home-shots-slider', start: [0, 40], step: 1, range: {'min': 0,'max': 40}, span_id: "home-shots-span", filter_key: 'shots_home'},
    {id:'away-shots-slider', start: [0, 40], step: 1, range: {'min': 0,'max': 40}, span_id: "away-shots-span", filter_key: 'shots_away'},
    {id:'home-pass-acc-slider', start: [0, 100], step: 1, range: {'min': 0,'max': 100}, span_id: "home-pass-acc-span", filter_key: 'pass_accuracy_home'},
    {id:'away-pass-acc-slider', start: [0, 100], step: 1, range: {'min': 0,'max': 100}, span_id: "away-pass-acc-span", filter_key: 'pass_accuracy_away'},
    {id:'home-distance-slider', start: [90, 130], step: 1, range: {'min': 90,'max': 130}, span_id: "home-distance-span", filter_key: 'distance_home'},
    {id:'away-distance-slider', start: [90, 130], step: 5, range: {'min': 90,'max': 130}, span_id: "away-distance-span", filter_key: 'distance_away'}
]

let filterSettings = {
    score_home: sliderSettings[0].start,
    score_away: sliderSettings[1].start,
    shots_home:  sliderSettings[2].start,
    shots_away:  sliderSettings[3].start,
    // passes_home: [],
    // passes_away: [],
    // misplaced_passes_home: [],
    // misplaced_passes_away: [],
    pass_accuracy_home:  sliderSettings[4].start,
    pass_accuracy_away:  sliderSettings[5].start,
    distance_home:  sliderSettings[6].start,
    distance_away:  sliderSettings[7].start
}

sliderSettings.forEach(slider =>{
    createSliders(slider.id, slider.start, slider.step, slider.range, slider.span_id, slider.filter_key)
})

function createSliders(id, start, step, range, span_id, filter_key){

    let slider = document.getElementById(id);

    noUiSlider.create(slider, {
        start: start,
        step: step,
        behavior: 'drag-drop',
        connect: true,
        range: range,
        format: wNumb({
            decimals: 1
        })
    })

// event listener
    slider.noUiSlider.on('change', function () {

        // get value & update info + filterSettings
        let value = slider.noUiSlider.get();
        document.getElementById(span_id).innerHTML = `${+value[0]} - ${+value[1]}`
        filterSettings[filter_key] = [+value[0], +value[1]]

        // try dynamic updates
        sendFilterSettings()
    });
}

// GENERATOR SLIDERS

let sentimentSlider = document.getElementById("sentiment-slider");

noUiSlider.create(sentimentSlider, {
    start: 0,
    step: 0.1,
    behavior: 'drag-drop',
    connect: true,
    range: {'min': -1,'max': 1},
    format: wNumb({
        decimals: 1
    })
})