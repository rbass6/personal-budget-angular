import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DataService } from '../data.service';
import * as d3 from 'd3';
import { Observable } from 'rxjs';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource:any = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19'
        ]
      }
    ],
    labels: []
  };

  private dataResult:Observable<any>;

  constructor(private dataService: DataService) {
    this.dataResult = this.dataService.getResponse()
  }

  ngOnInit(): void {

    // Get response if dataResult is empty
    if (this.dataResult == null){
      this.dataResult = this.dataService.getResponse()
    }

    this.dataResult
    .subscribe((res: any) => {

      for(var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget
        this.dataSource.labels[i] = res.myBudget[i].title;
      }

      const ctx:any = document.getElementById('myChart');
      new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
      })

      var data = res.myBudget
      var width = 600;
      const height = width * 0.6;
      var svg = d3.select(".d3-container")
                  .append("svg")
                  .append("g")


      svg.append("g").attr("class", "slices");
      svg.append("g").attr("class", "labels");
      svg.append("g").attr("class", "lines");

      const radius = Math.min(width, height) / 2;

      const pie = d3
          .pie()
          .sort(null)
          .value(d => (d as any).budget);

      const arc = d3
          .arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.4);

      const outerArc = d3
          .arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);

      svg.attr("transform", "translate(" + width / 1.7 + "," + height / 2 + ")");

      var color = d3.scaleOrdinal()
          .domain(data.map((d: any) => d.title))
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


      change(data);

      function change(data:any) {

          /* ------- PIE SLICES -------*/

          const pieData = pie(data);
          const slice = svg
          .select(".slices")
          .selectAll("path.slice")
          .data(pieData);

          slice
          .enter()
          .insert("path")
          .style("fill", function(d) {
              return color((d as any).data.title) as any;
          })
          .attr("class", "slice")
          .merge((slice as any))
          .transition()
          .duration(1000)
          .attrTween("d", function(d) {
              (this as any)._current = (this as any)._current || d;
              const interpolate:any = d3.interpolate((this as any)._current, d);
              (this as any)._current = interpolate(0);
              return function(t) {
              return arc(interpolate(t) as d3.DefaultArcObject) as any;
              };
          });

          slice.exit().remove();

          /* ------- TEXT LABELS -------*/

          const text = svg
          .select(".labels")
          .selectAll("text")
          .data(pie(data));

          function midAngle(d:any) {
          return d.startAngle + (d.endAngle - d.startAngle) / 2;
          }

          text
          .enter()
          .append("text")
          .attr("dy", ".35em")
          .text(function(d:any) {
              return d.data.title + ": " + d.data.budget;
          })
          .merge(text as any)
          .transition()
          .duration(1000)
          .attrTween("transform", function(d) {
              (this as any)._current = (this as any)._current || d;
              const interpolate = d3.interpolate((this as any)._current, d);
              (this as any)._current = interpolate(0);
              return function(t) {
              const d2 = interpolate(t);
              const pos = outerArc.centroid(d2 as any);
              pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate(" + pos + ")";
              };
          })
          .styleTween("text-anchor", function(d) {
              (this as any)._current = (this as any)._current || d;
              const interpolate = d3.interpolate((this as any)._current, d);
              (this as any)._current = interpolate(0);
              return function(t) {
              const d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start" : "end";
              };
          });

          text.exit().remove();

          /* ------- SLICE TO TEXT POLYLINES -------*/

          const polyline = svg
          .select(".lines")
          .selectAll("polyline")
          .data(pie(data));

          polyline
          .join("polyline")
          .transition()
          .duration(1000)
          .attrTween("points", function(d) {
              (this as any)._current = (this as any)._current || d;
              const interpolate = d3.interpolate((this as any)._current, d);
              (this as any)._current = interpolate(0);
              return function(t) {
              const d2 = interpolate(t);
              const pos = outerArc.centroid(d2 as any);
              pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2 as any), outerArc.centroid(d2 as any), pos] as any;
              };
          });

          polyline.exit().remove();
      }

      return Object.assign(svg.node() as any, {
          update() {
          change(data);
          }
      });
  })
  }
}
