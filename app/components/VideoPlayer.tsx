"use client";

import { useRef } from "react";

export default function VideoPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <video
      ref={ref}
      src={src}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
      onMouseOver={() => ref.current?.play()}
      onMouseOut={() => ref.current?.pause()}
    />
  );
}
