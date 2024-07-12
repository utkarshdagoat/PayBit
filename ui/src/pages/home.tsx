import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedGradientText } from "@/components/animated-gradient-text";
import bg from "@/assets/home-bg.svg";
import { ArrowLongRightIcon } from "@heroicons/react/16/solid";
import { useUserStore } from "@/hooks/useStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUserAPI } from "@/lib/endpoints";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner";

export default function Home() {
  const { user, setUser } = useUserStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    axios
      .get(getUserAPI, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 403) {
          setUser(null);
        } else if (res.status === 200) {
          console.log(res.data);
          setUser(res.data);
        } else {
          setUser(null);
          toast({
            description: "Can't Seem to find you, Please login again.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
        toast({
          description: "Can't Seem to find you, Please login again.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <div
        className="h-screen w-full flex flex-col gap-8 items-center justify-center"
        style={{
          background: `url(${bg}) no-repeat`,
          backgroundSize: "cover",
        }}
      >
        {loading ? (
          <div className="top-[50%]">
            <Spinner className="w-20 h-20" />
          </div>
        ) : (
          <>
            <div className="text-center flex flex-col gap-6">
              <h1 className="text-8xl drop-shadow-2xl font-extrabold leading-none tracking-tight ">
                Pay
                <AnimatedGradientText text="Bit" />
              </h1>
              <p className="text-xl leading-8 text-muted-foreground font-semibold lg:text-xl">
                The open source fiat payment system for <br />{" "}
                <span className="text-primary font-bold">UBit Network</span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Link to={user ? "/pay" : "/onboard"}>
                <Button size={"lg"} className="font-extrabold text-sm">
                  Get Started <ArrowLongRightIcon className="ml-1 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="text-xs p-2 font-medium text-white/40 transition-all duration-200 hover:text-white/70"
                >
                  Already have an account?
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
