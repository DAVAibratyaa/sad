import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Oops! Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
              {this.state.error?.stack && (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40 mb-4">
                  {this.state.error.stack}
                </pre>
              )}
              <Button onClick={this.handleReload}>Reload Page</Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }

