/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData.slice().sort((a, b) => d3.ascending(a.year, b.year));
        this.bars = d3.select("#barChart")
                    .selectAll("rect")
                    .data(this.allData);
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {


        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes
  
        let marginX = 80;
        let marginY = 80;
        let xScale = d3.scaleBand().range([marginX, 500]).domain(this.allData.map(x => x.year));
        let yScale = d3.scaleLinear().range([400 - marginY, 0])
                        .domain([0, d3.max(this.allData, d => d[selectedDimension])]
                    );

        

        // Create colorScale
        let colorScale = d3.scaleOrdinal()
                           .domain(this.allData.map(function(d) { return d.year; }))
                           .range(["#DD4E00", "#F78500", "#F9C134", "#F0F4C1"])
                    d3.select("#barChart")
                      .selectAll("rect")
                      .remove()
                    


        // Create the axes (hint: use #xAxis and #yAxis)
        let min = d3.min(this.allData, x => x.year)
        let max = d3.max(this.allData, x => x.year)
        let x = d3.scaleLinear().range([marginX, 500]).domain([min, max])
        let y = d3.scaleLinear().range([400-marginY, marginY])
        let self = this;

         d3.select("#xAxis")
           .attr("transform", "translate(" + 12 + "," + (400-marginY + ")"))
           .call(d3.axisBottom(xScale))
           .selectAll("text")
           .attr("transform", "rotate(90)")
           .style('text-anchor', 'start')
         d3.select("#yAxis")
           .attr("transform", "translate(" + marginX + ",0)")
           .call(d3.axisLeft(yScale));
         
        // Create the bars (hint: use #bars)
         d3 .select("#bars")
            .selectAll("rect")
            .data(this.allData)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.year) + 6)
            .attr("width", 15)
            .attr("y", d =>  yScale(d[selectedDimension]))
            .attr("height", d => 400 - marginY - yScale(d[selectedDimension]))
            .attr("fill", d =>colorScale(d.year))
            
        


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.
             .on('click', function(d){
                d3.select("#bars")
                  .selectAll("rect")
                  .data(self.allData)
                  .attr("fill", d => colorScale(d.year))
                d3.select(this)
                  .attr("fill", "blue")
                self.infoPanel.updateInfo(d);
                self.worldMap.updateMap(d);
             })
    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        this.updateBarChart(d3.select("#dataset").property('value'));
    }
}