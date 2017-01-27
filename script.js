$(function() {

var config = {
  apiKey: "AIzaSyDis8TTOcaDju9g8zqWrlNIei5g5hQiyNc",
  authDomain: "authlearning-31116.firebaseapp.com",
  databaseURL: "https://authlearning-31116.firebaseio.com",
  storageBucket: "authlearning-31116.appspot.com",
  messagingSenderId: "927237143466"
};




firebase.initializeApp(config);
var database = firebase.database();
var user = database.ref('/user');
var newUser = database.ref('/newuser');
var email;
var pass;
var movies;
database.ref().on('value', function(snap) {


  // console.log((snap.val().user))
  // console.log(snap.val())


  $('#txtEmail').val(email)
  $('#txtPassword').val(pass)

})

user.on('value', function(snap) {
  email = snap.val().email
  pass = snap.val().pass

  // console.log(email)
  // console.log(snap.val())

});


//gET elEMENTS
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');
//add login

btnLogin.addEventListener('click', e => {
  //Get emeil and pass
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();


  var newUser = {
      email: email,
      pass: pass,
      uid: '',
      zip: ''
    }
    // Sign in
  user.push(newUser)

  const promise = auth.signInWithEmailAndPassword(email, pass);

  promise.catch(e => console.log(e.message));

  console.log('loggedin')
  return false

});
// sign up 

btnSignUp.addEventListener('click', e => {

  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  // Sign up
  $('.info').show()
  newUser.push({
    email: email,
    pass: pass,
    status: 'loggedin',
    zpi: '',
    uid: ''
  });
  $('#weathers').empty();

  const promise = auth.createUserWithEmailAndPassword(email, pass);

  promise.catch(e => console.log(e.message));
    return false
});

btnLogout.addEventListener('click', e => {
  newUser.update({
    status: 'loggedOUT'
  });

  user.update({
    status: 'loggedOUT'
  });

  firebase.auth().signOut();
})


//add real time listener

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    $('.info').show()
    console.log(firebaseUser);
    // console.log(firebaseUser.uid);


    btnLogout.classList.remove('hide');
  } else {

    $('.info').hide()
    console.log("not logged in");
    btnLogout.classList.add('hide');
  }

});
var pos;
var weatherReport;
var lowtemp;
var eventsNames = [];
$('.info').hide()
$('#lookInfo').on('click', function() {
      // console.log("I was clicked")
  zip = $('.search').val().trim()
  var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(`${zip}`);
  if (isValidZip === true) {

    user.update({
      zip: zip
    })

    $('#weathers').empty()
      // console.log(zip)
    findLocation(zip)
  } else {

    console.log('bad zip')
  }


})

function findLocation(zip) {
  $.ajax({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyATHPPagioRnJR7xhCvEYBT2VVFUkE5ajY`,
    })
    .done(function(data) {
      console.log(data)


      lat = data.results[0].geometry.bounds.northeast.lat,
        lng = data.results[0].geometry.bounds.northeast.lng
      checkWeather(lat, lng)


      // console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
}

function checkWeather(lat, lng) {
  var url = `http://api.wunderground.com/api/3f4f6b8d728af2d4/forecast10day/q/${lat},${lng}.json`
  $.ajax({
      url: url, // here we get our weather from at and long from first api call

    })
    .done(function(data) {



      // console.log(data.forecast.simpleforecast.forecastday.length);

      var arrWeathers = data.forecast.simpleforecast.forecastday;
      var forecastDay = data.forecast.simpleforecast.forecastday;
                  
                  for (i = 0; i < 5; i++) {
                  var strDate = forecastDay[i].date.year + "-" + forecastDay[i].date.month + "-" + forecastDay[i].date.day;
                  //var strDateF = strDate.slice(15,31).trim();
                  // console.log(strDate);
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
                          // console.log(data.events[j].short_title);
                          // console.log(moment(data.events[j].datetime_local).format("YYYY-MM-DD"));
                          // console.log(data.events[j].url);
                        }
                         // console.log(data);  //CHECK THIS
                      });
                    }

      for (i in arrWeathers) {

        if (i <= 4) {
          date = `${arrWeathers[i].date.monthname_short } ${arrWeathers[i].date.day}`
            // console.log(date)
          // console.log(arrWeathers[i])

          // console.log(`${arrWeathers[i].date.year}-${arrWeathers[i].date.month}-${arrWeathers[i].date.yday}`)


          $("#weathers").append(`<div  class=" col-md-2 weathertag Day${i}" data-day = "${date}" ">
                                    <p>${arrWeathers[i].date.monthname_short} ${arrWeathers[i].date.day} </p>
                                    <p>Condition ${arrWeathers[i].conditions}</p>
                                    <p>Low temperature ${arrWeathers[i].low.fahrenheit}</p>
                                    <p>High temperature ${arrWeathers[i].high.fahrenheit}</p>                              
                                    <img class="imgWeather${i}" src="${arrWeathers[i].icon_url}"
                                    
                                    </div>
                                    <button class="meetupBtn"  data-day = "${date}" > Meetup </button> 
                                    `)
        }
      }

      $('.meetupBtn').on('dblclick', function(event) {
        event.preventDefault();
        // console.log($(this).data().day)

        day = $(this).data().day
        console.log(day)
        _this = $(this)

        $.ajax({
            url: `https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon=${lng}&limited_events=False&photo-host=secure&page=150&time=0d%2C5d&radius=7&lat=${lat}&desc=False&status=upcoming&sig_id=211596974&sig=f7fffeb2a7206720eb02e77e00013fad17a51e5f`,
            dataType: 'jsonp'

          })
          .done(function(data) {
              console.log(data)
            var events = data.results;

            for (i in events) {

              if (events[i].hasOwnProperty('venue')) {


                str = (moment(events[i].time)._d).toString()
                str = str.slice(4, 10).trim()
                console.log(str)

                  // console.log(str)
                if (str === day) {
                  console.log(day)

                  console.log(events[i].link)
                  console.log(events[i].name)


                  _this.append(`<div class='meetupEvent'> 
                                          <p>Name: ${events[i].name}</p>
                                          <p>Adress: ${events[i].venue.address_1}</p>
                                          <p>Venue Name: ${events[i].venue.name} </p>
                                          <a href="${events[i].link}" target="_blank">Link on Event</a>
                                          <p>___________________________</p>
                              <div>`)


                }


              }
            }
          })

        console.log(eventsNames)


      });

      $('.meetupBtn').on('click', function() {

        $(this).html('Meetup')

      })

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {

    });
}
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.themoviedb.org/3/movie/popular?page=1&language=en-US&api_key=65df1022a70a9ad63fbfa028ad61d139",
  "method": "GET"
}

$.ajax(settings).done(function(response) {
  var arrayOfmovies = []
  while (arrayOfmovies.length < 5) {
    var randomMovie = Math.floor(Math.random() * response.results.length)


    if (arrayOfmovies.includes(randomMovie)) {} else {
      arrayOfmovies.push(randomMovie)

    }



    console.log(arrayOfmovies)
  }
  for (i in arrayOfmovies) {


    index = arrayOfmovies[i]

    console.log(response.results[index].original_title)



  }
});
});