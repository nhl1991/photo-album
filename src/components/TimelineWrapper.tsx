export default function TimelineWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  //className="m-4 grid grid-cols-[repeat(1,minmax(300px,450px))] md:grid-cols-[repeat(4,minmax(200px,300px))] 2xl:grid-cols-[repeat(6,minmax(300px,450px))] 4k:grid-cols-[repeat(8,minmax(300px,450px))] grid-rows-[repeat(2,minmax(300px,1fr))] md:grid-rows-[repeat(2,minmax(300px,1fr))] md:auto-rows-[minmax(300px,250px)] auto-rows-[minmax(300px,1fr)] md:gap-4 gap-y-4 "
  return (

      <main className="max-w-[1920px]   w-screen min-h-[720px] grid grid-cols-[repeat(2,minmax(160px,1fr))] grid-rows-[repeaet(4,minmax(160px,160px))] md:grid-cols-[repeat(4,minmax(320px,640px))] auto-rows-[min(160px)] md:grid-rows-[repeat(2,minmax(320px,480px))]  md:auto-rows-[minmax(320px,480px)] gap-0.5 md:gap-2 p-4">
        {children}
      </main>

  );
}
