import React from 'react';
import styled from 'styled-components';

const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Button = styled.button`
  border: none;
  background: #333;
  outline: none;
  border-radius: 3px;
  color: #fff;
  margin: 0;
  padding: 20px;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 900;
  font-size: 50px;
  text-transform: lowercase;
  cursor: pointer;
`;

const Home = () => {
  function handleClick() {
    const { remote } = require('electron');
    const { dialog } = remote;
    const fs = remote.require('fs');
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'openDirectory', 'multiSelections']
      },
      result => {
        console.log(result);
        fs.readdir(result[0], (err, files) => {
          fs.readFile(result[0] + '/' + files[0], (err, data) => {
            console.log(data);
          })
        });
      }
    );
  }

  return (
    <Container>
      <Button onClick={handleClick}>заебалб выбери папку</Button>
    </Container>
  );
};

export default Home;
