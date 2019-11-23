d3.csv('../mortalidade_datavis_sem2013.csv', function (dataset) {
  //console.log(dataset)

  function camelCase(str) { 
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) 
    { 
        return index == 0 ? word.toLowerCase() : word.toUpperCase(); 
    }).replace(/\s+/g, ''); 
} 
  

  facts = crossfilter(dataset)
  
  // #################################################
  // Gráfico que mostra a quantidade de óbitos por ano
  // #################################################
  yearDim = facts.dimension(d => d.ANO)
  obitoAno = yearDim.group().reduceSum(d => d.OBITO)
  nascAno = yearDim.group().reduceCount(d => d.OBITO)
  taxaAno = yearDim.group().reduceSum(d => d.OBITO)

  for (i = 0; i < taxaAno.size(); i++) {
    taxaAno.all()[i].value = (taxaAno.all()[i].value / nascAno.all()[i].value) * 1000
  }

  let lineChart = dc.lineChart(".line-chart-obitos")
  let xScale = d3.scaleLinear()
    .domain([yearDim.bottom(1)[0].ANO, yearDim.top(1)[0].ANO])

  // console.log(xScale)
  let yScaleSmall = d3.scaleLinear()
    .domain([0, 10])
  let yScale = d3.scaleLinear()
    .domain([0, 1200])

  lineChart
    .width(960)
    .height(400)
    .dimension(yearDim)
    .margins({ top: 50, right: 50, bottom: 40, left: 50 })
    .renderArea(false)
    .yAxisLabel("Nº de óbitos")
    .xAxisLabel("Ano")
    .x(xScale)
    .renderHorizontalGridLines(true)
    .brushOn(false)
    .group(obitoAno)

  lineChart.render()

  // #############################################
  // Gráfico que relaciona Idade da Mãe com Óbitos
  // #############################################
  idadeDim = facts.dimension(d => d.IDADEMAE)
  nascAno2 = idadeDim.group().reduceCount(d => d.OBITO)
  obitoIdade = idadeDim.group().reduceSum(d => d.OBITO)
  taxaIdade = idadeDim.group().reduceSum(d => d.OBITO)

  for (i = 0; i < taxaIdade.size(); i++) {
    taxaIdade.all()[i].value = (taxaIdade.all()[i].value / nascAno2.all()[i].value) * 1000
  }
  let barChart = dc.barChart(".bar-chart-idademae")

  barChart
    .width(960)
    .height(400)
    .margins({ top: 50, right: 50, bottom: 40, left: 50 })
    .dimension(idadeDim)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .brushOn(true)
    .group(obitoIdade)
    .yAxisLabel("Nº de óbitos")
    .xAxisLabel("Idade da Mãe")

  barChart.render()

  let idadeScale = d3.scaleLinear()
    .domain([0, 200])
  let zeroToHundredScale = d3.scaleLinear()
    .domain([0, 100])

  d3.selectAll('#myCheckbox')
    .on('change', function () {
      if (document.getElementById("myCheckbox").checked === true) {
        lineChart
          .y(yScaleSmall)
          .group(taxaAno)
          .render()
          .yAxisLabel("Nº de óbitos")
        barChart
          .y(zeroToHundredScale)
          .group(taxaIdade)
          .render()
          .yAxisLabel("Nº de óbitos")
      }
      else {
        lineChart
          .y(yScale)
          .group(obitoAno)
          .render()
          .yAxisLabel("Taxa de mortalidade")

        barChart
          .y(idadeScale)
          .group(obitoIdade)
          .render()
          .yAxisLabel("Taxa de mortalidade")
      }
    })


  // ###################################################
  // Gráfico que relaciona a Raça à Quantidade de Óbitos
  // ###################################################
  racaDim = facts.dimension(d => d.RACACOR)

  obitoRaca = racaDim.group().reduceSum(d => d.OBITO)

  let piechart = dc.pieChart(".pie-chart-raça")

  piechart
    .width(320)
    .height(200)
    .slicesCap(4)
    .innerRadius(40)
    .dimension(racaDim)
    .group(obitoRaca)
  piechart.render();

  // ###########################################################################
  // Gráfico que relaciona o tempo de escolaridade da mae à Quantidade de Óbitos
  // ###########################################################################
  escDim = facts.dimension(d => d.ESCMAE)

  obitoEsc = escDim.group().reduceSum(d => d.OBITO)

  let piechart2 = dc.pieChart(".pie-chart-escmae")

  piechart2
    .width(320)
    .height(200)
    .slicesCap(4)
    .innerRadius(40)
    .dimension(escDim)
    .group(obitoEsc)
  piechart2.render();

  // ################################################################
  // Gráfico que relaciona o tempo de gestacao à Quantidade de Óbitos
  // ################################################################
  gestDim = facts.dimension(d => d.GESTACAO)

  obitoGest = gestDim.group().reduceSum(d => d.OBITO)

  let piechart3 = dc.pieChart(".pie-chart-gestacao")

  piechart3
    .width(320)
    .height(200)
    .slicesCap(4)
    .innerRadius(40)
    .dimension(gestDim)
    .group(obitoGest)
  piechart3.render();

  // #############
  // Mapa do Ceará
  // #############

  munDim = facts.dimension(d => d.Município)

  obitoMun = munDim.group().reduceSum(d => d.OBITO)

  var width = 960,
      height = 600;

  var svg = d3.select(".map").append("svg")
      .attr("width", width)
      .attr("height", height);

  let obitoMap = d3.map()
  for (i = 0; i < obitoMun.size(); i++) {
    obitoMap.set(obitoMun.all()[i].key.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), obitoMun.all()[i].value)
  }

  let taxaMap = d3.map()
  dataset.forEach(function(d) {
        d.Município = d.Município.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        taxaMap.set(d.Município, d.TAXA_MORT)
      });

  colorScale = d3.scaleQuantize()
      .domain([1,10])
      .range(['white', 'beige', 'Khaki', 'yellow', 'orange', 'tomato', 'OrangeRed', 'red'])

  console.log(obitoMap)

  
  d3.json("ceara.json", function(error, ceara) {
          if (error) return console.error(error);
          // console.log(ceara);
          
          var subunits = topojson.feature(ceara, ceara.objects.Municipios_do_Ceara);
          var projection = d3.geoMercator()
                                  .center([-5.335113, -39.449235])
                                  .scale(4500)
                                  .translate([width*3.3, height*5.4]);

          var path = d3.geoPath()
                          .projection(projection);

          svg.append("path")
          .datum(subunits)
          .attr("d", path);          

          svg.selectAll(".subunit")
                          .data(topojson.feature(ceara, ceara.objects.Municipios_do_Ceara).features)
                          .enter().append("path")
                          .attr("id", function(d) { 
                                  // console.log(d)
                                  return d.properties.Name.toUpperCase();
                          })
                          .attr("fill", d => colorScale(obitoMap.get(d.properties.Name.toUpperCase())))
                          .attr("d", path)                          
                          .on("mouseover", function(d){
                              d3.select(this).style("cursor", "pointer")
                                  .attr("stroke-width", 3)
                                  .attr("stroke", "#FFF5B1")
                                  .append("title").text(d => d.properties.Name + ": " + obitoMap.get(d.properties.Name.toUpperCase()))
                        
                              
                              })
                              .on("mouseout", function(d){
                                    d3.select(this)
                                      .style("cursor", "default")
                                      .attr("stroke-width", 0)
                                      .attr("stroke", "none");
                                  })
          
          d3.selectAll('#myCheckbox')
                  .on('change', function () {
                    if (document.getElementById("myCheckbox").checked === true) {
                      svg.selectAll(".subunit")
                          .data(topojson.feature(ceara, ceara.objects.Municipios_do_Ceara).features)
                          .enter().append("path")
                          .attr("id", function(d) { 
                                  // console.log(d)
                                  return d.properties.Name.toUpperCase();
                          })
                          .attr("fill", d => colorScale(taxaMap.get(d.properties.Name.toUpperCase())))
                          .attr("d", path)
                          .on("mouseover", function(d){
                            d3.select(this).style("cursor", "pointer")
                                .attr("stroke-width", 3)
                                .attr("stroke", "#FFF5B1")
                                .append("title").text(d => d.properties.Name + ": " + obitoMap.get(d.properties.Name.toUpperCase()))
                      
                            
                            })
                            .on("mouseout", function(d){
                                  d3.select(this)
                                    .style("cursor", "default")
                                    .attr("stroke-width", 0)
                                    .attr("stroke", "none");
                                })
                            }
                    else {
                      svg.selectAll(".subunit")
                          .data(topojson.feature(ceara, ceara.objects.Municipios_do_Ceara).features)
                          .enter().append("path")
                          .attr("id", function(d) { 
                                  // console.log(d)
                                  return d.properties.Name.toUpperCase();
                          })
                          .attr("fill", d => colorScale(obitoMap.get(d.properties.Name.toUpperCase())))
                          .attr("d", path)
                          .on("mouseover", function(d){
                            d3.select(this).style("cursor", "pointer")
                                .attr("stroke-width", 3)
                                .attr("stroke", "#FFF5B1")
                                .append("title").text(d => d.properties.Name + ": " + obitoMap.get(d.properties.Name.toUpperCase()))
                      
                            
                            })
                            .on("mouseout", function(d){
                                  d3.select(this)
                                    .style("cursor", "default")
                                    .attr("stroke-width", 0)
                                    .attr("stroke", "none");
                                })
                    }
                  })

  });

  

  // let taxaMap = d3.map()
  //             dataset.forEach(function(d) {
  //               taxaMap.set(d.Município.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), d.TAXA_MORT)
  //             });
  
  // d3.selectAll(".subunit")

    
  // dataset.forEach(function (d) {
  //   d3.select("#${d.Município}")
  //       .attr("fill", d => colorScale(taxaMap.get(d.d.Município.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))))
  // })            

    // d => colorScale(taxaMap.get(d.Município)
});