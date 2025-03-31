"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onFileSelected: (file: File) => void
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({
  onFileSelected,
  accept = "video/*,application/pdf,.doc,.docx,.ppt,.pptx",
  maxSizeMB = 100,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return false
    }

    // Check file type if accept is specified
    if (accept && accept !== "*") {
      const fileType = file.type
      const acceptTypes = accept.split(",").map((type) => type.trim())

      // Check if file type matches any of the accepted types
      const isAccepted = acceptTypes.some((type) => {
        if (type.startsWith(".")) {
          // Check file extension
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        } else if (type.includes("/*")) {
          // Check mime type category (e.g., "video/*")
          const category = type.split("/")[0]
          return fileType.startsWith(`${category}/`)
        } else {
          // Check exact mime type
          return fileType === type
        }
      })

      if (!isAccepted) {
        setError(`File type not accepted. Please upload: ${accept}`)
        return false
      }
    }

    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      handleFile(droppedFile)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)

    if (validateFile(file)) {
      setFile(file)
      simulateUpload(file)
    }
  }

  const simulateUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onFileSelected(file)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const clearFile = () => {
    setFile(null)
    setUploadProgress(0)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept={accept} />

          <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {accept.replace(/,/g, ", ")} (Max: {maxSizeMB}MB)
          </p>

          <Button type="button" variant="outline" onClick={handleButtonClick} className="mt-4">
            Select File
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="mr-2 flex-shrink-0">
                {uploadProgress === 100 ? (
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
                )}
              </div>
              <div className="truncate">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              disabled={isUploading && uploadProgress < 100}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Progress value={uploadProgress} className="h-2" />

          {uploadProgress === 100 && <p className="text-xs text-green-600 mt-2">Upload complete! File ready to use.</p>}
        </div>
      )}
    </div>
  )
}

