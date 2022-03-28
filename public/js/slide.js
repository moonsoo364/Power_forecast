function navigate(y){
window.scroll({
    top:document.querySelector(y).offsetTop,
    left: 0,
    behavior: 'smooth'
});
}