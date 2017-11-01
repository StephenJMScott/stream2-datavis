queue()
    .defer(d3.csv, "data/summer.csv")
    
    .await(makeGraphs);
    
function makeGraphs(error, eventData){
    var ndx = crossfilter(eventData);
    
    show_gender_balance(ndx);
    show_top_countries(ndx);
    show_medal_ratio(ndx);
    
    dc.renderAll();
}
    
function show_gender_balance(ndx){
    var gender_dim = ndx.dimension(dc.pluck("Gender"));
    var gender_mix =gender_dim.group();
    
    dc.pieChart("#gender_chart")
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(gender_dim)
        .group(gender_mix);
        
}

function show_top_countries(ndx){
    var country_dim = ndx.dimension(dc.pluck("Country"));
    var country_count = country_dim.group();
    
    dc.rowChart("#top_performers")
        .width(500)
        .height(330)
        .dimension(country_dim)
        .group(country_count)
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(4); 
}

function show_medal_ratio(ndx){
    var medal_dim = ndx.dimension(dc.pluck("Medal"));
    var medal_count = medal_dim.group();
    
    dc.pieChart("#medal_chart")
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(medal_dim)
        .group(medal_count);
    
    
    
}
        
        
