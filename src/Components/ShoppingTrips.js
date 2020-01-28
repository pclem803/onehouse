import React, { useState, useEffect } from 'react';
import { Column, Button, Modal, Container, Image, Delete, Notification, Block, Heading } from 'rbx';
import { db } from '../firebaseHelpers';

const getDate = (timeStamp) => {
  const date = new Date(timeStamp);
  return date.toLocaleDateString();
}

const ShoppingTrip = ({receipt, modalState}) => {
  return (
    <Modal active={modalState.active}>
      <Modal.Background onClick={() => modalState.setActive(false)}/>
      <Modal.Card>
        <Modal.Card.Head>
          <Modal.Card.Title>{getDate(receipt.timeStamp)}</Modal.Card.Title>
          <Delete onClick={() => modalState.setActive(false)}/>
        </Modal.Card.Head>
        <Modal.Card.Body>
          <Container>
            {receipt.items.map(item => 
              <Notification key={item.productName}>
                <b>{item.productName}</b> for
                <Block/>
                {item.neededBy.map(p => `${p.name} (bought ${p.quantity})`).join(<Block/>)}
              </Notification>
            )}
            <Image.Container size='3by5'>
              <Image src={receipt.url}/>
            </Image.Container>
          </Container>
        </Modal.Card.Body>
        <Modal.Card.Foot />
      </Modal.Card>
    </Modal>
  )
}

const ShoppingTrips = ({house}) => {
  const [receipts, setReceipts] = useState([]);
  const [active, setActive] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const receiptClick = (receipt) => {
    setActive(true);
    setReceipt(receipt);
  }

  useEffect(() => {
    const handleData = snap => {
      if (snap.val().houses[house].receipts) {
        setReceipts(Object.values(snap.val().houses[house].receipts));
      }
    };
    db.on("value", handleData, error => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, [house]);

  if (receipts.length === 0) return (
    <Heading>
      Looks like you haven't been shopping yet. Select items and attach a receipt to get started.
    </Heading>
  )

  return (
    <div>
      {!!receipt && <ShoppingTrip receipt={receipt} modalState={{active, setActive}}/>}
      <Column.Group>
        <Column size={4} offset={4}>
          <Container>
            {receipts.map(r => 
              <Button 
                key={r.timeStamp} 
                color='info'
                onClick={() => receiptClick(r)}
              >
                {getDate(r.timeStamp)}
              </Button>)}
          </Container>
        </Column>
      </Column.Group>
    </div>
  )
}

export default ShoppingTrips;