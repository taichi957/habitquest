import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function PhoneFrame({ children }: Props) {
  
  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        {children}
      </div>
    </div>
  );
}
