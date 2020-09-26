import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Consumer from "./contracts/Consumer.json";
import LinkToken from "./contracts/LinkTokenInterface.json";
import config from "./truffle/truffle.js";
import getWeb3 from "./getWeb3";
import "./App.css";
import {
  Button,
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Table,
} from "react-bootstrap";

const timeout = 30;

const currencyPairs = [
  { currency1: "BTC", currency2: "USD" },
  { currency1: "BTC", currency2: "EUR" },
  { currency1: "ETH", currency2: "USD" },
  { currency1: "LINK", currency2: "USD" },
];

function App() {
  const [prices, setPrices] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState();
  const [web3, setWeb3] = useState();
  const [balance, setBalance] = useState(0);
  const [linkTokenContract, setLinkTokenContract] = useState();
  const [consumerContract, setConsumerContract] = useState();

  useEffect(() => {
    try {
      async function initWeb3() {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();

        const network = await web3.eth.net.getNetworkType();
        const linkToken = new web3.eth.Contract(
          LinkToken.abi,
          config.networks[network].linkToken
        );

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Consumer.networks[networkId];

        const contract = new web3.eth.Contract(
          Consumer.abi,
          deployedNetwork && deployedNetwork.address
        );

        setAccounts(accounts);
        setWeb3(web3);
        setLinkTokenContract(linkToken);
        setConsumerContract(contract);

        linkToken.methods
          .balanceOf(contract._address)
          .call((error, balance) => {
            setBalance(web3.utils.fromWei(balance));
          });
      }

      initWeb3();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleFundContract = async () => {
    try {
      console.log("Sending LINK to the consumer contract...");

      setLoading(true);

      linkTokenContract.methods
        .transfer(
          consumerContract._address,
          web3.utils.toWei(currencyPairs.length.toString())
        )
        .send({ from: accounts[0] })
        .on("transactionHash", function (hash) {
          console.log("Done", hash);
          setTimeout(() => {
            setLoading(false);
          }, timeout * 1000);
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleRequestData = async () => {
    try {
      if (balance <= 0) {
        alert("Please fund contract");
        return;
      }

      setLoading(true);

      currencyPairs.map(async (pair) => {
        await consumerContract.methods
          .requestPrice(
            pair.currency1.toUpperCase(),
            pair.currency2.toUpperCase()
          )
          .send({ from: accounts[0] })
          .on("transactionHash", function (hash) {
            console.log("Done", hash);
            setTimeout(() => {
              setLoading(false);
            }, timeout * 1000);
          });
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleReadContract = async () => {
    try {
      let _prices = [];
      await Promise.all(currencyPairs.map(async (pair) => {
        const hash = web3.utils.sha3(
          pair.currency1.toUpperCase() + pair.currency2.toUpperCase()
        );
        const data = await consumerContract.methods.prices(hash).call();

        console.log("Pair hash: " + hash);

        _prices.push({
          currency1: pair.currency1,
          currency2: pair.currency2,
          price: data / 100,
        });
      }));

      setPrices(_prices);
    } catch (error) {
      console.error(error);
    }
  };

  if (!web3) {
    return <div>Loading Web3...</div>;
  }
  return (
    <Container>
      <div className="App">
        <Row style={{ marginTop: 100 }}>
          <Col>
            <Button
              variant="success"
              size="lg"
              block
              onClick={handleFundContract}
              disabled={isLoading}
            >
              {isLoading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              FUND CONTRACT
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              size="lg"
              block
              onClick={handleRequestData}
              disabled={isLoading}
            >
              {isLoading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              REQUEST DATA
            </Button>
          </Col>
          <Col>
            <Button variant="info" size="lg" block onClick={handleReadContract}>
              READ CONTRACT
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <h5>
            Contract balance <Badge variant="secondary">{balance} LINK</Badge>
          </h5>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <h5>Latest prices</h5>
        </Row>
        <Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th colSpan={2}>Currency pair</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((e, index) => {
                return (
                  <tr key={index}>
                    <td>{e.currency1}</td>
                    <td>{e.currency2}</td>
                    <td>
                      <Badge variant="secondary">{e.price}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </div>
    </Container>
  );
}

export default App;
