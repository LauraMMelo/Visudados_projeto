d3.csv('../mortalidade_datavis_sem2013.csv', function (dataset) {
  //console.log(dataset)

  facts = crossfilter(dataset)

  // Gráfico que mostra a quantidade de óbitos por ano
  yearDim = facts.dimension(d => d.ANO)
  obitoAno = yearDim.group().reduceSum(d => d.OBITO)
  nascAno = yearDim.group().reduceCount(d => d.OBITO)
  taxaAno = yearDim.group().reduceSum(d => d.OBITO)

  for (i = 0; i < taxaAno.size(); i++) {
    taxaAno.all()[i].value = (taxaAno.all()[i].value / nascAno.all()[i].value) * 1000
  }


  console.log(taxaAno.all())

  let lineChart = dc.lineChart(".line-chart-obitos")
  let xScale = d3.scaleTime()
    .domain([yearDim.bottom(1)[0].ANO, yearDim.top(1)[0].ANO])

  let yScaleSmall = d3.scaleLinear()
    .domain([0, 10])
  let yScale = d3.scaleLinear()
    .domain([0, 1200])

  lineChart
    .width(800)
    .height(400)
    .dimension(yearDim)
    .margins({ top: 50, right: 50, bottom: 25, left: 40 })
    .renderArea(false)
    .x(xScale)
    // .y(yScale)
    .renderHorizontalGridLines(true)
    .brushOn(false)
    .group(obitoAno)

  lineChart.render()

  // Gráfico que relaciona Idade da Mãe com Óbitos
  idadeDim = facts.dimension(d => d.IDADEMAE)
  nascAno2 = idadeDim.group().reduceCount(d => d.OBITO)
  obitoIdade = idadeDim.group().reduceSum(d => d.OBITO)
  taxaIdade = idadeDim.group().reduceSum(d => d.OBITO)

  for (i = 0; i < taxaIdade.size(); i++) {
    taxaIdade.all()[i].value = (taxaIdade.all()[i].value / nascAno2.all()[i].value) * 1000
  }
  let barChart = dc.barChart(".bar-chart-idademae")

  barChart
    .width(800)
    .height(400)
    .margins({ top: 50, right: 50, bottom: 25, left: 40 })
    .dimension(idadeDim)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .brushOn(true)
    .group(obitoIdade)

  barChart.render()

  let idadeScale = d3.scaleLinear()
    .domain([0, 200])
  let zeroToHundredScale = d3.scaleLinear()
    .domain([0, 100])

  d3.selectAll('#myCheckbox')
    .on('change', function () {
      if (document.getElementById("myCheckbox").checked === true) {
        console.log("found")
        lineChart
          .y(yScaleSmall)
          .group(taxaAno)
          .render()
        barChart
          .y(zeroToHundredScale)
          .group(taxaIdade)
          .render()
      }
      else {
        lineChart
          .y(yScale)
          .group(obitoAno)
          .render()

        barChart
          .y(idadeScale)
          .group(obitoIdade)
          .render()
      }
    })


  // Gráfico que relaciona a Raça à Quantidade de Óbitos
  racaDim = facts.dimension(d => d.RACACOR)

  obitoRaca = racaDim.group().reduceSum(d => d.OBITO)

  let piechart = dc.pieChart(".pie-chart-raça")

  piechart
    .width(768)
    .height(480)
    .slicesCap(4)
    .innerRadius(100)
    .dimension(racaDim)
    .group(obitoRaca)
  // .legend(dc.legend())
  // // workaround for #703: not enough data is accessible through .label() to display percentages
  // .on('pretransition', function(chart) {
  //     chart.selectAll('text.pie-slice').text(function(d) {
  //         return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
  //     })
  // });
  piechart.render();


});