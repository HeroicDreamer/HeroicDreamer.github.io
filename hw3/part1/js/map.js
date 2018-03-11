/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
        this.path = d3.geoPath().projection(this.projection)
    }

    /**
     * Function that clears the map
     */
    clearMap() {
       
        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.
      d3.select("#map")
        .selectAll("path")
        .attr("class", "countries")
        .classed("host", false)
      d3.select("#map")
        .selectAll(".team")
        .classed("team", false)
      d3.select("#points")
        .selectAll("circle")
        .remove();
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();
        
        

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.
        d3.select("#" + worldcupData.host_country_code).classed("host", true)
       
        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.
        
          worldcupData.teams_iso.forEach(function(el){
            d3.select("#" + el)
              .classed('team', true)
          })
          
        
        // Add a marker for gold/silver medalists
        var win = [worldcupData.WIN_LON, worldcupData.WIN_LAT];
        var run = [worldcupData.RUP_LON, worldcupData.RUP_LAT];
        d3.select("#points")
          .selectAll(".gold")
          .data([this.projection(win)])
          .enter()
          .append("circle")
          .classed("gold", "true")
          .attr("cx", d => d[0])
          .attr("cy", d => d[1])
          .attr("r", 8)

        d3.select("#points")
          .selectAll(".silver")
          .data([this.projection(run)])
          .enter()
          .append("circle")
          .classed("silver", "true")
          .attr("cx", d => d[0])
          .attr("cy", d => d[1])
          .attr("r", 8)
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {
        
        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)
    
       
       //https://github.com/topojson/topojson-client/blob/master/README.md#feature
       var geodata = topojson.feature(world, world.objects.countries)

        d3.select("#map")
          .selectAll("path")
          .data(geodata.features)
          .enter()
          .append("path")
          .classed("countries", true)
          .attr("id", d => d.id)
          .attr("d", this.path)
          
          
        
    }


}
