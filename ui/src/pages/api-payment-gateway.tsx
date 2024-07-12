import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { AnimatedGradientText } from "@/components/animated-gradient-text";

import Metadata from "@/components/payments/metadata";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import stripeLogo from "@/assets/stripe.svg";
import styles from "@/components/components.module.css";
import CheckoutForm from "@/components/payments/stripeCheckout";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import keplrIcon from "@/assets/keplr-icon.svg";
import KycExternal from "@/components/kyc/kyc-external";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const PK_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripe = loadStripe(PK_KEY);

export default function ApiPaymentGateway() {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentDisabled, setPaymentDisabled] = useState(true);

  // TODO: searchParams.get("paymentId") aur vo sab krke get krle sabkuch and populate the states
  const searchParams = useSearchParams();

  const connectWalletHandle = async () => {
    const chainId = "akashnet-2";
    if (!window.keplr) {
      toast({
        description: "Please install Keplr wallet to proceed",
      });
    } else {
      await window.keplr.enable(chainId);
      const address = await window.keplr.getKey(chainId);
      setWalletAddress(address.bech32Address);
    }
  };

  const api = import.meta.env.VITE_BACKEND_URI;
  const [clientSecret, setClientSecret] = useState("");
  const [exchangeAmount, setExchangeAmount] = useState(0);
  const [UBITAmount, setUBITAmount] = useState(0);
  const [paymentClickedStripe, setPaymentClickedStripe] = useState(false);
  const [paymentClickedCoinbase, setPaymentClickedCoinbase] = useState(false);

  const handleStripePayment = async () => {
    try {
      const response = await axios.post(`${api}/stripe/create-payment-intent`, {
        amount: exchangeAmount,
      });
      const data = await response.data;
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
    setPaymentClickedStripe(true);
  };

  const handleCoinbasePayment = async () => {
    setPaymentClickedCoinbase(true);
  };

  const options: StripeElementsOptions = {
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#ff414c",
        colorBackground: "#1c1c1c",
      },
    },
    clientSecret: clientSecret,
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {paymentClickedStripe ? (
        <Elements stripe={stripe} options={options}>
          <CheckoutForm />
        </Elements>
      ) : paymentClickedCoinbase ? (
        <div id="#cbpay-container"></div>
      ) : (
        <div
          className={`p-1 bg-gradient-to-br w-[400px] from-gradient_1/80 via-purple-500/80 to-gradient_2/80 ${styles.animate_gradient} rounded-xl`}
        >
          <Card className="p-2 shadow-xl border">
            <CardHeader>
              <CardTitle>
                Get <AnimatedGradientText text="UBIT" /> Tokens
              </CardTitle>
              <CardDescription>Fiat to deployment currency</CardDescription>
            </CardHeader>
            <CardContent>
              <InputBoxes
                exchangeAmount={exchangeAmount}
                UBITAmount={UBITAmount}
                setExchangeAmount={setExchangeAmount}
                setUBITAmount={setUBITAmount}
              />
              <Metadata />
              <div className="flex flex-row gap-2 my-4">
                <Input
                  className="basis-5/6"
                  defaultValue={walletAddress}
                  placeholder="Wallet Address"
                  onChange={() => setWalletAddress(walletAddress)}
                />
                <div className="p-1/2 rounded-md bg-gradient-to-b from-teal-500/60 to-violet-500/60">
                  <Button
                    variant={"secondary"}
                    size={"icon"}
                    className="font-bold bg-transparent"
                    onClick={connectWalletHandle}
                  >
                    <img src={keplrIcon} className="w-5" alt="" />
                  </Button>
                </div>
              </div>
              <KycExternal setPaymentDisabled={setPaymentDisabled}>
                <Button
                  size={"lg"}
                  className="font-bold w-full mb-3"
                  disabled={!paymentDisabled}
                >
                  Complete KYC
                </Button>
              </KycExternal>
              <Button
                variant={"gradient"}
                size={"lg"}
                disabled={paymentDisabled}
                className="font-bold w-full"
                onClick={handleStripePayment}
              >
                Pay with
                <img src={stripeLogo} className="w-14 -ml-1" />{" "}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Input Boxes
interface InputBoxesProps {
  exchangeAmount: number;
  UBITAmount: number;
  setExchangeAmount: (value: number) => void;
  setUBITAmount: (value: number) => void;
}

const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_RATE_API;
const dataFetch = async () => {
  const res = await axios.get(EXCHANGE_RATE_API);
  const data = await res.data;
  return data;
};

function InputBoxes({
  exchangeAmount,
  setUBITAmount,
  setExchangeAmount,
  UBITAmount,
}: InputBoxesProps) {
  const { toast } = useToast();

  console.log(EXCHANGE_RATE_API);
  const onUSDChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setExchangeAmount(Number(e.target.value));
    if (Number(e.target.value) > 0) {
      const data = await dataFetch();
      const price = data.data.price;
      if (price) {
        setUBITAmount(Number(e.target.value) / price);
      } else {
        toast({
          title: "Uh oh!",
          description: "Unable to fetch data from the API.",
          variant: "destructive",
        });
      }
    }
  };

  const onAktChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUBITAmount(Number(e.target.value));
    if (Number(e.target.value) > 0) {
      const data = await dataFetch();
      const price = data.data.price;
      // 1
      if (price) {
        setExchangeAmount(Number(e.target.value) * price);
      } else {
        toast({
          title: "Uh oh!",
          description: "Unable to fetch data from the API.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="pay-amount">You pay</Label>
        <div className="relative flex items-center rounded-md shadow-sm">
          <Input
            className="w-full pr-12  pt-7 pb-7 rounded-md"
            id="pay-amount"
            name="pay-amount"
            type="number"
            placeholder="0"
            readOnly
            value={!exchangeAmount ? "" : exchangeAmount}
            onChange={onUSDChange}
          />
          <span className="text-sm -ml-11 font-bold text-muted-foreground">
            USD
          </span>
        </div>
      </div>
      <div className="flex justify-center mt-3 rounded-full items-center">
        <ArrowDownUpIcon className="text-gray-500" />
      </div>
      <div className="mb-6">
        <Label htmlFor="receive-amount">You receive</Label>
        <div className="relative flex items-center rounded-md shadow-sm">
          <Input
            className="w-full pr-12 pt-7 pb-7 rounded-md"
            id="pay-amount"
            name="pay-amount"
            type="number"
            readOnly
            placeholder="0"
            value={!UBITAmount ? "" : UBITAmount}
            onChange={onAktChange}
          />
          <span className="-ml-11 font-bold rounded-md text-sm text-muted-foreground">
            UBIT
          </span>
        </div>
      </div>
    </>
  );
}

function ArrowDownUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}
