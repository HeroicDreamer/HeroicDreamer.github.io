/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let divTiles = d3.select("#tiles").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2 + 400;
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
        this.svg = divTiles.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",this.svgHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
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
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
        });
        text += "</ul>";

        return text;
    }

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale){

            //Calculates the maximum number of columns to be laid out on the svg
            this.maxColumns = d3.max(electionResult,function(d){
                                    return parseInt(d["Space"]);
                                });

            //Calculates the maximum number of rows to be laid out on the svg
            this.maxRows = d3.max(electionResult,function(d){
                                    return parseInt(d["Row"]);
                            });

            //Creates a legend element and assigns a scale that needs to be visualized
            this.legendSvg.append("g")
                .attr("class", "legendQuantile")
                .attr("transform", "translate(0,50)");

            let legendQuantile = d3.legendColor()
                .shapeWidth(100)
                .cells(10)
                .orient('horizontal')
                .scale(colorScale);

            this.legendSvg.select(".legendQuantile")
                .call(legendQuantile);
                           
         
           
        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
            let tip = d3.tip().attr('class', 'd3-tip')
                .direction('se')
                .offset(function() {
                    return [0,0];
                })
                .html((d)=>{
                    var titleClass;
                    switch(d['Winning Party']){
                        case 'R': titleClass='republican'; break
                        case 'I': titleClass='independent'; break
                        case 'D': titleClass='democrat'; break
                    }
                    return `
                    <div>
                        <div class='tooltip-title ${titleClass}'>${d.State}</div>
                        <div>Electoral Votes: ${d.Total_EV}</div>
                        <ul>
                            <li class='democrat'>${d.D_Nominee_prop}: ${d.D_Votes}(${d.D_Percentage}%)</li>
                            <li class='republican'>${d.R_Nominee_prop}: ${d.R_Votes}(${d.R_Percentage}%)</li>
                            ${d.I_Nominee ? `<li class='independent'>${d.I_Nominee_prop}: ${d.I_Votes}${d["I_Nominee tooltip '('"]}${d.I_Percentage}${d["I_Nominee tooltip 'Percentage)'"]}</li>` : ""}
                        </ul>
                    </div>
                    
                    `;
                    
                    
                });

            // ******* TODO: PART IV *******
            //Tansform the legend element to appear in the center and make a call to this element for it to display.

            //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

            //Display the state abbreviation and number of electoral votes on each of these rectangles

            //Use global color scale to color code the tiles.

            //HINT: Use .tile class to style your tiles;
            // .tilestext to style the text corresponding to tiles

            //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
            //then, vote percentage and number of votes won by each party.
            //HINT: Use the .republican, .democrat and .independent classes to style your elements.
            this.svg
            .selectAll(".tile").remove()
        this.svg
            .selectAll(".tilestext").remove()
     
           
            
            this.svg.call(tip);
            this.svg
            .selectAll(".tile")
            .data(electionResult)
            .enter()
            .append("rect")
            .classed("tile", true)
            .attr("x", d => d.Space * 60)
            .attr("y", d => d.Row * 60)
            .attr("width", 62)
            .attr("height", 62)
            .attr("fill", d => colorScale(d.RD_Difference))
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
        
        this.svg
            .selectAll(".tilestext .name")
            .data(electionResult)
            .enter()
            .append("text")
            .classed("tilestext", true)
            .classed("name", true)
            .attr("x", d => d.Space * 60 + 30)
            .attr("y", d => d.Row * 60 + 20)
            .text(d => d.Abbreviation)
    
        this.svg
            .selectAll(".tilestext .number")
            .data(electionResult)
            .enter()
            .append("text")
            .classed("tilestext", true)
            .classed("number", true)
            .attr("x", d => d.Space * 60 + 30)
            .attr("y", d => d.Row * 60 + 40)
            .text(d => d.Total_EV)
            
    };


}
