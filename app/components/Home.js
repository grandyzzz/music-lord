import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Main from './Main'

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 600px;
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

  const [state, setState] = useState({ files: [] });
  const [folderUrl, setFolderUrl] = useState('');

  const inputRef = useRef(null);

  function handleClick() {
    const { remote } = require('electron');
    const { dialog } = remote;

    const fs = remote.require('fs');
    const util = remote.require('util');
    const stat = util.promisify(fs.stat);


    let filesPromises = [];
    dialog.showOpenDialog(
        {
          properties: ['openFile', 'openDirectory', 'multiSelections']
        },
        result => {
          if (result === undefined) return;
          setFolderUrl(result[0]);
          fs.readdir(result[0], async (err, files) => {
              for (let fileName of files) {
                  const promise = new Promise(resolve => {
                      fs.readFile(result[0] + '/' + fileName, (err, data) => {
                          //const file = new File([data.buffer], fileName);
                          const metadata = fs.statSync(result[0] + '/' + fileName);
                          console.log(metadata);
                          resolve(metadata)
                      })
                  });
                  filesPromises.push(promise)
              }

              Promise.all(filesPromises).then(result => {
                  setState({
                      files: [...result]
                  })
              })
          });
        }
    );
  }

  return (
      <ButtonContainer>
        {
            state.files.length === 0 ?
              <Container>
                <Button onClick={handleClick}>заебалб выбери папку</Button>
              </Container>
              :
              <Main files={state.files} folderUrl={folderUrl} />
        }
      </ButtonContainer>
  );
};

export default Home;
