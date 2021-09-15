import React, { useState, useEffect } from "react";
import {
  Column,
  Button,
  Modal,
  Container,
  Image,
  Delete,
  Notification,
  Block,
  Heading,
  Card,
  Content,
} from "rbx";
import { db } from "../firebaseHelpers";

const getDate = (timeStamp) => {
  const date = new Date(timeStamp);
  return date.toLocaleDateString();
};

const ShoppingTrip = ({ receipt, modalState }) => {
  return (
    <Modal active={modalState.active}>
      <Modal.Background onClick={() => modalState.setActive(false)} />
      <Modal.Card>
        <Modal.Card.Head>
          <Modal.Card.Title>{getDate(receipt.timeStamp)}</Modal.Card.Title>
          <Delete onClick={() => modalState.setActive(false)} />
        </Modal.Card.Head>
        <Modal.Card.Body>
          <Container>
            {receipt.items.map((item) => (
              <Notification key={item.productName}>
                <b>{item.productName}</b> for
                <Block />
                {item.neededBy
                  .map((p) => `${p.name} (bought ${p.quantity})`)
                  .join(", ")}
              </Notification>
            ))}
            {receipt.url !== "n/a" ? (
              <Image.Container size="3by5">
                <Image src={receipt.url} alt="No Receipt" />
              </Image.Container>
            ) : (
              <Heading>No receipt uploaded</Heading>
            )}
          </Container>
        </Modal.Card.Body>
        <Modal.Card.Foot />
      </Modal.Card>
    </Modal>
  );
};

const ShoppingTrips = ({ house }) => {
  const [receipts, setReceipts] = useState([]);
  const [active, setActive] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const receiptClick = (receipt) => {
    setActive(true);
    setReceipt(receipt);
  };

  useEffect(() => {
    const handleData = (snap) => {
      if (snap.val().houses[house].receipts) {
        setReceipts(Object.values(snap.val().houses[house].receipts).reverse());
      }
    };
    db.on("value", handleData, (error) => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, [house]);

  const getNames = (items) => {
    const name = [];
    for (var i in items) {
      items[i].neededBy.forEach((element) => name.push(element.name));
    }

    const names = [...new Set(name)].join(", ");
    return names;
  };

  if (receipts.length === 0)
    return (
      <Heading>
        Looks like you haven't been shopping yet. Select items and attach a
        receipt to get started.
      </Heading>
    );

  return (
    <div>
      {!!receipt && (
        <ShoppingTrip receipt={receipt} modalState={{ active, setActive }} />
      )}
      <Column.Group>
        <Column size={8} offset={2}>
          <Container>
            <Column.Group multiline centered>
              {receipts.map((r) => (
                <Column key={r.timeStamp}>
                  <Card>
                    <Card.Header>
                      <Card.Header.Title>
                        <Button
                          fullwidth
                          key={r.timeStamp}
                          color="info"
                          onClick={() => {
                            receiptClick(r);
                          }}
                          size="medium"
                        >
                          {getDate(r.timeStamp)}
                        </Button>
                      </Card.Header.Title>
                    </Card.Header>
                    <Card.Content>
                      <Content>{" " + getNames(r.items)}</Content>
                    </Card.Content>
                  </Card>

                  <Block />
                </Column>
              ))}
            </Column.Group>
          </Container>
        </Column>
      </Column.Group>
    </div>
  );
};

export default ShoppingTrips;
