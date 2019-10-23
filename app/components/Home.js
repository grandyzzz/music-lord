import React, { useState } from 'react';
import styled from 'styled-components';
import Main from './Main'
import filesize from 'filesize';
import NodeID3 from 'node-id3'
import getMP3Duration from 'get-mp3-duration'

const Container = styled.div`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
`;

const ButtonContainer = styled.main`
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

const getFormattedDate = time => {
    let actualDate = new Date(time);
    return `${('0' + actualDate.getDate()).slice(-2)}.${('0' + (actualDate.getMonth() + 1)).slice(-2)}.${actualDate.getFullYear()}`
};

const getFormattedTime = time => {
    const allSeconds = Math.round(time / 1000);
    const seconds = allSeconds % 60;
    const minutes = Math.floor(allSeconds / 60);

    return `${minutes}:${('0' + seconds).slice(-2)}`
};

const getFileExtension = fileName => {
    const splitArray = fileName.split('.');

    return splitArray[splitArray.length - 1]
};

const Home = () => {

  const [state, setState] = useState({ files: [] });
  const [folderUrl, setFolderUrl] = useState('');

  function handleClick() {
    const { remote } = require('electron');
    const { dialog } = remote;

    const fs = remote.require('fs');
    const size = filesize.partial({ locale: 'ru' });


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
                      const path = result[0] + '/' + fileName;

                      fs.readFile(path, (err, data) => {
                          const metadata = fs.statSync(result[0] + '/' + fileName);

                          const extension = getFileExtension(fileName);

                          let item = {
                              fileName: fileName.slice(0, -extension.length - 1),
                              lastModifiedDate: getFormattedDate(metadata.atime),
                              size: size(metadata.size),
                              extension
                          };

                          if (extension === 'mp3') {

                              NodeID3.read(path, (err, tags) => {
                                  console.log(tags);
                                  const { artist, title } = tags;

                                  if (artist !== undefined) item.artist = artist;
                                  if (title !== undefined) item.title = title;

                                  const duration = getMP3Duration(data);

                                  item.duration = getFormattedTime(duration);

                                  resolve(item)
                              });
                          } else { resolve(item) }
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
      <Container>
        {
            state.files.length === 0 ?
              <ButtonContainer>
                <Button onClick={handleClick}>заебалб выбери папку</Button>
              </ButtonContainer>
              :
              <Main files={state.files} folderUrl={folderUrl} />
        }
      </Container>
  );
};

export default Home;
