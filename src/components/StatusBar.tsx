type Props = {
  label: string;
  value: number;
  max: number;
  color: string;
  animate?: boolean;
  damage?: boolean;
};

export default function StatusBar({
  label,
  value,
  max,
  color,
  animate,
  damage,
}: Props) {
  const percent = Math.min(100, (value / max) * 100);

  return (
    <div className="status-bar">
      <span>{label}</span>

      <div className={`bar-bg 
        ${animate ? "heal-animate" : ""}
        ${damage ? "damage-animate" : ""}`}>
        <div
          className="bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <small>
        {value}/{max}
      </small>
    </div>
  );
}
