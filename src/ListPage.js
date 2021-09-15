import React, { useState } from "react";
import {
  Container,
  Button,
  Input,
  Column,
  Block,
  Field,
  Control,
  Heading,
  Divider,
} from "rbx";
import { ColumnGroup } from "rbx/grid/columns/column-group";
import ItemList from "./ItemList";
import { saveItem } from "./firebaseHelpers";
import ReceiptModal from "./ReceiptModal";
import ShoppingTrips from "./Components/ShoppingTrips";
import WelcomeScreen from "./Components/WelcomeScreen";
import SignInScreen from "./Components/SignInScreen";

const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = (x) => {
    setSelected(
      selected.includes(x)
        ? selected.filter((y) => y !== x)
        : [x].concat(selected)
    );
  };
  const clearSelected = () => {
    setSelected([]);
  };
  return [selected, clearSelected, toggle];
};

const ListPage = ({ propItems, user, house }) => {
  const [productName, setProductName] = useState("");

  const [selected, clearSelected, toggle] = useSelection();
  const [attachReceipt, setAttachReceipt] = useState(false);

  const handleProductChange = (event) => {
    setProductName(event.target.value);
  };

  const handleSubmit = () => {
    saveItem({ name: productName, user: user, houseName: house });
    setProductName("");
  };

  if (user && house) {
    return (
      <Container>
        <ReceiptModal
          selectedState={{ selected, clearSelected }}
          modalState={{ attachReceipt, setAttachReceipt }}
          house={house}
        />
        <ColumnGroup>
          <Column size={10} offset={1}>
            <Block />
            <ItemList
              items={propItems}
              user={user}
              selectedState={{ selected, toggle }}
              house={house}
            />
            {selected.length === 0 ? (
              <div />
            ) : (
              <Button color="info" onClick={() => setAttachReceipt(true)}>
                Attach To Receipt
              </Button>
            )}
            <Block />
            <Column size="three-fifths" offset="one-fifth">
              <Field align="centered" kind="addons">
                <Control expanded>
                  <Input
                    size="medium"
                    placeholder="Eggs (dozen)"
                    value={productName}
                    onChange={handleProductChange}
                  />
                </Control>
                <Control>
                  <Button size="medium" color="link" onClick={handleSubmit}>
                    Add
                  </Button>
                </Control>
              </Field>
            </Column>
          </Column>
        </ColumnGroup>
        <Block />
        <Divider color="info">Shopping Trips</Divider>
        <Block />
        <ShoppingTrips house={house} />
      </Container>
    );
  } else if (user) {
    return <SignInScreen user={user} />;
  } else {
    return <WelcomeScreen />;
  }
};

export default ListPage;
