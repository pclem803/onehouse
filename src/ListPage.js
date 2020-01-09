import React, { useState } from 'react';
import "rbx/index.css";
import { Container, Button, Input, Box, Column, Delete, Field, Control } from "rbx";
import { ColumnGroup } from 'rbx/grid/columns/column-group';
import Banner from './Banner'
import ItemList from './ItemList'
import {saveItem} from './firebaseHelpers';

const ListPage = ({propItems}) => {

  const [items, setItems] = useState(propItems);
  const [userInput, setUserInput] = useState("");

  const handleChange = (event) => {
    setUserInput(event.target.value);
  }

  const handleSubmit = () => {
    saveItem({id: userInput, name: userInput});
  }

  return (
    <Container>
        <Banner/>
        <ColumnGroup>
            <Column size="half" offset="one-quarter">
                <Box>
                <ItemList items={propItems}></ItemList>
                </Box>
                <Field kind="addons">
                    <Control>
                        <Input placeholder="eggs" onChange={handleChange}/>
                    </Control>
                    <Control>
                        <Button color="info" onClick={handleSubmit}>Add</Button>
                    </Control>
                </Field>
            </Column>
        </ColumnGroup>
    </Container>
  )
}

export default ListPage;