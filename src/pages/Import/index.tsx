/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  const asyncForEach = async (
    array: FileProps[],
    callback: (
      item: FileProps,
      index: number,
      array: FileProps[],
    ) => Promise<void>,
  ): Promise<void> => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) {
      return;
    }

    const data = new FormData();

    try {
      await asyncForEach(uploadedFiles, async file => {
        data.append('file', file.file);
        await api.post('/transactions/import', data);
        data.delete('file');
      });

      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const filesToSubmit = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(filesToSubmit);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
