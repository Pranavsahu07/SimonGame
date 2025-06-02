var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var highScore = localStorage.getItem("simonHighScore") || 0;
let highScoreName = localStorage.getItem("simonHighScoreName") || "None";
$("#high-score").text(`${highScore} (${highScoreName})`);

$(document).keypress(function () {
  if (!started) {
    startGame();
  }
});

$("#restart-btn").click(function () {
  startOver();
  startGame();
});

$(".btn").click(function () {
  if (!started) return;

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function startGame() {
  level = 0;
  gamePattern = [];
  started = true;
  nextSequence();
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    updateHighScore(level - 1);
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  $("#current-score").text(level - 1);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
  playSound(randomChosenColour);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  $("#current-score").text("0");
}

function updateHighScore(score) {
  const name = $("#player-name").val().trim() || "Anonymous";
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("simonHighScore", highScore);
    localStorage.setItem("simonHighScoreName", name);
    $("#high-score").text(`${highScore} (${name})`);
  }
}

$("#dark-mode-toggle").click(function () {
  $("body").toggleClass("dark-mode");

  // Optional: save theme preference
  const isDark = $("body").hasClass("dark-mode");
  localStorage.setItem("simonDarkMode", isDark ? "on" : "off");
});

// Optional: load saved preference on startup
$(document).ready(function () {
  if (localStorage.getItem("simonDarkMode") === "on") {
    $("body").addClass("dark-mode");
  }
});
