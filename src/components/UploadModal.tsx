"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Hash, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal = ({ isOpen, onClose, onUploadSuccess }: UploadModalProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { profile, getFullName } = useUserProfile();
  
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim();
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addHashtag();
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to upload photos to the gallery.",
        variant: "destructive",
      });
      openAuthModal();
      return;
    }

    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Convert image to base64 for storage
      const imageBase64 = await convertImageToBase64(selectedFile);
      
      const username = getFullName() || user?.email?.split('@')[0] || 'Anonymous';
      
      const uploadData = {
        user_id: user?.id,
        username,
        user_email: user?.email,
        image_url: imageBase64,
        caption: caption.trim(),
        hashtags: hashtags
      };

      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();

      toast({
        title: "Upload Successful!",
        description: "Your photo has been added to the gallery.",
      });

      // Reset form
      setSelectedFile(null);
      setImagePreview(null);
      setCaption('');
      setHashtags([]);
      setHashtagInput('');
      
      onUploadSuccess();
      onClose();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-serif text-2xl text-foreground">Upload to Gallery</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to share your photos with the Guloona community.
              </p>
              <Button onClick={() => { openAuthModal(); onClose(); }}>
                <User className="w-4 h-4 mr-2" />
                Sign In to Upload
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <Label className="font-sans font-medium">Select Photo</Label>
                <div 
                  className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => document.getElementById('gallery-file-input')?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-sans text-muted-foreground mb-2">
                        Click to select an image or drag & drop
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        JPG, PNG files up to 5MB
                      </p>
                    </>
                  )}
                  <input
                    id="gallery-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <Label htmlFor="caption" className="font-sans font-medium">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Share the story behind your photo..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-2 min-h-[80px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {caption.length}/500 characters
                </p>
              </div>

              {/* Hashtags */}
              <div>
                <Label htmlFor="hashtags" className="font-sans font-medium">Hashtags</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="hashtags"
                        placeholder="Add hashtags (press Enter or comma to add)"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={handleHashtagKeyPress}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addHashtag}
                      disabled={!hashtagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer">
                          #{tag}
                          <X 
                            className="w-3 h-3 ml-1" 
                            onClick={() => removeHashtag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <User className="w-4 h-4 inline mr-1" />
                  Posting as: {getFullName() || user?.email}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                  className="flex-1"
                >
                  {uploading ? 'Uploading...' : 'Share Photo'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UploadModal;
