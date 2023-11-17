'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'



export default function Userpage() { 
    
     //버전 문제로 router 사용 시 에러. usesearchParams 대체함. (navigation도 동일한 에러)
     const searchParams = useSearchParams()
     const id = searchParams.get('id') //url로 가져온 값은 정상적으로 잘 가져와짐.
   
     const [data, setData] = useState<any>(null); //any 타입을 넣어서 ossibly 'null'.ts(18047) 에러 발생 막아줌
     const [isLoading, setIsLoading] = useState(true); //Lodding시간이 있어서 check용.

     //async / await 비동기 처리를 바로 사용할때 사용하기 위함
     //즉시 실행 함수

    useEffect(() => { //비동기식
     async function fetchData() { //그냥 function에 async하게되면 'use client'에러 발생
        try {
        setIsLoading(true);
        const res =  await fetch(`http://54.180.116.37:8080/api/${id}`) //개체 저장하지 않고 캐시 설정.
        const json_data = await res.json();
        console.log(json_data);
        setData(json_data); //저장
        
        } catch (error) {
            console.log(error);   
        }
        finally{setIsLoading(false);}
        };
        fetchData(); //함수 호출
    }, []);

    const [pw,setPw] = useState(""); //pw 기본 셋팅
    const handleChangePw = (event:React.ChangeEvent<HTMLInputElement>) =>setPw(event.target.value);
    //input password 값 pw 값에 넣기
    function CheckPW(){ //pw 체크 함수 onClick
        if(pw != ''){
            if(pw == data.pw){
                location.href=`/games/corr?id=${id}`
            }else{
                alert("비밀번호가 일치하지 않습니다.");
            }
        }else{
           alert("비밀번호를 입력해주세요."); 
        }
    }

    function Delete(){
        if(pw != ''){
            if(pw == data.pw){
            fetch(`http://54.180.116.37:8080/api/delete/${id}`,{
                method: 'DELETE'
            });
               alert("삭제되었습니다.");
               location.href='/' //목록화면으로 되돌아옴
            }else{
                alert("비밀번호가 일치하지 않습니다.");
            }
        }else{
           alert("비밀번호를 입력해주세요."); 
        }
    }


    if(isLoading)return(<h1>Lodding</h1>) //걸리는 시간이 있기 때문에 로딩 필요

  return (
   <div>
   <h6>
  
    <img src={`data:image/png;base64, ${data.image}`}
                alt="Game Image"
                width={100}
                height={100}/>
    제목: {data.title}<br/>
    내용: {data.text}<br/>
    비밀번호<input type='password' onChange={handleChangePw}></input>

    <button onClick={CheckPW}>수정하기</button>
    <button onClick={Delete}>삭제하기</button>
   </h6>


   </div>
  )
}

