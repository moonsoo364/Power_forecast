$(document).ready(function(){
                
    //process클래스안에 a태그에다가 마우스를 갖져다 놓을 때
    $(".process>a").click(function(){
        var sub_menu=$(this).next(".slide_menu");

        //sub_menu가 화면상에 부드럽게 펼치기
        if(sub_menu.is(":visible")){
            //slideUp 화면을 위로 올린다, 화면이 안보이는 기능  
            sub_menu.slideUp();
        }else if(sub_menu.is(":hidden")){
            //slideUp 화면을 아래로 내린다, 화면이 보이는 기능
            sub_menu.slideDown();
            
        }
       
       
    }).mouseover(function(){
        $(this).next(".slide_menu").slideDown();
    });
    
});