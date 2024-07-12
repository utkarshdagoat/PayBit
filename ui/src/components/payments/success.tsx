import Spinner from "@/components/ui/spinner";
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import {TESTNET_PAYMENT_API } from "@/lib/endpoints";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_RATE_API;
const dataFetch = async () => {
  const res = await axios.get(EXCHANGE_RATE_API);
  const data = await res.data;
  return data;
};


export default function SuccessfulPayment() {
  const stripe = useStripe();
  const { toast } = useToast();
  const [txHash, setTxHash] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [callCounter, setCallCounter] = useState(0);
  const {address} = useAccount();
  const transferCall = async (amountInUsd: number) => {
    const data = await dataFetch();
    const price = data.data.price;
    const amount = amountInUsd / price;
    try {
      const res = await axios.post(
        TESTNET_PAYMENT_API,
        {
          amount,
          address
        },
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        setTxHash(res.data.data);
        console.log(res.data.data)
        setSuccessful(true);
        toast({ description: "USC Should be recived 🚀" });
      }
    } catch (err) {
      console.error(err);
      toast({
        description:
          "Error converting to UIBIT. Don't worry we will refund you within 24hrs if the transaction does not Happen",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );
    console.log(clientSecret);
    if (!clientSecret) {
      return;
    }
    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        if (paymentIntent !== undefined) {
          switch (paymentIntent.status) {
            case "succeeded":
              toast({ description: "Payment succeeded! Converting to Crypto" });
              if (callCounter === 0) {
                await transferCall(paymentIntent.amount / 10000);
                setCallCounter(1);
              }
              break;
            case "processing":
              console.log("Your payment is processing.");
              break;
            case "requires_payment_method":
              console.log("Your payment was not successful, please try again.");
              break;
            default:
              console.log("hereh");
              break;
          }
        } else {
          toast({
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      });
  }, [stripe]);
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-5xl font-extrabold">
        Payment <span className="text-primary">Success</span>
      </h1>
      <p className="text-2xl font-bold text-muted-foreground">
        Coverting into UBIT{" "}
        <span className="inline-flex align-middle">
          {!successful ? (
            <Spinner className="w-6 h-6" />
          ) : (
            <Check className="w-6 h-6 text-green-400" />
          )}
        </span>
      </p>
      {successful ? (
        <>
          <Card className="w-[400px] mt-4 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4 gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor="burnTxHash">Burn Tx Hash</Label>
                  <Input id="burnTxHash" value={"https://testnet.ubitscan.io/tx/"+txHash} />
                </div>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => {
                    navigator.clipboard.writeText("https://testnet.ubitscan.io/tx/"+txHash);
                    toast({
                      description: "Copied to clipboard",
                    });
                  }}
                >
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </>
      ) : null}
    </div>
  );
}
