// var video = document.createElement('video');
var video = document.querySelector('video');
var canvas = document.getElementById('canvas');
var canvas2 = document.createElement('canvas');
canvas2.width = 100;
canvas2.height = 100;
var context = canvas.getContext('2d');
var context2 = canvas2.getContext('2d');
var time, temp, weather, gender, latitude, longitude, accuracy, height, wind, atmosphere;
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({ video: { width: 1000, height: 1000 } }).then(function (stream) {
//         video.srcObject = stream;
//         video.play();
//         video.onloadedmetadata = function (e) {
//             loop_canvas();
//         }
//     });
// }
var tracker = new tracking.ObjectTracker('face');
tracker.setInitialScale(4);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);
tracking.track(video, tracker, { camera: { width: 1000, height: 1000 } });
var cameraTimer = 0;
setInterval(function () {
    --cameraTimer;
}, 1000);
tracker.on('track', function (event) {
    // console.log(cameraTimer, event);
    if (cameraTimer > 0) {
        return true;
    }
    // && event.data[0].total > 2
    if (event.data.length > 0) {
        cameraTimer = 10;
        console.log(event.data[0]);
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function (rect) {
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
        
        sendPicture();
    }
    // else {
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    // }
});
dateSetting();
getWeather();
navigator.geolocation.getCurrentPosition(success, error, options);

function loop_canvas() {
    // 
    context.drawImage(video, 0, 0, 1000, 1000);
    window.requestAnimationFrame(loop_canvas);
}

function dateSetting() {

    setInterval(function () {
        var date = new Date();
        time = date.toLocaleTimeString();
        document.querySelector(".time").innerHTML = (time);
    }, 1000);
}

function getWeather() {
    axios.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Seoul%22)%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
        .then(function (response) {
            console.log(response.data.query.results.channel.item.condition);
            var conditions = response.data.query.results.channel.item.condition;
            var channel = response.data.query.results.channel;
            weather = conditions.text;
            temp = conditions.temp;
            wind = channel.wind;
            atmosphere = channel.atmosphere;
            document.querySelector(".temp").innerHTML = (temp);
            document.querySelector(".speed").innerHTML = (wind.speed);
            document.querySelector(".humidity").innerHTML = (atmosphere.humidity);
        });
}
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    latitude = crd.latitude;
    longitude = crd.longitude;
    accuracy = crd.accuracy;
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function sendPicture() {
    context2.drawImage(video, 0, 0, 100, 100);
    // document.querySelector(".top").classList.toggle("flash");
    canvas.classList.toggle("flash");
    
    axios.post('/api/create2', {
        image: canvas2.toDataURL(),
        temp: temp,
        windspeed: wind.speed,
        weather: weather,
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy,
        humidity: atmosphere.humidity,
    })
    .then(function(response){
        // document.querySelector(".top").classList.remove("flash");
        canvas.classList.remove("flash");
        context2.clearRect(0, 0, canvas.width, canvas.height);
        console.log(response);
        document.querySelector("ul.recommend").children.item(0).children.src = response.image;
    });
}