import { Button, Container, Grid, Stack, Typography } from '@mui/material';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { SemVer } from 'semver';

export default function AboutWindow() {
  const [version, setVersion] = useState({
    node: -1,
    app: -1,
    chrome: -1,
    electron: -1,
  });

  const [update, setUpdate] = useState({
    hasUpdate: false,
    newVersion: new SemVer('1.0.0'),
    isDownloaded: false,
    failed: false,
  });

  const mainFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-app-version')
      .then((res) => {
        if (res) setVersion(res);
        return true;
      })
      .catch((ex) => console.log(ex));

    window.electron.ipcRenderer
      .invoke('get-app-update')
      .then((res) => {
        if (res) {
          if (res && res !== null) setUpdate(res);
        }
        return true;
      })
      .catch((ex) => console.log(ex));

    window.electron.ipcRenderer.on('update-handler', (res) => {
      if (res && res !== undefined)
        setUpdate((oldUpdate) => {
          return {
            ...oldUpdate,
            ...res,
          };
        });
    });
  }, []);

  useLayoutEffect(() => {
    if (mainFrameRef.current) {
      window.electron.ipcRenderer.sendMessage('resize', {
        width: mainFrameRef.current.offsetWidth,
        heigth: mainFrameRef.current.offsetHeight,
      });
    }
  }, []);

  const handleClose = () => {
    window.electron.ipcRenderer.sendMessage('runmode-change', false);
  };

  return (
    <Container ref={mainFrameRef}>
      <Grid
        container
        direction="column"
        style={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            Bisection Line Oral Computerized Test
          </Typography>
          <Typography
            sx={{
              fontWeight: 'bold',
              marginBottom: 3,
              backgroundColor: 'rgba(255, 0, 0, 0.3)',
              boxShadow: '0 0 10px 10px rgba(255,0,0, 0.3)',
            }}
          >
            This app is currently undergoing empiric validation, use at your
            discretion!
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <Typography>App version</Typography>
            </Grid>
            <Grid item xs={6} direction="row" flexDirection="row">
              <Typography>
                {version.app}
                {update.failed && ' - Update has failed'}
                {update.hasUpdate && !update.failed
                  ? `           
                   - Update ${
                     update.isDownloaded ? 'downloaded' : 'available'
                   } (${update.newVersion.version})`
                  : ' - No update available'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Electron version</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{version.electron}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Node version</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{version.node}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Chrome version</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{version.chrome}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ marginBottom: 10 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography>
              Jakob Dickert{' '}
              <p
                style={{
                  transform: 'scale(-1,1)',
                  display: 'inline-flex',
                  WebkitTransform: 'scale(-1,1)',
                }}
              >
                ©
              </p>{' '}
              2023
            </Typography>
            <Button variant="outlined" onClick={handleClose}>
              OK
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
