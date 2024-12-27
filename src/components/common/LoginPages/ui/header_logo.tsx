import { LoginImage } from "@/assets/svgs"; // Add the logo here

export default function HeaderLogo() {
  return (
    <div>
    <div className=" flex flex-col w-full items-center justify-center" style={{ padding: '6%' }}>
      <img src={LoginImage} alt="logo" style={{ width: '22vw', height: '22vh' }} />
    </div>
    </div>
  );
}
