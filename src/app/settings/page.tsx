"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  User, 
  Mail,
  Palette,
  Languages,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

const SettingsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    language: 'en',
    currency: 'PKR',
    autoSave: true
  });

  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-8 bg-hero-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                Settings
              </h1>
              <p className="font-sans text-lg text-muted-foreground">
                Customize your experience and preferences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          {/* Account Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>
                Your account details and basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans font-medium">Email Address</Label>
                  <div className="mt-2 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm">{user?.email}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-sans font-medium">Account Status</Label>
                  <div className="mt-2">
                    <Badge variant="default">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize how Guloona looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-sans font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sun className="w-4 h-4" />
                    Light
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Moon className="w-4 h-4" />
                    Dark
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language" className="font-sans font-medium">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ur">اردو (Urdu)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currency" className="font-sans font-medium">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Manage how you receive updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-sans font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-sans font-medium">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about your custom order progress
                    </p>
                  </div>
                  <Switch
                    checked={settings.orderUpdates}
                    onCheckedChange={(value) => handleSettingChange('orderUpdates', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-sans font-medium">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive news about new collections and offers
                    </p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(value) => handleSettingChange('marketingEmails', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Data & Privacy</CardTitle>
              </div>
              <CardDescription>
                Control your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-sans font-medium">Auto-Save Profile Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes to your profile
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(value) => handleSettingChange('autoSave', value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-medium">Download Your Data</span>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Request Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-sans font-medium">Delete Account</span>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <CardTitle>Help & Support</CardTitle>
              </div>
              <CardDescription>
                Get help and learn more about Guloona
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Contact Support</div>
                    <div className="text-sm text-muted-foreground">Get help with your orders</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Size Guide</div>
                    <div className="text-sm text-muted-foreground">Learn about measurements</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">FAQ</div>
                    <div className="text-sm text-muted-foreground">Common questions</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Privacy Policy</div>
                    <div className="text-sm text-muted-foreground">How we protect your data</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSaveSettings}
              variant="elegant"
              size="elegant"
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SettingsPage;
