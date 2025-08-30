"use client"

import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, Trash2, User, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ImageCropper } from './image-cropper'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Array of beautiful background colors for avatars
const AVATAR_COLORS = [
  'bg-purple-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
]

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  onAvatarChange?: (avatarData: { 
    avatar?: string, 
    avatarType: 'initials' | 'image',
    avatarColor?: string 
  }) => void
}

export function UserAvatar({ 
  size = 'md', 
  interactive = false,
  onAvatarChange
}: UserAvatarProps) {
  const { user, updateUserInfo } = useAuth()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Generate a random avatar color if not already set
  const [avatarColor, setAvatarColor] = useState<string>(
    user?.avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
  )

  useEffect(() => {
    // If user already has an avatar color, use it
    if (user?.avatarColor) {
      setAvatarColor(user.avatarColor)
    }
  }, [user?.avatarColor])

  // Get initials from user name
  const getInitials = (name: string): string => {
    if (!name) return 'U'
    
    const parts = name.split(' ')
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // Size classes mapping
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl'
  }

  // Handle avatar file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        // Set temporary image and open cropper
        setTempImage(event.target.result as string)
        setIsCropperOpen(true)
        setIsMenuOpen(false)
      }
    }
    
    reader.readAsDataURL(file)
    
    // Reset the input value so the same file can be selected again
    e.target.value = ''
  }

  // Handle completion of image cropping
  const handleCropComplete = async (croppedImage: string) => {
    try {
      setIsLoading(true)
      if (updateUserInfo) {
        await updateUserInfo({
          avatar: croppedImage,
          avatarType: 'image' as 'image'
        })
      }
      
      // Call the change handler if provided
      if (onAvatarChange) {
        onAvatarChange({
          avatar: croppedImage,
          avatarType: 'image',
          avatarColor
        })
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
      toast({
        title: "Error updating avatar",
        description: "There was a problem updating your profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false)
      setTempImage(null)
      setIsCropperOpen(false)
    }
  }

  // Handle removing the avatar image
  const handleRemoveAvatar = async () => {
    try {
      setIsLoading(true)
      if (updateUserInfo) {
        // Use undefined for avatar to ensure it's properly removed
        const updateData = {
          avatar: undefined,
          avatarType: 'initials' as 'initials',
          avatarColor
        };
        
        await updateUserInfo(updateData);
      }
      
      // Call the change handler if provided
      if (onAvatarChange) {
        onAvatarChange({
          avatar: undefined,
          avatarType: 'initials',
          avatarColor
        })
      }
      
      // Show success message using toast
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been successfully removed."
      });
    } catch (error) {
      console.error("Error removing avatar:", error)
      
      // Show error message using toast
      toast({
        title: "Error removing avatar",
        description: "There was a problem removing your profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  // Handle changing avatar color
  const handleChangeColor = async () => {
    const newColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    setAvatarColor(newColor)
    
    if (updateUserInfo) {
      await updateUserInfo({
        avatarType: 'initials' as 'initials',
        avatarColor: newColor
      })
    }
    
    // Call the change handler if provided
    if (onAvatarChange) {
      onAvatarChange({
        avatarType: 'initials',
        avatarColor: newColor
      })
    }
    
    setIsMenuOpen(false)
  }

  if (!user) {
    return (
      <Avatar className={`${sizeClasses[size]} ${avatarColor} text-white font-medium`}>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ${!user.avatar ? avatarColor : ''} text-white font-medium`}>
        {user.avatar && user.avatarType === 'image' ? (
          <AvatarImage 
            src={user.avatar} 
            alt={user.name}
            onError={(e) => {
              console.error("Error loading avatar image, falling back to initials");
              // If image fails to load, update user to use initials instead
              if (updateUserInfo) {
                updateUserInfo({
                  avatar: undefined,
                  avatarType: 'initials' as 'initials',
                  avatarColor: user.avatarColor || avatarColor
                }).catch(err => console.error("Error updating avatar after image load failure:", err));
              }
            }} 
          />
        ) : null}
        {isLoading ? (
          <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className={avatarColor}>{getInitials(user.name)}</AvatarFallback>
        )}
      </Avatar>
      
      {interactive && (
        <>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-6 w-6 p-1 bg-purple-600 text-white shadow-md hover:bg-purple-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Photo
              </DropdownMenuItem>
              
              {user.avatar && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Photo
                  </DropdownMenuItem>
                </>
              )}
              
              {!user.avatar && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleChangeColor} className="cursor-pointer">
                    <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    Change Color
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          {/* Image Cropper */}
          {tempImage && (
            <ImageCropper
              image={tempImage}
              open={isCropperOpen}
              onOpenChange={setIsCropperOpen}
              onComplete={handleCropComplete}
              aspect={1}
              isLoading={isLoading}
            />
          )}
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Profile Picture</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove your profile picture? This will revert back to using your initials.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveAvatar}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    'Remove'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
} 