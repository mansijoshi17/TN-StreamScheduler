import { ethers } from "ethers";
import React, { useState, createContext } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

import { NotificationContext } from "./Notification";
import { networkDirectory, contracts } from "../config";
import streamFactory from "../abi/StreamFactory.json";
import streamScheduler from "../abi/StreamScheduler.json";

import { collection, addDoc, db } from "../firebase";

export const MoneyStreamingContext = createContext();

export const MoneyStreamingContextProvider = (props) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const { Moralis, user } = useMoralis();

  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications } = notificationContext;

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      customerAdd: "",
      token: "",
      chain: "mumbai",
      amount: "",
      period: "",
      sdate: 0,
      edate: 0,
    },
  });

  const setFormdata = (prop) => (event) => {
    setlabelInfo({
      ...labelInfo,
      formData: { ...labelInfo.formData, [prop]: event.target.value },
    });
  };

  const steps = [{ title: "Select Chain" }, { title: "Payment Details" }];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function getSeconds(dateValue) {
    const date = new Date(dateValue.toString());
    const seconds = Math.floor(date.getTime() / 1000);
    return seconds;
  }

  async function createPayment() {
    try {
      const formData = labelInfo.formData;
      const startDate = getSeconds(labelInfo.formData.sdate);
      const endDate = getSeconds(labelInfo.formData.edate);

      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const streamFactoryCon = new ethers.Contract(
        contracts[labelInfo.formData.chain],
        streamFactory.abi,
        signer
      );

      console.log(startDate, endDate);
      console.log(formData);

      const network = networkDirectory[labelInfo.formData.chain];
      let createStreamTrans = await streamFactoryCon.createStreamScheduler(
        network.cfa,
        network.host
      );

      // console.log(startDate, endDate);
      let tx = await createStreamTrans.wait();
      if (tx) {
        let event = await tx.events[0];
        let streamSchedulerAdd = event?.args[1];

        const streamSchedulerCon = new ethers.Contract(
          streamSchedulerAdd,
          streamScheduler.abi,
          signer
        );

        console.log(streamSchedulerCon, "streamSchedulerCon");

        const transactionCreateStream =
          await streamSchedulerCon.createStreamOrder(
            formData.customerAdd,
            formData.token,
            startDate,
            parseInt("1000000000000000"),
            endDate,
            0
          );

        let tcs = await transactionCreateStream.wait();

        if (tcs) {
          const transactionExecuteStream =
            await streamSchedulerCon.executeCreateStream(
              formData.customerAdd,
              formData.token,
              parseInt(startDate),
              parseInt("1000000000000000"),
              parseInt(endDate),
              0
            );

          let txe = await transactionExecuteStream.wait();

          if (txe) {
            const docRef = await addDoc(collection(db, "customers"), {
              customerAddress: labelInfo.formData.customerAdd,
              token: labelInfo.formData.token,
              chain: labelInfo.formData.chain,
              amount: labelInfo.formData.amount,
              period: labelInfo.formData.period,
              sdate: startDate,
              edate: endDate,
              streamScheduler: streamSchedulerAdd,
            });
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MoneyStreamingContext.Provider
      value={{
        page,
        open,
        handleClickOpen,
        handleClose,
        steps,
        labelInfo,

        setFormdata,
        createPayment,
        loading,
      }}
    >
      {props.children}
    </MoneyStreamingContext.Provider>
  );
};
