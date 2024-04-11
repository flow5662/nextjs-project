'use client'
import Image from 'next/image'
import Link from 'next/link';
import { SetStateAction, useEffect, useState } from 'react';

interface Game{
  id: number;
  pw:string;
  title: string;
  text:string;
  image:string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true); //Lodding시간이 있어서 check용.
  const [games, setGames] = useState<Game[]>([]);

  /* 페이징 셋팅 */
  const [page, setPage] = useState(0);
  const size = 10; //기본적으로 10개 페이징
  const [count,setCount] = useState(0);

  function logout(){
    localStorage.clear();
    location.href='/login';
  }


 



  useEffect(() => {
    async function findList(){
    

      try {
        setIsLoading(true);
        /* 페이지 카운팅*/
        const countResponse = fetch('http://localhost:8080/api/count');
        const cr = await (await countResponse).json();
        setCount(cr); //전체 값 저장
      
       //전체 페이지수
        const totalPage = Math.ceil(count/size);
       
        
        console.log("count:"+count);
        console.log("size:"+size);
        console.log("total"+totalPage);
        
        /* 실제 값 가져오기 */
        const res = await fetch(`http://localhost:8080/api/page?page=${page}&size=${size}`,{cache: 'no-store'}); //개체 저장하지 않고 캐시 설정.
        setGames(await res.json());
        console.log(localStorage.getItem("token"));
        if(localStorage.getItem("token") == null || localStorage.getItem("token") == ""){
          location.href="/login";
        }

      } catch (error) {
        console.log("error--"+error);
      }
      finally{setIsLoading(false);}
    };
      findList();
  }, [count,page]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(count / size);

     // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: Math.ceil(count / size) }, (_, i) => i + 1);

    // 페이지 이동 함수
    const handlePageChange = (pageNumber: SetStateAction<number>) => {
      setPage(pageNumber);
    };


  return (
  <div>
    <Link href={"games"}>게시글 작성</Link>
    <button onClick={logout}>로그아웃</button>
    {games.map((game) => 
    <div key={game.id}>

      <Link href={
      {
        pathname: '/games/post', 
        query:{id:`${game.id}`} //해당 경로로 값을 보냄
      }
      }
     >{game.title}<br/>
      <Image
                src={`data:image/png;base64, ${game.image}`} //`${data}` 이런 식으로 
                alt="Game Image"
                width={100}
                height={100}
              />
     </Link> 
    
      </div> 
    )}


   {/* 페이지 링크 생성 */}
   <div>
        {/* 이전 페이지로 이동하는 버튼 */}
        <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
          이전
        </button>

        {/* 페이지 번호 출력 */}
        {pageNumbers.map((pageNumber) => (
          <a key={pageNumber} onClick={() => handlePageChange(pageNumber - 1)}>
            [{pageNumber}]
          </a>
        ))}

        {/* 다음 페이지로 이동하는 버튼 */}
        <button disabled={page === Math.ceil(count / size) - 1} onClick={() => handlePageChange(page + 1)}>
          다음
        </button>
      </div>
  </div> 
  )
}
