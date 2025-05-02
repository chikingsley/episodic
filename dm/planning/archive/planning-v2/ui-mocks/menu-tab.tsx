import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  HelpCircle,
  Info,
  Languages,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sliders,
  User,
  Volume2,
} from "lucide-react"

export default function MenuTab() {
  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-200 overflow-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-cyan-400">Settings & Options</h2>
        <p className="text-xs text-gray-400">Configure your agent experience</p>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-cyan-400 uppercase">Display</h3>

          <div className="bg-gray-900/70 rounded-lg border border-gray-800 divide-y divide-gray-800">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Dark Mode</div>
                  <div className="text-xs text-gray-500">Reduce eye strain in low light</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">HUD Elements</div>
                  <div className="text-xs text-gray-500">Show mission indicators</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Animation Effects</div>
                  <div className="text-xs text-gray-500">Enable UI animations</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-cyan-400 uppercase">Audio</h3>

          <div className="bg-gray-900/70 rounded-lg border border-gray-800 divide-y divide-gray-800">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Sound Effects</div>
                  <div className="text-xs text-gray-500">Mission and UI sounds</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Notifications</div>
                  <div className="text-xs text-gray-500">Alert sounds for messages</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-cyan-400 uppercase">General</h3>

          <div className="bg-gray-900/70 rounded-lg border border-gray-800 divide-y divide-gray-800">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Languages className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Language</div>
                  <div className="text-xs text-gray-500">English (US)</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-cyan-400">
                Change
              </Button>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Account</div>
                  <div className="text-xs text-gray-500">Manage your agent profile</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-cyan-400">
                View
              </Button>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Advanced Settings</div>
                  <div className="text-xs text-gray-500">Configure technical options</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-cyan-400">
                Configure
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-cyan-400 uppercase">Support</h3>

          <div className="bg-gray-900/70 rounded-lg border border-gray-800 divide-y divide-gray-800">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">Help Center</div>
                  <div className="text-xs text-gray-500">Get assistance with missions</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-cyan-400">
                Open
              </Button>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Info className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm">About</div>
                  <div className="text-xs text-gray-500">Version 1.0.5</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-cyan-400">
                Details
              </Button>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  )
}
