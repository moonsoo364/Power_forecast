const toggleBtn=document.querySelector('.navbar_togleBtn');
const menu=document.querySelector('.navbar_menu');


toggleBtn.addEventListener('click',() =>{
    menu.classList.toggle('active');
   
});

