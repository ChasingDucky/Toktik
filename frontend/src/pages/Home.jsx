import React from 'react';
import { Box } from '@mui/material';
import VideoFeed from '../components/VideoFeed';

const Home = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <VideoFeed />
    </Box>
  );
};

export default Home;
