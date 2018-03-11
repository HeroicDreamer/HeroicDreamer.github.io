   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

    update (electionResult, colorScale){

        // ******* TODO: PART II *******

        let groups = electionResult.reduce((rv, e) => {
            let x = +e.RD_Difference;
            rv[x ? x > 0 ? 2 : 1 : 0].push(e);
            return rv;
        }, [[],[],[]]);
        groups.forEach(x => x.sort((a, b) => +a.RD_Difference - +b.RD_Difference));
        let counts = groups.map(e => e.map(x => +x.Total_EV).reduce((a, b) => a + b, 0));
        let self = this;
        let totalTotal = electionResult.reduce((a, b) => a + +b.Total_EV, 0);
        let ev = 0;
        this.svg.html(null);
   
        let g = this.svg.selectAll("g")
            .data(groups)
            .enter()
            .append("g")
            .selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
               return calcX(d);
            })
            .attr("y", this.svgHeight / 2 - 20)
            .attr("width", function(d, i) {
               return calcWidth(d);
            })
            .attr("height", 20)
            .style("fill", function(d, i) {
                return +d.RD_Difference ? colorScale(+d.RD_Difference) : "green";
            })
            .classed('electoralVotes', true);
        let texts = counts.map((c, i) => {
            return this.svg.append("text")
                .text(c)
                .attr("y", this.svgHeight / 2 - 24)
                .classed(this.chooseClass("IDR"[i]), true)
                .classed('electoralVoteText', true)
            });
        texts[1].attr('text-anchor', 'end')
            .attr('x', self.svgWidth * counts[0] / totalTotal);
        texts[2].attr('text-anchor', 'start')
            .attr('x', self.svgWidth);
        this.svg.append("path")
            .attr('stroke', '#000')
            .attr('stroke-width', '2')
            .attr('d', 'M' + self.svgWidth / 2 + ',' + (this.svgHeight / 2 - 28) + 'v36');
        this.svg.append("text")
            .text('Electoral Vote (270 needed to win)')
            .attr('text-anchor', 'middle')
            .attr('x', self.svgWidth / 2)
            .attr('y', this.svgHeight / 2 - 36);


        
    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    function calcX(d){
        let ret = self.svgWidth * ev / totalTotal;
        ev += +d.Total_EV;
        return ret;
    }
    function calcWidth(d){
        return self.svgWidth * d.Total_EV / totalTotal;
    }

    function brushed(){
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var data = electionResult.filter(d => {
            return d3.event.selection[0] <= d.xmin && d.xmax <=d3.event.selection[1]
        })
        shiftChart.update(data);
       
    }

    ev = 0;
    var minx = 1e100, maxx = 0;
    groups.forEach(g => g.forEach(d => {
        var dd = calcX(d), ww = calcWidth(d);
        minx = Math.min(minx, dd)
        maxx = Math.max(maxx, dd + ww);
        d.xmin = dd;
        d.xmax = dd + ww;
    }));
    var brush = d3.brushX().extent([[minx, this.svgHeight / 2 - 20], [maxx, this.svgHeight / 2]]).on("end", brushed);
    
    this.svg.append("g")
            .attr("class", "brush")
            .call(brush)
    };

    
}
