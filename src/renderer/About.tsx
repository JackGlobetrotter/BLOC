import { Button, Container, Grid, Stack, Typography } from '@mui/material';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function AboutWindow() {
  const [version, setVersion] = useState({
    node: -1,
    app: -1,
    chrome: -1,
    electron: -1,
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
            <Grid item xs={8}>
              <Typography>App version</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>{version.app}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>Electron version</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>{version.electron}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>Node version</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>{version.node}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>Chrome version</Typography>
            </Grid>
            <Grid item xs={4}>
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
