// SLIDER SETTINGS FOR EXPLORER SLIDERS
let sliderSettings = [
    {id:'home-goals-slider', start: [0, 10], step: 1, range: {'min': 0,'max': 10}, span_id: "home-goals-span", filter_key: 'score_home'},
    {id:'away-goals-slider', start: [0, 10], step: 1, range: {'min': 0,'max': 10}, span_id: "away-goals-span", filter_key: 'score_away'},
    {id:'home-shots-slider', start: [0, 40], step: 1, range: {'min': 0,'max': 40}, span_id: "home-shots-span", filter_key: 'shots_home'},
    {id:'away-shots-slider', start: [0, 40], step: 1, range: {'min': 0,'max': 40}, span_id: "away-shots-span", filter_key: 'shots_away'},
    {id:'home-passes-slider', start: [0, 1000], step: 50, range: {'min': 0,'max': 1000}, span_id: "home-passes-span", filter_key: 'passes_home'},
    {id:'away-passes-slider', start: [0, 1000], step: 50, range: {'min': 0,'max': 1000}, span_id: "away-passes-span", filter_key: 'passes_away'},
    {id:'home-misplaced_passes-slider', start: [0, 200], step: 10, range: {'min': 0,'max': 200}, span_id: "home-misplaced-passes-span", filter_key: 'misplaced_passes_home'},
    {id:'away-misplaced_passes-slider', start: [0, 200], step: 10, range: {'min': 0,'max': 200}, span_id: "away-misplaced-passes-span", filter_key: 'misplaced_passes_away'},
    {id:'home-pass-acc-slider', start: [0, 100], step: 1, range: {'min': 0,'max': 100}, span_id: "home-pass-acc-span", filter_key: 'pass_accuracy_home'},
    {id:'away-pass-acc-slider', start: [0, 100], step: 1, range: {'min': 0,'max': 100}, span_id: "away-pass-acc-span", filter_key: 'pass_accuracy_away'},
    {id:'home-distance-slider', start: [90, 130], step: 1, range: {'min': 90,'max': 130}, span_id: "home-distance-span", filter_key: 'distance_home'},
    {id:'away-distance-slider', start: [90, 130], step: 5, range: {'min': 90,'max': 130}, span_id: "away-distance-span", filter_key: 'distance_away'}
]

// init explorer sliders
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





// SLIDER SETTINGS FOR EXPLORER SLIDERS
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