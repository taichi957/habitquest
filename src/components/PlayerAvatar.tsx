type Props = {
  src: string;
  size?: number;
  className?: string;
};

export default function PlayerAvatar({ src, size = 48, className = "" }: Props) {
  return (
    <img
      src={src}
      alt="avatar"
      className={className}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        borderRadius: 8,
        border: "2px solid #222",
      }}
    />
  );
}
