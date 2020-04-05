$(document).ready(function() {
	let apiUrl = 'https://api.covid19india.org/';
	getStateWiseStats(apiUrl);
});

function getStateWiseStats(apiUrl) {
	$('#tbl_covid19StateWiseStats').DataTable({
		paging: false,
		ordering: false,
		info: false,
		scrollY: '246px',
		scrollCollapse: true
	});
	let apiEndPoint = 'data.json';
	let url = apiUrl + apiEndPoint;
	let mapData = [],
		dailyDelta = [],
		dailycases = { date: [], confirmed: [], recovered: [], deaths: [] };
	$.getJSON(url, function(data, textStatus, jqXHR) {
		if (textStatus == 'success') {
			let htmlBody = '',
				htmlFooter = '';
			// StateWise Stats
			$.each(data.statewise, function(index, value) {
				if (value.state.toLowerCase() !== 'total') {
					if (
						parseInt(value.confirmed) +
							parseInt(value.active) +
							parseInt(value.recovered) +
							parseInt(value.deaths) !==
						0
					) {
						htmlBody += `<tr>`;
						htmlBody += `<td>${value.state}</td>`;
						htmlBody += `<td>${value.confirmed === '0'
							? '-'
							: value.confirmed +
								(parseInt(value.deltaconfirmed) !== 0
									? ' <sup class="text-danger"><b>&#8593; ' + value.deltaconfirmed + '</b></sup>'
									: '')}</td>`;
						htmlBody += `<td>${value.active === '0' ? '-' : value.active}</td>`;
						htmlBody += `<td>${value.recovered === '0' ? '-' : value.recovered}</td>`;
						htmlBody += `<td>${value.deaths === '0' ? '-' : value.deaths}</td>`;
						htmlBody += `</tr>`;
					}
					mapData.push([
						'in-' + (value.statecode.toLowerCase() === 'gj' ? '2984' : value.statecode.toLowerCase()),
						parseInt(value.confirmed)
					]);
				} else {
					htmlFooter += `<tr>`;
					htmlFooter += `<th>${value.state}</th>`;
					htmlFooter += `<th>${value.confirmed +
						(parseInt(value.deltaconfirmed) !== 0
							? ' <sup class="text-danger"><b>&#8593; ' + value.deltaconfirmed + '</b></sup>'
							: '')}</th>`;
					htmlFooter += `<th>${value.active}</th>`;
					htmlFooter += `<th>${value.recovered}</th>`;
					htmlFooter += `<th>${value.deaths}</th>`;
					htmlFooter += `</tr>`;
					// Total Values
					$('#totalConfirmed').html(value.confirmed);
					$('#totalActive').html(value.active);
					$('#totalRecovered').html(value.recovered);
					$('#totalDeaths').html(value.deaths);
					// Delta Values
					dailyDelta = [ value.deltaconfirmed, value.deltarecovered, value.deltadeaths ];
					$('#deltaConfirmed').html(`( +${dailyDelta[0]} )`);
					$('#deltaRecovered').html(`( +${dailyDelta[1]} )`);
					$('#deltaDeaths').html(`( +${dailyDelta[2]} )`);
				}
			});
			$.each(data.cases_time_series, function(index, value) {
				dailycases['date'].push(value.date);
				dailycases['confirmed'].push(value.totalconfirmed);
				dailycases['recovered'].push(value.totalrecovered);
				dailycases['deaths'].push(value.totaldeceased);
			});
			$('#tblBody_covid19StateWiseStats').html(htmlBody);
			$('#tblFooter_covid19StateWiseStats').html(htmlFooter);
			// India Map Data
			Covid19IndiaMap(mapData);
			// Today's Spread
			Covid19DailyDelta(dailyDelta);
			// Daily Spread
			Covid19DailyCases(dailycases);
		}
	});
}

function Covid19IndiaMap(dataValues) {
	// var data = [
	// 	[ 'in-5390', 0 ],
	// 	[ 'in-py', 1 ],
	// 	[ 'in-ld', 2 ],
	// 	[ 'in-an', 3 ],
	// 	[ 'in-wb', 4 ],
	// 	[ 'in-or', 5 ],
	// 	[ 'in-br', 6 ],
	// 	[ 'in-sk', 7 ],
	// 	[ 'in-ct', 8 ],
	// 	[ 'in-tn', 9 ],
	// 	[ 'in-mp', 10 ],
	// 	[ 'in-2984', 11 ],
	// 	[ 'in-ga', 12 ],
	// 	[ 'in-nl', 13 ],
	// 	[ 'in-mn', 14 ],
	// 	[ 'in-ar', 15 ],
	// 	[ 'in-mz', 16 ],
	// 	[ 'in-tr', 17 ],
	// 	[ 'in-3464', 18 ],
	// 	[ 'in-dl', 445 ],
	// 	[ 'in-hr', 20 ],
	// 	[ 'in-ch', 21 ],
	// 	[ 'in-hp', 22 ],
	// 	[ 'in-jk', 23 ],
	// 	[ 'in-kl', 24 ],
	// 	[ 'in-ka', 25 ],
	// 	[ 'in-dn', 26 ],
	// 	[ 'in-mh', 27 ],
	// 	[ 'in-as', 28 ],
	// 	[ 'in-ap', 29 ],
	// 	[ 'in-ml', 30 ],
	// 	[ 'in-pb', 31 ],
	// 	[ 'in-rj', 32 ],
	// 	[ 'in-up', 33 ],
	// 	[ 'in-ut', 34 ],
	// 	[ 'in-jh', 35 ]
	// ];
	// console.log(data);
	var data = dataValues;
	// Create the chart
	Highcharts.mapChart('indiaMap', {
		chart: {
			map: 'countries/in/custom/in-all-andaman-and-nicobar'
		},

		title: {
			text: 'India Map'
		},

		subtitle: {
			text: 'HOVER OVER A STATE FOR MORE DETAILS'
		},

		mapNavigation: {
			enabled: true,
			buttonOptions: {
				verticalAlign: 'bottom'
			}
		},

		colorAxis: {
			min: 0,
			stops: [
				[ 0, '#EFEFFE' ],
				[ 0.5, Highcharts.getOptions().colors[8] ],
				[ 1, Highcharts.color(Highcharts.getOptions().colors[8]).brighten(-0.8).get() ]
			]
		},
		legend: {
			layout: 'vertical',
			align: 'left',
			verticalAlign: 'bottom'
		},

		series: [
			{
				data: data,
				name: 'Covid-19 Confirmed Cases',
				states: {
					hover: {
						color: '#F67280'
					}
				},
				dataLabels: {
					enabled: false,
					format: '{point.name}'
				}
			}
		]
	});
}

function Covid19DailyDelta(dataValues) {
	(Chart.defaults.global.defaultFontFamily = 'Nunito'),
		'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
	Chart.defaults.global.defaultFontColor = '#858796';

	// Pie Chart Example
	var ctx = document.getElementById('covid19DailyDelta');
	var myPieChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: [ 'Confirmed', 'Recovered', 'Deaths' ],
			datasets: [
				{
					data: dataValues,
					backgroundColor: [ 'rgb(231, 76, 60,0.9)', 'rgb(46, 204, 113,0.9)', 'rgb(127, 140, 141, 0.9)' ],
					hoverBackgroundColor: [ 'rgb(231, 76, 60,1)', 'rgb(46, 204, 113,1)', 'rgb(127, 140, 141, 1)' ],
					hoverBorderColor: 'rgba(234, 236, 244, 1)'
				}
			]
		},
		options: {
			maintainAspectRatio: false,
			tooltips: {
				backgroundColor: 'rgb(255,255,255)',
				bodyFontColor: '#858796',
				borderColor: '#dddfeb',
				borderWidth: 1,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				caretPadding: 10
			},
			legend: {
				display: true,
				position: 'bottom',
				align: 'start',
				labels: {
					boxWidth: 15
				}
			},
			title: {
				display: true,
				text: "TODAY'S SPREAD"
			},
			cutoutPercentage: 50
		}
	});
}

function Covid19DailyCases(dataValues) {
	// Set new default font family and font color to mimic Bootstrap's default styling
	(Chart.defaults.global.defaultFontFamily = 'Nunito'),
		'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
	Chart.defaults.global.defaultFontColor = '#858796';
	var ctx = document.getElementById('covid19-Chart');
	var myLineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: dataValues.date,
			datasets: [
				{
					label: 'Confirmed',
					lineTension: 0.3,
					backgroundColor: 'rgba(78, 115, 223, 0.05)',
					borderColor: 'rgb(231, 76, 60, 0.5)',
					pointRadius: 3,
					pointBackgroundColor: 'rgb(231, 76, 60,0.7)',
					pointBorderColor: 'rgb(231, 76, 60,1)',
					pointHoverRadius: 3,
					pointHoverBackgroundColor: 'rgb(231, 76, 60,1)',
					pointHoverBorderColor: 'rgb(231, 76, 60,1)',
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: dataValues.confirmed
				},
				{
					label: 'Recovered',
					lineTension: 0.3,
					backgroundColor: 'rgba(78, 115, 223, 0.05)',
					borderColor: 'rgb(46, 204, 113,0.5)',
					pointRadius: 3,
					pointBackgroundColor: 'rgb(46, 204, 113,0.7)',
					pointBorderColor: 'rgb(46, 204, 113, 1)',
					pointHoverRadius: 3,
					pointHoverBackgroundColor: 'rgb(46, 204, 113, 1)',
					pointHoverBorderColor: 'rgb(46, 204, 113, 1)',
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: dataValues.recovered
				},
				{
					label: 'Deaths',
					lineTension: 0.3,
					backgroundColor: 'rgba(78, 115, 223, 0.05)',
					borderColor: 'rgb(127, 140, 141, 0.5)',
					pointRadius: 3,
					pointBackgroundColor: 'rgb(127, 140, 141, 0.7)',
					pointBorderColor: 'rgb(127, 140, 141, 1)',
					pointHoverRadius: 3,
					pointHoverBackgroundColor: 'rgb(127, 140, 141, 1)',
					pointHoverBorderColor: 'rgb(127, 140, 141, 1)',
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: dataValues.deaths
				}
			]
		},
		options: {
			maintainAspectRatio: false,
			title: {
				display: true,
				text: 'SPREAD TRENDS'
			},
			layout: {
				padding: {
					left: 10,
					right: 25,
					top: 25,
					bottom: 0
				}
			},
			scales: {
				xAxes: [
					{
						time: {
							unit: 'date'
						},
						gridLines: {
							display: false,
							drawBorder: false
						},
						ticks: {
							maxTicksLimit: 10,
							padding: 10,
							minRotation: 360,
							callback: function(value, index, values) {
								let splittedValue = value.split(' ');
								return splittedValue[1].substring(0, 3) + ' ' + splittedValue[0];
							}
						}
					}
				],
				yAxes: [
					{
						position: 'right',
						ticks: {
							maxTicksLimit: 5,
							padding: 10,
							// Include a dollar sign in the ticks
							callback: function(value, index, values) {
								return value;
							}
						},
						gridLines: {
							color: 'rgb(234, 236, 244)',
							zeroLineColor: 'rgb(234, 236, 244)',
							drawBorder: false,
							borderDash: [ 2 ],
							zeroLineBorderDash: [ 2 ]
						}
					}
				]
			},
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					boxWidth: 15
				}
			},
			tooltips: {
				backgroundColor: 'rgb(255,255,255)',
				bodyFontColor: '#858796',
				titleMarginBottom: 10,
				titleFontColor: '#6e707e',
				titleFontSize: 14,
				borderColor: '#dddfeb',
				borderWidth: 1,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				intersect: false,
				mode: 'index',
				caretPadding: 10,
				callbacks: {
					label: function(tooltipItem, chart) {
						var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
						return datasetLabel + ': ' + tooltipItem.yLabel;
					}
				}
			}
		}
	});
}
