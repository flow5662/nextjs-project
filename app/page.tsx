import Image from 'next/image'
import Link from 'next/link'
import { NextResponse } from 'next/server';
import { Route } from 'next';
import AppRouter from 'next/dist/client/components/app-router';
import { Router } from 'next/router';

interface Game{
  id: number;
  pw:string;
  title: string;
  text:string;
  image:string;
}

export default  async function Home() {
  const res = await fetch('http://54.180.116.37:8080/api',{cache: 'no-store'}) //개체 저장하지 않고 캐시 설정.
  const games: Game[] = await res.json();
  
  

  return (
  <div>
    <Link href={"games"}>게시글 작성</Link>
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
                src={`data:image/png;base64, ${game.image}`}
                alt="Game Image"
                width={100}
                height={100}
              />
     </Link>
      </div> 
    )}
  </div> 
  )
}
