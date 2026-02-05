"use client";
import HomeContainer from "./_components/HomeContainer";
import HomeHero from "./_components/HomeHero";


export default function Home() {
  // const {query , lastRef} = await getAll()
  return(
    <>
      <HomeHero />
      <HomeContainer />
    </>
  )
}
