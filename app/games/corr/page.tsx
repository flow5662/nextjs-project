'use client'
import { File } from 'buffer';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

// Types
interface FileData {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

function Corrpage() {

     //버전 문제로 router 사용 시 에러. usesearchParams 대체함. (navigation도 동일한 에러)
     const searchParams = useSearchParams();
     const id = searchParams.get('id'); //url로 가져온 값은 정상적으로 잘 가져와짐.
    
     const [data, setData] = useState<any>(null); //any 타입을 넣어서 ossibly 'null'.ts(18047) 에러 발생 막아줌
     const [isLoading, setIsLoading] = useState(true); //Lodding시간이 있어서 check용.


    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState<FileData | null>(null);
    const [disabled,setDisabled] = useState(false); //빈 값인지 아닌지

       //event 자체가 안됨, ChangeEventHandler도 안됨, ChangeEvent로 변경
    const handleChangeTitle = (event:React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
    const handleChangeText = (event:React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);
  const handleChangeFile = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const imageFile = event.target.files[0];
      setFile(imageFile);
    }
  };

    useEffect(() => { //비동기식
        async function fetchData() { //그냥 function에 async하게되면 'use client'에러 발생
           try {
           setIsLoading(true);
           const res =  await fetch(`http://localhost:8080/api/${id}`) //개체 저장하지 않고 캐시 설정.
           const json_data = await res.json();
           console.log(json_data);
           setData(json_data); //저장

           setTitle(json_data.title); // setText(json_data.text);초기 value 저장
          

           } catch (error) {
               console.log("error--"+error);    
           }
           finally{setIsLoading(false);}
           };
           fetchData(); //함수 호출
       }, []);
       
       

    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => { //FormEvnet
        setDisabled(true);
        event.preventDefault();

        const formdata = new FormData(event.currentTarget);
        formdata.append("id",data.id);
        console.log(data.image);

        console.log(formdata.getAll("id"));
        console.log(formdata.getAll("file"));
        console.log(formdata.getAll("title"));
        console.log(formdata.getAll("text"));
        try { //update 하는 await fatch문
        const response = await fetch(`http://localhost:8080/api/update/${id}`,{
          method: 'PUT',
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formdata
          })
          setDisabled(false);
          window.location.href="/";
      } catch (error) {
        console.error(error);
      }
    }
       function MainPage(){ //이전 페이지로 돌아가는 function
        location.href='/';
       }

       if(isLoading)return(<h1>Lodding</h1>) //걸리는 시간이 있기 때문에 로딩 필요
       //defaultValue로 해야 값이 변경 가능.그냥 value로 할 경우 리액트에서 read-only로 동작이 안되는 모양이다.
  return (
    
    <form onSubmit={handleSubmit}>
      <img src={`data:image/png;base64, ${data.image}`}
                alt="Game Image"
                width={100}
                height={100}/>
    썸네일<input type='file' name='file' onChange={handleChangeFile}></input><br/>
    제목<input type='text' name='title' onChange={handleChangeTitle} defaultValue={data.title} required></input><br/>
    내용<input type='text' name='text' onChange={handleChangeText} defaultValue={data.text}></input><br/>
    <button type='button' onClick={MainPage}>이전</button><p/>
    <button type='submit'>등록</button>
    </form>


  )
}

export default Corrpage
