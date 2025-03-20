import { Settings, HelpCircle, RefreshCw, User, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeaderProps {
  onRefresh: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="material-icons text-primary mr-2">table_chart</span>
              <h1 className="text-xl font-semibold text-gray-800">Google Sheets Data Viewer</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  className="text-gray-700 hover:text-gray-900 p-1 rounded-full"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-3 text-gray-700 hover:text-gray-900 p-1 rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-3 text-gray-700 hover:text-gray-900 p-1 rounded-full"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="ml-3 flex items-center space-x-3">
              <Link href="/register">
                <Button
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center hover:bg-green-700"
                >
                  <FileSignature className="h-4 w-4 mr-1" />
                  <span>Register</span>
                </Button>
              </Link>
              <Link href="/">
                <Button
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center hover:bg-blue-700"
                >
                  <User className="h-4 w-4 mr-1" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
