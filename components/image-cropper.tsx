"use client"

import { useState, useCallback, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { RotateCw, ZoomIn, Loader2 } from 'lucide-react'

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

interface ImageCropperProps {
  image: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (croppedImage: string) => void
  aspect?: number
  isLoading?: boolean
}

export function ImageCropper({
  image,
  open,
  onOpenChange,
  onComplete,
  aspect = 1,
  isLoading = false
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect))
  }, [aspect])
  
  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop)
  }
  
  const saveImage = useCallback(() => {
    if (!completedCrop || !imgRef.current) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    
    const pixelRatio = window.devicePixelRatio
    
    canvas.width = completedCrop.width * scaleX * pixelRatio
    canvas.height = completedCrop.height * scaleY * pixelRatio
    
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
    
    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY
    const rotateRads = rotate * Math.PI / 180
    const centerX = imgRef.current.naturalWidth / 2
    const centerY = imgRef.current.naturalHeight / 2
    
    ctx.save()
    
    // Move the canvas to the center for rotation
    ctx.translate(canvas.width / 2 / pixelRatio, canvas.height / 2 / pixelRatio)
    ctx.rotate(rotateRads)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)
    
    // Draw the image
    ctx.drawImage(
      imgRef.current,
      0,
      0,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight,
      0,
      0,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight,
    )
    
    // Draw the crop
    ctx.translate(cropX, cropY)
    
    ctx.restore()
    
    // Get the cropped image
    const base64Image = canvas.toDataURL('image/jpeg', 0.95)
    onComplete(base64Image)
    onOpenChange(false)
  }, [completedCrop, imgRef, onComplete, onOpenChange, rotate, scale])
  
  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adjust Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => handleCropComplete(c)}
              aspect={aspect}
              circularCrop
              keepSelection
            >
              <img
                ref={imgRef}
                src={image}
                alt="Profile picture to crop"
                style={{ 
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxHeight: '400px',
                  width: '100%',
                  objectFit: 'contain'
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
          
          <div className="flex items-center gap-4">
            <ZoomIn className="h-5 w-5 text-gray-500" />
            <Slider 
              min={0.5} 
              max={3} 
              step={0.1} 
              value={[scale]} 
              onValueChange={(values) => setScale(values[0])}
              className="flex-1"
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRotate} className="w-full">
            <RotateCw className="mr-2 h-4 w-4" />
            Rotate
          </Button>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button onClick={saveImage} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Apply'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 