
  // Initialize Firebase
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

user.on('child_added', function(snap){
          email =  snap.val().email
          pass =   snap.val().pass

          console.log(email)
          console.log(snap.val())

          $('#txtEmail').val(email)
          $('#txtPassword').val(pass)
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

  // Sign in
  user.push({

          email : email, 
          pass  : pass,
          uid: ''

  })

  const promise = auth.signInWithEmailAndPassword(email, pass);

  promise.catch(e => console.log(e.message));

console.log('loggedin')

});
// sign up 

btnSignUp.addEventListener('click', e => {

  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  // Sign up
  $('.info').show()
  newUser.push({
          email : email,
          pass: pass,
          status: 'loggedin',
          zpi: '',
          uid: ''
    } );
  $('#weathers').empty();

  const promise = auth.createUserWithEmailAndPassword(email, pass);

  promise.catch(e => console.log(e.message));
});

btnLogout.addEventListener('click', e => {
    newUser.update({
          status: 'loggedOUT'
    } );

  firebase.auth().signOut();
})


//add real time listener

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    $('.info').show()
    console.log(firebaseUser);
    console.log(firebaseUser.uid);


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
$('.draggable').hide();
$('.info').hide()
$('#lookInfo').on('click', function() {

  zip = $('.search').val().trim()
  var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(`${zip}`);
  if (isValidZip === true) {
// user.({zipcode: zip})
$('#weathers').empty()
    console.log(zip)
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

      for (i in arrWeathers) {

        if (i <= 4) {
          date = `${arrWeathers[i].date.monthname_short } ${arrWeathers[i].date.day}`
            // console.log(date)


          $("#weathers").append(`<div  class="weathertag Day${i}" data-day = "${date}" ">
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
        _this = $(this)

        $.ajax({
            url: `https://api.meetup.com/find/events?photo-host=public&sig_id=211596974&lon=${lng}&lat=${lat}&sig=38c2cf24f276b84aafa5431fca7ea8a893f594e4`,
            dataType: 'jsonp'

          })
          .done(function(data) {

            var events = data.data;
            for (i in events) {

              if (events[i].hasOwnProperty('venue')) {

                str = (moment(events[i].time)._d).toString()
                str = str.slice(4, 10).trim()
                  // console.log(str)
                if (str == day) {


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

    $('.draggable').show();
}
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.themoviedb.org/3/movie/popular?page=1&language=en-US&api_key=65df1022a70a9ad63fbfa028ad61d139",
      "method": "GET"
    }

    $.ajax(settings).done(function (response) {
               var arrayOfmovies = []
            while (arrayOfmovies.length < 5) {
            var randomMovie = Math.floor(Math.random()*response.results.length)
             arrayOfmovies.push(randomMovie)
            }
                  for ( i in  arrayOfmovies ){

                          
                            index = arrayOfmovies[i]

                                console.log( response.results[index].original_title)
                                  $('.movies').append(`<p>${response.results[index].original_title}</p>`)


                  }
    });
 // target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      // textEl && (textEl.textContent =
        
      //   );
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;