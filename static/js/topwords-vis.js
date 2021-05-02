class TopWordsVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.wrangledDate = []

        // call initVis method
        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 50, right: 30, bottom: 50, left: 10};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height()*5 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text('most frequent words')
            .attr('transform', `translate(${vis.width / 2}, -15)`)
            .attr('text-anchor', 'middle');


        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'distributionTooltip')

        // axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // having initialized the map, move on to wrangle data
        // this.wrangleData();
    }

    wrangleData(){
        let vis = this

        // reset wrangledDate
        let home = vis.data.home.slice(0,100)
        let away = vis.data.away.slice(0,100)

        let homeFinal = [],
            awayFinal = []

        home.forEach(word=>{
            homeFinal.push({word: word[0], count: word[1]})
        })

        away.forEach(word=>{
            awayFinal.push({word: word[0], count: word[1]})
        })

        vis.wrangledDate = {home: homeFinal, away: awayFinal}


        console.log('wrangleData', vis.wrangledDate)

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // scale for rectWidth HOME & AWAY
        vis.rectWidthScaleHome = d3.scaleLinear()
            .range([vis.width*2/10, vis.width*4.5/10])
            .domain([d3.min(vis.wrangledDate.home, d => d.count), d3.max(vis.wrangledDate.home, d => d.count)])


        // home rects
        vis.rectanglesHome = vis.svg.selectAll('.home-rect').data(vis.wrangledDate.home)

        vis.rectanglesHome.enter().append('rect')
            .merge(vis.rectanglesHome)
            .attr('class', 'home-rect')
            .transition()
            .duration(500)
            .attr('x', (d,i) => 0)
            .attr('y', (d,i) => i*25)
            .attr('width', d => vis.rectWidthScaleHome(d.count))
            .attr('height', 20)
            .style('fill', '#35978f')
            .style('stroke', '#01665e')

        vis.rectanglesHome.exit().remove()

        // away rects
        vis.rectanglesAway = vis.svg.selectAll('.away-rect').data(vis.wrangledDate.away)

        vis.rectanglesAway.enter().append('rect')
            .merge(vis.rectanglesAway)
            .attr('class', 'away-rect')
            .transition()
            .duration(500)
            .attr('x', (d,i) => vis.width - vis.rectWidthScaleHome(d.count)) // adjust for right side
            .attr('y', (d,i) => i*25)
            .attr('width', d => vis.rectWidthScaleHome(d.count))
            .attr('height', 20)
            .style('fill', '#35978f')
            .style('stroke', '#01665e')

        vis.rectanglesAway.exit().remove()


        // home text
        vis.textHome = vis.svg.selectAll('.home-text').data(vis.wrangledDate.home)

        vis.textHome.enter().append('text')
            .merge(vis.textHome)
            .attr('class', 'home-text')
            .attr('x', (d,i) => 2)
            .attr('y', (d,i) => i*25+15)
            .text(d => `${d.word} (${d.count})`)

        vis.textHome.exit().remove()

        // home text
        vis.textAway = vis.svg.selectAll('.away-text').data(vis.wrangledDate.away)

        vis.textAway.enter().append('text')
            .merge(vis.textAway)
            .attr('class', 'away-text')
            .attr('x', (d,i) => vis.width-2) // adjust for right side
            .attr('y', (d,i) => i*25+15)
            .text(d => `${d.word} (${d.count})`)
            .style('text-anchor', 'end')

        vis.textAway.exit().remove()
    }
}