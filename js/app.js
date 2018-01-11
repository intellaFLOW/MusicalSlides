const BASE_URL = "https://api.unsplash.com/";
const ID_STR =
  "client_id=cc682cb24c6d39c5f80d0e5b0703f516c2ce7e7a4c5028787549cc061e8b8880";
const COLLECTIONS_URL = BASE_URL + "/collections/454300/photos/?" + ID_STR;
const STATE = {
  images: [],
  currentIndex: 0,
  slideShowDelayInterval: 10000
};

function welcomeMessageAction() {
  $(".start-button").click(function() {
    $(".site-message-frame").addClass("hidden-message");
    $(".start-button").addClass("hidden-message");
    console.log("Welcome");
  });
}

function callUnsplashAPI() {
  let query = {
    per_page: 100
  };
  $.getJSON(COLLECTIONS_URL, query)
    .then(saveUnsplashApiData)
    .then(shuffleImageArray)
    .then(saveApiObjectProperties)
    .then(renderImages);
    console.log("Unsplash API Called")
}

function saveUnsplashApiData(data) {
  STATE.images.push(...data);
  return STATE.images;
}

function shuffleImageArray(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function saveApiObjectProperties() {
  const state = STATE;
  let currentIndex = 0;
  for (var image of state.images) {
    let backgroundImage = image.urls.regular;
    let firstName = image.user.first_name;
    let lastName = image.user.last_name;
    let portfolioUrl = image.user.portfolio_url;
    currentIndex = currentIndex + 1;
    appendHTMLElement(backgroundImage, portfolioUrl, firstName, lastName);
    console.log(backgroundImage, firstName, portfolioUrl);
  }
}

function appendHTMLElement(backgroundImage, portfolioUrl, firstName, lastName) {
  let imageBlock = `<li class="js-slideshowFrame">
            <span style="background-image: url(${backgroundImage})"></span>
            <div class="photo-info-frame">
              <p class="photographer-info"><a href="${portfolioUrl}"><i class="fa fa-camera-retro" id="camera-icon" aria-hidden="true"></i> by ${firstName} ${lastName}</a></p>
            </div>
          </li>`;
  $(".slideshow").append(imageBlock);
}

function renderImages() {
  cacheFirstImage(displayImageSlideShow);
}

function cacheFirstImage(callback) {
  let image = new Image();
  image.onload = function() {
    callback();
  };
  image.src = STATE.images[0].urls.full;
}

function displayImageSlideShow() {
  let slides = $(".js-slideshowFrame");

  hidePreloader();
  menuIconleftArrowAction(slides);
  menuIconRightArrowAction(slides);
  callForinsmaticApi();
  for (let i = 0; i < slides.length; i++) {
    if (i > 0) {
      $(slides[i]).addClass("slideshow-image--hide");
      $(slides[i]).removeClass("slideshow-image--reveal");
    } else {
      $(slides[i]).addClass("slideshow-image--reveal");
      $(slides[i]).removeClass("slideshow-image--hide");
    }
  }

  setTimeout(showSlides, STATE.slideShowDelayInterval);

  function showSlides() {
    advanceToNextSlide(slides);
    setTimeout(showSlides, STATE.slideShowDelayInterval);
  }
}

function menuIconleftArrowAction(slides) {
  $("#js-prevImageArrow").click(function() {
    console.log("prev image please");
    console.log(STATE.currentIndex);

    advanceToPreviousSlide(slides);
  });
}

function menuIconRightArrowAction(slides) {
  $("#js-nextImageArrow").click(function() {
    console.log("next image please");
    console.log(STATE.currentIndex);
    advanceToNextSlide(slides);
  });
}

function advanceToNextSlide(slides) {
  $(slides[STATE.currentIndex]).removeClass("slideshow-image--reveal");
  $(slides[STATE.currentIndex]).addClass("slideshow-image--hide");

  if (STATE.currentIndex === slides.length - 1) {
    STATE.currentIndex = 0;
  } else {
    STATE.currentIndex++;
  }

  $(slides[STATE.currentIndex]).removeClass("slideshow-image--hide");
  $(slides[STATE.currentIndex]).addClass("slideshow-image--reveal");
  callForinsmaticApi();
}

function advanceToPreviousSlide(slides) {
  $(slides[STATE.currentIndex]).removeClass("slideshow-image--reveal");
  $(slides[STATE.currentIndex]).addClass("slideshow-image--hide");

  if (STATE.currentIndex === 0) {
    STATE.currentIndex = slides.length - 1;
  } else {
    STATE.currentIndex--;
  }

  $(slides[STATE.currentIndex]).removeClass("slideshow-image--hide");
  $(slides[STATE.currentIndex]).addClass("slideshow-image--reveal");
  callForinsmaticApi();
}

function hidePreloader() {
  $(".spinner-wrapper").addClass("hide-preloader");
}

function callForinsmaticApi() {
  $.getJSON(
    "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?"
  ).done(saveForismaticApiData);
}

function saveForismaticApiData(response) {
  let quoteText = response.quoteText;
  let quoteAuthor = response.quoteAuthor;
  diplayQuote(quoteText, quoteAuthor);
}

function diplayQuote(quoteText, quoteAuthor) {
  if (quoteText.length > 64) {
    callForinsmaticApi();
  } else {
    $(".js-quote-frame").text(quoteText);
    $(".js-quote-author-frame").text(quoteAuthor);
  }
}

function menuIconSettingAction(event) {
  $(".menu-icon--settings").click(function(event) {
    event.preventDefault();
    $(".site-message-frame").toggleClass("hidden-message");
    $(".menu-icon--camera").toggleClass("hide-me");
    $(".menu-icon--quote").toggleClass("hide-me");
    $(".menu-icon--prevImage").toggleClass("hide-me");
    $(".menu-icon--nextImage").toggleClass("hide-me");
    $(".photo-info-frame").toggleClass("hide-me-important");
    $(".js-slideshowFrame blockquote").toggleClass("hide-me-important");
    $(".menu-frame").toggleClass("top-icon").addClass("behind-menu-icons");
  });
}

function menuIconQuoteAction() {
  $(".menu-icon--quote").click(function() {
    $(".menu-icon--quote").toggleClass("red-icon");
    showOrHideQuote();
  });
}

function showOrHideQuote() {
  let isIconRed = $(".menu-icon--quote").hasClass("red-icon");
  if (isIconRed) {
    $("blockquote").removeClass("reveal-me");
    $("blockquote").addClass("hide-me");
  } else {
    $("blockquote").removeClass("hide-me");
    $("blockquote").addClass("reveal-me");
  }
}

function menuIconCameraAction() {
  $(".menu-icon--camera").click(function() {
    $(".menu-icon--camera").toggleClass("red-icon");
    showOrHidePhotographer();
  });
}

function showOrHidePhotographer() {
  let isIconRed = $(".menu-icon--camera").hasClass("red-icon");
  if (isIconRed) {
    $(".photo-info-frame").removeClass("reveal-me");
    $(".photo-info-frame").addClass("hide-me");
  } else {
    $(".photo-info-frame").removeClass("hide-me");
    $(".photo-info-frame").addClass("reveal-me");
  }
}

function onYouTubePlayerAPIReady() {
  var numPl = Math.floor((Math.random() * 5) + 1);
  var player = new YT.Player('player', {  
    loop: true,
    loopPlaylists: true,
    shufflePlaylist: true,
    height: '0',
    width: '0',
    playerVars: {
      listType:'playlist',
      list:'PL4ZQ4oPtGbs5VmHSKxjp2Bz6yFDUDjuxD',
      index: numPl,
    },
      events: {
          onReady: function (e) {
              e.target.playVideo();
            
          },
          onStateChange: function (event) {

          }
      }
  });
}

$(function() {
  welcomeMessageAction();
  callUnsplashAPI();
  menuIconSettingAction();
  menuIconQuoteAction();
  menuIconCameraAction();
});