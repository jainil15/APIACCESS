

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
        country_name.push(responseData[0]),
            request_data.push([responseData[0], responseData[1]])
    }
    let selection = d3.select("#country-select")
    let option = selection.selectAll("option").data(request_data.slice(1, request_data.length))
        .enter()
        .append("option")
    option
        .attr("value", function (d, i) {
            //console.log(d)
            return d[1]
        })
        .attr("name", function (d, i) {
            //console.log(d)
            return d[0]
        })
        .text(function (d, i) {
            return d[0]
        })

})


function draw() {
    let country_select = document.getElementById("country-select")
    let country_id = country_select.value
    let county_name = $("#country-select").find('option:selected').text()
    $("#country-name-div").text(county_name)
    
    console.log(county_name)
    
    google.charts.load('current', {'packages': ['corechart']});
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
        console.log(url)

        $.ajax({
            url: "https://api.census.gov/data/timeseries/idb/5year",
            data: {

                get: "NAME" + url,
                YR: "2021",
                FIPS: country_id,
                key: "dac13e19808c831211754f0e1e0ac27f45bddaaf"
            }
        }).then((response) => {
            {
                console.log(response)
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
                    animation: {
                        startup: true,
                        duration: 1000,
                        easing: 'out'
                    },
                }
                let dataTable = google.visualization.arrayToDataTable(req_data)

                let chart = new google.visualization.ColumnChart(document.getElementById("chart"))
                chart.draw(dataTable, options)
                console.log(req_data)


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
                key: "dac13e19808c831211754f0e1e0ac27f45bddaaf"
            }
        }).then((response) => {
            {
                let arr = [["Gender", "Population"]]
                arr.push(["Male", parseInt(response[1][2])])
                arr.push(["Female", parseInt(response[1][1])])


                let dataTable = google.visualization.arrayToDataTable(arr)

                let options = {
                    title: "PopDist",
                    titleTextStyle: {
                        fontSize: 30
                    },
                    animation: {
                        startup: true,
                        duration: 1000,
                        easing: 'out'
                    },
                    // height: 500,
                    // width: 500,
                    pieHole: 0.7,
                    legend: {position: "bottom"}
                }

                let chart2 = new google.visualization.PieChart(document.getElementById("chart2"))
                
                chart2.draw(dataTable, options)
            }
        })
    }
}