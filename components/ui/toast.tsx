"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn("fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:w-[400px]", className)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(
      "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-value)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[calc(100% + 25px)]",
      toastVariants({ variant }),
      className,
    )}
    {...props}
  />
))
Toast.displayName = ToastPrimitives.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-sm font-semibold [&[data-state=open]]:animate-in [&[data-state=closed]]:animate-out [&[data-state=closed]]:fade-out-80 [&[data-state=closed]]:zoom-out-95 [&[data-state=open]]:fade-in-90 [&[data-state=open]]:zoom-in-95",
      className,
    )}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-sm opacity-70 [&[data-state=open]]:animate-in [&[data-state=closed]]:animate-out [&[data-state=closed]]:fade-out-80 [&[data-state=closed]]:zoom-out-95 [&[data-state=open]]:fade-in-90 [&[data-state=open]]:zoom-in-95",
      className,
    )}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md opacity-0 focus:shadow-none group-hover:opacity-100 transition-opacity hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
      className,
    )}
    {...props}
  />
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium transition-colors focus:shadow-none hover:bg-gray-100 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:hover:bg-gray-800 dark:disabled:opacity-50 dark:data-[state=open]:bg-gray-800",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const toastVariants = cva("bg-background border", {
  variants: {
    variant: {
      default: "border-border",
      destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction, toastVariants }

export type { ToastProps, ToastActionElement }

import { useToast } from "@/components/ui/use-toast"

const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ ...props }) => (
        <Toast key={props.id} {...props}>
          <ToastTitle>{props.title}</ToastTitle>
          {props.description && <ToastDescription>{props.description}</ToastDescription>}
        </Toast>
      ))}
    </ToastProvider>
  )
}

export { Toaster }

