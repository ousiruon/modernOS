import { usrGuest,backImg } from "./user.js";
import {movies} from "./movies.js";
import {musics} from "./music.js";
import {foods} from "./delivery.js";
import {news} from "./news.js";
import {apps} from "./apps.js";
import {weather} from "./weather.js";


// Global status variable
let userStatus = 'disconnected';
// Global declaration for entered PIN
let enteredPin = "";
// Global declaration for username from passcode
let userIndex;

/* Data manipulation */

// Get username
function getUserName(userIndex) {
    const tempUsrArray = usrGuest.find(e => e.id === userIndex);
    return tempUsrArray['userName'];
}
//Get background image
function getImgBckg (userIndex) {
    if (!userIndex) {
        userIndex = 0;
    }
    let tempUsrArray = usrGuest.find(e => e.id === userIndex);
    let currentIDimg = tempUsrArray['backgroundImg'];
    tempUsrArray = backImg.find(e => e.id === currentIDimg);
    return tempUsrArray['src'];
}
// Keydown function
function getKey(event) {
    let numberIn = '';
    numberIn = event.key;
    signInDOM (numberIn);
}
// Sign-in listner
function signIn() {
    window.addEventListener("keydown", getKey);
    const numbersDIV = document.querySelector('.numbers');
    numbersDIV.addEventListener('click' , (e) => {
        let numberIn = '';
        numberIn = e.target.dataset.numberInput;
        signInDOM (numberIn);
    });
}
// Get movies
function getMovies() {
    let content = '';
    movies.forEach((e) => {
        content += 
        `
            <div class='movie'>
                <img class='movie-img' src='${e.imgsrc}' alt=${e.name} />
                <div class='movie-txt'>
                    <div class='movie-title'>${e.name}</div>
                    <div class='movie-description'>${e.desc}</div>
                </div>
                <div class='movie-info'>
                    <div class='movie-rating'>${e.rating}</div>
                    <div class='movie-icon'>${e.icon}</div>
                </div>
            </div>
        `;
    });
    return content;
}
//Get music
function getMusics () {
    let content='';
    musics.forEach((e) => {
        content+=
        `
            <div class='music'>
                <img src='${e.imgsrc}' alt='${e.name}'/>
                <div class='play'>
                    <i class="fa-solid fa-play"></i>
                </div>
                <div class='length'>${e.length ? '00:00 / '+e.length : '<i class="fa-solid fa-circle-dot"></i> Live'}</div>
            </div>
        `;
    });
    return content;
}
//Get food
function getDeliveries() {
    let content = '';
    foods.forEach((e) => {
        content += 
        `
            <div class='delivery'>
                <img src='${e.imgsrc}' alt='${e.name}'/>
                <div class='desc'>
                    <div class='food_title'>${e.name}</div>
                    <div class='food_desc'>${e.desc}</div>
                </div>
            </div>
        `;
    });
    return content;
}
// Get news
function getNews() {
    let content ='';
    news.forEach((e) => {
        content +=
        `
            <div class='new'>
                <img src='${e.imgsrc}' alt='${e.title}'/>
                <div class='new_title'>${e.title}</div>
            </div>
        `;
    });
    return content;
}
// Get apps
function getApps() {
    let content='';
    apps.forEach((e)=> {
        content += 
        `
            <div class='app'>
                <div class='app-name'>${e.name}</div>
                <img src='${e.imgsrc}' alt='${e.name}'/>
                ${e.icon}
            </div>
        `;
    });
    return content;
}
// Get weather
function getWeather(option) {
    let content='';
    weather.forEach((e) => {
        let condition = e.condition;
        let degree = e.degree;
        if (option === 'farn') {
            degree = (degree * 9/5) + 32;
        }
        let conditionTag ='';
        if (condition ==='snow') {
            conditionTag ='<i class="fa-solid fa-snowflake"></i>';
        }
        else if (condition ==='thunder') {
            conditionTag ='<i class="fa-solid fa-cloud-bolt"></i>';
        }
        else if (condition ==='sunny') {
            conditionTag ='<i class="fa-solid fa-sun"></i>';
        }
        else if (condition === 'cloudy') {
            conditionTag ='<i class="fa-solid fa-cloud-sun"></i>';
        }
        content +=
        `
            <div class='weekday'>
                <div class='degree celc'>
                    ${degree}
                </div>
                ${conditionTag}
                ${e.name}
            </div>
        `;
    });
    return content;
}
// Check if user is connected 
function checkStatus () {
    if (userStatus === 'disconnected') {
        nonLogged();
    }
    else if (userStatus === 'connected') {
        logged();
    }
}
/* DOM manipulation */

const root = document.querySelector('#root');
const bgImage = document.querySelector('#bgimage');
const rootContent = document.querySelector('.root-content');
//SET Background image
function setBgImg (blur) {
    const bgImgDIV = 
    `
        <div class='background-img ${blur ? blur:''}'>
        </div>
    `;
    bgImage.innerHTML = bgImgDIV;
    const bgImg = document.querySelector('.background-img');
    let localBgImg = localStorage.getItem('background_'+userIndex);
    localBgImg = JSON.parse(localBgImg);
    if (userIndex !== 'undefined') {
        bgImg.style.backgroundImage = `url(${getImgBckg(userIndex)})`;
    }
    if (localBgImg) {
        if (localBgImg['0'] === userIndex) {
            let tempUImgArray = backImg.find(e => e.id === localBgImg['1']);
            let currentSrcImg = tempUImgArray['src'];
            bgImg.style.backgroundImage = `url(${currentSrcImg})`;
        }
    }
    if (userIndex === 'undefined') {
        bgImg.style.backgroundImage = `url(${getImgBckg(0)})`;
    }
}
// Sign-in DOM operations
function signInDOM (numberIn) {
    const isNumber = isFinite(numberIn);
    if (isNumber && (enteredPin.length < 4)) {
        const currentPinContent = document.querySelector('.pin.active > .pin-content');
        const currentPinDIV = document.querySelector('.pin.active');
        const invalidPins = document.querySelectorAll('.pin.invalid');
        currentPinContent.textContent = numberIn;
        currentPinDIV.classList.toggle('active');
        currentPinDIV.classList.toggle('hide');
        if (invalidPins) {
            invalidPins.forEach((e) => {
                e.classList.remove('invalid');
            });
        }
        if (!(currentPinDIV.classList.contains('last'))) {
            const nextPinDIV = currentPinDIV.nextElementSibling;
            nextPinDIV.classList.toggle('active');
        }
        enteredPin += ''+numberIn;
    }
    if (isNumber && (enteredPin.length) === 4) {
        enteredPin = parseInt(enteredPin);
        let loginMethodLocal = [];
        usrGuest.forEach((element,key) => {
            const passKeyData = 'pass_'+key;
            const passKeyStorage = localStorage.getItem(passKeyData);
            if (passKeyStorage) {
                loginMethodLocal.push(key);
            }
        });
        let tempUsrGuest = usrGuest;
        if (loginMethodLocal.length >= 1) {
            tempUsrGuest.forEach((e,key) => {
                loginMethodLocal.forEach((c) => {
                    if (key === c) {
                        const passKeyData = 'pass_'+key;
                        const passKeyStorage = JSON.parse(localStorage.getItem(passKeyData));
                        tempUsrGuest[key].psswd = passKeyStorage[1];
                    }
                });
            });
        }
        const tempUsrArray = tempUsrGuest.find(e => e.psswd == enteredPin);
        if (tempUsrArray) {
            userStatus = 'connected';
            userIndex = tempUsrArray['id'];
            checkStatus ();
        }
        else {
            enteredPin = '';
            const allPinContent = document.querySelectorAll('.pin.hide > .pin-content');
            const allPin = document.querySelectorAll('.pin');
            const firstPin = document.querySelector('.pin:first-child');
            allPinContent.forEach((e) => {
                e.textContent = '';
                e.parentElement.classList.remove('hide');
            });
            firstPin.classList.toggle('active');
            allPin.forEach((e)=> {
                e.classList.add('invalid');
            });
        }
    }
}
// Display index page if not logged in
function nonLogged() {
    const options = { weekday: "short" };
    const options2 = { month: "short" };
    const date = new Date();
    const month = new Intl.DateTimeFormat("en-US", options2).format(date);
    const weekDay = new Intl.DateTimeFormat("en-US", options).format(date);
    const day = date.getDate();
    let hour = date.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    const content =
    `
        <div class='non-logged'>
            <i class="fa-solid fa-lock"></i>
            <div class='date'>${weekDay} ${day} ${month}</div>
            <div class='time'>${hour}:${minutes}</div>
            <div class='unlock'><i class="unlock-btn fa-solid fa-right-to-bracket"></i></div>
        </div>
    `;
    rootContent.innerHTML = content;
    const unlockBtn = document.querySelector('.unlock-btn');
    unlockBtn.addEventListener('click' , (e) => {
        displaySignIn ();
    });
    setBgImg ('');
}
// Highlight the selected category
function categoryDOM(e) {
    const categoryActive = document.querySelector('.category.active');
    const categoryId = e.target;
    const categoryIdData = categoryId.dataset.categoryId;
    if (categoryActive) {
        categoryActive.classList.remove('active');
    }
    if (categoryIdData !== '0') {
        categoryId.classList.add('active');
    }
    const allCategories = document.querySelectorAll('[data-cat-id]');
    allCategories.forEach((event) => {
        if (event.dataset.catId === categoryIdData) {
            event.classList.remove('hide');
        }
        else if (categoryIdData === '0') {
            if (event.classList.contains('hide')) {
                event.classList.remove('hide');
            }
        }
        else {
            event.classList.add('hide');
        }
    });
}
// Scroll functionalities
function btnScroll (currentScrollerBtn , parentOfScoller, singleEl) {
    const containerTotalWitdth = parentOfScoller.scrollWidth;
    const containerWitdth = parentOfScoller.offsetWidth;
    const singleElWidth = singleEl.offsetWidth;
    const currentLeftScrollPos = (parentOfScoller.scrollLeft +1);
    let previousBtn = currentScrollerBtn.firstElementChild;
    let nextBtn = currentScrollerBtn.lastElementChild;
    let widthToAdd = 24;
    let widthToSub = 24;
    if (window.screen.width <= 750) {
        widthToSub = 28;
    }
    if (currentLeftScrollPos === 1) {
        if (!(previousBtn.classList.contains('inactive'))) {
            previousBtn.classList.add('inactive');
        }
    }
    else {
        previousBtn.classList.remove('inactive');
    }
    if ((currentLeftScrollPos+containerWitdth) >= containerTotalWitdth) {
        if (!(nextBtn.classList.contains('inactive'))) {
            nextBtn.classList.add('inactive');
        }
    }
    else {
        nextBtn.classList.remove('inactive');
    }
    currentScrollerBtn.addEventListener('click' , (e) => {
        if (e.target.classList.contains('previous') || e.target.parentElement.classList.contains('previous')) {
            if (!(previousBtn.classList.contains('inactive'))) {
                parentOfScoller.scrollLeft = currentLeftScrollPos - (singleElWidth + widthToSub);
            }
        }
        else if (e.target.classList.contains('next') || e.target.parentElement.classList.contains('next')) {
            if (!(nextBtn.classList.contains('inactive'))) {
                parentOfScoller.scrollLeft = currentLeftScrollPos + (singleElWidth + widthToAdd);
            }
        }
    });
}
// Get scroll
function scroll(scroller,toScroll) {
    let currentScrollerBtn = '.'+scroller;
    let parentOfScoller = '.'+toScroll;
    currentScrollerBtn = document.querySelector(currentScrollerBtn);
    parentOfScoller = document.querySelector(parentOfScoller);
    let singleEl = parentOfScoller.firstElementChild.className;
    singleEl = '.'+singleEl+':first-child';
    singleEl = document.querySelector(singleEl);
    currentScrollerBtn.addEventListener('click' , (e) => {
        btnScroll (currentScrollerBtn, parentOfScoller, singleEl);
    });
    btnScroll (currentScrollerBtn, parentOfScoller, singleEl);
}
//Get hour format for settings
function hourFormatSetting () {
    let localFormat = localStorage.getItem('format_'+userIndex);
    localFormat = JSON.parse(localFormat);
    let content;
    if (localFormat && (localFormat['0'] === userIndex)) { 
        content = 
        `
            <option value='24' ${localFormat['1'] === '24' ? 'selected':''}>24 Hours</option>
            <option value='12' ${localFormat['1'] === '12' ? 'selected':''}>12 Hours</option>
        `;
    }
    else {
        content = 
        `
            <option value='24' selected>24 Hours</option>
            <option value='12'>12 Hours</option>
        `;
    }
    return content;
}
//Get setting
function setting() {
    let backImgOption = '';
    let tempUsrArray = usrGuest.find(e => e.id === userIndex);
    let localBgImg = localStorage.getItem('background_'+userIndex);
    localBgImg = JSON.parse(localBgImg);
    let currentIDimg;
    if (localBgImg && (localBgImg['0'] === userIndex)) {
        currentIDimg = localBgImg['1'];
    }
    else {
        currentIDimg = tempUsrArray['backgroundImg'];
    }
    tempUsrArray = backImg.find(e => e.id === currentIDimg);
    backImg.forEach((e) => {
        backImgOption += 
        `
            <option ${currentIDimg === e.id ? 'selected':''} value='${e.id}'>${e.name}</option>
        `;
    });
    let content =
    `
        <div class='setting-container'>
            <div class='setting'><i class="setting-btn fa-solid fa-gears"></i></div>
            <h3 class='setting-title'>Settings</h3>
            <div class='pass-result'></div>
            <div class='option-choice'>
                <label for='background-choice'>Background</label>
                <select id='background-choice'>
                    ${backImgOption}
                </select>
            </div>
            <div class='option-choice'>
                <label for='pass-choice'>Passcode (4 digits)</label>
                <div class='passcase'>
                    <input type='number' id='pass-choice' maxlength='4' pattern="[0-9]{4}"> 
                    <i class="save-pass fa-solid fa-floppy-disk"></i>
                </div>
            </div>
            <div class='option-choice'>
                <label for='hour-format-choice'>Hour Format</label>
                <select id='hour-format-choice'>
                    ${hourFormatSetting()}
                </select>
            </div>
        </div>
    `;
    return content;
}
// Activate listner when logged in
function loggedListner () {
    const logoutBtn = document.querySelector('.lock-btn');
    const moviesContainer = document.querySelector('.latest_movies_container');
    const musicsContainer = document.querySelector('.musics_container');
    const appContainer = document.querySelector('.apps_container');
    const weatherContainer = document.querySelector('.weather_container');
    const backgroundOption = document.querySelector('#background-choice');
    const hourFormatChoice =  document.querySelector('#hour-format-choice');
    const savePass = document.querySelector('.save-pass');
    const settingBtn = document.querySelector('.setting');
    const settingContainer = document.querySelector('.setting-container');
    logoutBtn.addEventListener('click' , () => {   
        enteredPin = '';
        userStatus = 'disconnected';
        checkStatus ();
    });
    const categoriesSection = document.querySelector('.categories');
    categoriesSection.addEventListener('click' , (e) => {
        if (e.target.dataset.categoryId) {
            categoryDOM(e);
        }
    });
    const weatherOptions = document.querySelector('.weather-options');
    weatherOptions.addEventListener('click' , (e) => {
        const celciusOption = document.querySelector('.celcius');
        const farenheitOption = document.querySelector('.farenheit');
        function updateDegree(option) {
            const getAllDegrees = document.querySelectorAll('.weekday .degree');
            getAllDegrees.forEach((e) => {
                let currentDayContent = e.textContent;
                if (option === 'farn') {
                    e.classList.remove('celc');
                    e.classList.add('farn');
                    let degree = Math.round((currentDayContent * 9/5) + 32);
                    e.textContent = degree;
                }
                else if (option ==='celcius') {
                    e.classList.remove('farn');
                    e.classList.add('celc');
                    let degree = Math.round((currentDayContent - 32) * 5/9);
                    e.textContent = degree;
                }
            });
        }
        if (e.target.classList.contains('celcius')) {
            if (!(e.target.classList.contains('active'))) {
                updateDegree('celcius');
            }
            e.target.classList.add('active');
            farenheitOption.classList.remove('active');
        }
        else if (e.target.classList.contains('farenheit')) {
            if (!(e.target.classList.contains('active'))) {
                updateDegree('farn');
            }
            e.target.classList.add('active');
            celciusOption.classList.remove('active');
        }
    });
    backgroundOption.addEventListener('change' , (e) => {
        const selectedImg = parseInt(e.target.value);
        const infoArray = [];
        infoArray.push(userIndex,selectedImg);
        localStorage.setItem('background_'+userIndex, JSON.stringify(infoArray));
        setBgImg ('inactive-app');
    });
    savePass.addEventListener('click' , (e) => {
        const passValue = document.querySelector('#pass-choice').value;
        const passResult = document.querySelector('.pass-result');
        if (/^\d{4}$/.test(passValue)) {
            passResult.innerHTML = 
            `
                <div class='success'>Passcode saved!</div>
            `;
            const passArray = [];
            passArray.push(userIndex,passValue);
            localStorage.setItem('pass_'+userIndex, JSON.stringify(passArray));
        }
        else {
            passResult.innerHTML = 
            `
                <div class='error'>Your passcode must be at 4 digits</div>
            `;
        }
    });
    hourFormatChoice.addEventListener('change' , (e) => {
        const selectedHourFormat = hourFormatChoice.value;
        console.log(selectedHourFormat);
        const hourFormatArray = [];
        hourFormatArray.push(userIndex,selectedHourFormat);
        localStorage.setItem('format_'+userIndex, JSON.stringify(hourFormatArray));
        logged ();
    });
    settingBtn.addEventListener('click' , (e) => {
        settingContainer.classList.toggle('active');
    });
    moviesContainer.addEventListener('scroll' , (e) => {
        scroll('movies-nav','latest_movies_container');        
    });
    musicsContainer.addEventListener('scroll' , (e) => {
        scroll('music-nav','musics_container');    
    });
    appContainer.addEventListener('scroll' , (e) => {
        scroll('app-nav','apps_container');
    })
    weatherContainer.addEventListener('scroll' , (e) => {
        scroll('weather-nav','weather_container');
    })
    scroll('movies-nav','latest_movies_container'); 
    scroll('music-nav','musics_container');
    scroll('app-nav','apps_container');
    scroll('weather-nav','weather_container');
}
// Display index page after login
function logged () {
    setBgImg ('inactive-app');
    const date = new Date();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let alarm = hour+1;
    let ampm = '';
    let alarmAMPM = '';
    let localFormat = localStorage.getItem('format_'+userIndex);
    localFormat = JSON.parse(localFormat);
    if (alarm > 24) {
        alarm = 1;
    }
    if (localFormat && (localFormat['0'] === userIndex)) { 
        if (localFormat['1'] === '12') {
            ampm = hour >= 12 ? 'PM' : 'AM';
            alarmAMPM = alarm >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            alarm = alarm % 12;
            if (alarm > 12) {
                alarm = 1;
            }
        }
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (alarm < 10) {
        alarm = '0' + alarm;
    }
    const content =
    `
        <div class='content-container'>
            ${setting()}
            <div class='header_1'>
                <div class='greeting'>
                    Hi, ${getUserName(userIndex)}</div>
                    <div class='time'>${hour}:${minutes} ${ampm}</div>
                    <div class='weather-content'>
                    <i class="fa-solid fa-sun"></i>
                    <div class='degree'>2</div>
                </div>
                <div class='alarm'><i class="fa-regular fa-bell"></i>Call mom<div class='alarm-time'>${alarm}:30 ${alarmAMPM}</div></div>
            </div>
            <div class='header_2'>
                <div class='logout'><i class="lock-btn fa-solid fa-right-to-bracket"></i></div>
            </div>
            <div class='categories'>
                <div class='category' data-category-id = '0'>All</div>
                <div class='category' data-category-id = '1'>Movies</div>
                <div class='category' data-category-id = '2'>Music</div>
                <div class='category' data-category-id = '3'>Delivery</div>
                <div class='category' data-category-id = '4'>Latest news</div>
                <div class='category' data-category-id = '5'>Most used apps</div>
                <div class='category' data-category-id = '6'>Weather</div>
            </div>
            <div class='latest_movies' data-cat-id ='1'>
                <div class='movies-nav nav'>
                    <div class='previous'><i class="fa-solid fa-angle-left"></i></div>
                    <div class='next'><i class="fa-solid fa-angle-right"></i></div>
                </div>
                <h3>Escape into imagination!</h3>
                <div class='latest_movies_container'>
                    ${getMovies()}
                </div>
            </div>
            <div class='musics' data-cat-id ='2'>
                <h3>Feel the rhythm!</h3>
                <div class='music-nav nav'>
                    <div class='previous'><i class="fa-solid fa-angle-left"></i></div>
                    <div class='next'><i class="fa-solid fa-angle-right"></i></div>
                </div>
                <div class='musics_container'>
                    ${getMusics()}
                </div>
            </div>
            <div class='deliveries' data-cat-id ='3'>
                <h3>Delightful culinary experiences!</h3>
                <div class='deliveries_container'>
                    ${getDeliveries()}
                </div>
            </div>
            <div class='news' data-cat-id ='4'>
                <h3>Stay informed always</h3>
                <div class='news_container'>
                    ${getNews()}
                </div>
            </div>
            <div class='used-apps' data-cat-id ='5'>
                <h3>Power in pocket!</h3>
                <div class='app-nav nav'>
                    <div class='previous'><i class="fa-solid fa-angle-left"></i></div>
                    <div class='next'><i class="fa-solid fa-angle-right"></i></div>
                </div>
                <div class='apps_container'>
                    ${getApps()}
                </div>
            </div>
            <div class='Weather' data-cat-id ='6'>
                <div class='weather-head'>
                    <h3>Nature's changing moods</h3>
                    <div class='weather-options'>
                        <div class='celcius active'>C</div>
                        <div class='farenheit'>F</div>
                    </div>
                </div>
                <div class='weather-nav nav'>
                    <div class='previous'><i class="fa-solid fa-angle-left"></i></div>
                    <div class='next'><i class="fa-solid fa-angle-right"></i></div>
                </div>
                <div class='weather_container'>
                    ${getWeather()}
                </div>
            </div>
        <div>
    `;
    rootContent.innerHTML = content;
    loggedListner();
}
// Display sign in if called
function displaySignIn () {
    const signInDIV = 
    `
        <div class='sign-interface'>
            <div class='sign-in'>
                <div class='pin active'><div class='pin-content'></div></div>
                <div class='pin'><div class='pin-content'></div></div>
                <div class='pin'><div class='pin-content'></div></div>
                <div class='pin last'><div class='pin-content'></div></div>
            </div>
            <div class='login-msg'>Passcode: 1234 or 0000 </br>(Or new passcode if changed previously) <a>Cancel</a></div>
            <div class='numbers'>
                <div class='number' data-number-input='1'>1</div>
                <div class='number' data-number-input='2'>2</div>
                <div class='number' data-number-input='3'>3</div>
                <div class='number' data-number-input='4'>4</div>
                <div class='number' data-number-input='5'>5</div>
                <div class='number' data-number-input='6'>6</div>
                <div class='number' data-number-input='7'>7</div>
                <div class='number' data-number-input='8'>8</div>
                <div class='number' data-number-input='9'>9</div>
                <div class='number' data-number-input='0'>0</div>
            </div>
        </div>
    ` ;
    rootContent.innerHTML = signInDIV;
    root.classList.toggle('hidden');
    const pinWidth = document.querySelector('.sign-in').offsetWidth;
    const numbersContainer = document.querySelector('.numbers');
    numbersContainer.style.width = pinWidth;
    const closeBtn = document.querySelector('.login-msg a');
    signIn();
    setBgImg ('inactive');
    closeBtn.addEventListener('click' , () => {
        enteredPin = '';
        window.removeEventListener("keydown", getKey);
        nonLogged();
    });
}
window.addEventListener('load' , () =>{
    checkStatus ();
    let windowWidth = window.innerWidth;
    window.addEventListener('resize' , (e) => {
        if (windowWidth !== window.innerWidth) {
            setTimeout(() => {
                checkStatus ();
            }, 500); 
            windowWidth = window.innerWidth;
        }
    });
});
