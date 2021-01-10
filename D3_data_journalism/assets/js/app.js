// Set up height and width of SVG chart
var svgWidth = 960;
var svgHeight = 500;

// Set up margins for SVG chart
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

// Calculate height and width of SVG chart itself
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper for chart
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
// Shift the group by left and top margins
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial params for x and y axis
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used for updating scale for x-axis upon click on axis label
function xScale(censusData, chosenXAxis) {

    // Create linear scales as all numerical data
    // Scale from 0 to max value of chosen parameter for x-axis
    var xLinearScale = d3.scaleLinear()
                        .domain([0, d3.max(censusData, d => d[chosenXAxis])])
                        .range([0, width]);
  
    // Return the determined scale
    return xLinearScale;
  
  }
  
  // Function used for updating x-axis paramter upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    
    // Set the x-axis to the new paramter with its new scale
    var bottomAxis = d3.axisBottom(newXScale);
  
    // Use transition to animate update of display of x-axis
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    // Return the new x-axis for the chosen parameter
    return xAxis;
  }
  
// Function used for updating scale for y-axis upon click on axis label
function yScale(censusData, chosenYAxis) {

    // Create linear scales as all numerical data
    // Scale from 0 to max value of chosen parameter for y-axis
    var yLinearScale = d3.scaleLinear()
                        .domain([0, d3.max(censusData, d => d[chosenYAxis])])
                        .range([height, 0]);
  
    // Return the determined scale
    return yLinearScale;
  
  }
  
  // Function used for updating y-axis paramter upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    
    // Set the y-axis to the new paramter with its new scale
    var leftAxis = d3.axisLeft(newYScale);
  
    // Use transition to animate update of display of y-axis
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    // Return the new y-axis for the chosen parameter
    return yAxis;
  }






// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    
    // Error handling
    if (err) throw err;
  
    // Parse census data and convert to numerical format for the desired paramters
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    console.log(censusData);

    // Use xScale function above csv import to scale initial x-axis for chosen paramter
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Use yScale function above csv import to scale initial y-axis for chosen paramter
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x-axis, translating it to correct place
    var xAxis = chartGroup.append("g")
                        .classed("x-axis", true)
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis);

    // Append y-axis
    var yAxis = chartGroup.append("g").classed("y-axis", true).call(leftAxis);

    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${width / 2}, ${height + 20})`);

    // Create and position the three labels for x-axis
    // Set poverty to initial paramter
    var povertyXLabel = xLabelsGroup.append("text")
                                    .attr("x", 0)
                                    .attr("y", 20)
                                    .attr("value", "poverty") // value to grab for event listener
                                    .classed("active", true)
                                    .text("In Poverty (%)");

    var ageXLabel = xLabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 40)
                                .attr("value", "age") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Age (Median)");

    var incomeXLabel = xLabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 60)
                                .attr("value", "income") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Household Income (Median)");

   // Create group for three y-axis labels
   var yLabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${height/2}, 0)`);
                               
    // Create and position the three labels for y-axis
    // Set healthcare to initial paramter
    var healthcareYLabel = yLabelsGroup.append("text")
                                    .attr("transform", "rotate(-90)")
                                    .attr("x", 0 - (height / 2))
                                    .attr("y", 0 - margin.left - 130)
                                    .attr("value", "healthcare") // value to grab for event listener
                                    .classed("active", true)
                                    .text("Lacks Healthcare (%)");

    var obesityYLabel = yLabelsGroup.append("text")
                                .attr("transform", "rotate(-90)")
                                .attr("x", 0 - (height / 2))
                                .attr("y", 0 - margin.left - 150)
                                .attr("value", "obesity") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Obese (%)");

    var smokesYLabel = yLabelsGroup.append("text")
                                    .attr("transform", "rotate(-90)")
                                    .attr("x", 0 - (height / 2))
                                    .attr("y", 0 - margin.left - 170)
                                    .attr("value", "smokes") // value to grab for event listener
                                    .classed("inactive", true)
                                    .text("Smokes (%)");

 
    // Event listener for x-axis labels
    xLabelsGroup.selectAll("text")
                .on("click", function() {

        // Get value of selection
        var xValue = d3.select(this).attr("value");

        // Check if selected value is not equal to currently selected paramter
        if (xValue !== chosenXAxis) {

        // Replace chosenXAxis with xValue
        chosenXAxis = xValue;

        // Functions here are found above csv import
        // Updates x-axis scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // Updates x-axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
    // circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

    // updates tooltips with new info
    // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // Changes classes to change bold text based on selected paramter
        // If age paramter is selected
        if (chosenXAxis === "age") {
            ageXLabel.classed("active", true).classed("inactive", false);
            povertyXLabel.classed("active", false).classed("inactive", true);
            incomeXLabel.classed("active", false).classed("inactive", true);
        }
        // If income paramter is selected
        else if (chosenXAxis === "income") {
            incomeXLabel.classed("active", true).classed("inactive", false);
            povertyXLabel.classed("active", false).classed("inactive", true);
            ageXLabel.classed("active", false).classed("inactive", true);
        }
        // Else use default paramter of poverty
        else {
            povertyXLabel.classed("active", true).classed("inactive", false);
            ageXLabel.classed("active", false).classed("inactive", true);
            incomeXLabel.classed("active", false).classed("inactive", true);
  
        }
    }
});

    // Event listener for y-axis labels
     yLabelsGroup.selectAll("text")
                .on("click", function() {

    // Get value of selection
    var yValue = d3.select(this).attr("value");

    // Check if selected value is not equal to currently selected paramter
    if (yValue !== chosenYAxis) {

        // Replace chosenYAxis with yValue
        chosenYAxis = yValue;

        // Functions here are found above csv import
        // Updates y-axis scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // Updates x-axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        // circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // Changes classes to change bold text based on selected paramter
        // If obesity paramter is selected
        if (chosenYAxis === "obesity") {
            obesityYLabel.classed("active", true).classed("inactive", false);
            healthcareYLabel.classed("active", false).classed("inactive", true);
            smokesYLabel.classed("active", false).classed("inactive", true);
        }       
        // If income paramter is selected
        else if (chosenYAxis === "smokes") {
            smokesYLabel.classed("active", true).classed("inactive", false);
            healthcareYLabel.classed("active", false).classed("inactive", true);
            obesityYLabel.classed("active", false).classed("inactive", true);
        }
        // Else use default paramter of healthcare
        else {
            healthcareYLabel.classed("active", true).classed("inactive", false);
            obesityYLabel.classed("active", false).classed("inactive", true);
            smokesYLabel.classed("active", false).classed("inactive", true);

        }
    }
});

// Error handling
}).catch(function(error) {
    console.log(error);

});
