"use client"
// import Image from "next/image";
import Container from "@/components/common/ui/Container";

export default function HomeHero(){


    return(
        <Container>
            <section className="relative overflow-hidden border-b border-line pb-12 pt-12 md:pb-16 md:pt-16">
                {/* Hero image slot — enable once the image asset is ready. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] md:block"
                >
                    {/* <Image
                        src="/images/hero.jpg"
                        alt=""
                        fill
                        priority
                        sizes="55vw"
                        className="object-cover object-right opacity-90 [mask-image:linear-gradient(to_right,transparent,black_45%)] dark:opacity-50"
                    /> */}
                </div>
                <div className="relative max-w-3xl">
                    <p className="eyebrow">Captured by real people</p>
                    <h1 className="mt-4 font-serif text-[clamp(3rem,1.6rem+4.4vw,5.75rem)] leading-[0.95] tracking-tight text-ink">
                        Explore <span className="text-accent">moments.</span>
                    </h1>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
                        A space for everyday moments and extraordinary places.
                        Discover photos from around the world.
                    </p>
                </div>
            </section>
        </Container>
    )
}
