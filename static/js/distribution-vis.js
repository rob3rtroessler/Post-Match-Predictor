class DistributionVis {

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

        vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

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
            .text('Currently selected games from dataset')
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

        // text label for the y axis
        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x",0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Goal Difference");

        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x",0 - (vis.height *1/10))
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.7em")
            .text("Home Team -->");

        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x",0 - (vis.height *9/10))
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.7em")
            .text("<-- Away Team");

        // text label for the x axis
        vis.svg.append("text")
            .attr("y", vis.height)
            .attr("x",vis.width / 2)
            .attr("dy", "2em")
            .style("text-anchor", "middle")
            .text("Difference in Shots");

        vis.svg.append("text")
            .attr("y", vis.height)
            .attr("x", vis.width *9/10)
            .attr("dy", "2.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.7em")
            .text("Away Team -->");

        vis.svg.append("text")
            .attr("y", vis.height)
            .attr("x", vis.width *1/10)
            .attr("dy", "2.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.7em")
            .text("<-- Home Team");
    }

    wrangleData(){
        let vis = this

        // reset wrangledDate
        vis.wrangledDate = []

        // calculate goal & shot diff & populate wrangledData
        vis.data.forEach(match => {

            let goal_diff = match['score_home'] - match['score_away']
            let shot_diff = match['shots_home'] - match['shots_away']

            vis.wrangledDate.push({
                goal_diff: goal_diff,
                shot_diff: shot_diff,
                data : match
            })
        })

        console.log(vis.wrangledDate);

        // after data wrangling is done, call updateVis method
        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // scale for x axis
        vis.xScale = d3.scaleLinear()
            .range([vis.width, 0])
            .domain([d3.min(vis.wrangledDate, d => d.shot_diff), d3.max(vis.wrangledDate, d => d.shot_diff)])

        console.log('shot_diffs', [d3.min(vis.wrangledDate, d => d.shot_diff), d3.max(vis.wrangledDate, d => d.shot_diff)])

        // scale for y axis
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([d3.min(vis.wrangledDate, d => d.goal_diff), d3.max(vis.wrangledDate, d => d.goal_diff)])

        // axis
        vis.xAxisGroup.transition().duration(500).call(d3.axisBottom(vis.xScale))
        vis.yAxisGroup.transition().duration(500).call(d3.axisLeft(vis.yScale))

        // draw scatter plot
        vis.circles = vis.svg.selectAll('circle').data(vis.wrangledDate)

        vis.circles.enter().append('circle')
            .merge(vis.circles)
            .attr('cx', d => vis.xScale(d.shot_diff)+ Math.floor(Math.random() * 5)) // some randomness to see overlapping matches
            .attr('cy', d => vis.yScale(d.goal_diff))

            .on('mouseover', function (event,d) {

                // reset all
                d3.selectAll('.match_circle')
                    .attr('r', 2)
                    .style('fill', '#35978f')

                // highlight selection
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r', 10)
                    .style('fill', '#35978f')

                // update text
                let interview_home = d.data['interview_home_english']
                let interview_away = d.data['interview_away_english']

                document.getElementById("interview_home").innerHTML = `${d.data['coach_home']} (${d.data['name_home_team']}): ${interview_home}`;
                document.getElementById("interview_away").innerHTML = interview_away;

                // update tooltip
                // update tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                            <h3>${d.data['name_home_team']} - ${d.data['name_away_team']}<h3>
                            <h4>Score: ${d.data['score_home']} - ${d.data['score_away']}</h4>
                            <h4>Shots: ${d.data['shots_home']} - ${d.data['shots_away']}</h4>
                            <h4>Passes: ${d.data['passes_home']} - ${d.data['passes_away']}</h4>                            
                            <h4>Misplaced Passes: ${d.data['misplaced_passes_home']} - ${d.data['misplaced_passes_away']}</h4>                            
                            <h4>Pass Accuracy: ${d.data['pass_accuracy_home']}% - ${d.data['pass_accuracy_away']}%</h4>
                        </div>`);
            })
            .on('mouseout', function (event,d) {

                // stop highlighting
                d3.select(this)
                    .attr('r', 2)
                    .style('fill', '#35978f')

                document.getElementById("interview_home").innerHTML = 'explore interviews by hovering & clicking matches or generate an interview by clicking on "generate"';
                document.getElementById("interview_away").innerHTML = '';

                // hide tooltip
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0 +"px")
                    .style("top", 0+ "px")

            })
            .on('click', function (a,b) {
                console.log('test', a,b)
            })
            .attr('r', 0)
            .transition()
            .duration(500)
            .attr('class', 'match_circle')
            .attr('cx', d => vis.xScale(d.shot_diff)+ Math.floor(Math.random() * 5)) // some randomness to see overlapping matches
            .attr('cy', d => vis.yScale(d.goal_diff))
            .attr('r', 2)
            .style('fill', '#35978f')
            .style('opacity', '0.4')
            .style('stroke', '#01665e')

        vis.circles.exit().remove()

    }
}