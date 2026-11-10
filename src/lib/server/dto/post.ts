import { GeocodeResponse } from "@/types/Geocode";


export interface PostDoc {
  title: string;
  content: string;
  author: { uid: string; displayName: string | null; photoURL: string | null };
  address: GeocodeResponse;       // 지금 쓰는 주소 타입
  view: number;
  likeCount: number;
  imageUrl: string;
  imagePath: string;      // 서버 전용, DTO로 내보내지 않음
  createdAt: number;      // Date.now()
  description?: string;
}

