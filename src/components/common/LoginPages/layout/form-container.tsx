// import { LanguageDropdown } from "@/components/common/localization/language-dropdown";
import { FormContainerProps } from "@/types/loginTypes";
import { LoginImage } from "@/assets/svgs";
// import { SsdcLogo_Login } from "@/assets/svgs";

export function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="w-screen bg-white">
      <div className="relative p-16 flex flex-col w-full items-center justify-center">
        <img src={LoginImage} alt="logo" width={80} height={80} />
      </div>
      
      <div className="relative flex w-full items-center justify-center text-neutral-600">
        {/* <LanguageDropdown /> */}
        <div className="w-[500px] items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
