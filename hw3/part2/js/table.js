/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {
        window.table = this;

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice()// 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData.slice();

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];
        

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';
        /** Setup the scales*/
        this.goalScale = d3.scaleLinear().domain([0, 18]).range([20, this.cell.width * 3 - 20]); 

        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear().domain([0, 7]).range([0, this.cell.width]); 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear().range(['#ece2f0', '#016450']).domain([0, 7])

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = d3.scaleOrdinal().range(['#cb181d', '#034e7b', 'gray']).domain([0, 1, 2]);

        this.sortMaps = [
            d => d.key,
            d => d.value["Delta Goals"],
            d => d.value.Result.ranking,
            d => d.value.Wins,
            d => d.value.Losses,
            d => d.value.TotalGames
        ]

        this.lastSort = null;
        this.lastSortOrder = "descending";
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains

        // Create the x axes for the goalScale.
        var xAxes = d3.axisTop(this.goalScale);
          

           

        //add GoalAxis to header of col 1.
        d3.select("#goalHeader")
        .append("svg")
        .attr('width', this.cell.width * 3)
        .attr('height', this.cell.height * 3)
        .append("g")
        .call(xAxes)
        .attr('transform', 'translate(0, 20)')
      
        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 

        d3.select("#matchTable thead tr:nth-child(1)")
          .selectAll("th, td")
          .on('click', (d, i) => this.sortTable(i))
    }

    sortTable(i){
        this.collapseList();
        var self = this;
        if(this.lastSort == i){
            this.lastSortOrder = this.lastSortOrder == "ascending" ? "descending" : "ascending";
        }else{
            this.lastSortOrder = "descending";
        }
        console.log(this.lastSortOrder, this.lastSort, i)
        this.lastSort = i;
        var order = d3[this.lastSortOrder];
        var map = this.sortMaps[i];
        var func = function(a, b){
            return order(map(a), map(b));
        }
        this.tableElements = this.tableElements.sort(func);
        this.updateTable();
    }

    
    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows

        d3.select("#matchTable tbody")
          .selectAll("tr")
          .remove()
        
        var trs = d3.select("#matchTable tbody")
                  .selectAll("tr")
                  .data(this.tableElements);

        var tr=trs.enter()
          .insert("tr")
          .classed("aggregate", d => d.value.type == "aggregate")
          .classed("game", d => d.value.type == "game")
          .attr('id', d => d.key)
          .on('click', (d, i) => this.updateList(i))
          .attr("title", d => d.value["Goals Made"] + ":" + d.value["Goals Conceded"]);

        trs.exit().remove();

        //Append th elements for the Team Names
        tr.append("td")  
          .text(d => d.value.type == "aggregate" ? d.key : "x" + d.key)
          .style('text-align', 'right')
          .classed("title", true)
          .on('mouseover', d => this.tree.updateTree(d))
          .on('mouseout', d => this.tree.clearTree());
        
        //Append td elements for the remaining columns. 
        tr.append("td")
          .classed("goals", true)
          .append("svg")
          .attr("width", this.cell.width * 3)
          .attr("height", this.cell.height)

        tr.append("td")
          .text(d => d.value.Result.label)
        var ag = tr.filter(d => d.value.type == "aggregate")
      
        ag.append("td")
          .classed("wins", true)
          .append("svg")
          .attr("width", this.cell.width)
          .attr("height", this.cell.height)
        ag.append("td")
          .classed("losses", true)
          .append("svg")
          .attr("width", this.cell.width)
          .attr("height", this.cell.height)
        ag.append("td")
          .classed("total", true)
          .append("svg")
          .attr("width", this.cell.width)
          .attr("height", this.cell.height)
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        ag.selectAll(".wins")
          .selectAll("svg")
          .append("rect")
          .attr("x", this.gameScale(0))
          .attr("y", 0)
          .attr("width", d => this.gameScale(d.value.Wins))
          .attr("height", this.cell.height)
          .attr("fill", d => this.aggregateColorScale(d.value.Wins))

        ag.selectAll(".wins")
          .selectAll("svg")
          .append("text")
          .attr("x", d => this.gameScale(d.value.Wins))
          .attr("text-anchor", "end")
          .attr("y", 15)
          .attr("fill", "white")
          .text(d => d.value.Wins)
          
        ag.selectAll(".losses")
          .selectAll("svg")
          .append("rect")
          .attr("x", this.gameScale(0))
          .attr("y", 0)
          .attr("width", d => this.gameScale(d.value.Losses))
          .attr("height", this.cell.height)
          .attr("fill", d => this.aggregateColorScale(d.value.Losses))
        
        ag.selectAll(".losses")
          .selectAll("svg")
          .append("text")
          .attr("x", d => this.gameScale(d.value.Losses))
          .attr("y", 15)
          .attr("text-anchor", "end")
          .attr("fill", "white")
          .text(d => d.value.Losses)

        ag.selectAll(".total")
          .selectAll("svg")
          .append("rect")
          .attr("x", this.gameScale(0))
          .attr("y", 0)
          .attr("width", d => this.gameScale(d.value.TotalGames))
          .attr("height", this.cell.height)
          .attr("fill", d => this.aggregateColorScale(d.value.TotalGames))
        ag.selectAll(".total")
          .selectAll("svg")
          .append("text")
          .attr("x", d => this.gameScale(d.value.TotalGames))
          .attr("text-anchor", "end")
          .attr("y", 15)        
          .attr("fill", "white")
          .text(d => d.value.TotalGames)
        //Add scores as title property to appear on hover
        //Populate cells (do one type of cell at a time )
   
     
        //Create diagrams in the goals column
        tr.selectAll(".goals")
        .selectAll("svg")
        .enter()
        .append("svg")

      tr.selectAll(".goals")
        .selectAll("svg")
        .append("rect")
        .attr("x", d => this.goalScale(Math.min(d.value["Goals Made"], d.value["Goals Conceded"])))
        .attr("y", 5)
        .attr("width", d =>this.goalScale(Math.abs(d.value["Goals Made"] - d.value["Goals Conceded"])) - 20)
        .attr("height", 10)
        .attr("fill", d=>this.goalColorScale(d.value["Delta Goals"] > 0 ? 1 : d.value["Delta Goals"] == 0 ? 0.5 : 0))
        .attr("opacity", 0.5)
        .filter(d => d.value.type == "game")
        .attr("height", 5)
        .attr("y", 8)
        
      tr.selectAll(".goals")
        .selectAll("svg")
        .filter(d => d.value["Goals Made"] != d.value["Goals Conceded"])
        .append("circle")
        .attr("cx", d => this.goalScale(d.value["Goals Made"]))
        .attr("cy", 10)
        .attr("r", 8)
        .attr("fill", this.goalColorScale(1))
        .filter(d => d.value.type == "game")
        .attr("r", 4)
        
        
      
      tr.selectAll(".goals")
        .selectAll("svg")
        .filter(d => d.value["Goals Made"] != d.value["Goals Conceded"])
        .append("circle")
        .attr("cx", d => this.goalScale(d.value["Goals Conceded"]))
        .attr("cy", 10)
        .attr("r", 8)
        .attr("fill", this.goalColorScale(0))
        .filter(d => d.value.type == "game")
        .attr("r", 4)
      
        //Set the color of all games that tied to light gray
 
      tr.selectAll(".goals")
        .selectAll("svg")
        .filter(d => d.value["Goals Made"] == d.value["Goals Conceded"])
        .append("circle")
        .attr("cx", d => this.goalScale(d.value["Goals Conceded"]))
        .attr("cy", 10)
        .attr("r", 8)
        .attr("fill", this.goalColorScale(2))
        .filter(d => d.value.type == "game")
        .attr("r", 4)
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        var d = this.tableElements[i];
        if(d.value.type == "aggregate" && (this.tableElements.length == i + 1 || this.tableElements[i + 1].value.type == "aggregate")){
            this.tableElements.splice(i + 1, 0, ...(d.value.games));
            this.updateTable();
        }else if(d.value.type == "game"){

        }else{
            this.tableElements.splice(i + 1, d.value.games.length);
            this.updateTable();
        }
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        this.tableElements = this.tableElements.filter(x => x.value.type != "game")
        this.updateTable();
    }


}
