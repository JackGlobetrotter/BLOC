import {
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Stack,
  Checkbox,
  InputAdornment,
  SelectChangeEvent,
  Button,
} from '@mui/material';

import { Display } from 'electron';

import React, { useEffect, useState } from 'react';
import { LineGenerationType } from 'common/lineProvider';
import { Line } from '../common/Line';

interface Monitor extends Display {
  isPrimary: boolean;
  selected: boolean;
}

function Setup() {
  const [monitors, setMonitors] = useState<Array<Monitor>>([]);
  const [selectedMonitor, setSelectedMonitor] = useState(-1);
  const [useCustomResolution, setUseCustomResolution] = useState(false);
  const [customResolution, setCustomResolution] = useState({ x: -1, y: -1 });

  const [screenSize, setScreenSize] = useState(15.6);

  const [generationMode, setGenerationMode] = useState(1);

  const [runMode, setRunMode] = useState(1);
  const [repetitions, setRepetitions] = useState(60);

  const [isRunning, setIsRunning] = useState(false);

  const [currentLine, setCurrentLine] = useState<Line>(new Line());

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-monitors')
      .then(async (res: Monitor[] | number) => {
        if (res !== -1 && res instanceof Array) {
          if (res.length === 1) {
            setSelectedMonitor(res[0].id);
          } else
            await window.electron.ipcRenderer
              .invoke('get-primary-monitor')
              .then((res1: Monitor) => {
                let selected = false;
                res.forEach((monitor, key: any) => {
                  if (monitor.id === res1.id) res[key].isPrimary = true;
                  else {
                    res[key].isPrimary = false;
                    if (selected) {
                      res[key].selected = false;
                    } else {
                      res[key].selected = true;
                      selected = true;
                      setSelectedMonitor(monitor.id);
                    }
                  }
                });

                return -1;
              })
              .catch((ex) => console.log(ex));
          setMonitors(res);
        }
        return -1;
      })
      .catch((ex) => console.log(ex));
  }, []);

  useEffect(() => {
    if (selectedMonitor !== -1 && monitors.length > 0)
      setCustomResolution({
        x: monitors.filter((m) => m.id === selectedMonitor)[0].size.width,
        y: monitors.filter((m) => m.id === selectedMonitor)[0].size.height,
      });
  }, [selectedMonitor, monitors]);

  useEffect(() => {
    window.electron.ipcRenderer.on('runmode-change', (data) => {
      if (data !== undefined && data !== null) setIsRunning(Boolean(data));
    });

    window.electron.ipcRenderer.on('current-line', (data) => {
      if (data) setCurrentLine(data as Line);
    });
  }, []);

  const changeUseCustomResolution = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseCustomResolution(event.target.checked);
  };

  const changeRepetitions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepetitions(Number(event.target.value));
  };

  const changeSelectedMonitor = (event: SelectChangeEvent) => {
    setSelectedMonitor(Number(event.target.value));
  };

  const changeGenerationMode = (event: SelectChangeEvent) => {
    setGenerationMode(Number(event.target.value));
  };

  const changeRunMode = (event: SelectChangeEvent) => {
    setRunMode(Number(event.target.value));
  };

  const changeCustomResolution = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.name === 'xres')
      setCustomResolution({
        ...customResolution,
        x: Number(event.target.value),
      });
    else
      setCustomResolution({
        ...customResolution,
        y: Number(event.target.value),
      });
  };

  const runLineScreen = () => {
    window.electron.ipcRenderer.sendMessage('open-line-screen', {
      screenSize: customResolution ? screenSize : 15.6,
      id: selectedMonitor,
      runMode,
      generationMode,
      count: repetitions,
    });
  };

  const stopLineScreen = () => {
    window.electron.ipcRenderer.sendMessage('runmode-change', false);
  };

  return (
    <Container style={{ height: '100%' }}>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        style={{ height: '100%' }}
        spacing={4}
      >
        <Grid item>
          <Grid container spacing={2} style={{ marginTop: 20 }}>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item xs={12}>
                  <FormLabel id="genration-mode-radio-buttons-group-label">
                    Line Generation
                  </FormLabel>
                  <RadioGroup
                    onChange={changeGenerationMode}
                    defaultValue={LineGenerationType.PseudorandomFixed}
                    name="line-generation-mode-radio-buttons-group"
                    value={generationMode}
                  >
                    <FormControlLabel
                      value={LineGenerationType.Random}
                      control={<Radio />}
                      label="Random"
                    />
                    <FormControlLabel
                      value={LineGenerationType.PseudorandomFixed}
                      control={<Radio />}
                      label="Pseudo Random - Fixed Order"
                    />
                    <FormControlLabel
                      value={LineGenerationType.Pseudorandom}
                      control={<Radio />}
                      label="Pseudo Random - Random Order"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="run-mode--group-label">Run Mode</FormLabel>
                    <RadioGroup
                      aria-labelledby="run-mode-radio-buttons-group-label"
                      defaultValue={1}
                      onChange={changeRunMode}
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label="Loop"
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label={
                          <TextField
                            label="Repetitons"
                            value={repetitions}
                            onChange={changeRepetitions}
                            inputProps={{ type: 'number', min: 1 }}
                          >
                            60
                          </TextField>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={7}>
              {monitors.length > 1 && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Display
                    </InputLabel>
                    <Select
                      labelId="selected-monitor-label"
                      id="selected-monitor"
                      label="selectedMonitor"
                      value={selectedMonitor.toString()}
                      onChange={changeSelectedMonitor}
                    >
                      {monitors.length > 1 &&
                        monitors.flatMap((monitor: any) => {
                          return (
                            <MenuItem
                              key={`monitor_${monitor.id}`}
                              value={monitor.id}
                              style={{
                                fontWeight: monitor.isPrimary
                                  ? 'bold'
                                  : 'inherit',
                              }}
                            >
                              {`${monitor.label} (${monitor.size.width}x${monitor.size.height})`}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={useCustomResolution}
                        onChange={changeUseCustomResolution}
                      />
                    }
                    label="Custom screen settings"
                  />
                </Grid>
              )}
              {monitors.length === 1 && (
                <Grid item xs={12}>
                  <Typography>Screen</Typography>
                  <Typography>{`${monitors[0].label} (${monitors[0].size.width}x${monitors[0].size.height})`}</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={useCustomResolution}
                        onChange={changeUseCustomResolution}
                      />
                    }
                    label="Custom screen settings"
                  />
                </Grid>
              )}
              {useCustomResolution && (
                <Grid container direction="column" spacing={2}>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <Typography style={{ alignSelf: 'center' }}>
                        Screen resolution
                      </Typography>
                      <TextField
                        name="xres"
                        value={customResolution.x}
                        onChange={changeCustomResolution}
                      />
                      <Typography style={{ alignSelf: 'center' }}>X</Typography>
                      <TextField
                        name="yres"
                        value={customResolution.y}
                        onChange={changeCustomResolution}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Screen Size"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Inches</InputAdornment>
                        ),
                      }}
                      value={screenSize}
                      onChange={(e) => setScreenSize(Number(e.target.value))}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {isRunning && (
          <Grid
            container
            direction="row"
            style={{
              justifyContent: 'center',
            }}
          >
            <Grid item>
              <Grid
                container
                direction="row"
                style={{
                  textAlign: 'center',
                  background:
                    'linear-gradient(90deg,rgba(255,0,0, 0.45) 0%,rgba(255,0,0, 0.45) 33%,rgba(255,255,0,0.45) 38%, rgba(255,255,0,0.45) 41.5%, rgba(0,255,0,0.45) 46.5%,  rgba(0,255,0,0.45) 52.5%,rgba(0,255,0,0.45) 57% ,  rgba(255,255,0,0.45) 62%, rgba(255,255,0,0.45) 65%,rgba(255,0,0,0.45) 70%, rgba(255,0,0,0.45) 100%)',
                }}
              >
                {currentLine &&
                  currentLine.Letters.flatMap((letter, index) => {
                    return (
                      <Grid item style={{ padding: 10 }}>
                        <Stack>
                          <Typography>{index - 8}</Typography>
                          <Typography fontWeight="bold">{letter}</Typography>
                        </Stack>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </Grid>
        )}
        {isRunning ? (
          <Grid item>
            <Button variant="outlined" color="error" onClick={stopLineScreen}>
              Abort
            </Button>
          </Grid>
        ) : (
          <Grid item>
            <Button onClick={runLineScreen} variant="outlined">
              RUN
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Setup;
