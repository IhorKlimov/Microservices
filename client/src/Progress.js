import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import "./Progress.css";

export default function CircularIndeterminate() {
    return (
        <Box sx={{ display: 'table' }} className="moviesLoading">
            <CircularProgress />
        </Box>
    );
}