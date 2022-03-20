const express = require('express');
//csv파일 읽는 라이브러리
const fs = require('fs');
const app = express();
const cors = require('cors');


//Cors요청 에러 처리
app.use(cors())
//css,js,img 폴더 사용
app.use(express.static(__dirname+'/public'));

app.use(express.json())
//8080포트로 읽고 console 로그에 해당 문장을 출력해준다.
app.listen(8080, (err) => {
    if(err) return colosole.log(err);
    console.log('Node.js Server is running on port 8080...')

});

// '/' 주소에 표시되는 문자, index.html 불러오기
app.get('/', (req, res)=>{

    console.log("index.html loading");
    res.sendFile(__dirname + '/index.html');
   

});


app.get('/lab_explain', (req, res)=>{
    console.log("lab_explain.html loading");
    res.sendFile(__dirname + '/lab_explain.html');
});

app.get('/deep_learning_model', (req, res)=>{
    console.log("deep_learning_model.html loading");

    res.sendFile(__dirname + '/deep_learning_model.html');
    
});

app.get('/data_preprocessing', (req, res)=>{
    console.log("data_preprocessing.html loading");
    res.sendFile(__dirname + '/data_preprocessing.html');
});

app.get('/graph_predict', (req, res)=>{
    console.log("graph_predict.html loading");
    res.sendFile(__dirname + '/graph_predict.html');
});


app.get('/reference', (req, res)=>{
    console.log("reference.html loading");
    res.sendFile(__dirname + '/reference.html');
});

  app.get('/button', (req, res)=>{
    //respond(csv 파일 배열 값)을 button.js에 파일을 넘겨준다.
    res.sendFile(__dirname + '/button.js');
})

app.post('/lstm', (req, res)=>{
    //let은 재선언 불가능하고 재할당이 가능한 함수 
    let array = [];
    //Data 디렉토리에 '숫자'm.csv 파일을 utf-8형식으로 안에 데이터를 읽는다.
    fs.readFile(`./Data_LSTM/${Number(req.body.month)}m.csv`, "utf-8", (err, data)=>{
        //숫자,날짜,예측값,실제값으로 한 줄씩 읽는다.
        array = data.split(/\r\n|\n/).map((value)=>{
            //배열 초기화
            let jsondata = {
                index : '',
                date : '',
                pre : '',
                real : '',
            }
            let indata = [];
            let instdata = value.split(',');
          
            
            jsondata.index = instdata[0];
           
            if(instdata[1].length === 12 ){    
                
                   
                indata = instdata[1].substring(0, 11);
                                    
                indata += '0'+instdata[1][11];          
                jsondata.date = indata;
            }else{
                jsondata.date = instdata[1];
            }

            jsondata.pre = instdata[2];
            jsondata.real = instdata[3];
            
            return jsondata
        })  
       
        res.send(array);
        console.table(array);
    })

})

app.post('/cnn', (req, res)=>{
    //let은 재선언 불가능하고 재할당이 가능한 함수 
    let array = [];
    //Data 디렉토리에 '숫자'm.csv 파일을 utf-8형식으로 안에 데이터를 읽는다.
    fs.readFile(`./Data_CNN+LSTM/${Number(req.body.month)}m.csv`, "utf-8", (err, data)=>{
        //숫자,날짜,예측값,실제값으로 한 줄씩 읽는다.
        array = data.split(/\r\n|\n/).map((value)=>{
            //배열 초기화
            let jsondata = {
                index : '',
                date : '',
                pre : '',
                real : '',
            }
            let indata = [];
            let instdata = value.split(',');
            //index는 instdata의 첫번째 배열
            jsondata.index = instdata[0];
            // 날짜가 12자리 수 일 때 예외처리
            if(instdata[1].length === 12 ){    
                //substring(start,end), 문자열 start위치 부터 end전 까지 문자열 가지고옴
                //ex)2016-01-01-5 에서 첫 번째 value인 '2'부터 열 두 번째 value인 '5'까지 배열에서 가지고옴        
                indata = instdata[1].substring(0, 11);
                //instdata[2,0,1,6,-,0,1,-,0,1,-,5] 을 instsdata[0,2,0,1,6,-,0,1,-,0,1,-,5]로 수정 한다.                          
                indata += '0'+instdata[1][11];
                jsondata.date = indata;
            }else{
                jsondata.date = instdata[1];
            }
            //예측값은 3번째 인덱스
            jsondata.pre = instdata[2];
             //실제값은 3번째 인덱스
            jsondata.real = instdata[3];
            //csv파일에서 읽어온 jsondata 반환
            return jsondata
        })
        //콘솔에 jsondata로 불러온 데이터 출력
        
        //respond에 array(csv 파일 배열 값)을 넣는다
        res.send(array);
        console.table(array);
    })

})


