queue()
    .defer(d3.json, "/summer")
    .defer(d3.json, "/winter")
    .await(makeGraphs);




function makeGraphs(error, summerData, winterData){
      

        summerData.forEach(function(d) {
            d.Season="Summer"
            d.Year = +d.Year;
        }) 
        
        winterData.forEach(function(d) {
            d.Season="Winter"
            d.Year = +d.Year;
        }) 

        var totalData = summerData.concat(winterData) 
    
    
    var ndx = crossfilter(totalData);
    
    var seasonDim = ndx.dimension(dc.pluck("Season"))
        seasonGroup = seasonDim.group();

        dc.selectMenu('#select-season')
            .dimension(seasonDim)
            .group(seasonGroup);
    
        totalData.forEach(function(d) {
            d.Year = +d.Year;
        }) 
        
        //adopt a 4:2:1 ratio of medals as proposed by Michael Klien in the NY Times
        totalData.forEach(function(d){
            if (d['Medal'] == 'Bronze') {
                d.Score = 1;
            };
            if (d['Medal'] == 'Silver') {
                d.Score = 2;
            }; 
            if (d['Medal'] == 'Gold') {
                d.Score = 4;
            }; 
        });
        
    
    
    show_gender_balance(ndx);
    show_top_countries(ndx);
    show_medal_ratio(ndx);
    show_medals_over_time(ndx);
    
    
    dc.renderAll();
}



function show_gender_balance(ndx){
    var gender_dim = ndx.dimension(dc.pluck("Gender"));
    var gender_mix =gender_dim.group();
    var genderColors = d3.scale.ordinal()
        .domain(["Women", "Men"])
        .range(["pink", "blue"])
    
    dc.pieChart("#gender_chart")
        .height(330)
        .radius(90)
        .colors(genderColors)
        .transitionDuration(1500)
        .dimension(gender_dim)
        .group(gender_mix);
        
}

function show_top_countries(ndx){
    var country_dim = ndx.dimension(dc.pluck("Country"));
    var country_count = country_dim.group();
    var countryColors = d3.scale.ordinal()
        .range(["red", "blue", "orange", "green", "pink", "purple"])
    
    dc.rowChart("#top_performers")
        .width(400)
        .height(300)
        .colors(countryColors)
        .dimension(country_dim)
        .group(country_count)
        .cap(5)
        .elasticX(true)
        .othersGrouper(false)
        .xAxis().ticks(4); 
}

function show_medal_ratio(ndx){
    var medal_dim = ndx.dimension(dc.pluck("Medal"));
    var medal_count = medal_dim.group();
    var medalColors = d3.scale.ordinal()
        .domain(["Bronze", "Silver", "Gold"])
        .range(["#B04709", "#698192", "#FCCF2F"])
    var percentageFormat = d3.format("%");
    
    
    
    
    dc.pieChart("#medal_chart")
        .height(330)
        .radius(90)
        .colors(medalColors)
        .transitionDuration(1500)
        .dimension(medal_dim)
        .group(medal_count);
    
    
    
}

function show_medals_over_time(ndx){
  
        
        var dim = ndx.dimension(dc.pluck('Country'));
        var score = dim.group().reduceSum(dc.pluck('Score'));    
        var topThree = score.top(5);
        

    
        var chart = dc.rowChart("#top-score-chart");
        chart
            .width(600)
            .height(330)
            .dimension(dim)
            .group(score)
            .cap(3)
            .othersGrouper(false)
            .xAxis().ticks(4);
            
            
        var year_dim = ndx.dimension(dc.pluck('Year'));
        
        var minYear = year_dim.bottom(1)[0].Year;
        var maxYear = year_dim.top(1)[0].Year;
        
        
        function countryScoreByYear(country){
            return year_dim.group().reduceSum(function (d) {
                if (d.Country === country) {
                    return +d.Score;
                } else {
                    return 0;
                }
            });
        }
        
        function makeCountryChart(country, colour) {
            var scoreByYear = countryScoreByYear(country);
            return dc.lineChart(compositeChart)
                    .colors(colour)
                    .group(scoreByYear, country);
        }
        
        olympic_colours = ["red", "black", "green", "blue", "yellow"]
        
        var compositeChart = dc.compositeChart('#top-three-by-year-chart');

        lines = []
        topThree.forEach(function(d, i){
            console.log(i);
            chart = makeCountryChart(d.key , olympic_colours[i]);
            lines.push(chart)
        })


        // lines = [makeCountryChart("USA", "red"),
        //          makeCountryChart("URS", "blue"),
        //          makeCountryChart("GBR", "green"),
        //          makeCountryChart("FIN", "yellow")]
       
       
        compositeChart
            .width(990)
            .height(200)
            .dimension(year_dim)
            .x(d3.scale.linear().domain([minYear, maxYear]))
            .yAxisLabel("Weighted Score")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .data(function(group){return group.top(3);})
            .compose(lines)
            .brushOn(false)
            .render();
            
            
        compositeChart.xAxis().tickFormat(d3.format('d'));
        
            
        
            
         
        


}


