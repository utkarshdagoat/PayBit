import Navbar from "@/components/navbar";
import Exchange from "@/components/payments/exchange";

export default function Pay() {
  return (
    <>
      <Navbar active="Pay" />
      <div className="flex flex-col h-screen w-full justify-center">
        <div className="w-full flex items-center justify-center">
          <Exchange />
        </div>
      </div>
    </>
  );
}
