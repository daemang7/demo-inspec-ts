import { Settings as SettingsIcon, User, Bell, Shield, Database, HelpCircle, LogOut } from "lucide-react";
import MobileLayout from "@/components/mobile-layout";

export default function Settings() {
  return (
    <MobileLayout title="Settings" subtitle="App Configuration">
      {/* Profile Section */}
      <div className="inspection-card p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <User className="w-5 h-5 text-primary mr-2" />
          Profile
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">Inspector</p>
            </div>
            <button className="text-xs text-primary font-medium">Edit</button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">john.doe@company.com</p>
              <p className="text-xs text-muted-foreground">Email</p>
            </div>
            <button className="text-xs text-primary font-medium">Change</button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="inspection-card p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Bell className="w-5 h-5 text-primary mr-2" />
          Notifications
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Receive alerts for inspections</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email Reports</p>
              <p className="text-xs text-muted-foreground">Weekly summary emails</p>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Sound Alerts</p>
              <p className="text-xs text-muted-foreground">Play sounds for notifications</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="inspection-card p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <SettingsIcon className="w-5 h-5 text-primary mr-2" />
          App Settings
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Auto-save Photos</p>
              <p className="text-xs text-muted-foreground">Save inspection photos automatically</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Offline Mode</p>
              <p className="text-xs text-muted-foreground">Work without internet connection</p>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">High Quality Photos</p>
              <p className="text-xs text-muted-foreground">Use maximum photo quality</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="inspection-card p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Shield className="w-5 h-5 text-primary mr-2" />
          Data & Privacy
        </h3>

        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Export My Data</p>
                <p className="text-xs text-muted-foreground">Download all your inspection data</p>
              </div>
              <Database className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>

          <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Privacy Policy</p>
                <p className="text-xs text-muted-foreground">Read our privacy policy</p>
              </div>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>

          <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Terms of Service</p>
                <p className="text-xs text-muted-foreground">Read our terms of service</p>
              </div>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="inspection-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Account</h3>

        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-red-600">Sign Out</p>
                <p className="text-xs text-red-500">Sign out of your account</p>
              </div>
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
