var config = {
    apiKey: "AIzaSyDZu7G-jsQhOjIadv3jWxWs4bGRyFu_mSY",
    authDomain: "weather-project-7923a.firebaseapp.com",
    databaseURL: "https://weather-project-7923a.firebaseio.com",
    storageBucket: "weather-project-7923a.appspot.com",
    messagingSenderId: "840012888066"
  };

  firebase.initializeApp(config);//my firebase config did't used yet , but all API's already in ! 

  $( document ).ready(function() {
 var pos;
 var weatherReport;
 var lowtemp;
                               
                                        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=28105&key=AIzaSyATHPPagioRnJR7xhCvEYBT2VVFUkE5ajY',
                          })
                          .done(function(data) {
                            console.log(data)

                                        
                                        lat = data.results[0].geometry.bounds.northeast.lat,
                                        lng = data.results[0].geometry.bounds.northeast.lng
                                                checkWeather(lat,lng)
                                  
                            
                            console.log("success");
                          })
                          .fail(function() {
                            console.log("error");
                          })
                          .always(function() {
                            console.log("complete");
                          });


function checkWeather(lat,lng) {
            var url = `http://api.wunderground.com/api/3f4f6b8d728af2d4/forecast10day/q/${lat},${lng}.json`     
          $.ajax({
                    url: url, // here we get our weather from at and long from first api call

                  })
                  .done(function(data) {



                      // console.log(data.forecast.simpleforecast.forecastday.length);

                     var arrWeathers = data.forecast.simpleforecast.forecastday;

                                for( i in arrWeathers){


                                        //console.log(arrWeathers[i]);
                                        
                                        // console.log(arrWeathers[i].date.epoch);
                                        // console.log(arrWeathers[i].date.monthname_short);
                                        // console.log(arrWeathers[i].date.day);
                                        // console.log(arrWeathers[i].conditions);
                                        // console.log(arrWeathers[i].low.fahrenheit);
                                        // console.log(arrWeathers[i].high.fahrenheit); 
                                        // console.log(arrWeathers[i].high.icon_url);
                                        if ( i <= 4 ) { 
                                        date = `${arrWeathers[i].date.monthname_short } ${arrWeathers[i].date.day}`
                                        // console.log(date)


                                  $("#weathers").append(`<div  class="weathertag Day${i}" data-day = "${date}" ">
                                    <p>${arrWeathers[i].date.monthname_short} ${arrWeathers[i].date.day} </p>
                                    <p>Condition ${arrWeathers[i].conditions}</p>
                                    <p>Low temperature ${arrWeathers[i].low.fahrenheit}</p>
                                    <p>High temperature ${arrWeathers[i].high.fahrenheit}</p>                              
                                    <img class="imgWeather${i}" src="${arrWeathers[i].icon_url}"
                                
                                    </div> 
                                    `  )  
                                    }                        
                                }


                                  //Seat Geek
                
                  var forecastDay = data.forecast.simpleforecast.forecastday;
                  
                  for (i = 0; i < 5; i++) {
                  var strDate = forecastDay[i].date.year + "-" + forecastDay[i].date.month + "-" + forecastDay[i].date.day;
                  //var strDateF = strDate.slice(15,31).trim();
                  console.log(strDate);
                  var date = moment(strDate).format("YYYY-MM-DD").toString();
                  //console.log(date);

                      var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": `https://api.seatgeek.com/2/events?&geoip=true&datetime_local.gt=${date}&client_id=NjY5Nzc0MXwxNDg1MzkwMjgxLjEx`,
                        "method": "GET"
                      }

                      $.ajax(settings).done(function (data) {
                        for (j in data.events) {
                          console.log(data.events[j].short_title);
                          console.log(moment(data.events[j].datetime_local).format("YYYY-MM-DD"));
                          console.log(data.events[j].url);
                        }
                         console.log(data);
                      });
                    }






                                     $('.weathertag').on('click', function(event) {
                      event.preventDefault();
                      console.log($(this).data().day)

                        day = $(this).data().day


            $.ajax({
              url: 'https://api.meetup.com/find/events?photo-host=public&sig_id=211596974&lon=-80.7103532&lat=35.1105564&sig=38c2cf24f276b84aafa5431fca7ea8a893f594e4',
              dataType: 'jsonp'
              
            })
            .done(function(data) {
              console.log(data)
              console.log(data.data)
              console.log("success");
              var events = data.data;
                          for ( i in events ) {

                    if(events[i].hasOwnProperty('venue')) {
                                     
                    str = (moment(events[i].time)._d).toString()
                    str = str.slice(4 ,10).trim()
                    console.log(str)
                                if ( str == day) {

                                   
                    console.log(events[i].name)
                    console.log(events[i].venue.address_1)
                    console.log(events[i].venue.name)
                    console.log("---------------------------------")

                                       
                                }

} 
       }          
            })


                          $(this).append()

                    });


                  })
                  .fail(function() {
                    console.log("error");
                  })
                  .always(function() {
                    
                  });
                   }       


// function MeetUp (day) {


//             $.ajax({
//               url: 'https://api.meetup.com/find/events?photo-host=public&sig_id=211596974&lon=-80.7103532&lat=35.1105564&sig=38c2cf24f276b84aafa5431fca7ea8a893f594e4',
//               dataType: 'jsonp'
              
//             })
//             .done(function(data) {
//               console.log(data)
//               console.log(data.data)
//               console.log("success");
//               var events = data.data;
//                           for ( i in events ) {

//                     if(events[i].hasOwnProperty('venue')) {
                                     
//                     str = (moment(events[i].time)._d).toString()
//                     str = str.slice(4 ,10).trim()
//                     console.log(str)
//                                 if ( str == day) {

                                    
//                     console.log(events[i].name)
//                     console.log(events[i].venue.address_1)
//                     console.log(events[i].venue.name)
//                     console.log("---------------------------------")

                                       
//                                 }



// } 

//                     }          
//             })
//             .fail(function() {
//               console.log("error");
//             })
//             .always(function() {
//               console.log("complete");
//             });

// }

    console.log( "ready!" );


});




        // 32426c2a3817684768446d4c5535244f