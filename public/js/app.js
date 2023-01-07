const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const saveLinkInput = $('.save-link__input');
const saveToMsg = $('#msg');
function ChangeSaveLink(attrName, attrValue) {
    const currentURL = new URL(saveLinkInput.value);

    currentURL.searchParams.set(attrName, attrValue);
    
    saveLinkInput.value = currentURL;
    saveToMsg.value = currentURL;
}

saveLinkInput.value = window.location.href + '#neon';
saveToMsg.value = window.location.href + '#neon';

saveLinkInput.addEventListener('click', () => {
    const copyShow = $('.save-copied');
    saveLinkInput.select();
    document.execCommand('copy');
    copyShow.style.opacity = 1;
    setTimeout(() => {
        copyShow.style.opacity = 0;
    }, 1500);
});

// Navbar
const navMenu = $('#nav__menu');
const navToggle = $('#nav-toggle');
const navClose = $('#nav-close');


// Menu show
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    })
}

// Menu close
if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    })
}

// remove link action
const navLink = $$('.nav__link');

function linkAction() {
    const navMenu = $('#nav__menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(e => e.addEventListener('click', linkAction))

// change bacground header
function scrollHeader() {
    const header = $('#header')
    if(this.scrollY < 40) {
        header.classList.add('scroll-header')
    } else {
        header.classList.remove('scroll-header')
    }
}
scrollHeader();

// Tab items
const tabs = $$('.sign__tab-item')
const panes = $$('.sign__content-pane')

const tabActive = $('.sign__tab-item.active')
const line = $('.sign__line')

line.style.left = tabActive.offsetLeft + 'px'
line.style.width = tabActive.offsetWidth + 'px'

tabs.forEach((tab, index) => {
    const pane = panes[index]
    tab.onclick = function () {
        $('.sign__tab-item.active').classList.remove('active')
        $('.sign__content-pane.active').classList.remove('active')
    
        line.style.left = this.offsetLeft + 'px'
        line.style.width = this.offsetWidth + 'px'
    
        this.classList.add('active')
        pane.classList.add('active')
    }
})

// SWIPER
let swiper = new Swiper('.slideSwipe', {
    slidePerView: 1,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
})

// range scope, drag and move signShow
const scope = $('#sign-range')
const signShow = $('#sign-box')
const textArea = $('#text-area')

window.onload = function () {
    draggable(signShow) // this - is signShow
}

function draggable(el) {
    el.addEventListener('mousedown', function (e) {
        let offsetX = e.clientX - parseInt(window.getComputedStyle(this).left)
                            // this - is signShow (and (el) )
        let offsetY = e.clientY - parseInt(window.getComputedStyle(this).top)

        function mouseMoveHandler(e) {
            el.style.top = (e.clientY - offsetY) + 'px'
            el.style.left = (e.clientX - offsetX) + 'px'
        }

        function reset() {
            window.removeEventListener('mousemove', mouseMoveHandler)
            window.removeEventListener('mouseup', reset)
        }

        window.addEventListener('mousemove', mouseMoveHandler)
        window.addEventListener('mouseup', reset)
    })

    el.addEventListener('touchstart', function(e) {
        e.preventDefault();

        let offsetX = e.touches[0].clientX - parseInt(window.getComputedStyle(this).left)
        let offsetY = e.touches[0].clientY - parseInt(window.getComputedStyle(this).top)

        function mouseMoveHandler(e) {
            el.style.top = (e.touches[0].clientY - offsetY) + 'px'
            el.style.left = (e.touches[0].clientX - offsetX) + 'px'
        }

        function reset() {
            window.removeEventListener('touchmove', mouseMoveHandler)
            window.removeEventListener('touchend', reset)
            window.removeEventListener('touchcancel', reset)
        }
        window.addEventListener('touchmove', mouseMoveHandler)
            window.addEventListener('touchend', reset)
            window.addEventListener('touchcancel', reset)
    })
}

scope.addEventListener('input', function() {
    const size = scope.value
    signShow.style.fontSize = size + 'px'

    ChangeSaveLink('size', size);
})


// text show
textArea.oninput = function(e) {
    const elementShow = e.target.value
    const showedSign = signShow.innerText = elementShow

    if(showedSign) {
        showedSign
    } else {
        signShow.innerText = 'Your Sign'
    }
    
    ChangeSaveLink('text', showedSign);
}


// Font active and change style in sign show
function fontActive(e, fontFamily) {
    const allFonts = $$('.font')

    for(let font of allFonts) {font.classList.remove('active')}

    e.classList.add('active')

    signShow.style.fontFamily = fontFamily

    ChangeSaveLink('font', fontFamily);
}

// Color active and change style color in sign show
const allColors = $$('.light')
function colorActive(e, colorShadow) {

    for(let color of allColors) {
        color.classList.remove('active')
    }

    e.classList.add('active')

    for(let i = 0; i < signShow.classList.length; i++) {
        if(signShow.classList[i].search('ts-' > 0)) {
            signShow.classList.remove(signShow.classList[i])
        }
    }
    signShow.classList.add(colorShadow);

    ChangeSaveLink('color', colorShadow);
}

function validFont(font) {
    const allPossibleFont = [];
    const fonts = document.getElementsByClassName('font');
    for(let i = 0; i < fonts.length; i++) {
        const attrValue = fonts[i].getAttribute('onclick');
        const regex = /('[a-zA-Z]+)/g;
        const className = attrValue.match(regex).join('');
        allPossibleFont.push(className.slice(1));
    }
    return allPossibleFont.includes(font);
}

function validColor(light) {
    const allPossibleClasses = [];
    const lights = document.getElementsByClassName('light');
    for (let i = 0; i < lights.length; i++) {
        const attrValue = lights[i].getAttribute('onclick');
        const regex = /(ts[a-z\-1-9]+)/g;
        const className = attrValue.match(regex).join('');
        allPossibleClasses.push(className);
    }

    return allPossibleClasses.includes(light);
}

function loadLink() {
    const currentURL = new URL(window.location.href);

    const text = currentURL.searchParams.get('text');
    if(text) {
        signShow.innerHTML = text;
    }

    const font = currentURL.searchParams.get('font');
    if(font && validFont(font)) {
        signShow.style.fontFamily = font;
    }

    const color = currentURL.searchParams.get('color');
    if(color && validColor(color)) {
        signShow.classList.add(color);
    }
}
loadLink();


const form = $('#contact-form');

function sendMsg(e) {
    e.preventDefault();
        const fullName = $('#full-name'),
        email = $('#email'),
        msg = $('#msg');
    
    Email.send({
        SecureToken : "eb13f429-6a01-4a19-bd0d-87e0d3eac82f",
        To : 'zquy00@gmail.com',
        From : 'phamhieu07052007@gmail.com',
        Subject : `Od: ${email.value}`,
        Body : `vás email: ${email.value}
                Tel: ${fullName.value}        
                Link:${msg.value}`
    }).then(
      message => alert(message)
    );
}

form.addEventListener('submit', sendMsg);



// scroll up
function scrollUp() {
    const scroll = $('#scroll-up')

    if(this.scrollY >= 400) scroll.classList.add('show-scroll'); else scroll.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)