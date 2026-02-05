import Image from "next/image";

export default function Author({
  className,
  username,
  avartar,
}: {
  className: string;
  username: string;
  avartar: string;
}) {
  return (
      <div className="flex">
        <figure
          className={`${className} relative rounded-full overflow-hidden`}
        >
          <Image src={avartar} alt="" fill />
        </figure>
        <p className="text-[2rem] px-2">{username}</p>
      </div>
  );
}
