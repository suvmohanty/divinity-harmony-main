import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Shield, Languages, Moon, Bookmark, Palette, Globe, RefreshCw, Sliders, Upload, Save, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UserSettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  
  // Profile settings state
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    language: 'english',
    theme: 'system',
    notifications: true,
    marketing: false,
    sounds: true,
    autoplay: false
  });

  const handleProfileChange = (key: string, value: string | boolean) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="container px-4 py-10 mx-auto max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-hindu-red to-hindu-gold rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-bold">ॐ</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and application settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <Card className="lg:col-span-1 bg-muted/10 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-border">
                <AvatarImage src="/assets/avatar.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-to-r from-hindu-red/10 to-hindu-gold/10 text-hindu-red">JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1 px-2">
              {[
                { id: 'account', label: 'Account', icon: <User size={18} /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
                { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
                { id: 'language', label: 'Language', icon: <Globe size={18} /> },
                { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
                { id: 'saved', label: 'Saved Items', icon: <Bookmark size={18} /> },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start ${activeTab === item.id ? 'bg-muted' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className={`mr-2 ${activeTab === item.id ? 'text-hindu-red' : ''}`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.id === 'notifications' && (
                    <Badge className="ml-auto bg-hindu-red text-white">2</Badge>
                  )}
                </Button>
              ))}
            </nav>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2 border-t border-border/30 mt-4 pt-4">
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <RefreshCw size={18} className="mr-2" />
              Sync Account
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <TabsContent value="account" className={activeTab === 'account' ? 'block' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Details</h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profile.name} 
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="border-border/50 focus-visible:ring-hindu-red/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile.email} 
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="border-border/50 focus-visible:ring-hindu-red/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <Separator />
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <Avatar className="h-24 w-24 border-2 border-border">
                      <AvatarImage src="/assets/avatar.jpg" alt="User" />
                      <AvatarFallback className="bg-gradient-to-r from-hindu-red/10 to-hindu-gold/10 text-hindu-red text-xl">JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <Label>Upload a new avatar</Label>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" className="border-dashed border-2">
                          <Upload size={16} className="mr-2" />
                          Choose File
                        </Button>
                        <p className="text-sm text-muted-foreground">JPG, PNG or GIF, max 2MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Subscription</h3>
                  <Separator />
                  <div className="bg-gradient-to-r from-hindu-red/10 to-hindu-gold/10 rounded-lg p-4 border border-hindu-red/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Free Account</h4>
                        <p className="text-sm text-muted-foreground">Basic features and limited access</p>
                      </div>
                      <Button className="bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110 transition-all">
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-border/30 pt-6">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110 transition-all" onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className={activeTab === 'notifications' ? 'block' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New mantras and content</Label>
                        <p className="text-sm text-muted-foreground">Receive updates when new mantras are added</p>
                      </div>
                      <Switch 
                        checked={profile.notifications} 
                        onCheckedChange={(checked) => handleProfileChange('notifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing and promotions</Label>
                        <p className="text-sm text-muted-foreground">Receive news about events and promotions</p>
                      </div>
                      <Switch 
                        checked={profile.marketing} 
                        onCheckedChange={(checked) => handleProfileChange('marketing', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">App Notifications</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notification sounds</Label>
                        <p className="text-sm text-muted-foreground">Play sounds for app notifications</p>
                      </div>
                      <Switch 
                        checked={profile.sounds} 
                        onCheckedChange={(checked) => handleProfileChange('sounds', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Autoplay meditation videos</Label>
                        <p className="text-sm text-muted-foreground">Automatically play videos when browsing</p>
                      </div>
                      <Switch 
                        checked={profile.autoplay} 
                        onCheckedChange={(checked) => handleProfileChange('autoplay', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-border/30 pt-6">
                <Button variant="outline">Reset to Default</Button>
                <Button className="bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110 transition-all" onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className={activeTab === 'appearance' ? 'block' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <div 
                        key={theme}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-hindu-red/50 ${
                          profile.theme === theme ? 'border-hindu-red ring-1 ring-hindu-red/20 bg-hindu-red/5' : 'border-border/50'
                        }`}
                        onClick={() => handleProfileChange('theme', theme)}
                      >
                        <div className={`rounded-md aspect-video mb-3 ${
                          theme === 'light' ? 'bg-white' : 
                          theme === 'dark' ? 'bg-neutral-800' : 
                          'bg-gradient-to-r from-white to-neutral-800'
                        }`}>
                          <div className={`h-2 w-1/3 rounded-full mt-2 mx-2 ${
                            theme === 'light' ? 'bg-neutral-200' : 
                            theme === 'dark' ? 'bg-neutral-700' : 
                            'bg-neutral-400'
                          }`}></div>
                        </div>
                        <div className="font-medium capitalize">{theme}</div>
                        <p className="text-sm text-muted-foreground">
                          {theme === 'light' ? 'Light mode' : 
                           theme === 'dark' ? 'Dark mode' : 
                           'Follow system theme'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Color Scheme</h3>
                  <Separator />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Default', 'Ganges', 'Saffron', 'Lotus'].map((scheme, i) => (
                      <div key={scheme} className="text-center">
                        <div 
                          className={`h-12 rounded-full mx-auto mb-2 w-12 cursor-pointer transition-all hover:ring-2 ring-offset-2 ring-offset-background ${
                            i === 0 ? 'bg-gradient-to-r from-hindu-red to-hindu-gold' :
                            i === 1 ? 'bg-gradient-to-r from-hindu-blue to-hindu-green' :
                            i === 2 ? 'bg-gradient-to-r from-hindu-orange to-hindu-gold' :
                            'bg-gradient-to-r from-hindu-purple to-hindu-red'
                          } ${i === 0 ? 'ring-2' : ''}`}
                        ></div>
                        <span className="text-sm">{scheme}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-border/30 pt-6">
                <Button variant="outline">Reset to Default</Button>
                <Button className="bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110 transition-all" onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="language" className={activeTab === 'language' ? 'block' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>Language Settings</CardTitle>
                <CardDescription>Change your preferred language and translation options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Interface Language</h3>
                  <Separator />
                  <div className="grid grid-cols-1 gap-4 max-w-md">
                    <Select 
                      value={profile.language} 
                      onValueChange={(value) => handleProfileChange('language', value)}
                    >
                      <SelectTrigger className="border-border/50 focus:ring-hindu-red/30">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="sanskrit">Sanskrit</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Translation Settings</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show original texts</Label>
                        <p className="text-sm text-muted-foreground">Display mantras in their original language</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show translations</Label>
                        <p className="text-sm text-muted-foreground">Display translations alongside original texts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show transliterations</Label>
                        <p className="text-sm text-muted-foreground">Show phonetic spelling of original texts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-border/30 pt-6">
                <Button variant="outline">Reset to Default</Button>
                <Button className="bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110 transition-all" onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Placeholders for the other tabs */}
          {['privacy', 'saved'].map((tab) => (
            <TabsContent key={tab} value={tab} className={activeTab === tab ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>{tab === 'privacy' ? 'Privacy Settings' : 'Saved Items'}</CardTitle>
                  <CardDescription>
                    {tab === 'privacy' 
                      ? 'Manage your privacy and security settings'
                      : 'View and manage your saved mantras, texts, and media'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sliders className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-sm">
                      We're working hard to bring you this feature. Thank you for your patience.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-border/30 pt-6">
                  <Button variant="outline">Close</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage; 