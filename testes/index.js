
 d3.csv('../mortalidade_datavis_sem2013.csv', function(dataset) {
        //console.log(dataset)

        facts = crossfilter(dataset)

        yearDim = facts.dimension(d => d.ANO)
        obitoAno = yearDim.group().reduceSum(d => d.OBITO)
        nascAno = yearDim.group().reduceCount(d => d.OBITO)

        console.log(yearDim.group())

        let lineChart = dc.lineChart(".line-chart-obitos")
        let xScale = d3.scaleTime()
                  .domain([yearDim.bottom(1)[0].ANO, yearDim.top(1)[0].ANO])

        let yScale = d3.scaleLinear()
                  .domain([700, 1200])

        lineChart
              .width(800)
              .height(400)
              .dimension(yearDim)
              .margins({top: 50, right: 50, bottom: 25, left: 40})
              .renderArea(false)
              .x(xScale)
              .y(yScale)
              .renderHorizontalGridLines(true)
              .brushOn(false)
              .group(obitoAno)

        lineChart.render()


      //   pesoDim = facts.dimension(d => d.PESO)           

      //   obitoPeso = pesoDim.group().reduceSum(d => d.OBITO)


      //   let barChart = dc.barChart(".bar-chart-idademae")
        
      //   barChart
      //       .width(800)
      //       .height(400)
      //       .margins({top: 50, right: 50, bottom: 25, left: 40})
      //       .dimension(pesoDim)
      //       .x(d3.scaleBand())
      //       .xUnits(dc.units.ordinal)
      //       .brushOn(true)
      //       .group(obitoPeso)
          
      //     barChart.render()


});


