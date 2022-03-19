'use strict'

//strict mode: 실수를 에러로 변환, 기본 모드에서는
// 오류를 어느정도 무시하고 넘어가지만 나중에 심각한 버그를 만들게된다
// strict모드는 이러한 실수를 에러로 변환하여 즉시 수정할 수 있게 합니다.

let global_array = [];
//창이 로딩 됬을 때 id가 month인 값을 가지고 온다.
//처음 로딩 될 때 LSTM 차트
window.addEventListener('load', ()=>{
  document.getElementById('month').value = "1";
  fetch(`http://localhost:8080/lstm`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //stringify:객체를 json 문자열로 반환
      //문서에서 id가 month인 값을 json형식으로 반환한다. 
      body: JSON.stringify({"month" : document.getElementById('month').value})

    })
    .then((res)=>{
      //respond(csv 배열 값)을 json형태로 반환한다.
        return res.json();
    })
    //dataa=res=csv배열 값??
    .then((dataa)=>{
      global_array = dataa;


            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(chartLoadCallback);
            function chartLoadCallback(){
    
              drawChart();
              window.onresize=function(event) {drawChart();};
            }
    

            function drawChart()
            {
              let realdata = [];
              var chartData=[
                ['날짜','실제 전력값','예측 전력값'],
              ];
              //1m.csv일 경우 dataa=[[0,2016-01-01-1,0.0909069777,0.00985964505], .... [742,	2016-01-31-23,	0.117353901,	0.012643545]]
              //i=index number 742번까지 반복
            for(let i=0; i<dataa.length; i++){
              realdata = [];
              //[new Date(2016, 01, 01, 1, 1),0.179952,	0.315392646]
              //new Date(2016년,month value값의 1을 뺀값,slice(8,10)=2016-01(-01)-1,slice(11)=2016-01-01(-1))
              realdata.push(new Date(2016, document.getElementById('month').value-1, dataa[i].date.slice(8, 10), dataa[i].date.slice(11)));
              realdata.push(Number(dataa[i].real));
              realdata.push(Number(dataa[i].pre));
             
              chartData.push(realdata);
            }
             //모든 값을 콘솔에 출력
            console.log(chartData)
            //chartdata=['날짜','실제 전력값','예측 전력값'],[2016-01-01-1,0.179952,0.315392646]], ...[742,	2016-01-31-23,	0.117353901,	0.012643545]
            //가 담기게 됨
            
          
            var dataTable=google.visualization.arrayToDataTable(chartData);
            
            var options={
              
              'title':document.getElementById('month').value+' 월의 LSTM 모델로 1시간 단위로 예측한 그래프',

              "legend": {"position":'bottom'},
              "chartArea": {'width': '90%', 'height':'50%'},
              //selectionMode:여러 점을 같이 선택함
              "selectionMode":'multiple',
              //tooltip:점 표시한 전력값 전부 화면에 표시해줌
              "tooltip":{"trigger":'both'},
              "aggreationTarget":'none',
              "focusTarget":"category",
              //explorer: 마우스 왼쪽으로 영역 선택하면 확대 마우스 오른쪽 버튼 누르면 원래 영역으로
              "explorer":{
                "axis":'horizontal',
                "actions":['dragToZoom','rightClickToReset']
              },
              //crosshar: 클릭하면 해당점에 선을 그어줌
              "crosshair":{
                "trigger":"both",
                "orientation":'vertical'
              },
              
               width: '100%',
               height: $(window).height()*0.3,   
              hAxis: {
                gridlines: {
                  units: {
                    days: {format: ['dd일']},
                    hours: {format: ['HH', 'ha']},
                    
                  }
                },
                minorGridlines: {
                  units: {
                    hours: {format: ['hh a', 'ha']},
                    minutes: {format: ['HH a Z', ':mm']},
                   
                  }
                }
               
                
                
              },
              colors: ['#2D9FF1', '#E22A2A' ]
              
            };
            var chart=new google.visualization.LineChart(document.getElementById('lstm_chart'));
            chart.draw(dataTable,options);
    
            }
    



    })
})
//월 바뀔 때 LSTM 차트

document.getElementById('month').addEventListener('change', ()=>{
  //문서에서 id가 month인 값이 12보다 같거나작고 1보다 같거나 클 때
  if( document.getElementById('month').value <= 12 && document.getElementById('month').value >= 1 ){
    fetch(`http://localhost:8080/lstm`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"month" : document.getElementById('month').value})
    })
    .then((res)=>{
        return res.json();
    })
    .then((dataa)=>{
      global_array = dataa;

            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(chartLoadCallback);
            function chartLoadCallback(){
    
              drawChart();
              window.onresize=function(event) {drawChart();};
    
            }
    

            function drawChart()
            {
              let realdata = [];
              var chartData=[
                ['날짜','실제 전력값','예측 전력값'],
              ];
            for(let i=0; i<dataa.length; i++){
              realdata = [];
              realdata.push(new Date(2016, document.getElementById('month').value-1, dataa[i].date.slice(8, 10), dataa[i].date.slice(11)));
              realdata.push(Number(dataa[i].real));
              realdata.push(Number(dataa[i].pre));
              chartData.push(realdata);
            }
            console.log(chartData)
            
            var dataTable=google.visualization.arrayToDataTable(chartData);
    
            var options={
              'title':document.getElementById('month').value+' 월의 LSTM 모델로 1시간 단위로 예측한 그래프',
              "legend": {"position":'bottom'},
              "chartArea": {'width': '90%', 'height':'50%'},
              //selectionMode:여러 점을 같이 선택함
              "selectionMode":'multiple',
              //tooltip:점 표시한 전력값 전부 화면에 표시해줌
              "tooltip":{"trigger":'both'},
              "aggreationTarget":'none',
              "focusTarget":"category",
              //explorer: 마우스 왼쪽으로 영역 선택하면 확대 마우스 오른쪽 버튼 누르면 원래 영역으로
              "explorer":{
                "axis":'horizontal',
                "actions":['dragToZoom','rightClickToReset']
              },
              //crosshar: 클릭하면 해당점에 선을 그어줌
              "crosshair":{
                "trigger":"both",
                "orientation":'vertical'
              },
              width: '100%',
              height: $(window).height()*0.3,  
              hAxis: {
                gridlines: {
                  units: {
                    days: {format: ['dd일']},
                    hours: {format: ['HH', 'ha']},
                    
                  }
                },
                minorGridlines: {
                  units: {
                    hours: {format: ['hh a', 'ha']},
                    minutes: {format: ['HH a Z', ':mm']},
                   
                  }
                }
              },
              colors: ['#2D9FF1', '#E22A2A' ]
              
              
              
    
            };
            var chart=new google.visualization.LineChart(document.getElementById('lstm_chart'));
            chart.draw(dataTable,options);
    
            }
    })
  }else {
    alert("달 범위를 확인하세요!");
  }
})

//처음 로딩 될 때 CNN+LSTM 차트 
window.addEventListener('load', ()=>{
  document.getElementById('month').value = "1";
  fetch(`http://localhost:8080/cnn`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //stringify:객체를 json 문자열로 반환
      //문서에서 id가 month인 값을 json형식으로 반환한다. 
      body: JSON.stringify({"month" : document.getElementById('month').value})

    })
    .then((res)=>{
      //respond(csv 배열 값)을 json형태로 반환한다.
        return res.json();
    })
    //dataa=res=csv배열 값??
    .then((dataa)=>{
      global_array = dataa;


            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(chartLoadCallback);
            function chartLoadCallback(){
    
              drawChart();
              window.onresize=function(event) {drawChart();};
            }
    

            function drawChart()
            {
              let realdata = [];
              var chartData=[
                ['날짜','실제 전력값','예측 전력값'],
              ];
              //1m.csv일 경우 dataa=[[0,2016-01-01-1,0.0909069777,0.00985964505], .... [742,	2016-01-31-23,	0.117353901,	0.012643545]]
              //i=index number 742번까지 반복
            for(let i=0; i<dataa.length; i++){
              realdata = [];
              //[new Date(2016, 01, 01, 1, 1),0.179952,	0.315392646]
              //new Date(2016년,month value값의 1을 뺀값,slice(8,10)=2016-01(-01)-1,slice(11)=2016-01-01(-1))
              realdata.push(new Date(2016, document.getElementById('month').value-1, dataa[i].date.slice(8, 10), dataa[i].date.slice(11)));
              realdata.push(Number(dataa[i].real));
              realdata.push(Number(dataa[i].pre));
             
              chartData.push(realdata);
            }
             //모든 값을 콘솔에 출력
            console.log(chartData)
            //chartdata=['날짜','실제 전력값','예측 전력값'],[2016-01-01-1,0.179952,0.315392646]], ...[742,	2016-01-31-23,	0.117353901,	0.012643545]
            //가 담기게 됨
            
          
            var dataTable=google.visualization.arrayToDataTable(chartData);
            
            var options={
              
              'title':document.getElementById('month').value+' 월의 LSTM+CNN 모델로 1시간 단위로 예측한 그래프',
              "legend": {"position":'bottom'},
              "chartArea": {'width': '90%', 'height':'50%'},
              //selectionMode:여러 점을 같이 선택함
              "selectionMode":'multiple',
              //tooltip:점 표시한 전력값 전부 화면에 표시해줌
              "tooltip":{"trigger":'both'},
              "aggreationTarget":'none',
              "focusTarget":"category",
              //explorer: 마우스 왼쪽으로 영역 선택하면 확대 마우스 오른쪽 버튼 누르면 원래 영역으로
              "explorer":{
                "axis":'horizontal',
                "actions":['dragToZoom','rightClickToReset']
              },
              //crosshar: 클릭하면 해당점에 선을 그어줌
              "crosshair":{
                "trigger":"both",
                "orientation":'vertical'
              },
              
               width: '100%',
               height: $(window).height()*0.3,   
              hAxis: {
                gridlines: {
                  units: {
                    days: {format: ['dd일']},
                    hours: {format: ['HH', 'ha']},
                    
                  }
                },
                minorGridlines: {
                  units: {
                    hours: {format: ['hh a', 'ha']},
                    minutes: {format: ['HH a Z', ':mm']},
                   
                  }
                }
               
                
                
              },
              colors: ['#351C6C',  '#6DCE21']
              
            };
            var chart=new google.visualization.LineChart(document.getElementById('cnn_chart'));
            chart.draw(dataTable,options);
    
            }
    



    })
})
//월 바뀔 때 CNN+LSTM 차트
document.getElementById('month').addEventListener('change', ()=>{
  //문서에서 id가 month인 값이 12보다 같거나작고 1보다 같거나 클 때
  if( document.getElementById('month').value <= 12 && document.getElementById('month').value >= 1 ){
    fetch(`http://localhost:8080/cnn`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"month" : document.getElementById('month').value})
    })
    .then((res)=>{
        return res.json();
    })
    .then((dataa)=>{
      global_array = dataa;

            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(chartLoadCallback);
            function chartLoadCallback(){
    
              drawChart();
              window.onresize=function(event) {drawChart();};
    
            }
    

            function drawChart()
            {
              let realdata = [];
              var chartData=[
                ['날짜','실제 전력값','예측 전력값'],
              ];
            for(let i=0; i<dataa.length; i++){
              realdata = [];
              realdata.push(new Date(2016, document.getElementById('month').value-1, dataa[i].date.slice(8, 10), dataa[i].date.slice(11)));
              realdata.push(Number(dataa[i].real));
              realdata.push(Number(dataa[i].pre));
              chartData.push(realdata);
            }
            console.log(chartData)
            
            var dataTable=google.visualization.arrayToDataTable(chartData);
    
            var options={
              'title':document.getElementById('month').value+' 월의 LSTM+CNN 모델로 1시간 단위로 예측한 그래프',
              "legend": {"position":'bottom'},
              "chartArea": {'width': '90%', 'height':'50%'},
              //selectionMode:여러 점을 같이 선택함
              "selectionMode":'multiple',
              //tooltip:점 표시한 전력값 전부 화면에 표시해줌
              "tooltip":{"trigger":'both'},
              "aggreationTarget":'none',
              "focusTarget":"category",
              //explorer: 마우스 왼쪽으로 영역 선택하면 확대 마우스 오른쪽 버튼 누르면 원래 영역으로
              "explorer":{
                "axis":'horizontal',
                "actions":['dragToZoom','rightClickToReset']
              },
              //crosshar: 클릭하면 해당점에 선을 그어줌
              "crosshair":{
                "trigger":"both",
                "orientation":'vertical'
              },
              width: '100%',
              height: $(window).height()*0.3,  
              hAxis: {
                gridlines: {
                  units: {
                    days: {format: ['dd일']},
                    hours: {format: ['HH', 'ha']},
                    
                  }
                },
                minorGridlines: {
                  units: {
                    hours: {format: ['hh a', 'ha']},
                    minutes: {format: ['HH a Z', ':mm']},
                   
                  }
                }
              },
              colors: ['#03FF4A',  '#FF6D03']
              
              
              

            };
            var chart=new google.visualization.LineChart(document.getElementById('cnn_chart'));
            chart.draw(dataTable,options);
    
            }
    })
  }else {
    alert("달 범위를 확인하세요!");
  }
})





