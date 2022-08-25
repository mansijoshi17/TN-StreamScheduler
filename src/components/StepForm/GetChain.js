import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MoneyStreamingContext } from "src/context/CreateMoneyStreamContext";
import { firebaseDataContext } from "src/context/FirebaseDataContext";

import { networkDirectory } from "../../config";

function GetChain() {
  const value = useContext(MoneyStreamingContext);
  const formdata = value.labelInfo.formData;

  const [chain, setChain] = useState("");

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getCustomers, customers } = firebaseContext;

  const [superTokens, setSuperTokens] = React.useState(
    networkDirectory["mumbai"].superTokens
  );

  useEffect(async () => {
    getCustomers();
  }, [customers]);

  const handleChange = (event) => {
    setCreator(event.target.value);
  };

  return (
    <div>
      <Stack spacing={3} sx={{ margin: "20px" }}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl
            fullWidth
            style={{
              paddingRight: "2vw",
              marginBottom: "2vw",
            }}
          >
            <InputLabel id="demo-simple-select-label">Customer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="customer"
              label="Customer"
              value={formdata.customerAdd}
              onChange={value.setFormdata("customerAdd")}
            >
              {customers &&
                customers.map((customer) => {
                  return (
                    <MenuItem value={customer.address}>
                      {customer.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            style={{
              paddingRight: "2vw",
              marginBottom: "2vw",
            }}
          >
            <InputLabel id="demo-simple-select-label">Token</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="token"
              label="Token"
              value={formdata.token}
              onChange={value.setFormdata("token")}
            >
              {Object.keys(superTokens).map((key) => {
                return (
                  <MenuItem key={key} value={superTokens[key]}>
                    {key}
                  </MenuItem>
                );
              })}

              {/* <MenuItem value="MATICx">MATICx</MenuItem>
              <MenuItem value="AVAXx">AVAXx</MenuItem> */}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Choose Your Network
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={formdata.chain}
              onChange={(e) => {
                const networkId = window.ethereum.networkVersion;
                if (e.target.value == "bsc" && networkId !== "97") {
                  toast.error(
                    "Please connect to the BSC Testnet network in Metamask to continue!"
                  );
                } else if (
                  e.target.value == "mumbai" &&
                  networkId !== "80001"
                ) {
                  toast.error(
                    "Please connect to the Polygon Mumbai Testnet network in Metamask to continue!"
                  );
                } else if (e.target.value == "ropsten" && networkId !== "3") {
                  toast.error(
                    "Please connect to the Ropsten Network in Metamask to continue!"
                  );
                } else if (
                  e.target.value == "avalanche" &&
                  networkId !== "43113"
                ) {
                  toast.error(
                    "Please connect to the AVAX FUJI network in Metamask to continue!"
                  );
                }
                const network = networkDirectory[e.target.value];

                setSuperTokens(network.superTokens);
                setChain(e.target.value);
              }}
            >
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={2}
              >
                <FormControlLabel
                  value="mumbai"
                  control={<Radio />}
                  label="Mumbai"
                  onChange={value.setFormdata("chain")}
                />
                <FormControlLabel
                  value="ropsten"
                  control={<Radio />}
                  label="Ropsten"
                  onChange={value.setFormdata("chain")}
                />
                <FormControlLabel
                  value="avalanche"
                  control={<Radio />}
                  label="Avalanche"
                  onChange={value.setFormdata("chain")}
                />
              </Stack>
            </RadioGroup>
            {/* <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={chain}
                            label="Chain"
                            onChange={(e) => {
                                const networkId = window.ethereum.networkVersion;
                                if (e.target.value == 'Binance' && networkId !== '97') {
                                    toast.error("Please connect to the BSC Testnet network in Metamask to continue!");
                                } else if (e.target.value == 'Polygon' && networkId !== '80001') {
                                    toast.error("Please connect to the Polygon Mumbai Testnet network in Metamask to continue!");
                                } else if (e.target.value == 'Ropsten' && networkId !== '3') {
                                    toast.error("Please connect to the Ropsten Network in Metamask to continue!");
                                } else if (e.target.value == 'Boba' && networkId !== '28') {
                                    toast.error("Please connect to the BOBA network in Metamask to continue!");
                                } else if (e.target.value == 'Avax' && networkId !== '43113') {
                                    toast.error("Please connect to the AVAX FUJI network in Metamask to continue!");
                                }
                                setChain(e.target.value) 
                            }
                            }
                        > 
                            <MenuItem value="Binance" onChange={value.setFormdata("chain")} >BSC</MenuItem>
                            <MenuItem value="Polygon" onChange={value.setFormdata("chain")} >Polygon Mumbai</MenuItem>
                            <MenuItem value="Ropsten" onChange={value.setFormdata("chain")} >Ropsten</MenuItem>
                            <MenuItem value="Avax" onChange={value.setFormdata("chain")} >Avalanche FUJI</MenuItem>
                        </Select> */}
          </FormControl>
        </Box>
      </Stack>
    </div>
  );
}

export default GetChain;
