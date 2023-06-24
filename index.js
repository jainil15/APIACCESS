onload = () => {
    $.ajax({
        url: "https://api.census.gov/data/timeseries/idb/5year",
        data: {
            get: "NAME,POP",
            YR: "2021",
            // for: "country:NORWAY",
            key: "dac13e19808c831211754f0e1e0ac27f45bddaaf",
        },
        success: function(response) {
            console.log(response)
        }
    })
}
