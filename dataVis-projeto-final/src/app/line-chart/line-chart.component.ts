import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3'
import * as Crossfilter from 'crossfilter';
import crossfilter = require('crossfilter');

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // const dataset = "../../../mortalidade_datavis_sem2013.csv"
  // // d3.csv('../../../mortalidade_datavis_sem2013.csv', function(dataset) {
  //   //console.log(dataset)

  //   const facts = crossfilter(dataset)

  //   const yearDim = facts.dimension(d => d.ANO)
  //   const obitoAno = yearDim.group().reduceSum(d => d.OBITO)
  //   const nascAno = yearDim.group().reduceCount(d => d.OBITO)

  //   console.log(yearDim.group())

  //   let lineChart = dc.lineChart(".line-chart-obitos")
  //   let xScale = d3.scaleTime()
  //             .domain([yearDim.bottom(1)[0].ANO, yearDim.top(1)[0].ANO])

  //   let yScale = d3.scaleLinear()
  //             .domain([700, 1200])

  //   lineChart
  //         .width(800)
  //         .height(400)
  //         .dimension(yearDim)
  //         .margins({top: 50, right: 50, bottom: 25, left: 40})
  //         .renderArea(false)
  //         .x(xScale)
  //         .y(yScale)
  //         .renderHorizontalGridLines(true)
  //         .brushOn(false)
  //         .group(obitoAno)

  //   lineChart.render()


  // // });




}
