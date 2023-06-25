$.ajax({
    url: "https://api.census.gov/data/timeseries/idb/5year",
    data: {
        get: "NAME,FIPS",
        YR: "2021",
        key: "dac13e19808c831211754f0e1e0ac27f45bddaaf"
    }
}).then((response) => {
    let request_data = []
    let country_name = []
    for (const responseData of response) {
        country_name.push(responseData[0])
        request_data.push([responseData[0], responseData[1]])
    }
    let selection = d3.select("#country-select")
    let option = selection.selectAll("option").data(request_data.slice(1, request_data.length))
        .enter()
        .append("option")
    option
        .attr("value", function (d) {
            //console.log(d)
            return d[1]
        })
        .attr("name", function (d) {
            //console.log(d)
            return d[0]
        })
        .text(function (d) {
            return d[0]
        })
    let country_select = document.getElementById("country-select")
    let country_id = country_select.value
    let county_name = $("#country-select").find('option:selected').text()
    $("#country-name-div").text(county_name)
})


function draw() {
    let country_select = document.getElementById("country-select")
    let country_id = country_select.value
    let county_name = $("#country-select").find('option:selected').text()
    $("#country-name-div").text(county_name)
    
    
    google.charts.setOnLoadCallback(drawGenderBar);
    google.charts.setOnLoadCallback(drawGenderPie);

    function drawGenderBar() {
        let url = ""
        let startx = 0
        let endx = 4

        for (let i = 0; i < 20; i++) {
            url += `,FPOP${startx}_${endx}`
            startx += 5
            endx += 5
        }
        startx = 0
        endx = 4
        for (let i = 0; i < 20; i++) {
            url += `,MPOP${startx}_${endx}`
            startx += 5
            endx += 5
        }
        //console.log(url)

        $.ajax({
            url: "https://api.census.gov/data/timeseries/idb/5year",
            data: {
                get: "NAME" + url,
                YR: "2021",
                FIPS: country_id,
                key: "dac13e19808c831211754f0e1e0ac27f45bddaaf",
                
            },
            beforeSend: function() {
                $("#main-table").hide()
                $("#loading").show(); // Show loading indicator before making the request
            }
        }).then((response) => {
            {
                $("#main-table").show()
                $("#loading").hide();
                //console.log(response)
                let newstartx = 0
                let newendx = 4
                

                let req_data = [['Age group', 'Male', 'Female']]
                for (let i = 1; i <= 20; i++) {
                    req_data.push([`Age ${newstartx}-${newendx}`, parseInt(response[1][i+20]), parseInt(response[1][i])])
                    newstartx += 5
                    newendx += 5
                }
                let options = {
                    title: "Population Distribution",
                    titleTextStyle: {
                        font: "none",
                        color: "white",
                        fontSize: 30
                    },
                    animation: {
                        startup: true,
                        duration: 1000,
                        easing: 'out'
                    },
                    legend: {position: "bottom",
                        textStyle: {
                            color: "white"
                        }
                    },
                    backgroundColor: {
                        fill: "#030303",
                        fillOpacity: "0"
                    },
                    vAxis: {
                        textStyle: {
                            color: "white"
                        }
                    },
                    hAxis: {
                        textStyle: {
                            
                            color: "white"
                        }
                    },
                    chartArea: {
                        backgroundColor: {
                            fill: "black"
                        },
                    },
                }
                let dataTable = google.visualization.arrayToDataTable(req_data)

                // let chart = new google.charts.Bar(document.getElementById("chart"))
                // chart.draw(dataTable, google.charts.Bar.convertOptions(options))
                let chart = new google.visualization.ColumnChart(document.getElementById("chart"))
                chart.draw(dataTable, options)
                //console.log(req_data)
            }
        })
    }

//---------------------------------
    function drawGenderPie() {
        $.ajax({
            url: "https://api.census.gov/data/timeseries/idb/5year",
            data: {
                get: "NAME,FPOP,MPOP",
                YR: "2021",
                FIPS: country_id,
                key: "dac13e19808c831211754f0e1e0ac27f45bddaaf",
            },
            beforeSend: function() {
                $("#main-table").hide()
                $("#loading").show()// Show loading indicator before making the request
        }
        }).then((response) => {
            {
                $("#main-table").show()
                $("#loading").hide()
                let arr = [["Gender", "Population"]]
                arr.push(["Male", parseInt(response[1][2])])
                arr.push(["Female", parseInt(response[1][1])])

                let dataTable = google.visualization.arrayToDataTable(arr)

                let options = {
                    
                    title: "PopDist",
                    titleTextStyle: {
                        color: "white",
                        fontSize: 30
                    },
                    
                    animation: {
                        startup: true,
                        duration: 1000,
                        easing: 'out'
                    },
                    // height: 500,
                    // width: 500,
                    pieHole: 0.85,
                    legend: {position: "bottom",
                        textStyle: {
                        color: "#FFFFFF"
                        }
                    },
                    backgroundColor: {
                        fill: "#000000",
                        fillOpacity: "0"
                    },
                    // pieSliceText: "none",
                    // pieSliceBorderColor: "black",
                    pieStartAngle: "180",
                    // slices: {
                    //     1: {offset: 0, border: {color:"red"}}
                    // }
                    
                }

                let chart2 = new google.visualization.PieChart(document.getElementById("chart2"))
                
                chart2.draw(dataTable, options)
            }
        })
    }
}
