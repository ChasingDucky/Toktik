import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              哎呀，出错了！
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2 }}>
              应用程序遇到了一个意外错误。我们已经记录了这个问题。
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 200,
                }}
              >
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={this.handleReset}
              >
                重试
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
              >
                刷新页面
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
              如果问题持续存在，请联系我们的支持团队
            </Typography>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
