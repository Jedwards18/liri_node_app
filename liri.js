require("dotenv").config();

var keys = require("./keys");
var inquirer = require("inquirer");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

liriCommand = process.argv[2];

function movieSearch(movie) {

  var movieName = process.argv.slice(3).join("+");

  //var movieName = movieName.split('').join("+");

  if (movieName === '') {
    movieName = 'Mr. Nobody';
  };

  //searchTerm = searchTerm.split('').join('+');
  var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieName + "&plot=full&tomatoes=true";
  console.log(queryUrl);

  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      
      console.log("\n-------------------\n")
      console.log("\nTitle: " + data.Title +
      "\nRelease Year: " + data.Year +
      "\nIMDB Rating: " + data.imdbRating +
      "\nRotten Tomatoes Rating: " + data.tomatoRating +
      "\nCountry Produced: " + data.Country +
      "\nLanguage: " + data.Language +
      "\nPlot: " + data.Plot +
      "\nActors: " + data.Actors);
    } else {
      console.log("An error has occured: " + error);
    }
  });
};

function displayTweets() {
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
   
  var twitterUsername = process.argv[3];
  
  var params = {screen_name: twitterUsername};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log("\n-------------------\n");
        console.log("\nScreen Name: " + "@" + tweets[i].user.screen_name +
        "\nTweet: " + tweets[i].text +
        "\nCreated At: " + tweets[i].created_at);
      }

    } else {
      console.log("Error occured: " + err);
    }
  });
}

function spotifyThisSong() {
  
  var songName = process.argv[3];

  if (songName === "") {
    var songName = "The Sign";
  };

  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
  });
   
  spotify.search({ type: 'track', query: songName, limit: 10}, function(err, data) {
    if (!err) {
      var songInfo = data.tracks.items;
      for (var i = 0; i < 5; i++) {
        console.log("\n-------------------\n")
        console.log("\nArtist: " + songInfo[i].artists[0].name +
        "\nSong: " + songInfo[i].name +
        "\nAlbum The Song is From: " + songInfo[i].album.name +
        "\nPreview Url: " + songInfo[i].preview_url);
      }
      console.log(data.items);
    } else {
      return console.log('Error occurred: ' + err);
    }
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error,data) {
    if (!err) {
      console.log(data);
    } else {
      return console.log(error);
    };
  })
}

switch(liriCommand) {
  case "my-tweets": 
    displayTweets(); 
    break;
  case "movie-this": 
    movieSearch(); 
    break;
  case "spotify-this-song": 
    spotifyThisSong(); 
    break;
  case "do-what-it-says": 
    doWhatItSays(); 
    break;
  case "default": console.log("\n Select One of the Following" + "\r\n" +
  "1) my-tweets + username: Which will display your latest tweets" + "\r\n" +
  "2) movie-this + movie name: Which will diplay info about a particular movie" + "\r\n" +
  "3) spotify-this-song + sone name: Which will display info about a particular song" + "\r\n" +
  "4) do-what-it-says: ???"); break;
};

