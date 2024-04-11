'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
function Page() {

    const [cust_id,setCustId] = useState("");
    const [cust_pw,setCustPw] = useState("");
    const [disabled,setDisabled] = useState(false); //빈 값인지 아닌지
 
    const handleChangeCustId = (event:React.ChangeEvent<HTMLInputElement>) => setCustId(event.target.value);
    const handleChangeCustPw = (event:React.ChangeEvent<HTMLInputElement>) => setCustPw(event.target.value);

    const Login = { //JSON으로 변환하기 위한 변수
        cust_id,
        cust_pw
    }

    /* 토큰 발급 api */
    async function CreateToken(){ 
        console.log(cust_id);
        try {
            const response = await fetch(`http://localhost:8080/api/create/token?subject=${cust_id}`)
            const token = await response.json();
            console.log(token.result); //토큰 값 반환되는지 확인

            localStorage.setItem("token",token.result); //토큰을 로컬 스토리지에 저장
        } catch (error) {
            console.log(error);
        }
    }


    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        setDisabled(true); 
        event.preventDefault();


        try{
            const response = await fetch(
                'http://localhost:8080/api/login',{
                    method:'POST',
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(Login)
                    })
                    if((await (await response).text()).toString() == "true"){ //반환한 값이 true일 경우(boolean형태로 반환)
                        setDisabled(false);
                        CreateToken(); //정상적으로 true라면 토큰발급

                       location.href="/"; //목록화면으로 이동되게끔
                    }else{ //로그인 실패 시
                        console.log("false");
                        alert("아이디 및 비밀번호가 일치하지 않습니다.");
                        location.href="/login";
                    }
    

        }catch(error){
            console.log(error);
        }
    }
 
    return (
    <div>
        <form encType='multipart/form-data' method='post' onSubmit={handleSubmit}>
            <input type='text' name='cust_id' onChange={handleChangeCustId}/>
            <input type='password' name='cust_pw' onChange={handleChangeCustPw}/>
            <button type='submit' disabled={disabled}>로그인</button>
        </form>
        <Link href={'/join'}>회원가입</Link>
    </div>
  )
}

export default Page