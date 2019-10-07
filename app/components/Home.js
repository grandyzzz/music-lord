import React, { useState } from 'react';
import styled from 'styled-components';
import Main from './Main'

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Container = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
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

  const [fileList, setFileList] = useState([]);
  const [folderUrl, setFolderUrl] = useState('');

  function handleClick() {
    const { remote } = require('electron');
    const { dialog } = remote;

    const fs = remote.require('fs');
    let filesPromises = [];
    dialog.showOpenDialog(
        {
          properties: ['openFile', 'openDirectory', 'multiSelections']
        },
        result => {
          setFolderUrl(result[0]);
          fs.readdir(result[0], (err, files) => {

            files.forEach(fileName => {
              fs.readFile(result[0] + '/' + fileName, (err, data) => {
                  const file = new File([data.buffer], fileName);
                  setFileList([...fileList, file])
              })
            });
          });
        }
    );

  }

  return (
      <ButtonContainer>
        {
          fileList.length === 0 ?
              <Container>
                <Button onClick={handleClick}>заебалб выбери папку</Button>
              </Container>
              :
              <Main files={fileList} folderUrl={folderUrl} />
        }
      </ButtonContainer>
  );
};

export default Home;
