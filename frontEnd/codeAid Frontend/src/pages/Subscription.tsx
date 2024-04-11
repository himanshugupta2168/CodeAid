import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { CgUnavailable } from "react-icons/cg";
import { Link } from "react-router-dom";

interface SubscriptionBoxProps {
  plan_name?: string;
  plan_type?: string;
  features?: { is_premium?: boolean; feature?: string }[];
  curr_pricing?: string;
  real_pricing?: string;
}
function SubscriptionBox({ plan_name, Subscribe }: any) {
  return (
    <div
      className={`w-56 flex flex-col items-center py-6  ${
        plan_name === "premium" ? "bg-purple-500" : "bg-black"
      } rounded-lg`}
    >
      <h3 className="font-semibold ">{plan_name}</h3>
      {Subscribe.features.map((box: any, index: number) => (
        <div key={index} className="flex gap-4 w-full  px-4 py-4">
          {!box.is_premium || plan_name === "premium" ? (
            <FaCheckCircle />
          ) : (
            <CgUnavailable />
          )}
          <p>{box.feature}</p>
        </div>
      ))}
      <div className="flex  gap-2">
      <p
            className="text-3xl pb-4 font-bold"
            >
            {plan_name === "basic"
                ? "free"
                : `${
                    Subscribe.plan_type === "Monthly"
                    ? `${Subscribe.curr_pricing}/month`
                    : `${Math.floor(((parseInt(Subscribe.curr_pricing) * 12) / 100) *100)}/year`
                }`
            }
            </p>
        {plan_name!=='basic' &&<span className="line-through font-bold">{`${Subscribe.plan_type==='Monthly'
        ?`${Subscribe.real_pricing}`
        :`${parseInt(Subscribe.real_pricing)*12}`
        }`}</span>}
      </div>
      <button
        className={`${
          plan_name === "basic"
            ? "bg-purple-500 w-2/3 py-2 rounded-lg "
            : "bg-white text-black w-2/3 py-2 rounded-lg"
        }`}
      >
        {plan_name === "basic" ? "Continue" : "Buy now"}
      </button>
    </div>
  );
}

function Subscription() {
  const [Subscribe, setSubscribe] = useState<SubscriptionBoxProps>({
    plan_type: "Yearly",
    features: [
      { is_premium: false, feature: "Doubt Suport" },
      { is_premium: true, feature: "1-1  Doubt Support" },
      { is_premium: true, feature: "Instant Notification" },
    ],
    curr_pricing: "199",
    real_pricing: "299",
  });
  const handleChange: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const { name, value } = e.currentTarget;
    setSubscribe({
      ...Subscribe,
      [name]: value,
    });
  };
  return (
    <div className="bg-[#323232] w-full md:h-screen pb-10 text-white">
      <h3 className="text-center font-bold text-2xl pt-20">
        Choose your plan{" "}
      </h3>
      <div className="flex justify-center my-6">
        <button
          className={`px-4 py-2 ${
            Subscribe.plan_type === "Monthly" && "bg-purple-500 rounded-xl"
          }`}
          name="plan_type"
          value={"Monthly"}
          onClick={handleChange}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 ${
            Subscribe.plan_type === "Yearly" && "bg-purple-500 rounded-xl"
          }`}
          name="plan_type"
          value={"Yearly"}
          onClick={handleChange}
        >
          Yearly
        </button>
      </div>
      <div className="plans w-full flex flex-col md:flex-row gap-6 pt-6 justify-center items-center">
        <SubscriptionBox
          plan_name="basic"
          Subscribe={Subscribe}
        />
        <SubscriptionBox
          plan_name="premium"
          Subscribe={Subscribe}
        />
      </div>
    </div>
  );
}

export default Subscription;
