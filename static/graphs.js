queue()
    .defer(d3.csv, "data/winter.csv")
    .defer(d3.csv, "data/summer.csv")
    .await(makeGraphs);
    
function makeGraphs(error, winterData, summerData){
      winterData.forEach(function(d) {
            d.Season="Winter"
            d.Year = +d.Year;
        }) 

        summerData.forEach(function(d) {
            d.Season="Summer"
            d.Year = +d.Year;
        }) 

        var totalData = winterData.concat(summerData) 
    
    
    var ndx = crossfilter(totalData);
    
        eventData.forEach(function(d) {
            d.Year = +d.Year;
        }) 
        
        //adopt a 4:2:1 ratio of medals as proposed by Michael Klien in the NY Times
        eventData.forEach(function(d){
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
    
    // show_discipline_selector(ndx);
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
        .width(500)
        .height(300)
        .colors(countryColors)
        .dimension(country_dim)
        .group(country_count)
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(4); 
}

function show_medal_ratio(ndx){
    var medal_dim = ndx.dimension(dc.pluck("Medal"));
    var medal_count = medal_dim.group();
    var medalColors = d3.scale.ordinal()
        .domain(["Bronze", "Silver", "Gold"])
        .range(["#B04709", "#698192", "#FCCF2F"])
    
    
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
        
        var USAScoreByYear = countryScoreByYear("USA");
        var USRScoreByYear = countryScoreByYear("URS");
        var GBRScoreByYear = countryScoreByYear("GBR");
    
        var compositeChart = dc.compositeChart('#top-three-by-year-chart');
        compositeChart
            .width(990)
            .height(200)
            .dimension(year_dim)
            .x(d3.scale.linear().domain([minYear, maxYear]))
            .yAxisLabel("Weighted Score")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(USAScoreByYear, 'USA'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(USRScoreByYear, 'USR'),
                dc.lineChart(compositeChart)
                    .colors('black')
                    .group(GBRScoreByYear, 'GBR')
            ])
            .brushOn(false)
            .render();
        


}


