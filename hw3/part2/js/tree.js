/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        window.tree = this;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300. 
        var margin = { top: 20, right: 90, bottom: 30, left: 90 },
            width = 300 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;
        var treemap = d3.tree()
            .size([height, width]);
        console.log(treeData)
        //Create a root for the tree using d3.stratify(); 
        var root = d3.stratify()
            .id((d, i) => i)
            .parentId(d => d.ParentGame)
            (treeData)

        //Add nodes and links to the tree. 
        var nodes = treemap(root);
        var g = d3.select("#tree")
                .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // adds the links between the nodes
        var link = g.selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        // adds each node as a group
        var node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", function (d) {
                return "node" +
                    (d.children ? " node--internal" : " node--leaf") +
                    (d.data.Wins == "1" ? " winner" : " loser");

            })
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // adds the circle to the node
        node.append("circle")
            .attr("r", 10);

        // adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", function (d) { return d.children ? -13 : 13; })
            .style("text-anchor", function (d) {
                return d.children ? "end" : "start";
            })
            .text(function (d) { return d.data.Team; });

    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        this.clearTree();
        d3.select("#tree")
          .selectAll("path, circle")
          .filter(d => d.data.Team == row)
          .classed("selected", true)
        d3.select("#tree")
          .selectAll("text")
          .filter(d => d.data.Team == row)
          .classed("selectedLabel", true)
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
        d3.select("#tree").selectAll(".selected, .selectedLabel").classed("selected", false).classed("selectedLabel", false)

    }
}
