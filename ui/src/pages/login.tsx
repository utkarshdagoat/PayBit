import LoginCard from "@/components/auth/login-card";
import styles from "./pages.module.css";
import logo from "@/assets/logo.svg";

export default function Login() {
  return (
    <>
      <div className={`${styles.checkerboard_bg}`}>
        <div className="h-screen w-full bg-black/40 flex items-center justify-center">
          <div className="flex flex-col gap-2">
            <img src={logo} className="w-12" />
            <LoginCard />
          </div>
        </div>
      </div>
    </>
  );
}
