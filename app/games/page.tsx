'use client'
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { FormEvent } from 'react'
// Types
interface FileData {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}


function Page() {

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<FileData | null>(null);
  const [disabled,setDisabled] = useState(false);

  const handleChangeTitle = (event:React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  //event 자체가 안됨, ChangeEventHandler도 안됨, ChangeEvent로 변경
  const handleChangeText = (event:React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);
  const handleChangeFile = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const imageFile = event.target.files[0];
      setFile(imageFile);
    }
  };


  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    setDisabled(true);
    event.preventDefault();
  


    //formData를 사용하여 값을 넣어주자.(Json 제외)
    const formData = new FormData(event.currentTarget);
    //event.currentTarget 자체에 알아서 값이 넣어짐...
    // FormData 빈 값으로 넣을 시 에러 발생, event.currentTarget에서 자동으로 값이 넘어감!

    // formData.append("pw",pw);
    // formData.append("title",title);
    // formData.append("text",text);
    //formData.append("file",Memo.file); 

    //alert('title:'+title); //정상적으로 submit 확인!
    //alert('json:'+JSON.stringify(Memo));
  //  console.log(formData.get("title")); 

   console.log(formData.getAll("title"));
   //배열 2개로 저장되는 이슈
    try {
      const response =  fetch(
      'http://localhost:8080/api/insert',{
        method: 'POST',
        body: formData,
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        setDisabled(false);
        location.href="/";
    } catch (error) {
      console.error(error);
    }
    
  }

  return (
    
    <form encType="multipart/form-data" method="post" name="fileinfo" onSubmit={handleSubmit}> 
    썸네일<input type='file' name='file' onChange={handleChangeFile} ></input><br/>
    제목<input type='text' name='title' onChange={handleChangeTitle} required></input><br/>
    내용<input type='text' name='text' onChange={handleChangeText}></input><br/>
    <button type='submit' disabled={disabled}>등록</button>
    </form>

  )
}

export default Page
