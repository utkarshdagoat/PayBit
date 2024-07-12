import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner";
//TODO: Make a successful payment page

export default function CheckoutForm() {
  const FRONTEND_URI = import.meta.env.VITE_FRONTEND_URI;
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    console.log("here");
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

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent !== undefined) {
        switch (paymentIntent.status) {
          case "succeeded":
            //TODO: Call the API to convert place ORDER for UBIT
            console.log("here 123");
            toast({ description: "Payment succeeded!" });
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            console.log("hereh");
            break;
        }
      } else {
        toast({
          title: "Uh oh!",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("here");
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: FRONTEND_URI + "/payment-success",
      },
    });
    console.log(error);

    if (error.type === "card_error" || error.type === "validation_error") {
      if (error.message !== undefined)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
    } else {
      toast({
        title: "Uh oh!",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        variant={"gradient"}
        size={"lg"}
        className="mt-3 font-bold w-full"
      >
        <span id="button-text">
          {isLoading ? <Spinner className="w-6 h-6" /> : "Pay now"}
        </span>
      </Button>
      {message && (
        <div
          id="payment-message"
          className="text-primary text-sm font-semibold mt-2"
        >
          {message}
        </div>
      )}
    </form>
  );
}
