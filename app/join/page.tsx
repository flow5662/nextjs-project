'use client'
import React, { useState } from 'react'
//가입하는 페이지
 function Page() {
    const [cust_id,setCustId] = useState("");
    const [cust_pw,setCustPw] = useState("");
    const [cust_name,setCustName] = useState("");
    const [disabled,setDisabled] = useState(false); //빈 값인지 아닌지
   
    
    const handleChangeCustId = (event:React.ChangeEvent<HTMLInputElement>) => setCustId(event.target.value);
    const handleChangeCustPw = (event:React.ChangeEvent<HTMLInputElement>) => setCustPw(event.target.value);
    const handleChangeCustName = (event:React.ChangeEvent<HTMLInputElement>) => setCustName(event.target.value);
   
    const Cust = { //JSON 변환
        cust_id,
        cust_pw,
        cust_name
    }

    async function DuplicationId(){ //중복되는 아이디 가려내기 위한 함수
        try{
            const response = fetch(`http://localhost:8080/api/get/cust_id/${Cust.cust_id}`);
            const result = await (await response).json(); //중복값 boolean타입

            if(result == false){// true인 경우 0개이므로 false로 
                return false;
            } else{
                return true; 
            }
        }catch(error){
            console.error();
            return false;
        }
    }


    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        setDisabled(true); 
        event.preventDefault();

        try{
        /* 중복아이디 */
        const findbyid = await DuplicationId();

        /* 정규표현식 */
        const whitespacePattern = /\s+/g; //공백
        const idlength = /^.{12}$/; //12자를 기준으로
        const koreanPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/; //한글검사
        const pwlength = /^.{20}$/;; //20자 내외로 설정

        if(whitespacePattern.test(Cust.cust_id)||whitespacePattern.test(Cust.cust_pw)||whitespacePattern.test(Cust.cust_name)){
            alert("공백을 포함할 수 없습니다.");
        }
        else if(idlength.test(Cust.cust_id)){
            alert("12자 이하로 설정하세요.");
        }
        else if(koreanPattern.test(Cust.cust_id)){
            alert("영문으로 입력하세요.");
        }
        else if(koreanPattern.test(Cust.cust_pw)){
            alert("영문 및 특수문자, 숫자를 이용하여 입력하세요.");
        }
        else if(pwlength.test(Cust.cust_pw)){
            alert("패스워드의 길이는 20자 이하로 입력하세요.");
        }
        else if(findbyid == false){
            alert("아이디가 중복입니다.");
        }else{

            const response = fetch(
                'http://localhost:8080/api/join',{
                    method: 'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify(Cust)
                })
                setDisabled(false);

                if(!(await response).ok){ //http 200 정상적으로 넘어가지 않을 경우
                    location.reload;
                }else{
                     location.href="/login"; //정상적으로 넘어 갈 경우 login화면으로 이동되게끔 설정한다.
                }
        }

           

               
        }catch(error){
            console.log(error);
        }
    }

  return (
    <div>
        <form encType='multipart/form-data' method='post' onSubmit={handleSubmit}>
       아이디 <input type='text' name='cust_id' onChange={handleChangeCustId}></input>
       비밀번호 <input type='password' name='cust_pw' onChange={handleChangeCustPw}></input>
       이름 <input type='text' name='cust_name' onChange={handleChangeCustName}></input>
        <button type='submit' disabled={disabled}>가입</button>
        </form>

    </div>
  )
}
export default Page
