/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){

					window.electionResult = electionResult;
					console.log(electionResult);

	        //for reference:https://github.com/Caged/d3-tip
	        //Use this tool tip element to handle any hover over the chart
	        let x = electionResult[0];
	        let tip = d3.tip().attr('class', 'd3-tip')
	            .direction('s')
	            .offset(function() {
	                return [0,0];
	            })
	            .html((d)=> {
	            	let tooltip_data = {
	            		result: [
	            			{"nominee": x.D_Nominee_prop,"votecount": x.D_Votes_Total,"percentage": x.D_PopularPercentage,"party":"D"} ,
	                  {"nominee": x.R_Nominee_prop,"votecount": x.R_Votes_Total,"percentage": x.R_PopularPercentage,"party":"R"} ,
	                  {"nominee": x.I_Nominee_prop,"votecount": x.I_Votes_Total,"percentage": x.I_PopularPercentage,"party":"I"}
	            		]
	            	};
	                /* populate data in the following format
	                 * tooltip_data = {
	                 * "result":[
	                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
	                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
	                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
	                 * ]
	                 * }
	                 * pass this as an argument to the tooltip_render function then,
	                 * return the HTML content returned from that method.
	                 * */
	                return tooltip_render(tooltip_data);
	            });


   			  // ******* TODO: PART III *******

   			  this.svg.html(null);
   			  let rects = ["I","D","R"].map((c, i) => {
	   			  return this.svg.append('rect')
	   			  	.attr('y', this.svgHeight / 2 - 10)
	   			  	.attr('width', x[c + "_PopularPercentage"])
	   			  	.attr('height', 20)
	   			  	.classed(this.chooseClass(c), true)
              .classed('votesPercentage', true);
   			  });
   			  rects[1].attr('x', x.I_PopularPercentage);
   			  rects[2].attr('x', +x.I_PopularPercentage.slice(0, -1) + +x.D_PopularPercentage.slice(0, -1) + '%');
   			  let texts = ["I","D","R"].map((c, i) => {
   			  	return this.svg.append('text')
	   			  	.attr('y', this.svgHeight / 2 - 16)
   			  		.text(x[c + "_PopularPercentage"])
	   			  	.classed(this.chooseClass(c), true)
   			  		.classed('votesPercentageText', true);
   			  });
	        texts[1].attr('text-anchor', 'end').attr('x', x.I_PopularPercentage);
	        texts[2].attr('text-anchor', 'start').attr('x', '100%');
	        this.svg.append("path")
	            .attr('stroke', '#000')
	            .attr('stroke-width', '2')
	            .attr('d', 'M' + Math.floor(this.svgWidth / 2) + ',' + (this.svgHeight / 2 - 18) + 'v36');
	        this.svg.append("text")
	            .text('Popular Vote (50%)')
	            .attr('text-anchor', 'middle')
	            .attr('x', '50%')
	            .attr('y', this.svgHeight / 2 - 28);

		    //Create the stacked bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.

		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}
