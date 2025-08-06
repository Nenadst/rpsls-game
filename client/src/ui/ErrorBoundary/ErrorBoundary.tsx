import { Component, type PropsWithChildren } from 'react';

import { ErrorPage } from '../ErrorPage/ErrorPage';

type ErrorBoundaryProps = PropsWithChildren;

export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorPage onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
