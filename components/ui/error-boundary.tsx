"use client"

import { Component, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <AlertTriangle className="h-24 w-24 mx-auto text-destructive mb-4" />
            <h1 className="font-serif text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              We encountered an error while loading this page. Please try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-8 text-left max-w-2xl mx-auto">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}