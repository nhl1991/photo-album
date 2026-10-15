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
      <div className="flex items-center gap-3">
        <figure
          className={`${className} relative shrink-0 rounded-full overflow-hidden bg-line`}
        >
          <Image src={avartar} alt="" fill  sizes="5vw"/>
        </figure>
        <p className="text-sm font-medium text-ink">{username}</p>
      </div>
  );
}
