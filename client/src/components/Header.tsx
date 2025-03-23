import { RefreshCw, User, FileSignature, Database } from "lucide-react";
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
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <svg
                  className="h-8 w-8 text-primary mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="2" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="15" y2="16" />
                </svg>
                <h1 className="text-xl font-semibold text-gray-800">Project Registration Manager</h1>
              </div>
            </Link>
          </div>
          <div className="flex items-center">
            {onRefresh.toString() !== (() => {}).toString() && (
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
                </div>
              </div>
            )}
            <div className="ml-3 flex items-center space-x-3">
              <Link href="/register">
                <Button
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center hover:bg-green-700"
                >
                  <FileSignature className="h-4 w-4 mr-1" />
                  <span>Register</span>
                </Button>
              </Link>
              <Link href="/data">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-50"
                >
                  <Database className="h-4 w-4 mr-1" />
                  <span>View Data</span>
                </Button>
              </Link>
              <Link href="/">
                <Button
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center hover:bg-primary/90"
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