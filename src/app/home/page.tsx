"use client";
import PhotoPost from "@/components/common/PhotoPost";
import PostsWrapper from "@/components/common/ui/PostsWrapper";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { unauthorized } from "next/navigation";
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
